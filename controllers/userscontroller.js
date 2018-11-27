
const User = require('../models/users');
const neo = require('../neo4j_setup');
const neoQueries = require('../models/neo_queries');

function create(req,res) {
    const userProps = req.body;
    User.create(userProps)
        .then(user => {
            replyUser = user;
            // add user with relevant nodes to neo4j

            // NOTE: we have an atomicity problem here
            session = neo.session();
            neoQueries.createUser(session, user);

            session.close();
            res.send(replyUser);
        })
        .catch(err => {
            // error code 11000 in mongo signals duplicate entry
            if (err.code === 11000) {
                res.status(409);
                res.send('user already exists');
            } else {
                console.log('error in create user: ' + err);
                res.status(400);
                res.send(err);
            }
        });


}




function update(req,res) {
    const name = req.body.username;
    const passwordold = req.body.password;
    const passwordnew = req.body.password_new;

    User.findOneAndUpdate({username: name, password: passwordold}, {password: passwordnew})
        .then(user => {
            res.send(User.findOne({username: name}));
        })
        .catch(err => {
            // error code 11000 in mongo signals duplicate entry
            if (err.code === 11000) {
                res.status(409).send('user does not exist');
            } else {
                console.log('error in updating user');
                res.status(401).send("Password incorrect");
            }
        });


}

function del(req,res) {
    const name = req.body.username;
    const password = req.body.password;

    User.findOneAndDelete({username: name, password: password})

        .then(user => {
            replyUser = user;
            neoQueries.deleteUser(session, user);
            return;
        })
        .then(() => {
            res.send(replyUser);
        })
        .catch(err => {
            // error code 11000 in mongo signals duplicate entry
            if (err.code === 11000) {
                res.status(409);
                res.send('user does not exist');
            } else {
                console.log('error in updating user');
                res.status(401);
                res.send("Password incorrect");
            }
        });


}

module.exports = {
    create: create,
    update: update,
    delete: del
    // get: get
};