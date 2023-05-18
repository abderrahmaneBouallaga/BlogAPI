const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Comment can not be empty!']
        },
        react: {
            type: Number,
            min: 0,
            max: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            required: [true, 'Comment must belong to a post']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Comment must belong to a user.']
        }
    },
    {
        toJSON: { virtulas: true },
        toObject: { virtuals: true }
    }
)

