var express = require('express');
var session = require('express-session');

var logger = require('./tools/logger');
var passport = require('./tools/passport');
var config = require('./config');

logger.info(`🍻 gugu start! Cheers!`);

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.all('*', require('./routes/all'));

app.get('/login',
    passport.authenticate('weibo'),
    function (req, res) {
    }
);

app.get('/callback',
    passport.authenticate('weibo', { failureRedirect: '/login' }),
    function (req, res) {
        res.send('<script>window.location.href = "' + config.redirectURL + '"</script>');
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.send('<script>window.location.href = "' + config.redirectURL + '"</script>');
});

app.get('/account', function (req, res) {
    res.send(JSON.stringify(req.user));
});

app.post('/print', require('./routes/print'));
app.get('/status', require('./routes/status'));

app.listen(1211);