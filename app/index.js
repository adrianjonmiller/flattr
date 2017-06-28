const cookie = require('cookie-parser')
const fileUpload = require('express-fileupload');
const express = require('express')
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon')
const helpers = require('./helpers')
const passport = require('passport')
const path = require('path')
const session = require('express-session')

// Modules
const Tasks = require('./tasks')

// Routes
const login = require(path.join(__dirname, 'auth/routes'))
const public = require(path.join(__dirname, 'public/routes'))
const edit = require(path.join(__dirname, 'cms/routes'))

// Paths
const paths = {};
paths.public = path.join(__dirname, '../public')
paths.favicon = path.join(paths.public, 'favicon.ico')
paths.layouts = path.join(__dirname, 'layouts')
paths.partials = path.join(__dirname, 'partials')
paths.error = path.join(__dirname, 'public/views/error.hbs')

// Auth Check
function auth (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/auth/login')
  }
}

// App
const app = express();

const hbs = exphbs.create({
  partialsDir: paths.partials,
  defaultLayout: paths.layouts + '/default',
  extname: '.hbs',
  helpers: helpers
})

// View Engine
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// Middleware
app.use(cookie())
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use(favicon(paths.favicon))
app.use('/public', express.static(paths.public))
app.use('/admin', auth, edit)
// app.use('/admin', edit)
app.use('/auth', login)
app.use('/', public)

// Handle 404
app.use(function(req, res) {
  res.status(400);
  res.render(paths.error, {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500);
  res.render(paths.error, {title:'500: Internal Server Error', error: error});
});

module.exports = app
