
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
            return neoQueries.createUser(session, user);
        })
        .then(() => {
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
    const userprops = req.body;



    User.findOneAndUpdate({username: name, password: passwordold}, {password: passwordnew})

        .then(user => {
            replyUser = user;
            // add user with relevant nodes to neo4j

            // NOTE: we have an atomicity problem here
            session = neo.session();
            return neoQueries.updateUser(session, user);
        })
        .then(() => {
            session.close();
            res.send(User.findOne({username: name}));
        })

        //TODO: Doesnt update in neo4j^

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
    update: update
    // get: get
};