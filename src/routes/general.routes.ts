import { Router } from "express";

import generalController from "../modules/general/controllers/general.controller";

const generalRouter = Router();

generalRouter.get("/", generalController.default);

export default generalRouter;