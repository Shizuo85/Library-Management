import { Types } from 'mongoose';
import { uuidv7 } from 'uuidv7';

import authorRepo from '../../author/repository/author.repo';
import bookRepo from '../repository/book.repo';
import recordRepo from '../repository/book_record.repo';

class BookService {
    async createBook(data: any) {
        if (data.role != 'admin' && data.role != 'librarian') {
            const err: any = new Error(
                'Only admins and librarians can manage books'
            );
            err.status = 403;
            throw err;
        }

        const author = await authorRepo.findOne({
            _id: { $eq: new Types.ObjectId(data.author) },
        });

        if (!author) {
            const err: any = new Error('Author not found');
            err.status = 404;
            throw err;
        }

        const title: any = new RegExp('^' + data.title + '$', 'i');

        const book = await bookRepo.findOne({
            title: { $in: [title] },
            author: { $eq: new Types.ObjectId(data.author) },
        });

        if (book) {
            const err: any = new Error('This book already exists');
            err.status = 400;
            throw err;
        }

        const new_book: any = await bookRepo.create({
            isbn: uuidv7(),
            title: data.title,
            author: data.author,
        });

        return {
            message: 'Book added successfully',
            data: {
                book: new_book._id,
            },
        };
    }

    async fetchBook(data: any) {
        const book = await bookRepo.findOneSelect(
            {
                _id: { $eq: new Types.ObjectId(data.book) },
            },
            {
                _id: 0,
                title: 1,
                status: 1,
                isbn: 1,
                author: 1,
            }
        );

        if (!book) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
            data: {
                book,
            },
        };
    }

    async updateBook(data: any) {
        const { role, user, book, ...update } = data;
        const bookData: any = await bookRepo.findOne({
            _id: { $eq: data.book },
        });

        if (!bookData) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        if (data.author) {
            let title = data.title ? data.title : bookData.title;

            title = new RegExp('^' + title + '$', 'i');

            const check = await bookRepo.findOne({
                title: { $in: [title] },
                author: { $eq: new Types.ObjectId(data.author) },
            });

            if (check) {
                const err: any = new Error('This book already exists');
                err.status = 400;
                throw err;
            }
        }

        if (data.title) {
            let title = new RegExp('^' + data.title + '$', 'i');

            const check = await bookRepo.findOne({
                title: { $in: [title] },
                author: { $eq: new Types.ObjectId(bookData.author) },
            });

            if (check) {
                const err: any = new Error('This book already exists');
                err.status = 400;
                throw err;
            }
        }

        await bookRepo.updateOne(
            {
                _id: { $eq: data.book },
            },
            update
        );

        return {
            message: 'success',
        };
    }

    async fetchBooks(data: any) {
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
            sort.title = -1;
        } else {
            sort.title = 1;
        }
        if (data.status) {
            query.status = { $eq: data.status };
        }

        const search: any = data.search
            ? {
                  $or: [
                      {
                          $expr: {
                              $regexMatch: {
                                  input: '$author',
                                  regex: data.search,
                                  options: 'i',
                              },
                          },
                      },
                      {
                          $expr: {
                              $regexMatch: {
                                  input: '$isbn',
                                  regex: data.search,
                                  options: 'i',
                              },
                          },
                      },
                      {
                          $expr: {
                              $regexMatch: {
                                  input: '$title',
                                  regex: data.search,
                                  options: 'i',
                              },
                          },
                      },
                  ],
              }
            : {};

        const result = await bookRepo.fetchBooks(
            query,
            Math.abs(Number(data.limit) || 10),
            Math.abs(Number(data.page) || 1),
            sort,
            search
        );

        return {
            message: 'Success',
            data: {
                ...result,
            },
        };
    }

    async deleteBook(data: any) {
        if (data.role != 'admin') {
            const err: any = new Error('Only admins can delete a book');
            err.status = 403;
            throw err;
        }

        const bookData = await bookRepo.findOneAndDelete({
            _id: { $eq: new Types.ObjectId(data.book) },
        });

        if (!bookData) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
        };
    }

    async borrowBook(data: any) {
        if (data.role != 'member') {
            const err: any = new Error('Only members can borrow a book');
            err.status = 403;
            throw err;
        }

        const bookData = await bookRepo.updateOne(
            {
                _id: { $eq: new Types.ObjectId(data.book) },
            },
            { status: 'borrowed' }
        );

        if (!bookData) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        if (bookData.status == 'borrowed') {
            const err: any = new Error('This book is not available');
            err.status = 404;
            throw err;
        }

        await recordRepo.create({
            user: data.user,
            book: data.book,
            borrowed_at: new Date(),
            due_at: data.due_date,
        });

        return {
            message: 'success',
        };
    }

    async returnBook(data: any) {
        if (data.role != 'member') {
            const err: any = new Error('Only members can borrow a book');
            err.status = 403;
            throw err;
        }

        const bookRecord = await recordRepo.updateOne(
            {
                user: { $eq: new Types.ObjectId(data.user) },
                book: { $eq: new Types.ObjectId(data.book) },
                returned_at: {$eq: undefined}
            },
            {
                returned_at: new Date(),
            }
        );

        if (!bookRecord) {
            const err: any = new Error(
                'No record of you borrowing this book found'
            );
            err.status = 404;
            throw err;
        }

        await bookRepo.updateOne(
            {
                _id: { $eq: new Types.ObjectId(data.book) },
            },
            {
                status: "available",
            }
        )

        return {
            message: 'success',
        };
    }
}

export default new BookService();
