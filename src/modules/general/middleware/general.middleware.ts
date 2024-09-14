import { Request, Response, NextFunction } from "express";

import sanitizer from "../../../lib/sanitizer";
import generalSchema from "../schemas/general.schema";

class GeneralMiddleware {
    async sanitizeParams(req: Request, res: Response, next: NextFunction){
        try{
            sanitizer(req.params);
            await generalSchema.paramsId.validateAsync(req.params);
            return next();
        }catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async pagination(req: Request, res: Response, next: NextFunction){
        try{
            sanitizer(req.query);
            await generalSchema.pagination.validateAsync(req.query);
            return next();
        }catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new GeneralMiddleware();