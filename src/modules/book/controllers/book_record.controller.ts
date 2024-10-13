import { Response, NextFunction } from 'express';

import CustomRequest from '../../../lib/custom.request';

import recordService from '../services/book_record.service';

class RecordController {
    async fetchRecord(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await recordService.fetchRecord({
                record: req.params.id,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchRecords(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await recordService.fetchRecords({
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new RecordController();
