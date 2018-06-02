var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserPhoneDAO.js');


function addUserPhone(params,callback){
    var query = " insert into user_phone (uid,phone,date_id,import_id) values ( ? , ? , ? ,?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.uid;
    paramsArray[i++]=params.phone;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.importId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUserPhone ');
        return callback(error,rows);
    });
}

function getUserPhone(params,callback) {
    var query = " select * from user_phone where id is not null ";
    var paramsArray=[],i=0;
    if(params.userPhoneId){
        paramsArray[i++] = params.userPhoneId;
        query = query + " and id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.favor){
        paramsArray[i++] = params.favor;
        query = query + " and favor = ? ";
    }
    if(params.remarkStatus){
        paramsArray[i++] = params.remarkStatus;
        query = query + " and remark_status = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and date_id = ? ";
    }
    if(params.importId){
        paramsArray[i++] = params.importId;
        query = query + " and import_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserPhone ');
        return callback(error,rows);
    });
}

function updateUserPhoneStatus(params,callback){
    var query = " update user_phone set status = ? ,connect_count=connect_count+1 where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userPhoneId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserPhoneStatus ');
        return callback(error,rows);
    });
}

function updateUserPhoneFavor(params,callback){
    var query = " update user_phone set favor = ?  where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.favor;
    paramsArray[i] = params.userPhoneId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserPhoneFavor ');
        return callback(error,rows);
    });
}

function updateUserPhoneRemark(params,callback){
    var query = " update user_phone set remark_status = ?,remark=? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.remarkStatus;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.userPhoneId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserPhoneRemark ');
        return callback(error,rows);
    });
}

function getUserPhoneStatusStat(params,callback) {
    var query = 'select count(id) phone_count,status from user_phone where id is not null ';
    var paramsArray = [], i = 0;
    if (params.userId) {
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if (params.status) {
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if (params.dateId) {
        paramsArray[i++] = params.dateId;
        query = query + " and date_id = ? ";
    }
    if (params.importId) {
        paramsArray[i++] = params.importId;
        query = query + " and import_id = ? ";
    }
    query = query + " group by status ";
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' getUserPhoneStatusStat ');
        return callback(error, rows);
    });
}

function getUserPhoneRemarkStat(params,callback) {
    var query = 'select count(id) phone_count,remark_status from user_phone where id is not null ';
    var paramsArray = [], i = 0;
    if (params.userId) {
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if (params.status) {
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if (params.remarkStatus) {
        paramsArray[i++] = params.remarkStatus;
        query = query + " and remark_status = ? ";
    }
    if (params.dateId) {
        paramsArray[i++] = params.dateId;
        query = query + " and date_id = ? ";
    }
    if (params.importId) {
        paramsArray[i++] = params.importId;
        query = query + " and import_id = ? ";
    }
    query = query + " group by remark_status ";
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' getUserPhoneRemarkStat ');
        return callback(error, rows);
    });
}
module.exports ={
    addUserPhone  ,getUserPhone ,updateUserPhoneStatus ,updateUserPhoneRemark ,
    getUserPhoneStatusStat ,getUserPhoneRemarkStat , updateUserPhoneFavor
}