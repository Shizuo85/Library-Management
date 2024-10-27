import Joi from "joi";

class UserSchema {
    updateUser = Joi.object({
        role: Joi.string().valid("librarian", "member", 'admin'),
        first_name: Joi.string(),
        last_name: Joi.string(),
    }).or('role', 'first_name', 'last_name')
}

export default new UserSchema();
