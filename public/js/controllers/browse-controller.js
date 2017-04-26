'use strict';

var app = angular.module("BrowseController", ['PlanService']);

app.controller('browseController', ['$scope', '$state', 'school', 'plans', 'planService', 'user',
function($scope, $state, school, plans, planService, user) {
    $scope.user = user;
    $scope.school = school;
    $scope.plans = plans;
    $scope.filters = {};

    $scope.load = function(plan){
        planService.copyPublicPlan(plan);
        $state.go('home');
    };
}]);
