import Joi from 'joi';
import mongoose from 'mongoose';

class GeneralSchema {
    paramsId = Joi.object({
        id: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'ID Validation')
            .required(),
    });

    pagination = Joi.object({
        status: Joi.string().valid('available', 'borrowed'),
        limit: Joi.number(),
        page: Joi.number(),
        sort: Joi.string().valid('asc', 'desc'),
        start: Joi.date().default(new Date(0)).iso().less('now'),
        end: Joi.date().iso().greater(Joi.ref('start')).messages({
            'date.greater': 'End date must be greater than Start date',
        }),
        search: Joi.string(),
    });
}

export default new GeneralSchema();
