import { Types } from 'mongoose';

import authorRepo from '../../author/repository/author.repo';
import bookRepo from '../repository/book.repo';


class BookService {
    async createBook(data: any) {
        const author = await authorRepo.findOne({
            _id: {$eq: new Types.ObjectId(data.author)}
        })

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
    }

    async fetchBook(data: any) {}

    async updateBook(data: any) {}

    async fetchBooks(data: any) {}

    async deleteBook(data: any) {}

    async borrowBook(data: any) {}

    async returnBook(data: any) {}
}

export default new BookService();
