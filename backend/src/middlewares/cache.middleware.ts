import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisConnection";

export const cache =
    (ttlSeconds: number) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const key = req.originalUrl;

        if (redisClient.status !== "ready") {
            console.warn("Redis not connected, skipping cache");
            next();
        }

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                console.log(`[CACHE] HIT for key ${key}`);
                res.setHeader("Content-Type", "application/json");
                res.setHeader("X-Cache", "HIT");
                res.send(JSON.parse(cachedData));
                return;
            } else {
                console.log(`[CACHE] MISS for key ${key}`);
                res.setHeader("X-Cache", "MISS");
                const originalSend = res.send.bind(res);
                res.send = (body: any): Response => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        redisClient.set(
                            key,
                            JSON.stringify(body),
                            "EX",
                            ttlSeconds,
                        );
                    }
                    return originalSend(body);
                };
                next();
            }
        } catch (err) {
            console.error(`Redis cache middleware error:`, err);
            next();
        }
    };
