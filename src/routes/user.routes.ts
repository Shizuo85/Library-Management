import { Router } from 'express';

import authMiddleware from "../modules/user/middleware/auth.middleware";

import userController from '../modules/user/controllers/user.controller';
import userMiddleware from '../modules/user/middleware/user.middleware';

import generalMiddleware from '../modules/general/middleware/general.middleware';

const userRouter = Router();

userRouter.get(
    '/fetch/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    userController.fetchUser
);

userRouter.get(
    '/all',
    authMiddleware,
    generalMiddleware.pagination,
    userController.fetchUsers
);

userRouter.patch(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    userMiddleware.updateUser,
    userController.updateUser
);

userRouter.delete(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    userController.deleteUser
);

export default userRouter;
