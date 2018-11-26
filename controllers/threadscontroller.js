function create(req,res) {
    const threadProps = req.body;
    logger.trace('user = ' + threadProps);

    User.create(threadProps)
        .then(thread => res.status(200).json(thread).end())
        .catch(error => next(new ApiError(error)));


    res.status(200).json('NOT IMPLEMENTED YET').end();
}