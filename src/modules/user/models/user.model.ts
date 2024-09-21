import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'librarian', 'member'],
        },
        status: {
            type: String,
            required: true,
            enum: ['verified', 'unverified', 'suspended'],
            default: 'unverified',
        },
        google_login: {
            type: Boolean,
            required: true,
            default: false,
        },
        temp_email: {
            type: String,
        },
        email_code: {
            type: String,
        },
        email_code_exp: {
            type: Date,
        },
        verification_code: {
            type: String,
        },
        verification_exp: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetOtp: {
            type: String,
        },
        passwordResetExp: {
            type: Date,
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('user', userSchema);
