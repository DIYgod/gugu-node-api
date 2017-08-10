var fs = require('fs');
var url = require('url');
var logger = require('../tools/logger');
var gugu = require('../tools/gugu');
var config = require('../config');

var reqIP = {};
var reqUser = {};

module.exports = function (req, res) {
    var body = '';
    var jsonStr = {};

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    req.on('data', dataListener);
    req.on('end', endListener);

    function dataListener (chunk) {
        body += chunk;
    }
    function endListener () {
        cleanListener();
        var type;
        var content;
        try {
            jsonStr = JSON.parse(body);
            type = jsonStr.type;
            content = jsonStr.content;
        } catch (err) {
            jsonStr = {};
        }

        if (!req.user) {
            logger.info(`Reject gugu print for not login, IP: ${ip}`);
            res.send(`{"code": 4, "msg": " 请先登录"}`);
            return;
        }

        // check black ip
        var blanklist = fs.readFileSync('blacklist').toString().split('\n');
        if (blanklist.indexOf(ip.split(',')[0]) !== -1 || blanklist.indexOf(req.user.id) !== -1 || blanklist.indexOf(req.user.displayName) !== -1) {
            logger.info(`Reject gugu print for black ip, IP: ${ip}`);
            res.send(`{"code": 1, "msg": "抱歉，您已被加入黑名单"}`);
            return;
        }

        if (content.length > config.maxLength) {
            logger.info(`Reject gugu print for max length, IP: ${ip}`);
            res.send(`{"code": 2, "msg": "超出最大文本长度"}`);
            return;
        }

        // frequency limitation(ip)
        if (reqIP[ip] && reqIP[ip] >= config.frequency) {
            logger.info(`Reject gugu print for frequent operation, IP: ${ip}`);
            res.send(`{"code": 3, "msg": "操作频繁，频繁次数过多会被拉入黑名单哦"}`);
            return;
        }
        else {
            if (reqIP[ip]) {
                reqIP[ip]++;
            }
            else {
                reqIP[ip] = 1;
            }
            setTimeout(function () {
                reqIP[ip]--;
            }, 1800000);   // 30 min
        }

        // frequency limitation(weibo user)
        var userid = req.user.id;
        if (reqUser[userid] && reqUser[userid] >= config.frequency) {
            logger.info(`Reject gugu print for frequent operation, User: ${userid} ${req.user.displayName}`);
            res.send(`{"code": 3, "msg": "操作频繁，频繁次数过多会被拉入黑名单哦"}`);
            return;
        }
        else {
            if (reqUser[userid]) {
                reqUser[userid]++;
            }
            else {
                reqUser[userid] = 1;
            }
            setTimeout(function () {
                reqUser[userid]--;
            }, 1800000);   // 30 min
        }

        logger.info(`gugu print ${type} ${content}, IP: ${ip}`);

        switch (type) {
            case '1':
                gugu.printText(req.user.displayName + ': ' + content)
                    .then(printcontentid => res.send(`{"code": 0, "msg": "成功发送打印请求", "user": "${req.user.displayName}", "printcontentid": "${printcontentid}"}`));
                break;
            case '2':
                gugu.printImage(content)
                    .then(printcontentid => res.send(`{"code": 0, "msg": "成功发送打印请求", "user": "${req.user.displayName}", "printcontentid": "${printcontentid}"}`));
                break;
            default:
                res.send(`{"code": 1, "msg": "参数错误"}`);
        }
    }

    function cleanListener () {
        req.removeListener('data', dataListener);
        req.removeListener('end', endListener);
    }
};