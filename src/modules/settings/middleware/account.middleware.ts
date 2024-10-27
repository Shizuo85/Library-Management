import { Request, Response, NextFunction } from "express";
import { normalizeEmail } from "validator";
import sanitizer from "../../../lib/sanitizer";
import CustomRequest from "../../../lib/custom.request";


import accountSchema from "../schemas/account.schema";


class AccountMiddleware {
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await accountSchema.changePassword.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async changeEmail(req: Request, res: Response, next: NextFunction) {
        try {
            req.body.email = normalizeEmail(req.body.email);
            sanitizer(req.body);
            await accountSchema.changeEmail.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async changeEmailCode(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await accountSchema.changeEmailCode.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async updateLoginWithGoogle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            if(req.email?.split('@')[1] != "gmail.com"){
                const err: any = new Error("This permission is only available for Google accounts");
                err.status = 400;
                throw err;
            }
            sanitizer(req.body);
            await accountSchema.updateLoginWithGoogle.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = err.status ?? 422;
            return next(err);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await accountSchema.updateProfile.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new AccountMiddleware();
