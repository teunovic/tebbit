let express = require('express');

const UsersController = require('../controllers/userscontroller');
const ThreadsController = require('../controllers/threadscontroller');
const FriendsController = require('../controllers/friendscontroller');


let router = express.Router();


/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});




module.exports = (router) =>{


    // _____USERS______

    //Create a new user
    router.post('/users', UsersController.create);
    //Update a user's password
    router.put('/users', UsersController.update);


    //_____FRIENDS______

    //Create a friendship between two users
    router.post('/friends', FriendsController.addFriend);
    //Delete a friendship between two users
    router.delete('/friends', FriendsController.removeFriend);



    //_____THREADS______

    //Create a new thread
    router.post('/threads', ThreadsController.create);

};
