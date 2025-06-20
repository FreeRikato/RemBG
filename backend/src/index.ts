import app from "./app";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./controllers/auth.controller";
import userRoutes from "./controllers/user.controller";
import pngRouter from "./controllers/png.controller";
import { PORT } from "./config";
import { errorHandler } from "./middlewares/error.middleware";

/*
cluster module in node.js allows to create child processes(workers) that run copies of server code to make use of multi-core systems, Node.js is single-threaded by defualt, so without clustering, one CPU core handles all the traffic.

Process > One running instance of the app. Think of it as 1 copy
PID > "Process ID" - a unique number of each process
Primary > The main process that manages others 
Worker > The sub process that does actual work (like running the server)
cluster.fork > Make a copy of the app (a worker)
*/
import cluster from "cluster";
import os from "os";

// Calculate the number of CPU cores available
const numCPUs = os.cpus().length / 2;

const startApp = async () => {
    try {
        AppDataSource.initialize()
            .then(() => {
                console.log("Data source has been initialized");
                console.log(`Worker ${process.pid}: Database connected`);
                app.listen(PORT, () => {
                    console.log("Server is running on http://localhost:3000");
                });
            })
            .catch((err) => {
                console.error("Error during Data source initialization:", err);
            });
    } catch (err) {
        console.error(`Worker ${process.pid} failed to initialize:`, err);
        process.exit(1);
    }
};

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking for ${numCPUs} CPUs`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `Worker ${worker.process.pid} died. Forking another one...`,
        );
        cluster.fork();
    });
} else {
    startApp();
}
