import { Request, Response, NextFunction } from "express";
import CustomRequest from "../../../lib/custom.request";

import verificationService from "../services/verification.service";

class VerificationController {
    async verifyCode(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await verificationService.verifyCode({
                ...req.body,
                user: req.user
            });
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

export default new VerificationController();
