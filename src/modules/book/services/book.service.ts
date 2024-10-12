import { Types } from 'mongoose';
import { uuidv7 } from 'uuidv7';

import authorRepo from '../../author/repository/author.repo';
import bookRepo from '../repository/book.repo';

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

    async updateBook(data: any) {}

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

    async deleteBook(data: any) {}

    async borrowBook(data: any) {}

    async returnBook(data: any) {}
}

export default new BookService();
