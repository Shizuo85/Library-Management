import Joi from 'joi';

class AuthorSchema {
    createAuthor = Joi.object({
        name: Joi.string().required(),
        bio: Joi.string(),
        birthday: Joi.date().iso().less('now'),
    });

    updateAuthor = Joi.object({
        name: Joi.string(),
        bio: Joi.string(),
        birthday: Joi.date().iso().less('now'),
    }).or('name', 'bio', 'birthday');
}

export default new AuthorSchema();
