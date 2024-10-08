import { Response, NextFunction } from 'express';

import CustomRequest from '../../../lib/custom.request';

import bookService from '../services/book.service';

class BookController {
    async createBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.createBook({
                ...req.body,
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
                ...req.body,
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
                ...req.body,
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
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async deleteBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.deleteBook({
                ...req.body,
                user: req.user,
                role: req.role,
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
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async returnBook(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await bookService.returnBook({
                ...req.body,
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
