import bookModel from '../models/book.model';

class BookRepo {
    async create(data: any) {
        return await bookModel.create(data);
    }

    async findOne(filter: any) {
        return await bookModel.findOne(filter);
    }

    async findOneSelect(filter: any, select: any = {}) {
        return await bookModel.findOne(filter).select(select);
    }

    async updateOne(filter: any, data: any) {
        return await bookModel.findOneAndUpdate(filter, data, {
            upsert: false,
        });
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await bookModel
            .findOneAndUpdate(filter, data, { new: true, upsert: false })
            .select(select);
    }

    async findOneAndDelete(filter: any) {
        return await bookModel.findOneAndDelete(filter);
    }
}

export default new BookRepo();
