import Joi from 'joi';
import mongoose from 'mongoose';

class BookSchema {
    createBook = Joi.object({
        title: Joi.string().required(),
    });

    updateBook = Joi.object({
        title: Joi.string(),
        author: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ID Validation'),
    }).or('title', 'author');

    borrowBook = Joi.object({
        due_date: Joi.date().iso().greater('now').required(),
    });
}

export default new BookSchema();
