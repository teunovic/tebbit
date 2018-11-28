const users = require('../models/users');
const neo = require('../neo4j_setup');
const neoQueries = require('../models/neo_queries');
const ErrorResponse = require('../response_models/errorresponse');

function create(req,res) {
    const userProps = req.body;
    users.User.create(userProps)
        .then(user => {
            let session = neo.session();
            neoQueries.createUser(session, user);
            session.close();
            res.status(200).json(user);
        })
        .catch(err => {
            if (err.code === 11000) {
                res.status(409).json(new ErrorResponse(1, "Username taken").getResponse());
            } else {
                console.error(err);
                res.status(400).json(new ErrorResponse(2, "Could not create user").getResponse());
            }
        });
}




function update(req,res) {
    const name = req.body.username;
    const passwordold = req.body.password;
    const passwordnew = req.body.password_new;

    if(passwordold === passwordnew) {
        res.status(409).json(new ErrorResponse(1, "New password must be different than current password"));
        return;
    }

    let options = {new: true}; // De user => is nu de geupdatete, anders bleef het de oude
    users.User.findOneAndUpdate({username: name, password: passwordold}, {password: passwordnew}, options)
        .then(user => {
            if(!user) {
                res.status(404).json(new ErrorResponse(1, "Username or old password incorrect").getResponse());
                return;
            }
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Something went wrong updating your password");
        });
}

function del(req,res) {
    const name = req.body.username;
    const password = req.body.password;

    users.User.findOneAndDelete({username: name, password: password})
        .then(user => {
            if(!user) {
                res.status(401).json(new ErrorResponse(1, "Username or password incorrect"));
                return;
            }
            neoQueries.deleteUser(session, user);
            res.status(200).json({});
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Something went wrong deleting your account");
        });


}

module.exports = {
    create: create,
    update: update,
    delete: del
    // get: get
};