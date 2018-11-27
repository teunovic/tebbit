const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    }
});

//TODO: Hier moet dus een user in zitten

const CommentSchema = new Schema({

    content: String,
    upvotes: [],
    downvotes: []
});

const threads = mongoose.model('threads', ThreadSchema);
const comments = mongoose.model('comments', CommentSchema);

module.exports = threads;