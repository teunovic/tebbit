const neo = require('../neo4j_setup');
const neoQueries = require('../models/neo_queries');


function addFriend(req,res) {
    let userName = req.body.userName;
    let otherName = req.body.otherName;
    let session = neo.session();
    neoQueries.addFriend(session, userName, otherName)
        .then(result => {
            session.close();
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.send(err);
        });
}

function removeFriend(req,res) {
    let userName = req.body.userName;
    let otherName = req.body.otherName;
    let session = neo.session();
    neoQueries.removeFriend(session, userName, otherName)
        .then(result => {
            session.close();
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.send(err);
        });
}

module.exports = {
    addFriend: addFriend,
    removeFriend: removeFriend
};