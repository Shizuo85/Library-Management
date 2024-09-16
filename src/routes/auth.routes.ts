import { Router } from 'express';

import signupController from '../modules/auth/controllers/signup.controller';
import signupMiddleware from '../modules/auth/middleware/signup.middleware';

import loginController from '../modules/auth/controllers/login.controller';
import loginMiddleware from '../modules/auth/middleware/login.middleware';

import verificationController from '../modules/auth/controllers/verification.controller';
import verificationMiddleware from '../modules/auth/middleware/verification.middleware';

import refreshMiddleware from '../modules/user/middleware/refresh.middleware';
import authController from '../modules/user/controllers/auth.controller';

import newPasswordMiddleware from '../modules/auth/middleware/forgot_password.middleware';
import newPasswordController from '../modules/auth/controllers/forgot_password.controller';

const authRouter = Router();

authRouter.post(
    '/signup',
    signupMiddleware.emailSignup,
    signupController.emailSignup
);

authRouter.post(
    '/google-signup',
    signupMiddleware.googleSignup,
    signupController.googleSignup
);

authRouter.post(
    '/login',
    loginMiddleware.emailLogin,
    loginController.emailLogin
);

authRouter.post(
    '/google-login',
    loginMiddleware.googleLogin,
    loginController.googleLogin
);

authRouter.post(
    '/verify-code',
    verificationMiddleware.verifyCode,
    verificationController.verifyCode
);

authRouter.post(
    '/resend-code',
    verificationMiddleware.resendCode,
    verificationController.resendCode
);

authRouter.get('/google-url', signupController.googleApiUrl);

authRouter.get(
    '/refresh-token',
    refreshMiddleware,
    authController.refreshLoginToken
);

authRouter.post(
    '/forgot-password',
    newPasswordMiddleware.forgotPassword,
    newPasswordController.forgotPassword
);

authRouter.post(
    '/forgot-password/verify',
    newPasswordMiddleware.forgotPasswordVerify,
    newPasswordController.forgotPasswordVerify
);

authRouter.post(
    '/new-password',
    newPasswordMiddleware.authenticateReset,
    newPasswordMiddleware.resetPassword,
    newPasswordController.resetPassword
);

export default authRouter;
