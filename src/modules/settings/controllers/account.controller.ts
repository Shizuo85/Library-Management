import { Response, NextFunction } from "express";

import accountService from "../services/account.service";
import CustomRequest from "../../../lib/custom.request";

class AccountController {
    async changePassword(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await accountService.changePassword({
                user: req.user,
                ...req.body,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async changeEmail(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await accountService.changeEmail({
                user: req.user,
                ...req.body,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async changeEmailCode(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await accountService.changeEmailCode({
                user: req.user,
                ...req.body,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async resendEmailCode(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await accountService.resendEmailCode({
                user: req.user,
                email: req.temp_email,
                ...req.body,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async updateLoginWithGoogle(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await accountService.updateLoginWithGoogle({
                user: req.user,
                ...req.body,
            });
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }
}

export default new AccountController();
