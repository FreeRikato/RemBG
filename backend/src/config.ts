import * as dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

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
export const accessKeyId = getEnv("AWS_ACCESS_KEY_ID");
export const secretAccessKey = getEnv("AWS_SECRET_ACCESS_KEY");
export const region = getEnv("AWS_REGION");
export const bucketName = getEnv("AWS_BUCKET_NAME");

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
