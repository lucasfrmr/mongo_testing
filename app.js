const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//changed for cloud 9
// mongoose.connect('mongodb://localhost/nodekb');
// updated in built
mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', () => {
	console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', (err) => {
	console.log('DB-err');
});

//init app
const app = express();

//Bring in models
let Post = require('./models/post');
let User = require('./models/user');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "pug");

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'yeti cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middlesware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// If user logged in
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    User.find({}, (err, users) => {
      if (err){
        console.log(err);
      } else {
        res.render('index', {
          title: "Home",
          posts: posts,
          users: users
        });
      } 
    });
  });
});

// Route Files
let posts = require('./routes/posts');
let users = require('./routes/users');
app.use('/posts', posts);
app.use('/users', users);

//start server
app.listen('4000',  () => {
	console.log('Server started on port 4000...');
});
