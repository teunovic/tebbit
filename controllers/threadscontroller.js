const Thread = require('../models/threads');

function create(req,res) {


    const threadProps = req.body;
    Thread.create(threadProps)
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
    create: create
};

