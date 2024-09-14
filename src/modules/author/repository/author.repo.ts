import authorModel from '../models/author.model';

class AuthorRepo {
    async create(data: any) {
        return await authorModel.create(data);
    }

    async findOne(filter: any) {
        return await authorModel.findOne(filter);
    }

    async findOneSelect(filter: any, select: any = {}) {
        return await authorModel.findOne(filter).select(select);
    }

    async updateOne(filter: any, data: any) {
        return await authorModel.findOneAndUpdate(filter, data, {
            upsert: false,
        });
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await authorModel
            .findOneAndUpdate(filter, data, { new: true, upsert: false })
            .select(select);
    }
}

export default new AuthorRepo();
