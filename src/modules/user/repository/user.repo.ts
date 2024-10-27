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

    async findOneAndDelete(filter: any) {
        return await userModel.findOneAndDelete(filter);
    }

    async fetchUser(filter: any) {
        const [user] = await userModel.aggregate([
            {
                $match: filter
            },
            {
                $project: {
                    name: {
                        $concat: [
                            { $ifNull: ['$first_name', ''] },
                            ' ',
                            { $ifNull: ['$last_name', ''] },
                        ],
                    },
                    email: 1,
                    role: 1,
                    status: 1
                }
            }
        ])

        return user
    }

    async fetchUsers(
        filter: any,
        limit: number,
        page: number,
        search: any
    ) {
        const [{ users, count }] = await userModel.aggregate([
            {
                $match: filter
            },
            {
                $project: {
                    name: {
                        $concat: [
                            { $ifNull: ['$first_name', ''] },
                            ' ',
                            { $ifNull: ['$last_name', ''] },
                        ],
                    },
                    email: 1,
                    role: 1,
                    status: 1
                }
            },
            {
                $match: search,
            },
            {
                $sort: {
                    name: 1
                },
            },
            {
                $facet: {
                    users: [
                        {
                            $skip: (page - 1) * limit,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                    count: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
        ]);

        const total_count = count[0]?.count ?? 0;
        const total_pages = Math.ceil(total_count / limit);

        return {
            users,
            total_count,
            page,
            total_pages,
        };
    }
}

export default new UserRepo();
