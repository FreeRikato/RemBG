import { RedisOptions } from "ioredis";
import IORedis from "ioredis";

const redisOptions: RedisOptions = {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
};

const redisConnection = new IORedis(redisOptions);
export default redisConnection;
