let createError = require('http-errors');
let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();

let indexRouter = require('./routes/index');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);



if(process.env.NODE_ENV == 'testCloud' || process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb+srv://tbadmin:Tbtest123!@cluster0-xbiza.mongodb.net/test?retryWrites=true',
        {useNewUrlParser: true}).then((con) => {

    });
} else {
    mongoose.connect('mongodb://localhost/users',
        {useNewUrlParser: true});
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
