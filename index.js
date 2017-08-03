var express = require('express');
var session = require('express-session');

var logger = require('./tools/logger');
var gugu = require('./tools/gugu');
var passport = require('./tools/passport');

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
app.get('/print', require('./routes/print'));
app.get('/status', require('./routes/status'));
app.get('/account', require('./routes/user'));
app.listen(1211);