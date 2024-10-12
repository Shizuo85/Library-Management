import { Router } from 'express';

import authMiddleware from "../modules/user/middleware/auth.middleware";

import bookController from '../modules/book/controllers/book.controller';
import bookMiddleware from '../modules/book/middleware/book.middleware';

import generalMiddleware from '../modules/general/middleware/general.middleware';

const bookRouter = Router();

bookRouter.post(
    '/create/:id',
    authMiddleware,
    bookMiddleware.createBook,
    bookController.createBook
);

bookRouter.get(
    '/fetch/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    bookController.fetchBook
);

bookRouter.get(
    '/all',
    authMiddleware,
    generalMiddleware.pagination,
    bookController.fetchBooks
);

bookRouter.patch(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    bookMiddleware.updateBook,
    bookController.updateBook
);

bookRouter.delete(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    bookController.deleteBook
);

export default bookRouter;
