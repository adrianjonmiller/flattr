const auth = require('./controller')
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser')
const path = require('path')
const router = require('express').Router()
const shortId = require('shortid')

const Models = require(path.join(__dirname, '../models'))
const Data = require('../data')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const paths = {}
paths.views = path.join(__dirname, 'views')
paths.viewsLogin = path.join(paths.views, 'login')
paths.viewsNew = path.join(paths.views, 'new')

router.use(function timeLog (req, res, next) {
  next()
})

router.get('/login', (req, res) => {
  res.render(paths.viewsLogin);
})

router.get('/new', urlencodedParser, (req, res) => {
  res.render(paths.viewsNew, {message: 'Please create a new user'});
})

router.post('/new', urlencodedParser, (req, res) => {
  if (req.body.password === req.body.confirm) {
    let user = {}
    user.userName = Models.user().userName.data(req.body.username)
    user.password = Models.user().password.data(req.body.password)
    user.access = Models.user().access.default

    Data.create('users', user, () => {
      res.redirect('login');
    })
  } else {
    res.redirect('new');
  }
})

router.get('/generatePassword/:password', (req, res) => {
  res.send(bcrypt.hashSync(req.params.password))
})

router.post('/login', urlencodedParser, auth.authenticate('local',
  { successRedirect: '/admin',
    failureRedirect: '/auth/login',
    failureFlash: false
  })
)

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router
