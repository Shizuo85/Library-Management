import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        birthday: {
            type: Date,
        },
    },
    { timestamps: true }
);

authorSchema.index({ email: 1 });

export default mongoose.model('author', authorSchema);
