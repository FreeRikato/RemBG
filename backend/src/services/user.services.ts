import { instanceToPlain } from "class-transformer";
import { SALT_ROUNDS } from "../config";
import { HttpError } from "../middlewares/error.middleware";
import retrieveUserById from "../repositories/retrieveUserById";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import * as bcrypt from "bcrypt";
import deleteUser from "../repositories/deleteUser";
import updateUser from "../repositories/updateUser";

const updateUserDetails = async ({
    jwt_ID,
    params_ID,
    email,
    password,
}: {
    jwt_ID: string;
    params_ID: string;
    email: string;
    password: string;
}) => {
    if (jwt_ID !== params_ID)
        throw new HttpError(
            "Another user's data cannot be modified",
            HttpStatusCode.FORBIDDEN,
        );

    const user = await retrieveUserById(params_ID);

    if (!user)
        throw new HttpError(
            "User doesn't exist in the database to be updated",
            HttpStatusCode.CONFLICT,
        );

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const updatedUser = await updateUser({ params_ID, email, hashedPassword });

    return { user: instanceToPlain(updatedUser) };
};

const deleteUserDetails = async ({
    jwt_ID,
    params_ID,
}: {
    jwt_ID: string;
    params_ID: string;
}) => {
    const userExists = retrieveUserById(params_ID);

    if (!userExists)
        throw new HttpError(
            "User doesn't exist in the database to be udpated",
            HttpStatusCode.CONFLICT,
        );

    if (jwt_ID !== params_ID)
        throw new HttpError(
            "Another user data cannot be modified",
            HttpStatusCode.FORBIDDEN,
        );

    const user = await deleteUser(params_ID);

    return { user: instanceToPlain(user) };
};

export { updateUserDetails, deleteUserDetails };
