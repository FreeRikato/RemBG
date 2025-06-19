import { s3Client, bucketName, queueName } from "../config"; // Perform actions on AWS S3
/*
 * > GetObjectCommand: used to retrieve files from S3
 * > PutObjectCommand: used to upload files to S3
 */
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// The utility function getSignedUrl generates a signed URL for accessing an S3 object securely and temporarily, without exposing S3 bucket policy
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpError } from "../middlewares/error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import { Queue } from "bullmq";
import redisConnection from "../utils/redisConnection";

/*
 * When using middleware like Multer to handle multipart/form-data,
 * The req.file object has the following fields:
 * 1. fieldname - name of the form field associated with the file
 * (image, if the HTML form says <input type="file" name="image")/>
 * 2. originalname - original name of the uploaded file on user's PC
 * 3. encoding - Encoding type of the file (usually 7bit or binary)
 * 4. mimetype - The MIME type of the file (e.g. image/png)
 * >> MIME (Multipurpose internet mail extension) is an internet standard
 * >> for identifying the type of object that is being transferred across internet
 * 5. size - Size of the file in bytes
 * 6. destination - The folder where the file has been stored (only for disk storage)
 * 7. filename - name of the file with destination (renamed with Multer)
 * 8. path - Full path to the store file (useful for disk storage)
 * 9. buffer - A Buffer of the entire file
 * (Only available if using memory storage)
 */
interface fileInput {
    buffer: Buffer; // Raw file data
    mimetype: string; // file's MIME type (like image/jpeg)
    originalname: string; // Original file name (from user upload)
}

const messageQueue = new Queue(queueName, { connection: redisConnection });

export const uploadImage = async (
    uploadType: "original" | "processed",
    file: fileInput,
    userID: string,
) => {
    /*
     * To store/put an image in a S3 bucket, we would need
     * - Bucket name: where to store the file
     * - Key: the file's S3 path
     * - Body: the raw file data
     * - ContentType: sets the MIME type for proper file handling
     */

    // Constructing the s3 object key, a unique name is mandatory in order to avoid files being overwritten. The images are stored in different directory on the basis of upload type here i.e. "Original" or "Processed"
    const key = `${uploadType}/${Date.now()}-${file.originalname}`;

    // Creating the PutObjectCommand
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        // Sends the PutObjectCommand to S3 using s3Client
        await s3Client.send(command);

        // Create a command to get an object from the specified S3 bucket
        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        // Get a pre-signed URL for termporary public access to an S3 object
        const signedUrl = await getSignedUrl(s3Client, getCommand, {
            expiresIn: 3600, // 1 hour in seconds
        });

        if (uploadType === "original") {
            const job = await messageQueue.add("remove-background", {
                signedUrl,
                userID,
            });
            return { signedUrl, job };
        }

        return { signedUrl };
    } catch (err) {
        throw new HttpError(
            "Upload failed",
            HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
    }
};

export const processedImage = async (jobID: string) => {
    const job = await messageQueue.getJob(jobID);
    if (!job) throw new HttpError("Job not found", HttpStatusCode.CONFLICT);
    const state = await job.getState();

    if (state === "completed") {
        const result = await job.returnvalue;
        return { status: "completed", result };
    }
    return { status: state };
};
