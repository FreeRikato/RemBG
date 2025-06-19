import { Worker, Job } from "bullmq";
import redisConnection from "../backend/src/utils/redisConnection";
import { processImageJob } from "./imageProcessor";
import { queueName } from "../backend/src/config";

const backgroundWorker = new Worker(
  queueName,
  async (job: Job) => {
    console.log(`Processing job ${job.id}`);
    const result = await processImageJob({
      jobID: job.id!,
      originalImageUrl: job.data.signedUrl,
      userId: job.data.userID,
    });
    console.log(`Completed job ${job.id}`);
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);

backgroundWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

process.stdin.resume();
