var express = require('express');
var config = require('./config/database');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var favicon = require('serve-favicon');
var passport = require('./config/passport');
var path = require('path');
var util = require('./util');
var fs = require('fs');
var https = require('https');
var http = require('http');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.database);
var db = mongoose.connection;
db.once('open', function(){
  db.useDb('test2');
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({limit: '5mb', extended: false, parameterLimit: 10000}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.isAdminLoggedin = false;
  //adminlogin check
  if(req.user) {
    if(req.user.id == "60e3c47a7ea3eab848d1b634" || req.user.id == "60e552f90b9b211c71a3b637" ) {
      res.locals.isAdminLoggedin = true;
    } else {
      res.locals.isAdminLoggedin = false;
    }
  }
  next();
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/comments', util.getPostQueryString, require('./routes/comments'));
app.use('/diary', require('./routes/diary'));

//error-page control
app.get("*", util.wrapAsync(async function (req, res) {
    await new Promise((resolve) => setTimeout(() => resolve(), 50));
    // 비동기 에러
    throw new Error("에러 발생!");
  })
);

app.use(function (error, req, res, next) {
  res.redirect('/errorpage');
});

//Server Start
http.createServer(app).listen(80);
/* const options = {
  ca: fs.readFileSync('/etc/letsencrypt/live/kongjay.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/kongjay.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/kongjay.com/cert.pem')
};
https.createServer(options, app).listen(443); */