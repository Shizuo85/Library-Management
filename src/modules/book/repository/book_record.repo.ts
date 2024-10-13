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

    async fetchRecord(filter: any){
        return await bookRecordModel.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                email: 1,
                                name: {
                                    $concat: [
                                        { $ifNull: ["$first_name", ""] },
                                        " ",
                                        { $ifNull: ["$last_name", ""] },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'book',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                isbn: 1,
                                status: 1
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$book',
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    book: 1,
                    borrowed_at: 1,
                    due_at: 1,
                    returned_at: 1,
                },
            },
        ]);
    }

    async fetchRecords(filter: any, limit: number, page: number, sort: any) {
        const [{ authors, count }] = await bookRecordModel.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                email: 1,
                                name: {
                                    $concat: [
                                        { $ifNull: ["$first_name", ""] },
                                        " ",
                                        { $ifNull: ["$last_name", ""] },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'book',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                isbn: 1,
                                status: 1
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$book',
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    book: 1,
                    borrowed_at: 1,
                    due_at: 1,
                    returned_at: 1,
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

export default new BookRecordRepo();
