app.controller("user_data_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    var adminId = _basic.getSession(_basic.USER_ID);
    $scope.importArray = [];
    $scope.userArray = [];
    $scope.importArray = [];
    $scope.userId = "0"
    $scope.start = 0;
    $scope.size =11;
    $scope.nextFlag = false;

    $scope.openUploadModal = function(){
        $('#uploadModal').modal("open");
        $('#import_file').val("");
        $('#import_file_text').val("");
    }

    $scope.getUser = function(){
        _basic.get(_host.api_url + "/admin/" + adminId + "/user").then(function (data) {
            if (data.success == true) {
                $scope.userArray = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getUserPhoneImport = function(){
        var url  ="?"
        if($scope.userId != "0"){
            url = url + "userId="+$scope.userId;
        }
        url= url + "&start="+$scope.start +"&size="+$scope.size;
        _basic.get(_host.api_url + "admin/" + adminId + "/userPhoneImport"+ url).then(function (data) {
            if (data.success == true && data.result.length>0) {
                $scope.importArray = data.result;
                if($scope.importArray.length>=$scope.size){
                    $scope.nextFlag = true;
                    $scope.importArray.splice($scope.size-1,1);
                }else{
                    $scope.nextFlag = false;
                }

            } else {
                // swal("a", "t", "error");
                return;
            }
        });
    }

    $scope.importFile = function(dom){
        if($scope.userId ==0){
            swal('请先选择用户','','error')
        }else{
            _basic.formPost($(dom).parent().parent().children()[0], _host.api_url +'admin/'+adminId+ '/user/' + $scope.userId + '/userPhone', function (data) {
                if (data.success == true) {
                    $('#uploadModal').modal("close");
                    $scope.queryUserPhoneImport();
                }
            });
        }

    }

    $scope.getImportStatusStat = function(importId){
        _basic.get(_host.api_url + "admin/" + adminId + "/userPhoneStatusStat?importId="+ importId).then(function (data) {
            if (data.success == true && data.result.length>0) {
                var statusStatArray = data.result;
                for(var i =0;i<statusStatArray.length;i++){
                    if(statusStatArray[i].status=="1"){
                        $scope.unprocessCount = statusStatArray[i].phone_count;
                    }
                    if(statusStatArray[i].status=="2"){
                        $scope.processedCount = statusStatArray[i].phone_count;
                    }
                }
            } else {
                // swal("a", "t", "error");
                return;
            }
        });
    }

    $scope.getImportRemarkStat = function(importId){
        _basic.get(_host.api_url + "admin/" + adminId + "/userPhoneRemarkStat?remarkStatus=1&importId="+ importId).then(function (data) {
            if (data.success == true && data.result.length>0) {
                $scope.remarkedCount = data.result[0].phone_count;
            } else {
                // swal("a", "t", "error");
                return;
            }
        });
    }
    $scope.getImportDetail = function(importId){

        $scope.unprocessCount = 0;
        $scope.processedCount = 0;
        $scope.remarkedCount  = 0;
        $('#importModal').modal("open");
        $scope.getImportStatusStat(importId);
        $scope.getImportRemarkStat(importId);
    }

    $scope.queryUserPhoneImport = function(){
        $scope.start = 0;
        $scope.getUserPhoneImport();
    }

    $scope.queryUserPhoneImport();

    $scope.prePage = function(){
        $scope.start = $scope.start -($scope.size-1);
        $scope.getUserPhoneImport();
    }
    $scope.nextPage = function() {
        $scope.start = $scope.start +($scope.size-1);
        $scope.getUserPhoneImport();
    }
    $scope.queryUserPhoneImport();
    $scope.getUser();



}]);

