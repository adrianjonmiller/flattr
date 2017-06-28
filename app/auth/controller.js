const bcrypt = require('bcrypt-nodejs')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

const Data = require('../data')

function validPassword (password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}

function getUser (username, cb) {
  Data.read('user', {name: username}, (snapShot) => {
    cb(() => snapShot())
  })
}

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    getUser(username, (user) => {
      if(!user()) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!validPassword(password, user().password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user());
    })
  }
))

passport.initialize()
passport.session()

module.exports = passport
