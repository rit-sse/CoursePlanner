'use strict';

var app = angular.module("BrowseController", ['PlanService', 'SchoolService']);

app.controller('browseController', ['$scope', '$state', 'school', 'plans', 'planService', 'schoolService', 'user',
function($scope, $state, school, plans, planService, schoolService, user) {
    $scope.user = user;
    $scope.school = school;
    $scope.plans = plans;
    $scope.filters = {};

    $scope.load = function(plan){
        planService.copyPublicPlan(plan);
        $state.go('home');
    };

    schoolService.getSchools()
    .then(function(schools){
        $scope.schools = schools;
    });
}]);
