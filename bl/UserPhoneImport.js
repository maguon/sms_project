var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var userPhoneDAO = require('../dao/UserPhoneDAO.js');
var userPhoneImportDAO = require('../dao/UserPhoneImportDAO.js');
var Seq = require('seq');
var csvtojson = require('csvtojson');
var moment = require('moment');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserPhoneImport.js');

function queryUserPhoneImport(req,res,next){
    var params = req.params ;
    userPhoneImportDAO.getUserPhoneImport(params,function(error,result){
        if (error) {
            logger.error(' queryUserPhoneImport ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserPhoneImport ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryUserPhoneImportStat(req,res,next){
    var params = req.params ;
    userPhoneImportDAO.getUserPhoneImportStat(params,function(error,result){
        if (error) {
            logger.error(' queryUserPhoneImportStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserPhoneImportStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function addUserPhoneImport(req,res,next){
    var params = req.params;
    var fullFilePath = req.files.file.path;
    var tmpArray = req.files.file.path.split('\\');
    var filePath = tmpArray[tmpArray.length-1];

    var dateId = moment(new Date()).format('YYYYMMDD');
    var importParamObj  ={
        uid : params.userId,
        dateId : dateId,
        uploadId : filePath
    }
    var userPhoneImportId = 0
    Seq().seq(function(){
        var that = this;
        userPhoneImportDAO.addUserPhoneImport(importParamObj,function(error,result){
            if (error) {
                logger.error(' addUserPhoneImport ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' addUserPhoneImport ' + 'success');
                    userPhoneImportId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"add user phone import  failed");
                    return next();
                }
            }
        })
    }).seq(function(){

        csvtojson().fromFile(fullFilePath).then((jsonArray)=>{
            //console.log(jsonArray);
            Seq(jsonArray).seqEach(function(item,i){
                var that = this;
                var userPhoneParamObj = {
                    phone :item.phone,
                    uid:params.userId,
                    dateId : item.date,
                    importId : userPhoneImportId
                }
                userPhoneDAO.addUserPhone(userPhoneParamObj,function(error,result){
                    if (error) {
                        logger.error(' addUserPhoneImport ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' addUserPhoneImport ' + 'success');

                        }else{
                            logger.warn(' addUserPhoneImport ' + 'failed');
                        }
                        that(null,i);
                    }
                })
            }).seq(function(){
                logger.info(' addUserPhoneImport ' + ' complete success');
                resUtil.resetCreateRes(res,{insertId:userPhoneImportId},null);
                return next();
            })

        })
    })


}

module.exports = {
    queryUserPhoneImport , queryUserPhoneImportStat , addUserPhoneImport
}