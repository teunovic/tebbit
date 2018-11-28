const neo = require('../neo4j_setup');
const neoQueries = require('../models/neo_queries');
const users = require('../models/users');
const ErrorResponse = require('../response_models/errorresponse');

function addFriend(req, res) {
    let username = req.body.username;
    let otherName = req.body.other_username;
    let session = neo.session();

    if (!username || !otherName) {
        res.status(409).json(new ErrorResponse(1, "One of the usernames is empty").getResponse());
        return;
    }

    if (username.toLowerCase() === otherName.toLowerCase()) {
        res.status(409).json(new ErrorResponse(1, "Can't be friends with yourself").getResponse());
        return;
    }

    users.User.find({$or: [{username: username}, {username: otherName}]})
        .then(result => {
            if (result.length !== 2) {
                console.log("Both users need to exist");
                res.status(409).json(new ErrorResponse(2, "Both users need to exist").getResponse());
                return;
            }

            neoQueries.getFriendship(session, username, otherName)
                .then(friendship => {
                    if(friendship) {
                        // Friendship bestaat al, maar vraag 2a vraagt specifiek om GEEN error in dit scenario
                        console.log("friendship already exists");
                        res.status(200).json({});
                        return;
                    }
                    neoQueries.addFriend(session, username, otherName)
                        .then(() => {
                            session.close();
                            res.status(200).json({});
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(501).json(new ErrorResponse(-1, "Something unexpected happened when creating the friendship").getResponse());
                        });
                })
                .catch(err => {
                    console.error(err);
                    // Something went wrong with checking if the friendship already exists, but the end-user does not need to know that
                    res.status(501).json(new ErrorResponse(-2, "Something unexpected happened when creating the friendship").getResponse());
                });
        })
        .catch(err => {
            console.error(err);
            res.status(404).json(new ErrorResponse(2, "Both users need to exist").getResponse());
        });
}

function removeFriend(req, res) {
    let username = req.body.username;
    let otherName = req.body.other_username;
    let session = neo.session();
    neoQueries.removeFriend(session, username, otherName)
        .then(() => {
            res.status(200).json({});
            session.close();
        })
        .catch(err => {
            console.error(err);
            res.status(501).json(new ErrorResponse(-1, "Something unexpected happened while removing friendship").getResponse());
            session.close();
        });
}

module.exports = {
    addFriend,
    removeFriend
};