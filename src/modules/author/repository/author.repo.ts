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
    async findOneAndDelete(filter: any) {
        return await authorModel.findOneAndDelete(filter);
    }

    async fetchAuthors(filter: any, limit: number, page: number, sort: any) {
        const [{ authors, count }] = await authorModel.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    bio: 1,
                    birthday: 1,
                    createdAt: 1,
                },
            },
            {
                $sort: sort,
            },
            {
                $facet: {
                    authors: [
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
            authors,
            total_count,
            page,
            total_pages,
        };
    }
}

export default new AuthorRepo();
