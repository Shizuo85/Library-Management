import { Response, NextFunction } from 'express';

import CustomRequest from '../../../lib/custom.request';

import bookService from '../services/book.service';

class BookController {
    async createBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.createBook({
                ...req.body,
                author: req.params.id,
                user: req.user,
                role: req.role,
            });
            return res.status(201).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.fetchBook({
                book: req.params.id,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchBooks(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.fetchBooks({
                ...req.query,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async updateBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.updateBook({
                ...req.body,
                user: req.user,
                role: req.role,
                book: req.params.id,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async deleteBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.deleteBook({
                user: req.user,
                role: req.role,
                book: req.params.id
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async borrowBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.borrowBook({
                ...req.body,
                user: req.user,
                role: req.role,
                book: req.params.id
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async returnBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.returnBook({
                book: req.params.id,
                user: req.user,
                role: req.role,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new BookController();
