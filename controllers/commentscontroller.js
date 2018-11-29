const mongoose = require('mongoose');
const threads = require('../models/threads');
const users = require('../models/users');
const ErrorResponse = require('../response_models/errorresponse');

function add(req, res) {
    let threadId = req.params.tid;
    let username = req.body.username;
    let parentCommentId = req.body.parent || null;
    let content = req.body.content;

    if(!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id").getResponse());
        return;
    }

    if(!content || content === "" || content.length < 2) {
        res.status(409).json(new ErrorResponse(0, "Invalid comment content, must be at least 2 characters").getResponse());
        return;
    }

    console.log('param tid = ' + threadId);

    users.User.findOne({username: username, nonActive: false})
        .then(user => {
            if(!user) {
                console.log("user not found");
                res.status(409).json(new ErrorResponse(1, "User could not be found").getResponse())
                return;
            }
            threads.Thread.findById(threadId)
                .then(thread => {
                    if(!thread) {
                        console.error("Thread not found");
                        res.status(404).json(new ErrorResponse(1, "Thread not found").getResponse());
                        return;
                    }

                    let comment = new threads.Comment({thread: thread._id, author: user._id, content: content});
                    if(parentCommentId) {
                        threads.Comment.findById(parentCommentId)
                            .then(parent => {
                                if(!parent) {
                                    res.status(409).json(new ErrorResponse(2, "Parent is unfound").getResponse());
                                    return;
                                }
                                parent.comments.push(comment._id);
                                comment.save((err, savedComment) => {
                                    parent.save((err, savedParent) => {
                                        if(err) {
                                            console.error(err);
                                            return;
                                        }
                                        res.status(200).json(savedComment);
                                    });
                                });
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    } else {
                        thread.comments.push(comment._id);
                        comment.save((err, savedComment) => {
                            thread.save((error, updatedThread) => {
                                res.status(200).json(savedComment);
                            });
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(404).json(new ErrorResponse(1, "Error finding thread").getResponse());
                });
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
        });
}

function remove(req, res) {
    let threadId = req.params.tid;
    let commentId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(threadId) || !mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id or comment id").getResponse());
        return;
    }

    threads.Thread.findById(threadId)
        .then(thread => {
            if(!thread) {
                res.status(404).json(new ErrorResponse(1, "Could not find thread").getResponse());
                return;
            }
            threads.Comment.findById(commentId)
                .then(comment => {
                    if(!comment) {
                        res.status(404).json(new ErrorResponse(2, "Could not find comment").getResponse());
                        return;
                    }
                    comment.remove(() => {
                        res.status(200).json({});
                    })
                })
                .catch(err => {
                    console.error(err);
                    res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
                })
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
        })

}

function vote(req, res) {
    let threadId = req.params.tid;
    let commentId = req.params.id;
    let username = req.body.username;
    let upvote = req.body.vote !== "down";

    if(!mongoose.Types.ObjectId.isValid(threadId) || !mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id or comment id").getResponse());
        return;
    }

    threads.Comment.findById(commentId)
        .then(comment => {
            if(!comment) {
                res.status(404).json(new ErrorResponse(1, "Could not find comment").getResponse());
                return;
            }
            if(!comment.thread.equals(threadId)) {
                res.status(422).json(new ErrorResponse(1, "Comment does not belong to this thread").getResponse());
                return;
            }
            users.User.findOne({username: username, nonActive: false})
                .then(user => {
                    if(!user) {
                        res.status(404).json(new ErrorResponse(1, "Could not find user").getResponse());
                        return;
                    }
                    // Remove existing votes by this user
                    for(i = comment.votes.length - 1; i >= 0; i--) {
                        let v = comment.votes[i];
                        if(v.voter.equals(user._id))
                            comment.votes.splice(i, 1);
                    }
                    let vote = new threads.Vote({voter: user._id, isUpvote: upvote});
                    comment.votes.push(vote);
                    comment.save()
                        .then(updatedComment => {
                            res.status(200).json(updatedComment);
                        })
                })
                .catch(err => {
                    console.error(err);
                    res.status(501).json(new ErrorResponse(-2, "Something unexpected went wrong").getResponse());
                })
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
        })
}

module.exports = {
    add,
    remove,
    vote
};