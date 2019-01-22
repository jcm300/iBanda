var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require("mongoose")
var uuid = require("uuid/v4")
var passport = require('passport')
var session = require("express-session")
var FileStore = require("session-file-store")(session)
var flash = require('connect-flash')

require('./auth/auth')
var auth = require('./auth/auth')

var indexRouter = require('./routes/index')
var usersAPIRouter = require('./routes/api/user')
var eventsAPIRouter = require('./routes/api/event')
var articlesAPIRouter = require('./routes/api/article')
var piecesAPIRouter = require('./routes/api/piece')
var entriesAPIRouter = require('./routes/api/entry')
var statisticsAPIRouter = require('./routes/api/statistic')
var usersRouter = require('./routes/users')
var articlesRouter = require('./routes/articles')
var eventsRouter = require('./routes/events')
var piecesRouter = require('./routes/pieces')
var entriesRouter = require('./routes/entries')
var statisticsRouter = require('./routes/statistics')

var app = express();

//define global variables
app.locals.url="http://localhost:3000/"

//Database connection
mongoose.connect("mongodb://127.0.0.1:27017/iBanda", {useNewUrlParser: true})
        .then(() => console.log("Mongo status " + mongoose.connection.readyState))
        .catch(() => console.log("Mongo: connection error."))

//create user root if not exists
//arguments: password 
//WARNING: Change password!!!!
auth.createAdmin("ibanda")

//session configuration
app.use(session({
  genid: () => {
    return uuid()
  },
  store: new FileStore(),
  secret: "^Qn//'8_hY5RxS*{",
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())

app.use('/api/user', usersAPIRouter)
app.use('/api/event', eventsAPIRouter)
app.use('/api/article', articlesAPIRouter)
app.use('/api/piece', piecesAPIRouter)
app.use('/api/entry',entriesAPIRouter)
app.use('/api/statistic',statisticsAPIRouter)
app.use('/users',usersRouter)
app.use('/articles',articlesRouter)
app.use('/events', eventsRouter)
app.use('/pieces', piecesRouter)
app.use('/entries',entriesRouter)
app.use('/statistics',statisticsRouter)
app.use('/', indexRouter)

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
