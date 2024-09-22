import { Request, Response, NextFunction } from "express";
import sanitizer from "../../../lib/sanitizer";

import bookSchema from "../schemas/book.schema";

class BookMiddleware {
    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.createBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async fetchBooks(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.fetchBooks.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async fetchBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.fetchBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.updateBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.deleteBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async borrowBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.borrowBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async returnBook(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await bookSchema.returnBook.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new BookMiddleware();
