let express = require('express');

const UsersController = require('../controllers/userscontroller');
const ThreadsController = require('../controllers/threadscontroller');


let router = express.Router();


/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});




module.exports = (router) =>{

    //Create a new user
    router.post('/users', UsersController.create);

    router.get('/users', UsersController.get);

    //Create a new thread
    router.post('/threads', ThreadsController.create);

};
