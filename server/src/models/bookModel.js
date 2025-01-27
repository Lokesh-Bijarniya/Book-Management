import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    userId: {
        type: Schema.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User'
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    ISBN: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    subcategory: {
        type: String,
        required: [true, 'Subcategory is required'],
        trim: true,
    },
    reviewsCount: {
        type: Number,
        default: 0,
        min: [0, 'Reviews cannot be negative'],
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    releasedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Book', bookSchema);
