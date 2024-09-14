import { Response, NextFunction } from "express";
import CustomRequest from "../../../lib/custom.request";

class GeneralController {
    async default(req: CustomRequest, res: Response, next: NextFunction){
        try{
            return res.status(200).json({data: "Server running!!!"});
        }catch(err){
            return next(err);
        }
    }
}

export default new GeneralController();