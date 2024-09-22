import { Request, Response, NextFunction } from "express";

import signupService from "../services/signup.service";

class SignupController {
    async googleSignup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await signupService.googleSignup(req.body);
            return res.status(201).json(result);
        } catch (err) {
            return next(err);
        }
    }

    async emailSignup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await signupService.emailSignup(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async googleApiUrl(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await signupService.googleApiUrl(req.body);
            return res.status(201).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new SignupController();
