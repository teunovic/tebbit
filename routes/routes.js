let express = require('express');

const usersController = require('../controllers/userscontroller');
const threadsController = require('../controllers/threadscontroller');
const friendsController = require('../controllers/friendscontroller');


let router = express.Router();


/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});




module.exports = (router) =>{


    // _____USERS______

    //Create a new user
    router.post('/users', usersController.create);
    //Update a user's password
    router.put('/users', usersController.update);
    //Delete a user
    router.delete('/users', usersController.delete);


    //_____FRIENDS_____

    //Create a friendship between two users
    router.post('/friends', friendsController.addFriend);
    //Delete a friendship between two users
    router.delete('/friends', friendsController.removeFriend);



    //_____THREADS______

    //Create a new thread
    router.post('/threads', threadsController.create);
    //Edit content of thread
    router.put('/threads/:id', threadsController.edit);

    // Commenting
    router.post('/threads/:tid/comments', threadsController.addComment);



};
