const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    Title: {
        type: String,
        required: true,
        unique: true,
    },
    Content: {
        type: String,
        required: true,
    }
});

const CommentSchema = new Schema({

    Content: String,
    Upvotes: [],
    Downvotes: []
});

const threads = mongoose.model('threads', ThreadSchema);
const comments = mongoose.model('comments', CommentSchema);

module.exports = threads;