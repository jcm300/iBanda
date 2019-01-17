var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersAPIRouter = require('./routes/api/user');
var eventsAPIRouter = require('./routes/api/event');
var articlesAPIRouter = require('./routes/api/article');
var piecesAPIRouter = require('./routes/api/piece')
var articlesRouter = require('./routes/articles')
var eventsRouter = require('./routes/events')
var piecesRouter = require('./routes/pieces')

var app = express();

//define global variables
app.locals.url="http://localhost:3000/"

//Base de dados
var mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/iBanda", {useNewUrlParser: true})
        .then(() => console.log("Mongo status " + mongoose.connection.readyState))
        .catch(() => console.log("Mongo: erro na conexão."))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', usersAPIRouter);
app.use('/api/event', eventsAPIRouter);
app.use('/api/article', articlesAPIRouter);
app.use('/api/piece', piecesAPIRouter)
app.use('/articles',articlesRouter);
app.use('/events', eventsRouter);
app.use('/pieces', piecesRouter)
app.use('/', indexRouter);

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
