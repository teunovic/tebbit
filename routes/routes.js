let express = require('express');

const usersController = require('../controllers/userscontroller');
const threadsController = require('../controllers/threadscontroller');
const friendsController = require('../controllers/friendscontroller');
const commentsController = require('../controllers/commentscontroller');

module.exports = (router) => {

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
    router.get('/threads/:id', threadsController.get);
    router.get('/threads', threadsController.getAll);
    router.put('/threads/:id', threadsController.edit);
    router.delete('/threads/:id', threadsController.remove);
    router.post('/threads/:id/vote', threadsController.vote);

    // Commenting
    router.post('/threads/:tid/comments', commentsController.add);
    router.delete('/threads/:tid/comments/:id', commentsController.remove);
    router.post('/threads/:tid/comments/:id/vote', commentsController.vote);


};
