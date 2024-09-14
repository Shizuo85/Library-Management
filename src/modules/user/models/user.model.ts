import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('user', userSchema);
