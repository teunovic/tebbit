let express = require('express');

const UsersController = require('../controllers/userscontroller');

let router = express.Router();


/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});




module.exports = (router) =>{
    // router.post('/users', UsersController.create)
    // router.post('/thread', ThreadsController.create)
};
