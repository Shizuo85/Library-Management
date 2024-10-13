import { Types } from 'mongoose';
import recordRepo from '../repository/book_record.repo';

class RecordService {
    async fetchRecord(data: any) {
        const [record] = await recordRepo.fetchRecord(
            {
                _id: { $eq: new Types.ObjectId(data.record) },
            }
        );

        if (!record) {
            const err: any = new Error('Record not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
            data: {
                record,
            },
        };
    }

    async fetchRecords(data: any) {
        const query: any = {};

        const sort: any = {};

        if (data.start) {
            query.createdAt = {
                ...query.createdAt,
                $gte: new Date(data.start),
            };
        }
        if (data.end) {
            const endDate = new Date(data.end);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { ...query.createdAt, $lte: endDate };
        }
        if (data.sort === 'desc') {
            sort.borrowed_at = -1;
        } else {
            sort.borrowed_at = 1;
        }

        const result = await recordRepo.fetchRecords(
            query,
            Math.abs(Number(data.limit) || 10),
            Math.abs(Number(data.page) || 1),
            sort,
        );

        return {
            message: 'Success',
            data: {
                ...result,
            },
        };
    }
}

export default new RecordService();
