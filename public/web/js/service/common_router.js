app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/js/view/common/panel.html',
        controller: 'panel_controller'
    }).when('/panel', {
        templateUrl: '/js/view/common/panel.html',
        controller: 'panel_controller'
    }).when('/operate', {
        templateUrl: '/js/view/common/operate.html',
        controller: 'operate_controller'
    })
}]);