import { Router } from 'express';

import authMiddleware from "../modules/user/middleware/auth.middleware";

import authorController from '../modules/author/controllers/author.controller';
import authorMiddleware from '../modules/author/middleware/author.middleware';

import generalMiddleware from '../modules/general/middleware/general.middleware';

const authorRouter = Router();

authorRouter.post(
    '/create',
    authMiddleware,
    authorMiddleware.createAuthor,
    authorController.createAuthor
);

authorRouter.get(
    '/fetch/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    authorController.fetchAuthor
);

authorRouter.get(
    '/all',
    authMiddleware,
    generalMiddleware.pagination,
    authorController.fetchAuthors
);

authorRouter.patch(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    authorMiddleware.updateAuthor,
    authorController.updateAuthor
);

authorRouter.delete(
    '/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    authorController.deleteAuthor
);

export default authorRouter;
