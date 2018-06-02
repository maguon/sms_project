var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserPhoneImportDAO.js');



function addUserPhoneImport(params,callback){
    var query = " insert into user_phone_import (uid,upload_id,date_id) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.uid;
    paramsArray[i++]=params.uploadId;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUserPhoneImport ');
        return callback(error,rows);
    });
}


function getUserPhoneImport(params,callback) {
    var query = " select upi.* ,ui.real_name from user_phone_import upi " +
        "left join user_info ui on upi.uid=ui.uid where upi.id is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and upi.uid = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and date_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " order by upi.id desc limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserPhoneImport ');
        return callback(error,rows);
    });
}

function getUserPhoneImportStat(params,callback){
    var query = " select count(id) import_count from user_phone_import where id is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and date_id = ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserPhoneImportStat ');
        return callback(error,rows);
    });
}

module.exports ={
    addUserPhoneImport ,getUserPhoneImport ,getUserPhoneImportStat
}
