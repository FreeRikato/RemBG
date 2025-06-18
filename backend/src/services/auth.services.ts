import { HttpError } from "../middlewares/error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import * as bcrypt from "bcrypt";
import createAndSaveUser from "../repositories/createAndSaveUser";
import findOneByEmail from "../repositories/findeOneByEmail";
import { generateToken } from "../utils/jwt";
import { SALT_ROUNDS } from "../config";
import { instanceToPlain } from "class-transformer";

const registerUser = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    /*
     * 1. Request body validation with userSchema using middleware
     * 2. Check if the user exists already in the database
     * 3. If not, register the new user by creating a new record in database
     * 4. Generate JWT token so that user skip login step and directly authenticated
     * 5. Transform the user record returned to exclude password
     */

    const userExists = await findOneByEmail(email);
    if (userExists)
        throw new HttpError("User already exists", HttpStatusCode.CONFLICT);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createAndSaveUser({ email, hashedPassword });

    const token = generateToken({ id: user.id, email });

    return { user: instanceToPlain(user), token };
};

const loginUser = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    /*
     * 1. Request body validation with userSchema using middleware
     * 2. Check if the user exists already in the database, else return unauthorized access
     * 3. If present then check if the provided password matches with the password from database, else return unauthorized access
     * 4. If provided password matches with stored password, Generate JWT token for authentication
     * 5. Transform the user record returned to exclude password
     */

    const user = await findOneByEmail(email);
    if (!user)
        throw new HttpError("User not found", HttpStatusCode.UNAUTHORIZED);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw new HttpError("Invalid credentials", HttpStatusCode.UNAUTHORIZED);
    const token = generateToken({ id: user.id, email });
    return { user: instanceToPlain(user), token };
};

export { registerUser, loginUser };
