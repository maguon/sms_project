app.controller("admin_login_controller", ['$rootScope','$scope','$location','$q',"_basic","_host","_config",

    function($rootScope,$scope,$location,$q,_basic,_host,_config){
        $scope.mobile='';
        $scope.password='';
        $scope.login = function(){

            if($scope.mobile==''||$scope.password==''){
                swal("账号或密码不能为空", "", "error");
            } else {
                $(".shadeDowWrap").show();
                _basic.post(_host.api_url+"/admin/do/login", {
                    "mobile": $scope.mobile,
                    "password": $scope.password
                }).then(function(data){
                    $(".shadeDowWrap").hide();
                    if(data.success==true){
                        _basic.setSession(_basic.USER_AUTH_NAME,data.result.accessToken);
                        _basic.setSession(_basic.USER_ID,data.result.userId);
                        _basic.setSession(_basic.USER_STATUS,data.result.userStatus);
                        _basic.setSession(_basic.USER_TYPE,"99");
                        _basic.setHeader(_basic.USER_TYPE, "99");
                        _basic.setHeader(_basic.COMMON_AUTH_NAME, data.result.accessToken);
                        window.location.href="./admin_home.html";
                    }else {
                        swal(data.msg,"","error");
                    }
                }).catch(function(error){
                    swal("登录异常", "", "error");
                    console.log(error)
                });
            }

        };
        console.log('Login Controller Init !');
    }]);
