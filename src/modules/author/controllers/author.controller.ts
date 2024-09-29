import { Response, NextFunction } from "express";

import CustomRequest from "../../../lib/custom.request";

import authorService from "../services/author.service";


class AuthorController {
    async createAuthor(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await authorService.createAuthor({
                ...req.body,
                user: req.user,
                role: req.role
            });
            return res.status(201).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchAuthor(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await authorService.fetchAuthor({
                user: req.user,
                role: req.role,
                author: req.params.id
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchAuthors(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await authorService.fetchAuthors({
                ...req.query,
                user: req.user,
                role: req.role
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
    
    async updateAuthor(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await authorService.updateAuthor({
                ...req.body,
                user: req.user,
                role: req.role,
                author: req.params.id
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
    async deleteAuthor(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await authorService.deleteAuthor({
                user: req.user,
                role: req.role,
                author: req.params.id
            });
            return res.status(204).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new AuthorController();
