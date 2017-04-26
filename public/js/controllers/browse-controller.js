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
        //School
        plans = _.filter(plans, { school: filters.school });
        
        //Title
        plans = _.filter(plans, function(plan) {
            return plan.title.includes(filters.title);
        });

        //Tag
        plans = _.filter(plans, function(plan) {
            return filters.tags.length === 0 || 
                _.intersectionBy(plan.tags, filters.tags, 'text').length > 0;
        });

        return plans;
    };
});
