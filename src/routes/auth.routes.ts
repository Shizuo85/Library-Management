import { Router } from 'express';

import signupController from '../modules/auth/controllers/signup.controller';
import signupMiddleware from '../modules/auth/middleware/signup.middleware';

const authRouter = Router();

authRouter.post(
    '/signup',
    signupMiddleware.googleSignup,
    signupController.googleSignup
);

authRouter.get(
    '/google-url',
    signupController.googleApiUrl
);

export default authRouter;
