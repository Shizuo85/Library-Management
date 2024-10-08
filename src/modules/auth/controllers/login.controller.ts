import { Request, Response, NextFunction } from "express";

import loginService from "../services/login.service";

class LoginController {
    async googleLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await loginService.googleLogin(req.body);
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }

    async emailLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await loginService.emailLogin(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new LoginController();
