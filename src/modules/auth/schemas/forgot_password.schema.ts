import Joi from 'joi';
import validator from 'validator';

class newPasswordSchema {
    forgotPassword = Joi.object({
        email: Joi.string().email().required(),
    });

    forgotPasswordVerify = Joi.object({
        otp: Joi.string().required(),
        token: Joi.string().required(),
    });

    resetPassword = Joi.object({
        newPassword: Joi.string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if (
                    !validator.isStrongPassword(value, {
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    })
                ) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Password Validation'),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({ 'any.only': 'Passwords do not match' }),
    });
}

export default new newPasswordSchema();
