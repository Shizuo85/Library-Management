import userModel from '../models/user.model';

class UserRepo {
    async create(data: any) {
        return await userModel.create(data);
    }

    async findOne(filter: any) {
        return await userModel.findOne(filter);
    }

    async findOneSelect(filter: any, select: any = {}) {
        return await userModel.findOne(filter).select(select);
    }

    async updateOne(filter: any, data: any) {
        return await userModel.findOneAndUpdate(filter, data, {
            upsert: false,
        });
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await userModel
            .findOneAndUpdate(filter, data, { new: true, upsert: false })
            .select(select);
    }
}

export default new UserRepo();
