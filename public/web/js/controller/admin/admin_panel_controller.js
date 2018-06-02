app.controller("admin_panel_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    var adminId = _basic.getSession(_basic.USER_ID);
    $scope.userArray = [];
    $scope.importCount = 0;

    $scope.getUser = function(){
        _basic.get(_host.api_url + "/admin/" + adminId + "/user").then(function (data) {
            if (data.success == true) {
                $scope.userArray = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    $scope.getImportStat = function(){

        _basic.get(_host.api_url + "/admin/" + adminId + "/userPhoneImportStat").then(function (data) {
            if (data.success == true) {
                $scope.importCount = data.result[0].import_count;

            } else {
                swal(data.msg, "", "error");
            }
        });
    };



    $scope.getUser();
    $scope.getImportStat();

}]);
