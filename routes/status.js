var url = require('url');
var logger = require('../tools/logger');
var gugu = require('../tools/gugu');

module.exports = function (req, res) {

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    var query = url.parse(req.url, true).query;
    var id = query.id;

    logger.info(`gugu status ${id}, IP: ${ip}`);

    gugu.watch(id, 1000, 20000)
        .then(printflag => res.send('' + printflag));
};