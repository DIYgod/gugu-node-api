var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "file",
            filename: 'logs/gugu.log',
            maxLogSize: 20480,
            backups: 3,
            category: [ 'gugu','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('gugu');
logger.setLevel('INFO');

module.exports = logger;