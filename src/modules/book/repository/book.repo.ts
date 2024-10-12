import bookModel from '../models/book.model';

class BookRepo {
    async create(data: any) {
        return await bookModel.create(data);
    }

    async findOne(filter: any) {
        return await bookModel.findOne(filter);
    }

    async findOneSelect(filter: any, select: any = {}) {
        return await bookModel
            .findOne(filter)
            .select(select)
            .populate({
                path: 'author',
                select: { name: 1, birthday: 1, bio: 1 },
            });
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

    async fetchBooks(
        filter: any,
        limit: number,
        page: number,
        sort: any,
        search: any
    ) {
        const [{ books, count }] = await bookModel.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$author',
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    isbn: 1,
                    author: '$author.name',
                    status: 1,
                    createdAt: 1,
                },
            },
            {
                $match: search,
            },
            {
                $sort: sort,
            },
            {
                $facet: {
                    books: [
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
            books,
            total_count,
            page,
            total_pages,
        };
    }
}

export default new BookRepo();
