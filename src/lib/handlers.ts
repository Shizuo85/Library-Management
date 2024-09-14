import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import multer from 'multer';

class Handlers {
    errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        console.log(err);
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FIELD_COUNT') {
                return res.status(400).json({
                    error: 'File size is too large, limit 15MB',
                });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    error: 'Invalid upload detected',
                });
            }
        } else if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
            });
        } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
            });
        } else if (
            err instanceof SyntaxError &&
            ('body' in err || 'query' in err)
        ) {
            return res.status(400).json({
                error: 'Bad request - Invalid input parameter(s)',
            });
        } else if (err instanceof TypeError) {
            return res.status(400).json({
                error: 'Bad request - Invalid parameter',
            });
        }
        return res
            .status(err.status || 500)
            .json({ error: err.message || err });
    }
    Error404Handler(req: Request, res: Response, next: NextFunction) {
        return res.status(404).json({ error: 'Oops, no page found!' });
    }
}

export default new Handlers();
