import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./controllers/auth.controller";
import userRoutes from "./controllers/user.controller";
import pngRouter from "./controllers/png.controller";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/png", pngRouter);

app.get("/", (_, res) => {
    res.send("Hello world");
});

app.use(errorHandler);

export default app;
