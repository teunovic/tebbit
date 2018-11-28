const users = require('../models/users');
const threads = require('../models/threads');
const ErrorResponse = require('../response_models/errorresponse');

function create(req,res) {
    users.User.findOne({username: req.body.username})
        .then(user => {
            if(!user) {
                res.status(409).json(new ErrorResponse(1, "Could not find user").getResponse());
                return;
            }
            console.log(user);
            threads.Thread.create({author: user._id, title: req.body.title, content: req.body.content})
                .then(thread => {
                    res.send(thread);
                })
                .catch(err => {
                    console.log('error while creating thread: ' + err);
                    res.status(501).send(err);
                });
        })
        .catch(err => {
            console.error(err);
        });
}


function edit(req,res) {
    const newcontent = req.body.content;
    const title = req.body.title;
    const threadProps = req.body;

    //TODO: You shouldn't be able to change the title of the thread...

    threads.Thread.findByIdAndUpdate(req.params.id, {content: newcontent})
        .then(() => {
            res.send("Thread successfully updated.");

        })
        .catch(err => {
            // error code 11000 in mongo signals duplicate entry
            if (err.code === 11000) {
                res.status(409);
                res.send('thread already exists');
            } else {
                console.log('error while creating thread: ' + err);
                res.status(400);
                res.send(err);
            }
        });

}

function addComment(req, res) {
    let threadid = req.params.tid;
    let username = req.body.username;
    let parentCommentId = req.body.parent || null;
    let content = req.body.content;

    if(!content || content === "" || content.length < 2) {
        res.status(409).json(new ErrorResponse(0, "Invalid comment content, must be at least 2 characters").getResponse());
        return;
    }

    console.log('param tid = ' + threadid);

    users.User.findOne({username: username})
        .then(user => {
            if(!user) {
                console.log("user not found");
                res.status(409).json(new ErrorResponse(1, "User could not be found").getResponse())
                return;
            }
            threads.Thread.findById(threadid)
                .then(thread => {
                    if(!thread) {
                        console.error("Thread not found");
                        res.status(404).json(new ErrorResponse(1, "Thread not found").getResponse());
                        return;
                    }

                    let comment = new threads.Comment({author: user._id, content: content});
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
                                        res.status(200).json(savedParent);
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
                                threads.Thread.findById(thread._id)
                                    .then(opgehaaldeThread => {
                                        res.json(opgehaaldeThread);
                                    })
                                    .catch(err => {
                                        console.error(err);
                                    });
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

        });


}

module.exports = {
    create: create,
    edit: edit,
    addComment: addComment
};

