import Joi from "joi";
// import mongoose from "mongoose";
// import validator from "validator";
// import moment from "moment";

class UserSchema {
    updateUser = Joi.object({})

    fetchUser = Joi.object({})

    fetchUsers = Joi.object({})    

    deleteUser = Joi.object({})
}

export default new UserSchema();
