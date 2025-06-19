import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import authenticate from "../middlewares/auth.middleware";
import retrieveUsers from "../repositories/retrieveUsers";
import ReqValidate from "../middlewares/validation.middleware";
import { userIdSchema } from "../types/userId.type";
import { userRequest } from "../types/userRequest.interface";
import retrieveUserById from "../repositories/retrieveUserById";
import { userSchema } from "../types/user.type";
import {
    deleteUserDetails,
    updateUserDetails,
} from "../services/user.services";
import { instanceToPlain } from "class-transformer";
import { cache } from "../middlewares/cache.middleware";

const router = Router();

router.get(
    "/",
    authenticate,
    cache(600),
    asyncHandler(async (req, res) => {
        const users = await retrieveUsers();
        res.json({
            msg: "Users retrieved successfully",
            data: users,
        });
    }),
);

router.get(
    "/:id",
    authenticate,
    ReqValidate.params(userIdSchema),
    cache(600),
    ReqValidate.params(userIdSchema),
    asyncHandler(async (req: userRequest, res) => {
        const user = await retrieveUserById(req.params.id);
        res.json({
            msg: "Users retrieved successfully",
            data: instanceToPlain(user),
        });
    }),
);

router.put(
    "/:id",
    authenticate,
    ReqValidate.params(userIdSchema),
    ReqValidate.body(userSchema),
    asyncHandler(async (req: userRequest, res) => {
        const { email, password } = req.body;

        const user = await updateUserDetails({
            jwt_ID: String(req.id),
            params_ID: req.params.id,
            email,
            password,
        });

        res.json({
            msg: "User updated successfully",
            data: user,
        });
    }),
);

router.delete(
    "/:id",
    authenticate,
    ReqValidate.params(userIdSchema),
    asyncHandler(async (req: userRequest, res) => {
        const user = await deleteUserDetails({
            jwt_ID: String(req.id),
            params_ID: req.params.id,
        });

        res.json({
            msg: "User deleted successfully",
            data: user,
        });
    }),
);

export default router;
