import Joi from 'joi';

class SignupSchema {
    verifyCode = Joi.object({
        code: Joi.string().required(),
    });

    resendCode = Joi.object({
        email: Joi.string().email().required(),
    });
}

export default new SignupSchema();
