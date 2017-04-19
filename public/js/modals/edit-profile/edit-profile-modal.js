'use strict';

angular.module('EditProfileModal', ['ui.bootstrap', 'SchoolService'])

.service('editProfileModal', ['$uibModal', function($uibModal) {
    var self = this;

    self.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/edit-profile/edit-profile-modal.html',
            animation: false,
            backdrop: false,
            size: 'sm',
            controller: ['$scope', 'schoolService', 'authService',
            function(modalScope, schoolService, authService) {
                modalScope.title = 'Profile';
                authService.getUser()
                .then(function(user){
                    modalScope.user = JSON.parse(JSON.stringify(user));
                });

                schoolService.getSchools()
                .then(function(schools){
                    modalScope.schools = schools;
                });

                modalScope.save = function() {
                    authService.updateData(modalScope.user)
                    .then(function(){
                        modalInstance.close();
                    });
                };

                modalScope.cancel = function(){
                    modalInstance.close();
                };
            }]
        });
    };
}]);
