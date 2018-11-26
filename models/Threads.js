const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadsSchema = new Schema({
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

const CommentsSchema = new Schema({

    Content: String,
    Upvotes: [],
    Downvotes: []
});

const Threads = mongoose.model('Threads', ThreadsSchema);
const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Threads;