app.controller("user_info_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    var adminId = _basic.getSession(_basic.USER_ID);
    $scope.userList = [];
    $scope.userDetail = {};
    $scope.getUser = function(){
        _basic.get(_host.api_url + "/admin/" + adminId + "/user").then(function (data) {
            if (data.success == true) {
                $scope.userList = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getUserDetail = function(userId){
        _basic.get(_host.api_url + "/admin/" + adminId + "/user?userId=" + userId).then(function (data) {
            if (data.success == true && data.result.length>0) {
                $scope.userDetail = data.result[0];
                $('#userModal').modal("open");

            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.createUser = function () {
        $scope.submitted = true;

        var obj = {
            mobile: $scope.mobile,
            realName: $scope.realName,
            password: $scope.password,
            remark : $scope.remark
        };
        _basic.post(_host.api_url + "/admin/" + adminId + "/user", obj).then(function (data) {
            if (data.success == true) {
                swal("新增成功", "", "success");
                $('#newUserModal').modal('close');
                $scope.getUser();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    $scope.updateUserStatus = function (status, id) {
        if (status == "1") {
            $scope.changeStatus = "0"
        } else if (status == "0") {
            $scope.changeStatus = "1"
        }

        _basic.put(_host.api_url + "/admin/" + adminId + "/user/" + id + "/status/" + $scope.changeStatus
            , {}).then(function (data) {
            if (data.success == true) {
                //getUserInfoList();
            } else {
                swal(data.msg, "", "error");
            }

        })
    };

    $scope.updateUserInfo = function () {
        var obj = {
            mobile: $scope.userDetail.mobile,
            realName: $scope.userDetail.real_name,
            remark: $scope.userDetail.remark
        };
        _basic.put(_host.api_url + "/admin/" + adminId + "/user/" + $scope.userDetail.uid, obj).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $('#userModal').modal('close');
                //getUserInfoList();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    $scope.openNewUserModal = function(){
        $scope.mobile = "";
        $scope.password = "";
        $scope.realName = "";
        $scope.remark = "";
        $('#newUserModal').modal("open");
    }

    $scope.getUser();



}]);

