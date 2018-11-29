const mongoose = require('mongoose');
const users = require('../models/users');
const threads = require('../models/threads');
const ErrorResponse = require('../response_models/errorresponse');

function get(req, res) {
    let threadId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id").getResponse());
        return;
    }

    threads.Thread.findById(threadId)
        .populate("comments")
        .then(thread => {
            if(!thread) {
                res.status(404).json(new ErrorResponse(1, "Could not find thread").getResponse());
                return;
            }
            // .toObject({virtuals: true}) om de berekende up/downvotes erbij te doen
            res.status(200).json(thread.toObject());
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
        });
}

function getAll(req, res) {
    /*
    1. zonder enige beloofde sortering
    2. aflopend gesorteerd op basis van het aantal upvotes van de thread
    3. aflopend gesorteerd op basis van het verschil tussen het aantal upvotes en het
            aantal downvotes van de thread
    4. aflopend gesorteerd op basis van het totaal aantal comments in de thread
     */
    let sort = req.query.sort || 1;
    threads.Thread.find({})
        .sort({'upvotes': 1})
        .then(result => {
            let response = [];
            result.forEach(r => {
                // Zorg dat de virtuals (up/downvotes) erbij worden verstuurd
                response.push(r.toObject());
            });
            res.status(200).json(response);
        })
}

function create(req,res) {
    users.User.findOne({username: req.body.username, nonActive: false})
        .then(user => {
            if(!user) {
                res.status(409).json(new ErrorResponse(1, "Could not find user").getResponse());
                return;
            }
            threads.Thread.create({author: user._id, title: req.body.title, content: req.body.content})
                .then(thread => {
                    res.status(200).json(thread.toObject({virtuals: true}));
                })
                .catch(err => {
                    console.log('error while creating thread: ' + err);
                    res.status(501).json(new ErrorResponse(-1, "Something went wrong creating thread, are title and content provided?").getResponse());
                });
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected went wrong").getResponse());
        });
}

function edit(req,res) {
    let threadId = req.params.id;
    let newContent = req.body.content;

    if(!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id").getResponse());
        return;
    }

    if(!newContent || newContent.length === 0) {
        res.status(409).json(new ErrorResponse(1, "Content can not be empty").getResponse());
        return;
    }

    let options = {new: true};
    threads.Thread.findByIdAndUpdate(threadId, {content: newContent}, options)
        .then(thread => {
            if(!thread) {
                res.status(404).send(new ErrorResponse(1, "Could not find thread").getResponse());
                return;
            }
            res.status(200).send(thread);
        })
        .catch(err => {
            console.error(err);
            res.status(501).send(new ErrorResponse(-1, "Something unexpected happened when updating your thread").getResponse());
        });
}

function remove(req, res) {
    let threadId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id").getResponse());
        return;
    }

    threads.Thread.findById(threadId)
        .then(thread => {
            if(!thread) {
                res.status(404).json(new ErrorResponse(1, "Could not find thread").getResponse());
                return;
            }
            threads.Comment.deleteMany({thread: thread._id})
                .then(() => {
                    thread.remove(() => {
                        res.status(200).json({});
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(501).json(new ErrorResponse(-1, "Something unexpected happened while removing all the thread's comments").getResponse());
                })
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected happened while retrieving the thread").getResponse());
        })

}

function vote(req, res) {
    let threadId = req.params.id;
    let username = req.body.username;
    let upvote = req.body.vote !== "down";

    if(!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(422).json(new ErrorResponse(1, "Invalid thread id").getResponse());
        return;
    }

    threads.Thread.findById(threadId)
        .then(thread => {
            if(!thread) {
                res.status(404).json(new ErrorResponse(1, "Could not find thread").getResponse());
                return;
            }
            users.User.findOne({username: username})
                .then(user => {
                    if(!user) {
                        res.status(404).json(new ErrorResponse(1, "Could not find user").getResponse());
                        return;
                    }
                    // Remove existing votes by this user
                    for(i = thread.votes.length - 1; i >= 0; i--) {
                        let v = thread.votes[i];
                        if(v.voter.equals(user._id))
                            thread.votes.splice(i, 1);
                    }
                    let vote = new threads.Vote({voter: user._id, isUpvote: upvote});
                    thread.votes.push(vote);
                    thread.save()
                        .then(updatedThread => {
                            res.status(200).json(updatedThread);
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
    get,
    getAll,
    create,
    edit,
    remove,
    vote
};

