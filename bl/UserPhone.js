var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var userPhoneDAO = require('../dao/UserPhoneDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserPhone.js');

function queryUserPhone(req,res,next){
    var params = req.params ;
    userPhoneDAO.getUserPhone(params,function(error,result){
        if (error) {
            logger.error(' queryUserPhone ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserPhone ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function importUserPhone(req,res,next){

}

function updateUserPhoneStatus(req,res,next){
    var params = req.params;
    userPhoneDAO.updateUserPhoneStatus(params,function(error,result){
        if (error) {
            logger.error(' updateUserPhoneStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserPhoneStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
function updateUserPhoneFavor(req,res,next){
    var params = req.params;
    userPhoneDAO.updateUserPhoneFavor(params,function(error,result){
        if (error) {
            logger.error(' updateUserPhoneFavor ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserPhoneFavor ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateUserPhoneRemark(req,res,next){
    var params = req.params;
    params.remarkStatus = 1 ;
    userPhoneDAO.updateUserPhoneRemark(params,function(error,result){
        if (error) {
            logger.error(' updateUserPhoneRemark ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserPhoneRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getUserPhoneStatusStat(req,res,next){
    var params = req.params;

    userPhoneDAO.getUserPhoneStatusStat(params,function(error,result){
        if (error) {
            logger.error(' getUserPhoneStatusStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getUserPhoneStatusStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getUserPhoneRemarkStat(req,res,next){
    var params = req.params;

    userPhoneDAO.getUserPhoneRemarkStat(params,function(error,result){
        if (error) {
            logger.error(' getUserPhoneRemarkStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getUserPhoneRemarkStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports ={
    queryUserPhone ,importUserPhone ,updateUserPhoneStatus ,updateUserPhoneRemark,
    getUserPhoneStatusStat , getUserPhoneRemarkStat ,updateUserPhoneFavor

}