const Thread = require('../models/threads');

function create(req,res) {

    const threadProps = req.body;
    Thread.create(threadProps)
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

    Thread.findByIdAndUpdate(req.params.id,{content: newcontent})
        .then(() => {
            res.send("Thread successfully updated");

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

module.exports = {
    create: create,
    edit: edit
};

