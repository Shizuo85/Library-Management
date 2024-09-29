import bookRecordModel from '../models/book_record.model';

class BookRecordRepo {
    async create(data: any) {
        return await bookRecordModel.create(data);
    }

    async findOne(filter: any) {
        return await bookRecordModel.findOne(filter);
    }

    async findOneSelect(filter: any, select: any = {}) {
        return await bookRecordModel.findOne(filter).select(select);
    }

    async updateOne(filter: any, data: any) {
        return await bookRecordModel.findOneAndUpdate(filter, data, {
            upsert: false,
        });
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await bookRecordModel
            .findOneAndUpdate(filter, data, { new: true, upsert: false })
            .select(select);
    }

    async findOneAndDelete(filter: any) {
        return await bookRecordModel.findOneAndDelete(filter);
    }
}

export default new BookRecordRepo();
