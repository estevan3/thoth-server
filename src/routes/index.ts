import { Router, Request, Response } from "express";
import userRouter from "./user.js";
import postRouter from "./post.js";

const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use((req: Request, res: Response) => {
  res.status(405).json({ message: "Method not allowed" });
});

export default router;
