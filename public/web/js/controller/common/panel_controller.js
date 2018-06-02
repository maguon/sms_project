app.controller("panel_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    $scope.statusStatObj = {};
    $scope.remarkStatObj = {};
    var userId = _basic.getSession(_basic.USER_ID);

    $scope.getUserPhoneStatusStat = function(){
        _basic.get(_host.api_url + "/user/" + userId + "/userPhoneStatusStat").then(function (data) {
            if (data.success == true && data.result.length>0) {
               var statusStatArray = data.result;
               for(var i =0;i<statusStatArray.length;i++){
                   if(statusStatArray[i].status=="1"){
                       $scope.statusStatObj.unprocessed = statusStatArray[i].phone_count;
                   }
                   if(statusStatArray[i].status=="2"){
                       $scope.statusStatObj.processed = statusStatArray[i].phone_count;
                   }
               }
            } else {
                // swal("a", "t", "error");
                return;
            }
        });
    }

    $scope.getUserPhoneRemarkStat = function(){
        _basic.get(_host.api_url + "/user/" + userId + "/userPhoneRemarkStat?status=2").then(function (data) {
            if (data.success == true && data.result.length>0) {
                //$scope.remarkStatArray = data.result;
                $scope.remarkStatObj.remarked = data.result[0].phone_count;
                Highcharts.chart('chart_div', {
                    chart: {
                        plotShadow: false,
                        type: 'pie'
                    },
                    credits: {
                        enabled:false
                    },
                    exporting: {
                        enabled:false
                    },
                    title: {
                        text: '任务处理分布图'
                    },
                    tooltip: {
                        pointFormat: '{point.y}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: '',
                        colorByPoint: true,
                        data: [{
                            name: '已处理',
                            y: $scope.statusStatObj.processed
                        }, {
                            name: '已备注',
                            y: $scope.remarkStatObj.remarked
                        }]
                    }]
                });
            } else {
                $scope.remarkStatObj.remarked = 0;
                // swal("a", "t", "error");
                return;
            }
        });
    }

    $scope.getUserPhoneStatusStat();
    $scope.getUserPhoneRemarkStat();

}]);

