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
        },
        google_login: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('user', userSchema);
