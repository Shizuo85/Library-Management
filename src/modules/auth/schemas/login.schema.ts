import Joi from "joi";

class LoginSchema {
    googleLogin = Joi.object({
        code: Joi.string().required(),
    });

    emailLogin = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

}

export default new LoginSchema();
