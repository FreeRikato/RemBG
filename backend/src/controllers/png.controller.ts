import { Router } from "express";
import multer from "multer";
import { asyncHandler, HttpError } from "../middlewares/error.middleware";
import authenticate from "../middlewares/auth.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import { uploadImage } from "../services/png.services";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/upload",
    authenticate,
    upload.single("image"),
    asyncHandler(async (req, res) => {
        if (!req.file)
            throw new HttpError(
                "No file present in request",
                HttpStatusCode.BAD_REQUEST,
            );
        const file = req.file;
        const url = await uploadImage(file);
        return res.status(200).json({
            message: "Image uploaded successfully",
            url,
        });
    }),
);

export default router;
