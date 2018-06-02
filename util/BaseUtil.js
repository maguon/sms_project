/**
 * Created by lingxue on 2016/12/8.
 */
var serverLogger = require('./ServerLogger.js');
var logger = serverLogger.createLogger('BaseUtil.js');
function Json2String(obj){
    try{
        return JSON.stringify(obj);
    }catch(e){
        logger.error('Json2String error:' +obj);
        return null;
    }
}

function String2Json(string) {
    try{
        return JSON.parse(string);
    }catch(e){
        logger.error('String2Json error:' +string);
        return null;
    }
}

module.exports = {
    Json2String : Json2String ,
    String2Json : String2Json
}