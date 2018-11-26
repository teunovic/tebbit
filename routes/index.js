let express = require('express');



/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});

module.exports = router;
