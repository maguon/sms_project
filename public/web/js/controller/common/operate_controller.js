app.controller("operate_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.phoneArray =[];
    $scope.operateStatus = "1";
    $scope.currentUserPhoneId = null;
    var d = new Date();
    //$scope.dateId = d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate();

    $scope.start = 0;
    $scope.size =13;
    $scope.nextFlag = false;
    $('.datepicker').pickadate({
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        format: 'yyyymmdd',
        onSet: function (arg) {
            if ('select' in arg) {
                this.close();
            }
        }
    });

    $scope.openRemarkModal = function(userPhoneId,index){
        $scope.remark = $scope.phoneArray[index].remark;
        $scope.currentUserPhoneId = userPhoneId;
        $('#remarkModal').modal("open");
    }
    //修改为电话以拨打
    $scope.updatePhoneStatus = function(userPhoneId,i){
        //console.log(userPhoneId)
        _basic.put(_host.api_url + "/user/" + userId + "/userPhone/" + userPhoneId + "/status/2" , {}).then(function (data) {
            if (data.success == true) {
                $scope.phoneArray[i].connect_count = $scope.phoneArray[i].connect_count + 1;
                //getUserInfoList();
            } else {
                swal("更新失败", "", "error");
            }

        })
    }
    //修改收藏状态
    $scope.updatePhoneFavor = function(userPhoneId,favor,i){
        //console.log(userPhoneId)
        var favorParams = 0;
        if(favor==0){
            favorParams =1;
        }else{
            favorParams = 0;
        }
        _basic.put(_host.api_url + "/user/" + userId + "/userPhone/" + userPhoneId + "/favor/"+favorParams , {}).then(function (data) {
            if (data.success == true) {
                $scope.phoneArray[i].favor = favorParams;
                //getUserInfoList();
            } else {
                swal("更新失败", "", "error");
            }

        })
    }
    //增加电话的备注信息s
    $scope.updateUserPhoneRemark = function(){
        var paramObj = {
            remark :$scope.remark
        }
        _basic.put(_host.api_url + "/user/" + userId + "/userPhone/" + $scope.currentUserPhoneId + "/remark" , paramObj).then(function (data) {
            if (data.success == true) {
                //getUserInfoList();
                swal('更新成功',"","success");
                $('#remarkModal').modal("close");
            } else {
                swal("更新失败", "", "error");
            }

        })
    }

    $scope.getUserPhone = function(){
        var url ;
        var status = $scope.operateStatus;
        if(status == 1){
            url = "?status=1";
        }else if(status ==2){
            url = "?status=2";

        }else if (status ==3){
            url = "?favor=1";
        }else if(status ==4){
            url = "?remarkStatus=1";
        }else {
            url = "?";
        }
        if($scope.dateId){
            url = url+ "&dateId="+$scope.dateId
        }
        url= url + "&start="+$scope.start +"&size="+$scope.size;
        _basic.get(_host.api_url + "/user/" + userId + "/userPhone"+ url).then(function (data) {
            if (data.success == true ) {
                $scope.phoneArray = data.result;
                if($scope.phoneArray.length>=$scope.size){
                    $scope.nextFlag = true;
                    $scope.phoneArray.splice($scope.size-1,1);
                }else{
                    $scope.nextFlag = false;
                }

            } else {
               // swal("a", "t", "error");
                return;
            }
        });
    }

    $scope.queryUserPhone = function(){
        $scope.start = 0;
        $scope.getUserPhone();
    }

    $scope.queryUserPhone();

    $scope.prePage = function(){
        $scope.start = $scope.start -($scope.size-1);
        $scope.getUserPhone();
    }
    $scope.nextPage = function() {
        $scope.start = $scope.start +($scope.size-1);
        $scope.getUserPhone();
    }
}]);

