let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

if(process.env.NODE_ENV == 'testCloud' || process.env.NODE_ENV == 'production') {
  mongoose.connect('mongodb+srv://tbadmin:Tbtest123!@cluster0-xbiza.mongodb.net/test?retryWrites=true',
      {useNewUrlParser: true}).then((con) => {

  });
} else {
  mongoose.connect('mongodb://localhost/users',
      {useNewUrlParser: true});
}

/* GET home page. */
router.get('*', function(req, res, next) {
  res.status(200).json({'yeet': {'or': {'be:': 'yeeten'}}});
});

module.exports = router;
