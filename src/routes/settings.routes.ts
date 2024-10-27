import { Router } from "express";

import authMiddleware from "../modules/user/middleware/auth.middleware";

import accountMiddleware from "../modules/settings/middleware/account.middleware";

import accountController from "../modules/settings/controllers/account.controller";

const settingsRouter = Router();

settingsRouter.patch(
    "/google-login",
    authMiddleware,
    accountMiddleware.updateLoginWithGoogle,
    accountController.updateLoginWithGoogle
);

settingsRouter.patch(
    "/change-password",
    authMiddleware,
    accountMiddleware.changePassword,
    accountController.changePassword
);

settingsRouter.post(
    "/new-email",
    authMiddleware,
    accountMiddleware.changeEmail,
    accountController.changeEmail
);

settingsRouter.patch(
    "/verify-email/",
    authMiddleware,
    accountMiddleware.changeEmailCode,
    accountController.changeEmailCode
);

settingsRouter.post(
    "/resend-email-code/",
    authMiddleware,
    accountController.resendEmailCode
);

settingsRouter.patch(
    "/edit/",
    authMiddleware,
    accountMiddleware.updateProfile,
    accountController.updateProfile
);

settingsRouter.get(
    "/profile/",
    authMiddleware,
    accountController.fetchProfile
);

export default settingsRouter;