

app.directive('header', function () {
    return {
        templateUrl: '/js/view/common_header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic, _config, _host) {
            //修改个人密码
            $scope.openPasswordModel = function () {
                $scope.originPassword = "";
                $scope.newPassword = "";
                $scope.confirmPassword = "";
                $(".modal").modal();
                $("#user_modal").modal("open");

            };

            $scope.closePasswordModel = function () {
                $("#user_modal").modal("close");

            };
            $("#menu_link").sideNav({
                menuWidth: 280, // Default is 300
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            });
            $('.collapsible').collapsible();
            $scope.changePassword = function () {
                if ($scope.newPassword == $scope.confirmPassword ) {
                    if($scope.newPassword.length >=6 && $scope.newPassword.length<20){
                        var obj = {
                            "originPassword": $scope.originPassword,
                            "newPassword": $scope.newPassword
                        };
                        _basic.put(_host.api_url + "/user/" + userId + "/password", obj).then(function (data) {
                            if (data.success == true) {
                                swal("密码重置成功", "", "success");
                                $("#user_modal").modal("close");
                            } else {
                                swal(data.msg, "", "error");
                            }
                        })
                    }else{
                        swal('新密码的长度在6-20位','','error')
                    }

                }else{
                    swal('密码不一致','','error')
                }
            };


            //退出登录
            $scope.logOut = function () {
                swal({
                    title: "注销账号",
                    text: "是否确认退出登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function () {
                    _basic.removeSession(_basic.COMMON_AUTH_NAME);
                    _basic.removeSession(_basic.USER_ID);
                    _basic.removeSession(_basic.USER_TYPE);
                    _basic.removeSession(_basic.USER_NAME);
                    window.location.href = '/common_login.html';
                });

            };

            if (_basic.getSession(_basic.USER_TYPE) == "10") {
                var userId = _basic.getSession(_basic.USER_ID);
                $scope.userType = _basic.getSession(_basic.USER_TYPE);

                //存储信息到sessionStorage
                _basic.setHeader(_basic.USER_TYPE, _basic.getSession(_basic.USER_TYPE));
                _basic.setHeader(_basic.COMMON_AUTH_NAME, _basic.getSession(_basic.COMMON_AUTH_NAME));
                $scope.qrList = [];
                _basic.get(_host.api_url + "/user/" + _basic.getSession(_basic.USER_ID)).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        $scope.userName = data.result[0].real_name;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);

                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else {
                window.location = "/common_login.html"
            }

        }
    };
});
app.directive('footer', function () {
    return {
        templateUrl: '/js/view/common_footer.html',
        replace: true,
        transclude: false,
        restrict: 'E'
    };
});