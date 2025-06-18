import { Router } from "express";
import ReqValidate from "../middlewares/validation.middleware";
import { userSchema } from "../types/user.type";
import { userRepository } from "../repositories/repository";
import { asyncHandler, HttpError } from "../middlewares/error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post(
    "/register",
    ReqValidate.body(userSchema),
    asyncHandler(async (req, res) => {
        /*
         * 1. Request body validation with userSchema
         * 2. Check if the user exists already in the database
         * 3. If not, register the new user by creating a new record in database
         * 4. Generate JWT token so that user skip login step and directly authenticated
         * 5. Transform the user record returned to exclude password
         */
        const { email, password } = req.body;

        const userExists = await userRepository.findOneBy({ email });
        if (userExists)
            throw new HttpError("User already exists", HttpStatusCode.CONFLICT);

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const userToSave = userRepository.create({
            email,
            password: hashedPassword,
        });
        const newUser = await userRepository.save(userToSave);

        const token = generateToken({ id: newUser.id, email });

        res.status(200).json({
            message: "User created successfully",
            data: {
                user: newUser,
                token,
            },
        });
    }),
);

router.post("/login", ReqValidate.body(userSchema), (req, res) => {
    const body = req.body;
    res.json({ data: body });
});

export default router;
