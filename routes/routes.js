let express = require('express');

const usersController = require('../controllers/userscontroller');
const threadsController = require('../controllers/threadscontroller');
const friendsController = require('../controllers/friendscontroller');
const commentsController = require('../controllers/commentscontroller');

module.exports = (router) => {

    // _____USERS______

    router.post('/users', usersController.create);
    router.put('/users', usersController.update);
    router.delete('/users', usersController.delete);


    //_____FRIENDS_____

    router.post('/friends', friendsController.addFriend);
    router.delete('/friends', friendsController.removeFriend);

    //_____THREADS______

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
