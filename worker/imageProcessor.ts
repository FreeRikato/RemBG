import { spawn } from "child_process";
import * as fs from "fs/promises";
import path from "path";
import { uploadImage } from "../backend/src/services/png.services";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import os from "os";

export const processImageJob = async ({
  jobID,
  originalImageUrl,
  userId,
}: {
  jobID: string;
  originalImageUrl: string;
  userId: string;
}) => {
  /*
   * 1. Download the image from the given URL
   * 2. Process the image (remove background with rembg cli)
   * 3. Upload the result to S3 or another storage
   * TODO
   * 4. Update the job record in DB
   */

  /* os.tmdir() returns the default temporary directory for the operating system
   * > Linux/macOS -> tmp
   * > Windows -> C:\Users\xyz\AppData\Local\Temp
   */
  const tempDir = path.join(os.tmpdir(), "rembg-jobs"); // Combine temp directory with folder name "rembg-jobs" into a single path
  await fs.mkdir(tempDir, { recursive: true }); // recursive ensures that any parent directory needed will also be created just like mkdir -p

  const cleanUrl = originalImageUrl.split("?")[0]; // Removes query string from the image URL
  const ext = path.extname(cleanUrl) || ".jpg"; // Extracts file extension, falls back to .jpg if missing
  // Full paths for saving input and output files
  const inputPath = path.join(tempDir, `${jobID}-input${ext}`);
  const outputPath = path.join(tempDir, `${jobID}-output.png`);

  try {
    /*
     * Axios supports several responseType options that control how the response data is parsed:
     * json, text, arraybuffer, stream (node.js), blob (browser), document (browser)
     * 🚨 Setting responseType to "arraybuffer" tells Axios not to decode the data, but to return the raw binary data. Commonly used for downloading images, PDFs, or other binary files
     */
    const response = await axios.get(originalImageUrl, {
      responseType: "arraybuffer",
    });

    /*
     * arraybuffer vs stream, which one to use for responseType?
     * ✅ arrayBuffer, due to
     * 1. Need of full image in binary to write in disk
     * 2. Not handling huge files
     * 3. fs.writeFile expects data to be in memory, like Buffer or string
     *
     * 🟡 stream, would work but introduces more complexity
     * with a stream, the stream has to be piped directly to a write stream
     * >> This is beneficial to saving memory for large files
     */
    await fs.writeFile(inputPath, response.data);

    await new Promise<void>((resolve, reject) => {
      // rembg i <inputPath> <outputPath>
      const rembg = spawn("rembg", ["i", inputPath, outputPath]);
      rembg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`rembg failed with code ${code}`));
      });
      rembg.on("error", reject);
    });

    // Reads the processed image from disk into memory like buffer
    const processedBuffer = await fs.readFile(outputPath);

    const processImageurl = await uploadImage(
      "processed",
      {
        buffer: processedBuffer,
        mimetype: "image/png",
        originalname: `${jobID}-output.png`,
      },
      userId,
    );
    console.log(`✅ Job ${jobID} complete for user ${userId}`);
    return { jobID, processImageurl };
  } catch (error) {
    console.error("Image processing failed");
    throw error;
  } finally {
    try {
      // Deletes input/output files from temp directory whether success or failure
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    } catch (_) {
      // Ignoring if files were never created
    }
  }
};

// const url =
//   "https://purepng.s3.ap-south-1.amazonaws.com/original/1750335451830-primeagen.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZI2LI3YZBM4JA6XC%2F20250619%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250619T121732Z&X-Amz-Expires=3600&X-Amz-Signature=2edc1cf93c1bbf1515bb302c8161d05847c00fa3dfd4b472378c80f9b200cb77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
// const userId = "1";
// const jobID = uuidv4();
//
// const main = async () => {
//   console.log(
//     "Image url with backgroun removed",
//     await processImageJob({
//       jobID,
//       originalImageUrl: url,
//       userId,
//     }),
//   );
// };
//
// main();
