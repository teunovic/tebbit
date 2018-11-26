const User = require('../models/users');


function create(req,res) {
    const userProps = req.body;
    logger.trace('user = ' + userProps);

    User.create(userProps)
        .then(user => res.status(200).json(user).end())
        .catch(error => next(new ApiError(error)));


    res.status(200).json('NOT IMPLEMENTED YET').end();
}