import { Response, NextFunction } from 'express';

import CustomRequest from '../../../lib/custom.request';

import userService from '../services/user.service';

class UserController {
    async fetchUser(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await userService.fetchUser({
                ...req.body,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
    
    async fetchUsers(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await userService.fetchUsers({
                ...req.body,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async updateUser(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await userService.updateUser({
                ...req.body,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async deleteUser(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await userService.deleteUser({
                ...req.body,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new UserController();
