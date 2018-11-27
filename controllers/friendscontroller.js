const neo = require('../neo4j_setup');
const neoQueries = require('../models/neo_queries');
const User = require('../models/users');
const ErrorResponse = require('../response_models/errorresponse');

function addFriend(req,res) {
    let userName = req.body.userName;
    let otherName = req.body.otherName;
    let session = neo.session();

    if(!userName || !otherName) {
        res.status(409).json(new ErrorResponse(1, "One of the usernames is empty").getResponse());
        return;
    }

    if(userName.toLowerCase() == otherName.toLowerCase()) {
        res.status(409).json(new ErrorResponse(1, "Can't be friends with yourself").getResponse());
        return;
    }

    User.find({$or: [{username: userName}, {username: otherName}]})
        .then(result => {
           if(result.length !== 2) {
               console.log("Both users need to exist");
               res.status(409).json(new ErrorResponse(2, "Both users need to exist").getResponse());
               return;
           }

           neoQueries.addFriend(session, userName, otherName)
               .then(result => {
                   session.close();
                   res.status(200).json(result);
               })
               .catch(err => {
                   console.log(err);
                   res.status(400);
                   res.send(err);
               });
        })
        .catch(reason => {
            console.log("Users were not found");
            res.status(404).json(new ErrorResponse(2, "Both users need to exist").getResponse());
            return;
        }
    );


}

function removeFriend(req,res) {
    let userName = req.body.userName;
    let otherName = req.body.otherName;
    let session = neo.session();
    neoQueries.removeFriend(session, userName, otherName)
        .then(result => {
            res.send(result);
            session.close();
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.send(err);
            session.close();
        });
}

module.exports = {
    addFriend: addFriend,
    removeFriend: removeFriend
};