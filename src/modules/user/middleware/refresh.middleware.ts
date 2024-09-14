import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { decrypt } from '../../aes/aes.service';
import CustomRequest from '../../../lib/custom.request';

export default async function (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.get('Authorization')?.split(' ')[1];
        if (!token) {
            const err: any = new Error('Bad request, token missing');
            err.status = 400;
            throw err;
        }
        const payLoad: any = jwt.verify(
            decrypt(token),
            process.env.JWT_SECRET!
        );
        if (payLoad?.action != 'refresh_jwt') {
            const err: any = new Error('Bad request, invalid token');
            err.status = 400;
            throw err;
        }

        req.user = payLoad.user;
        return next();
    } catch (err: any) {
        err.status = err.status ?? 400;
        return next(err);
    }
}
