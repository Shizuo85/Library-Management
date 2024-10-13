import mongoose from 'mongoose';

const bookRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        book: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        borrowed_at: {
            type: Date,
            required: true,
        },
        due_at: {
            type: Date,
            required: true,
        },
        returned_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

bookRecordSchema.index({ email: 1 });

export default mongoose.model('book_record', bookRecordSchema);
