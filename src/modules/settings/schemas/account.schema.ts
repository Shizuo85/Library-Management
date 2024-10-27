import Joi from "joi";
import validator from "validator";

class AccountSchema {
    changePassword = Joi.object({
        oldPassword: Joi.string().required(),
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
                    return helpers.error("any.invalid");
                }
                return value;
            }, "Password Validation"),
            confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('newPassword'))
            .messages({ 'any.only': 'Passwords do not match' }),
    });

    changeEmail = Joi.object({
        email: Joi.string().email().required(),
    });

    changeEmailCode = Joi.object({
        otp: Joi.string().required(),
    });

    updateLoginWithGoogle = Joi.object({
        google_login: Joi.boolean().required(),
    });

    updateProfile = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
    }).or('first_name', 'last_name')
}

export default new AccountSchema();
