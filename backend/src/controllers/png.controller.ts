import { Response, Router } from "express";
// multer is a node.js middleware used for handling multipart/form-data used for file uploads
import multer from "multer";
import { asyncHandler, HttpError } from "../middlewares/error.middleware";
import authenticate from "../middlewares/auth.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import { uploadImage } from "../services/png.services";
import { userRequest } from "../types/userRequest.interface";

const router = Router();
// Sets up multer to temporarily store uploaded files in memory (RAM) instead of on disk
// memoryStorage() is suitable for smaller file or OTA processing
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/upload",
    authenticate,
    /*
     * The middleware tells multer to:
     * > Accept a single file upload with the field name "image"
     * > Make the file available on req.file
     * >> For multiple images replace it with upload.array("images", <MAX_FILES>)
     */
    upload.single("image"),
    asyncHandler(async (req: userRequest, res: Response) => {
        if (!req.file)
            throw new HttpError(
                "No file present in request",
                HttpStatusCode.BAD_REQUEST,
            );
        const file = req.file;
        /*
         * For multiple images, make sure to map with a promise:
         * const files = req.files as Express.Multer.File[]
         * const urls = await Promise.all({
         *     files.map(file => uploadImage("original", file))
         * })
         */
        const { signedUrl: url, job } = await uploadImage(
            "original",
            file,
            req.id!,
        );
        return res.status(200).json({
            message: "Image uploaded successfully",
            url,
            ...job,
        });
    }),
);

export default router;
