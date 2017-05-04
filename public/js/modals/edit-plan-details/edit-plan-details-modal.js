'use strict';

angular.module('EditPlanDetailsModal', ['ui.bootstrap', 'AuthService', 'SchoolService'])

.service('editPlanDetailsModal', ['$uibModal', function($uibModal) {
    var self = this;

    self.open = function(plan) {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/edit-plan-details/edit-plan-details-modal.html',
            animation: false,
            backdrop: false,
            size: 'sm',
            controller: ['$scope', 'authService', 'schoolService',
            function(modalScope, authService, schoolService) {
                modalScope.plan = JSON.parse(JSON.stringify(plan));//Hack to make a copy so we don't edit the original

                authService.getUser()
                .then(function(user){
                    modalScope.user = user;
                });

                schoolService.getSchools()
                .then(function(schools){
                    modalScope.schools = schools;
                });

                modalScope.save = function() {
                    plan.title = modalScope.plan.title;
                    plan.details = modalScope.plan.details;
                    plan.school = modalScope.plan.school;
                    plan.tags = modalScope.plan.tags;
                    modalInstance.close();
                };

                modalScope.cancel = function(){
                    modalInstance.close();
                };
            }]
        });
        return modalInstance;
    };
}]);
