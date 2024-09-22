import { Request, Response, NextFunction } from 'express';
import sanitizer from '../../../lib/sanitizer';

import recordSchema from '../schemas/book_record.schema';

class RecordMiddleware {
    async fetchRecords(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await recordSchema.fetchRecords.validateAsync(req.body);
            return next();
        } catch (err: any) {
            err.status = 422;
            return next(err);
        }
    }

    async fetchRecord(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await recordSchema.fetchRecord.validateAsync(req.body);
            return next();
        } catch (err: any) {
            err.status = 422;
            return next(err);
        }
    }
}

export default new RecordMiddleware();
