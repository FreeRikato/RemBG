import * as dotenv from "dotenv";
dotenv.config();

const getEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

export const PORT = parseInt(getEnv("PORT"), 10);
export const JWT_SECRET = getEnv("JWT_SECRET");
export const SALT_ROUNDS = parseInt(getEnv("SALT_ROUNDS"), 10);
export const NODE_ENV = getEnv("NODE_ENV");
