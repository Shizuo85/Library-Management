import { Request, Response, NextFunction } from "express";
import sanitizer from "../../../lib/sanitizer";

import userSchema from "../schemas/user.schema";

class UserMiddleware {
    async fetchUsers(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await userSchema.fetchUsers.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async fetchUser(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await userSchema.fetchUser.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

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

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await userSchema.deleteUser.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new UserMiddleware();
