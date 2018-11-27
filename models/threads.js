const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    voter : { type: Schema.ObjectId, ref: 'User' },
    isUpvote: Boolean
});

const commentSchema = new Schema({
    author : { type: Schema.ObjectId, ref: 'User' },
    content: String,
    votes: [voteSchema]
});

const threadSchema = new Schema({
    author : { type: Schema.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [commentSchema],
    votes: [voteSchema]
});

threadSchema.virtual('downvotes').get(() => {
    return this.votes.filter(v => {
        return !v.isUpvote;
    })
});

threadSchema.virtual('upvotes').get(() => {
    return this.votes.filter(v => {
        return v.isUpvote;
    })
});

threadSchema.virtual('points').get(function(){
    return this.upvotes.length - this.downvotes.length;
});

const Vote = mongoose.model('Vote', voteSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Thread = mongoose.model('Thread', threadSchema);

function findComment(comments, commentId) {
    if(comments.length === 0) {
        return null;
    }
    for(let i = 0; i < comments.length; i++) {
        let c = comments[i];
        if(c._id === commentId) {
            return c;
        }
        if(c.comments.length !== 0) {
            let sc = findComment(c.comments, commentId);
            if(sc)
                return sc;
        }
    }
    return null;
}

module.exports = {Thread, Comment, Vote, findComment: findComment};