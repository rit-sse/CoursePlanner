'use strict';

angular.module('LoginModal', ['ui.bootstrap', 'AuthService'])

.service('loginModal', ['$uibModal', 'authService', function($uibModal, authService) {
    var self = this;

    self.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/login/login-modal.html',
            animation: false,
            backdrop: false,
            size: 'sm',
            controller: ['$scope', function(modalScope) {
                modalScope.signup = function(){
                    authService.signup(modalScope.email, modalScope.password)
                    .then(function(){
                        modalInstance.close();
                    });
                };
                modalScope.login = function(){
                    authService.login(modalScope.email, modalScope.password)
                    .then(function(){
                        modalInstance.close();
                    });
                };
                modalScope.auth = function(provider){
                    authService.authenticate(provider)
                    .then(function() {
                        modalInstance.close();
                    });
                };
                modalScope.close = function () {
                    modalInstance.close();
                };
                modalScope.invalidForm = function() {
                    return !modalScope.email || !modalScope.password;
                };
            }]
        });
    };
}]);
