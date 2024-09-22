import Joi from 'joi';

class VerificationSchema {
    verifyCode = Joi.object({
        code: Joi.string().required(),
    });

    resendCode = Joi.object({
        email: Joi.string().email().required(),
    });
}

export default new VerificationSchema();
