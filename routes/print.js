var url = require('url');
var logger = require('../tools/logger');
var gugu = require('../tools/gugu');

module.exports = function (req, res) {
    res.header('content-type', 'text/plain; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url, true).query;
    var type = query.type;
    var content = query.content;

    logger.info(`gugu print ${type} ${content}, IP: ${ip}`);

    switch (type) {
        case '1':
            gugu.printText(content)
                .then(printcontentid => res.send('' + printcontentid));
            break;
        case '2':
            gugu.printImage(content)
                .then(printcontentid => res.send('' + printcontentid));
            break;
    }
};