// Copyright (c) 2012 Mark Cavage. All rights reserved.

var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert-plus');
var restify = require('restify');

var sysConfig = require('./config/SystemConfig.js');
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('Server.js');

var adminUser = require('./bl/AdminUser');
var user = require('./bl/User')
var userPhone = require('./bl/UserPhone')
var userPhoneImport = require('./bl/UserPhoneImport');

///--- API

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({

        name: 'SMS_PROJECT',
        version: '0.0.1'
    });


    // Ensure we don't drop data on uploads
    //server.pre(restify.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());




    
    // Set a per request bunyan logger (with requestid filled in)
    //server.use(restify.requestLogger());

    // Allow 5 requests/second by IP, and burst to 10
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));

    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());

    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.bodyParser({uploadDir:__dirname+'/public/web/uploads/',keepExtensions:true}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());



   

    // Now our own handlers for authentication/authorization
    // Here we only use basic auth, but really you should look
    // at https://github.com/joyent/node-http-signature

    //server.use(authenticate);

    //server.use(apiUtil.save);



    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map|csv)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/web', default: 'common_login.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/web',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/web',
        maxAge: 0}));
    /**
     * Admin User Module
     */
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);

    /**
     * User Module
     */
    server.get('/api/user' ,user.queryUser);
    server.get('/api/admin/:adminId/user' ,user.queryUser);
    server.post({path:'/api/admin/:adminId/user',contentType: 'application/json'} , user.createUser);
    server.put({path:'/api/admin/:adminId/user/:userId',contentType: 'application/json'} ,user.updateUserInfo);
    server.put({path:'/api/admin/:adminId/user/:userId/status/:status',contentType: 'application/json'} ,user.updateUserStatus);
    server.get('/api/user/:userId' , user.queryUser);
    server.post({path:'/api/userLogin' ,contentType: 'application/json'}, user.userLogin);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.changeUserPassword);
    server.get('/api/user/:userId/token/:token' , user.changeUserToken);

    /**
     * User Phone Module
     */
    server.get('/api/user/:userId/userPhone' ,userPhone.queryUserPhone);
    server.get('/api/admin/:adminId/userPhone' ,userPhone.queryUserPhone);
    server.put({path:'/api/user/:userId/userPhone/:userPhoneId/status/:status',contentType: 'application/json'} ,userPhone.updateUserPhoneStatus);
    server.put({path:'/api/user/:userId/userPhone/:userPhoneId/favor/:favor',contentType: 'application/json'} ,userPhone.updateUserPhoneFavor);
    server.put({path:'/api/user/:userId/userPhone/:userPhoneId/remark',contentType: 'application/json'} ,userPhone.updateUserPhoneRemark);
    //server.post({path:'/api/user/:userId/userPhone' ,contentType: 'application/json'}, userPhone.importUserPhone);

    server.get('/api/user/:userId/userPhoneStatusStat' ,userPhone.getUserPhoneStatusStat);
    server.get('/api/user/:userId/userPhoneRemarkStat' ,userPhone.getUserPhoneRemarkStat);
    server.get('/api/admin/:adminId/userPhoneStatusStat' ,userPhone.getUserPhoneStatusStat);
    server.get('/api/admin/:adminId/userPhoneRemarkStat' ,userPhone.getUserPhoneRemarkStat);

    /**
     * User Phone Module
     */
    server.get('/api/admin/:adminId/userPhoneImport' ,userPhoneImport.queryUserPhoneImport);
    server.get('/api/admin/:adminId/userPhoneImportStat' ,userPhoneImport.queryUserPhoneImportStat);
    server.post({path:'/api/admin/:adminId/user/:userId/userPhone' ,contentType: 'multipart/form-data'}, userPhoneImport.addUserPhoneImport);
    server.on('NotFound', function (req, res, next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });

    return (server);

}



///--- Exports

module.exports = {
    createServer: createServer
};