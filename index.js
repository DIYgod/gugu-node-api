var express = require('express');
var logger = require('./tools/logger');
var gugu = require('./tools/gugu');

logger.info(`🍻 gugu start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/print', require('./routes/print'));
app.get('/status', require('./routes/status'));
app.listen(1211);