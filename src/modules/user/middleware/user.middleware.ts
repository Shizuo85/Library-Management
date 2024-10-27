import { Request, Response, NextFunction } from "express";
import sanitizer from "../../../lib/sanitizer";

import userSchema from "../schemas/user.schema";

class UserMiddleware {
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await userSchema.updateUser.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new UserMiddleware();
