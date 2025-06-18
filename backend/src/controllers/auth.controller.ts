import { Router } from "express";

const router = Router();

router.post("/register", (_, res) => {
    res.json({ msg: "Registered user successfully" });
});

export default router;
