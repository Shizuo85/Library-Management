import { Types } from 'mongoose';

import authorRepo from '../repository/author.repo';

class AuthorService {
    async createAuthor(data: any) {
        if (data.role != 'admin' && data.role != 'librarian') {
            const err: any = new Error(
                'Only admins and librarians can create an author'
            );
            err.status = 403;
            throw err;
        }

        const name: any = new RegExp('^' + data.name + '$', 'i');

        const authorCheck = await authorRepo.findOne({
            name: { $in: [name] },
        });

        if (authorCheck) {
            const err: any = new Error('This author already exists');
            err.status = 400;
            throw err;
        }

        const author = await authorRepo.create({
            name: data.name,
            bio: data.bio,
            birthday: data.birthday,
        });

        return {
            message: 'success',
            data: {
                author: author._id,
            },
        };
    }

    async fetchAuthor(data: any) {
        const author = await authorRepo.findOneSelect(
            {
                _id: { $eq: new Types.ObjectId(data.author) },
            },
            {
                _id: 0,
                name: 1,
                birthday: 1,
                bio: 1,
            }
        );

        if (!author) {
            const err: any = new Error('Author not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
            data: {
                author: author,
            },
        };
    }

    async updateAuthor(data: any) {
        if (data.role != 'admin' && data.role != 'librarian') {
            const err: any = new Error(
                'Only admins and librarians can create an author'
            );
            err.status = 403;
            throw err;
        }
        
        const { user, role, author, ...update } = data;
        if (update.name) {
            const name: any = new RegExp('^' + update.name + '$', 'i');

            const authorCheck = await authorRepo.findOne({
                name: { $in: [name] },
            });

            if (authorCheck) {
                const err: any = new Error('This author already exists');
                err.status = 400;
                throw err;
            }
        }
        const authorData = await authorRepo.updateOne(
            {
                _id: { $eq: new Types.ObjectId(author) },
            },
            update
        );

        if (!authorData) {
            const err: any = new Error('Author not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
        };
    }

    async fetchAuthors(data: any) {
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
            sort.name = -1;
        } else {
            sort.name = 1;
        }
        if (data.search) {
            query.name = { $regex: data.search, $options: 'i' };
        }

        console.log(query);
        const result = await authorRepo.fetchAuthors(
            query,
            Math.abs(Number(data.limit) || 10),
            Math.abs(Number(data.page) || 1),
            sort
        );

        return {
            message: 'Success',
            data: {
                ...result,
            },
        };
    }

    async deleteAuthor(data: any) {
        if (data.role != 'admin' && data.role != 'librarian') {
            const err: any = new Error(
                'Only admins and librarians can create an author'
            );
            err.status = 403;
            throw err;
        }

        const authorData = await authorRepo.findOneAndDelete({
            _id: { $eq: new Types.ObjectId(data.author) },
        });

        if (!authorData) {
            const err: any = new Error('Author not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
        };
    }
}

export default new AuthorService();
