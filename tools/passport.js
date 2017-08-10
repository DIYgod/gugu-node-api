var passport = require('passport');
var WeiboStrategy = require('passport-weibo').Strategy;
var config = require('../config');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new WeiboStrategy({
    clientID: config.appKey,
    clientSecret: config.appSecret,
    callbackURL: config.URL + '/callback'
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

module.exports = passport;