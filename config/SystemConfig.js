



var mysqlConnectOptions ={
    user: 'lxq',
    password: 'lxq_sms',
    database:'sms',
    host: '127.0.0.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: { file: { type: 'file', filename: 'sms_project.log' } ,console: { type: 'stdout' },},
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}

function getMysqlConnectOptions (){
    return mysqlConnectOptions;
}

var mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/log'
}

var hosts = {
    record : {host:"localhost",port:9004},
    auth : {host:"stg.myxxjs.com",port:9009}
}

module.exports = {
    getMysqlConnectOptions : getMysqlConnectOptions,
    loggerConfig : loggerConfig,
    logLevel : logLevel ,
    mongoConfig : mongoConfig,
    hosts : hosts
}
