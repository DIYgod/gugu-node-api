var config = require('../config');

module.exports = function (req, res, next) {
    if (req.headers.origin) {
        for (var i = 0; i < config.allowOrigin.length; i++) {
            if (new RegExp(config.allowOrigin[i]).test(req.headers.origin)) {
                res.header("Access-Control-Allow-Origin", req.headers.origin);
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
                res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
                res.header('content-type', 'application/json; charset=utf-8');
                next();
            }
        }
        res.send('Unallowed origin');
    }
    else {
        next();
    }
};