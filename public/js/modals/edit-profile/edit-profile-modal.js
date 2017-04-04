'use strict';

angular.module('EditProfileModal', ['ui.bootstrap'])

.service('editProfileModal', ['$uibModal', function($uibModal) {
    var self = this;

    self.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/edit-profile/edit-profile-modal.html',
            animation: false,
            backdrop: false,
            size: 'sm',
            controller: ['$scope', function(modalScope) {
                modalScope.title = 'Profile';

                modalScope.save = function() {
                    //TODO
                    modalInstance.close();
                };

                modalScope.cancel = function(){
                    modalInstance.close();
                };
            }]
        });
    };
}]);
