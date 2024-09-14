import { Router } from "express";

import generalRouter from "./general.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use("/", generalRouter);
router.use("/auth", authRouter);

export default router;