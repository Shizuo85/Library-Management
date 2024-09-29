import { Router } from "express";

import generalRouter from "./general.routes";
import authRouter from "./auth.routes";
import authorRouter from "./author.routes";

const router = Router();

router.use("/", generalRouter);
router.use("/auth", authRouter);
router.use("/author", authorRouter);

export default router;