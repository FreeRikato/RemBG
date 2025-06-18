import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { HttpError } from "../middlewares/error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import { userJWTPayload } from "../types/jwtPayload.interface";

export const generateToken = ({ id }: userJWTPayload) => {
    const generatedToken = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "2h",
    });
    return generatedToken;
};

export const validateToken = (token: string) => {
    try {
        const validToken = jwt.verify(token, JWT_SECRET) as userJWTPayload;
        return validToken;
    } catch (error) {
        throw new HttpError("Invalid JWT Token", HttpStatusCode.CONFLICT);
    }
};
