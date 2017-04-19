'use strict';

var app = angular.module("HomeController", ['PlanService', 'NotificationService']);

app.controller('homeController', ['$scope','$http', 'planService', 'notificationService', 'user',
function($scope, $http, planService, notificationService, user) {
    $scope.user = user;
    notificationService.on('user-changed', function(user){
        $scope.user = user;
    });
    
    $scope.plan = planService.plan;
    notificationService.on('plan-changed', function(){
        $scope.plan = planService.plan;
    });

    $scope.errormsg = "";
    $scope.setErrorMsg = function(text) {
        $scope.errormsg = text;
    };

}]);
