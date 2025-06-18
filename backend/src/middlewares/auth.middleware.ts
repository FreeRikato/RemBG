import { Response, NextFunction } from "express";
import { HttpError } from "./error.middleware";
import { HttpStatusCode } from "../types/HTTPStatusCode.enum";
import { validateToken } from "../utils/jwt";
import { userRequest } from "../types/userRequest.interface";

const authenticate = (req: userRequest, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken)
        throw new HttpError(
            "Bearer Token is missing or undefined in authorization header",
            HttpStatusCode.CONFLICT,
        );
    const token = bearerToken.split(" ")[1];
    console.log(token);
    if (!token)
        throw new HttpError(
            "Token is missing or undefined in bearer token",
            HttpStatusCode.CONFLICT,
        );

    const { id } = validateToken(token);
    req.id = id;
    next();
};

export default authenticate;
