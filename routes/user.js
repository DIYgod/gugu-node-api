var url = require('url');
var logger = require('../tools/logger');
var gugu = require('../tools/gugu');

module.exports = function (req, res) {
    res.send(JSON.stringify(req.user));
};