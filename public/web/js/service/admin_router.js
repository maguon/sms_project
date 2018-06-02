app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/js/view/admin/user/user_info.html',
        controller: 'user_info_controller'
    }).when('/user', {
        templateUrl: '/js/view/admin/user/user_info.html',
        controller: 'user_info_controller'
    }).when('/user_data', {
        templateUrl: '/js/view/admin/data/user_data.html',
        controller: 'user_data_controller'
    }).when('/panel', {
        templateUrl: '/js/view/admin/admin_panel.html',
        controller: 'admin_panel_controller'
    })
}]);