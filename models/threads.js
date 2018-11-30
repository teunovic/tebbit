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
    author: {type: Schema.ObjectId, ref: 'User', required: true},
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [{type: Schema.ObjectId, ref: 'Comment'}],
    votes: [voteSchema]
});
threadSchema.set('toObject', {virtuals: true});

let autoPopulateChildren = function(next) {
    this.populate('comments');
    next();
};

commentSchema // Zorg dat subcomments automatisch worden opgehaald
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren);

let calculateVotes = function(up) {
    return function() {
        let amount = 0;
        for(i = 0; i < this.votes.length; i++) {
            if(this.votes[i].isUpvote === up)
                amount++;
        }
        return amount;
    }
};

threadSchema.virtual('upvotes').get(calculateVotes(true));
threadSchema.virtual('downvotes').get(calculateVotes(false));

commentSchema.virtual('upvotes').get(calculateVotes(true));
commentSchema.virtual('downvotes').get(calculateVotes(false));

threadSchema.virtual('points').get(function() {
    return this.upvotes - this.downvotes;
});
commentSchema.virtual('points').get(function() {
    return this.upvotes - this.downvotes;
});

const Vote = mongoose.model('Vote', voteSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Thread = mongoose.model('Thread', threadSchema);



module.exports = {Thread, Comment, Vote};