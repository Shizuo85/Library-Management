import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: "author",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['available', 'borrowed'],
        },
    },
    { timestamps: true }
);

bookSchema.index({ email: 1 });

export default mongoose.model('book', bookSchema);
