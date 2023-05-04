const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    author: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    },
    secretPost: {
        type: Boolean,
        default: false
    }
})


//DOCUMENT MIDDLEWARE: uns before .save() and .create()

postSchema.pre('save', function(next) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase()
    const authorArr = this.author.toLowerCase().split(' ')
    this.author = authorArr.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    next()
})

// QUERY MIDDLEWARE

postSchema.pre(/^find/, function(next){   /// /^find/ for find - findOne
    this.find({ secretPost: { $ne: true }})
    next();
})


// AGGREGATION MIDDLEWARE

postSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretPost: { $ne: true } }})
    next()
})


const Post = mongoose.model('Post', postSchema)

module.exports = Post;