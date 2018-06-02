// var httpService=angular.module("httpService",[]);
app.factory('_basic', ['$http', '$location', '$q', function ($http, $location, $q) {
    var _this = {};
    _this.USER_AUTH_NAME = "auth-token";
    _this.COMMON_AUTH_NAME = 'auth-token';
    _this.USER_ID = "user-id";
    _this.USER_NAME = "user-name";
    _this.USER_IMG = "user_img";
    _this.USER_TYPE = "user-type";
    _this.USER_STATUS = "status";
    _this.ADMIN_AUTH_NAME = "admin-token";
    _this.ADMIN_ID = "admin-id";
    _this.ADMIN_STATUS = "admin-status";

    _this.setHeader = function (name, value) {
        $http.defaults.headers.common[name] = value;
    };

    _this.setHeader('Content-Type', 'application/json');

    _this.formPost = function (dom, url, success, error) {
        // url = '/api' + (url[0]==='/'?'':'/') + url;
        var options = {
            url: url,
            type: 'post',
            beforeSend: function (xhr) {
                console.log(xhr)
                xhr.setRequestHeader(_this.COMMON_AUTH_NAME, sessionStorage.getItem(_this.COMMON_AUTH_NAME));
                //xhr.setRequestHeader('Content-Type','multipart/form-data');
            },
            success: function (data) {
                if ($.isFunction(success)) {
                    success(data);
                }
            },
            error: function (data) {
                if ($.isFunction(error)) {
                    error(data);
                }
            }
        };
        $(dom).ajaxSubmit(options);
    };

    _this.formDataPost = function (formData, url, success, error) {
        /*$http({
            method: 'POST',
            url: url,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary4XY0LKeSkVPAmtU4'}
        }).success(function(data){
            success(data);
        }).error(function(err){
            error(err);
        })*/
        /*$.ajax({
            url:'url',
            method: 'POST',
            data:formData,
            success:function(data){
                console.log(data)
            },
            error:function(err){
                console.log(err)
            }
        });*/
        $.ajax({
            url:url,
            type:"POST",
            data:formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(_this.COMMON_AUTH_NAME, sessionStorage.getItem(_this.COMMON_AUTH_NAME));
            },
            contentType:false,
            processData:false,
            success:function(data){
                success(data)
            },
            error:function(err){
               error(err)
            }
        });
    };


    var fnArray = ['get', 'delete', 'jsonp', 'head', 'post', 'put'];
    // _this.option={
    //     shade:true
    // };
    for (var i in fnArray) {
        (function (fn) {
            var defaultOptions = {
                hidenShadow: false
            };
            _this[fn] = function (url, param, option) {
                if (option && option.hidenShadow) {
                    defaultOptions.hidenShadow = option.hidenShadow
                }
                if (defaultOptions.hidenShadow == true) {
                    $(".shadeDowWrap").hide();
                } else {
                    $(".shadeDowWrap").show();
                }

                var deferred = $q.defer();
                $http[fn](url, param).then(function (success) {
                    $(".shadeDowWrap").hide();
                    deferred.resolve(success.data);
                }).catch(function (data) {
                    $(".shadeDowWrap").hide();
                    swal("服务器内部异常", "", "error");
                    deferred.reject(data);
                });
                return deferred.promise;
            };
        })(fnArray[i]);
    }


    _this.setSession = function (name, value) {
        sessionStorage.setItem(name, value);
    };
    _this.getSession = function (name) {
        return sessionStorage.getItem(name);
    };
    _this.removeSession = function (name) {
        sessionStorage.removeItem(name);
    };

    _this.checkUser = function (userType) {
        if (!(this.getSession(this.COMMON_AUTH_NAME) && this.getSession(this.USER_ID))) {
            return false;
        } else {
            if (userType) {
                if (this.getSession(this.USER_TYPE) != userType) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    };
    // 回调处理
    _this.callBackDate = function (data, callback) {
        if (data.success == true && data.result.length > 0) {
            callback(data)
        } else {
            swal(data.msg, "", "error")
        }
    };
    _this.getParameter = function (name) {
        var url = document.location.href;
        var start = url.indexOf("?") + 1;
        if (start == 0) {
            return "";
        }
        var value = "";
        var queryString = url.substring(start);
        var paraNames = queryString.split("&");
        for (var i = 0; i < paraNames.length; i++) {
            if (name == getParameterName(paraNames[i])) {
                value = getParameterValue(paraNames[i])
            }
        }
        return value;
    };

    function getParameterName(str) {
        var start = str.indexOf("=");
        if (start == -1) {
            return str;
        }
        return str.substring(0, start);
    }

    function getParameterValue(str) {
        var start = str.indexOf("=");
        if (start == -1) {
            return "";
        }
        return str.substring(start + 1);
    }

    _this.removeNullProps = function (obj) {
        var tempObj = {};
        for (var i in obj) {
            if (obj[i] != "" && obj[i] != null) {
                tempObj[i] = obj[i]
            }
        }
        return tempObj
    };

    _this.objToUrl = function (obj) {
        var str = "";
        for (var i in obj) {
            if (obj[i] == 0 && obj[i] != "") {
                str = str + i + "=" + 0 + "&";
            }
            else if (obj[i] != null && obj[i] != "") {
                str = str + i + "=" + obj[i] + "&";
            }
        }
        return str.substr(0, str.length - 1);
    };
    return _this;
}]);

