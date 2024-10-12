import { Router } from "express";

import generalRouter from "./general.routes";
import authRouter from "./auth.routes";
import authorRouter from "./author.routes";
import bookRouter from "./book.routes";

const router = Router();

router.use("/", generalRouter);
router.use("/auth", authRouter);
router.use("/author", authorRouter);
router.use("/book", bookRouter);

export default router;