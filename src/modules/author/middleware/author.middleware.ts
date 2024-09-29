import { Request, Response, NextFunction } from "express";
import sanitizer from "../../../lib/sanitizer";

import authorSchema from "../schemas/author.schema";

class AuthorMiddleware {
    async createAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await authorSchema.createAuthor.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async updateAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            sanitizer(req.body);
            await authorSchema.updateAuthor.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new AuthorMiddleware();
