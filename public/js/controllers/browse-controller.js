'use strict';

var app = angular.module("BrowseController", ['PlanService', 'SchoolService']);

app.controller('browseController', ['$scope', '$state', 'school', 'plans', 'planService', 'schoolService', 'user',
function($scope, $state, school, plans, planService, schoolService, user) {
    $scope.user = user;
    $scope.school = school;
    $scope.plans = plans;
    $scope.filters = {
        school: school,
        title: '',
        tags: []
    };

    $scope.load = function(plan){
        planService.copyPublicPlan(plan);
        $state.go('home');
    };

    schoolService.getSchools()
    .then(function(schools){
        $scope.schools = schools;
    });
}])

.filter('planFilter', function(){
    return function(plans, filters){
        return _.filter(plans, function(plan) {
            //If schools dont match, dont include
            if(plan.school._id !== filters.school._id) {
                return false;
            }

            //If plan title does not match search query, do not include
            if(!plan.title.includes(filters.title)){
                return false;
            }

            //If there are tag filters AND none of those tags match the ones of this plan,
            //do not include
            if(filters.tags.length !== 0 &&
                _.intersectionBy(plan.tags, filters.tags, 'text').length === 0) {
                return false;
            }

            return true;
        });
    };
});
