import { Request, Response, NextFunction } from "express";

import CustomRequest from "../../../lib/custom.request";

import newPasswordService from "../services/forgot_password.service";


class NewPasswordController {
    async forgotPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await newPasswordService.forgotPassword(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async forgotPasswordVerify(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await newPasswordService.forgotPasswordVerify({
                token: req.query.token,
                otp: req.query.otp,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
    
    async resetPassword(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await newPasswordService.resetPassword({
                ...req.body,
                user: req.user,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new NewPasswordController();
