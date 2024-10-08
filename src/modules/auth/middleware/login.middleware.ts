import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { normalizeEmail } from "validator";

import sanitizer from "../../../lib/sanitizer";
import loginSchema from "../schemas/login.schema";

const verifyGoogleAuth = async (code: any) => {
    const data = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URL,
        grant_type: "authorization_code",
        code: code,
    };
    const response = await axios.post(
        `https://oauth2.googleapis.com/token`,
        data
    );
    const { access_token } = response.data;
    const result = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    return {
        last_name: result.data.family_name,
        email: result.data.email,
        first_name: result.data.given_name,
    };
};

class LoginMiddleware {
    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            await loginSchema.googleLogin.validateAsync(req.body);
            const user = await verifyGoogleAuth(req.body.code);
            if (!user) {
                const err: any = new Error("Google authentication failed");
                err.status = 400;
                throw err;
            }
            req.body.email = user.email;
            return next();
        } catch(err: any){
            err.status = 400;
            return next(err);
        }
    }

    async emailLogin(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await loginSchema.emailLogin.validateAsync(req.body);
            req.body.email = normalizeEmail(req.body.email);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new LoginMiddleware();
