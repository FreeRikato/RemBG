import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./controllers/auth.controller";
import { PORT } from "./config";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (_, res) => {
    res.send("Hello world");
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data source has been initialized");
        app.listen(PORT, () => {
            console.log("Server is running on http://localhost:3000");
        });
    })
    .catch((err) => {
        console.error("Error during Data source initialization:", err);
    });
