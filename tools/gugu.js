var Memobird = require('memobird');
var config = require('../config');

var gugu = new Memobird({
    ak: config.ak,
    memobirdID: config.memobirdID,
    useridentifying: config.useridentifying,
});

gugu.init();

module.exports = gugu;