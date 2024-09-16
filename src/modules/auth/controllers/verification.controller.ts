import { Request, Response, NextFunction } from "express";

import verificationService from "../services/verification.service";

class SignupController {
    async verifyCode(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await verificationService.verifyCode(req.body);
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }

    async resendCode(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await verificationService.resendCode(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new SignupController();
