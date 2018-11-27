const threads = require('../models/threads');
const ErrorResponse = require('../response_models/errorresponse');

function create(req,res) {

    const threadProps = req.body;
    threads.Thread.create(threadProps)
        .then(() => {
            res.send(threadProps);
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


function edit(req,res) {
    const newcontent = req.body.content;
    const title = req.body.title;
    const threadProps = req.body;

    //TODO: You shouldn't be able to change the title of the thread...

    threads.Thread.findByIdAndUpdate(req.params.id,{content: newcontent})
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
    let parentComment = req.body.parentComment || null;
    let content = req.body.content;

    threads.Thread.findById(threadid)
        .then(thread => {
            console.log('thread found');
            console.log(thread);
            let parent = null;
            if(parentComment) {
                parent = thread.findComment(thread.comments, parentComment);
                if(!parent) {
                    res.status(409).json(new ErrorResponse(1, "Parent is unfound"));
                    return;
                }
                console.log(parent);
            }
        })
        .catch(error => {
            res.status(404).json(new ErrorResponse(1, "Could not find thread"));
        });
}

module.exports = {
    create: create,
    edit: edit,
    addComment: addComment
};

