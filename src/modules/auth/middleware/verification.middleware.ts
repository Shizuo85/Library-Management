import { Request, Response, NextFunction } from 'express';
import { normalizeEmail } from 'validator';

import sanitizer from '../../../lib/sanitizer';
import verificationSchema from '../schemas/verification.schema';

class SignupMiddleware {
    async verifyCode(req: Request, res: Response, next: NextFunction) {
        try {
            await verificationSchema.verifyCode.validateAsync(req.body);
            return next();
        } catch (err: any) {
            err.status = 400;
            return next(err);
        }
    }

    async resendCode(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await verificationSchema.resendCode.validateAsync(req.body);
            req.body.email = normalizeEmail(req.body.email);
            return next();
        } catch (err: any) {
            err.status = 422;
            return next(err);
        }
    }
}

export default new SignupMiddleware();


