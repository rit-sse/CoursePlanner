'use strict';

var app = angular.module("BrowseController", ['PlanService']);

app.controller('browseController', ['$scope', 'school', 'plans', 'planService',
function($scope, school, plans, planService) {
    $scope.school = school;
    $scope.plans = plans;
}]);
