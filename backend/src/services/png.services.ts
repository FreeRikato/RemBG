import { s3Client, bucketName } from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { HttpError } from "../middlewares/error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";

export const uploadImage = async (file: Express.Multer.File) => {
    const key = `uploads/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
    });

    try {
        await s3Client.send(command);

        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return fileUrl;
    } catch (err) {
        throw new HttpError(
            "Upload failed",
            HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
    }
};
