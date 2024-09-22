import Joi from 'joi';

class BookSchema {
    fetchBooks = Joi.object({})

    fetchBook = Joi.object({})

    createBook = Joi.object({})

    updateBook = Joi.object({})

    deleteBook = Joi.object({})

    borrowBook = Joi.object({})

    returnBook = Joi.object({})
}

export default new BookSchema();
