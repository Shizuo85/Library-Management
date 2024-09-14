import Joi from "joi";
import mongoose from "mongoose";

class GeneralSchema {
    paramsId = Joi.object({
        id: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.error('any.invalid');
            }
            return value;
        }, 'ID Validation').required()
    });

    pagination = Joi.object({
        limit: Joi.number(),
        page: Joi.number()
    });
}

export default new GeneralSchema();