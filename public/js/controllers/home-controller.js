'use strict';

var app = angular.module("HomeController", ['PlanService', 'NotificationService', 'EditPlanDetailsModal']);

app.controller('homeController', ['$scope','$http', 'planService', 'notificationService', 'editPlanDetailsModal',
function($scope, $http, planService, notificationService, editPlanDetailsModal) {
    
    $scope.plan = planService.plan;
    notificationService.on('plan-changed', function(){
        $scope.plan = planService.plan;
    });

    $scope.errormsg = "";
    $scope.setErrorMsg = function(text) {
        $scope.errormsg = text;
    };

    $scope.editPlanDetails = function() {
        editPlanDetailsModal.open($scope.plan);
    };

}]);
