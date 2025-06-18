import { Router } from "express";
import ReqValidate from "../middlewares/validation.middleware";
import { userSchema } from "../types/user.type";
import { asyncHandler } from "../middlewares/error.middleware";
import { loginUser, registerUser } from "../services/auth.services";

const router = Router();

router.post(
    "/register",
    ReqValidate.body(userSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const { user, token } = await registerUser({ email, password });

        res.status(201).json({
            message: "User created successfully",
            data: {
                user,
                token,
            },
        });
    }),
);

router.post(
    "/login",
    ReqValidate.body(userSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const { user, token } = await loginUser({ email, password });

        res.status(200).json({
            message: "User logged in successfully",
            data: {
                user,
                token,
            },
        });
    }),
);

export default router;
