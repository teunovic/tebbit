const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    voter : { type: Schema.ObjectId, ref: 'User' },
    isUpvote: Boolean
});

const commentSchema = new Schema({
    thread: { type: Schema.ObjectId, ref: 'Thread' },
    author : { type: Schema.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
    votes: [voteSchema]
});

const threadSchema = new Schema({
    author : { type: Schema.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
    votes: [voteSchema]
});

let autoPopulateChildren = function(next) {
    this.populate('comments');
    next();
};

commentSchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren)

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

module.exports = {Thread, Comment, Vote};