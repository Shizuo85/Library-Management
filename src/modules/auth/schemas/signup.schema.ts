import Joi from 'joi';
// import mongoose from "mongoose";
import validator from 'validator';

class SignupSchema {
    googleSignup = Joi.object({
        code: Joi.string().required(),
        role: Joi.string().valid("librarian", "member").required()
    });

    emailSignup = Joi.object({
        email: Joi.string().email().required(),
        role: Joi.string().valid("librarian", "member").required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string()
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

export default new SignupSchema();
