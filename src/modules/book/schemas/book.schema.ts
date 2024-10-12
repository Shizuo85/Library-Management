import Joi from 'joi';

class BookSchema {
    createBook = Joi.object({
        title: Joi.string().required()
    })

    updateBook = Joi.object({})

    deleteBook = Joi.object({})

    borrowBook = Joi.object({})

    returnBook = Joi.object({})
}

export default new BookSchema();
