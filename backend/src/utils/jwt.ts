import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface userJWT {
    id: number;
    email: string;
}

export const generateToken = ({ id, email }: userJWT) => {
    const generatedToken = jwt.sign({ id, email }, JWT_SECRET, {
        expiresIn: "2h",
    });
    return generatedToken;
};
