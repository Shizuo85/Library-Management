import Joi from 'joi';

class AuthorSchema {
    createAuthor = Joi.object({})

    updateAuthor = Joi.object({})

    fetchAuthor = Joi.object({})

    fetchAuthors = Joi.object({})    

    deleteAuthor = Joi.object({})
}

export default new AuthorSchema();
