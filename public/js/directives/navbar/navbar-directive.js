'use strict';

angular.module('NavbarDirective',[
    'ui.bootstrap', 
    'ui-notification',
    'PlanService', 
    'AuthService', 
    'SchoolService', 
    'OpenPlanModalService',
    'EditColorschemeModal',
    'EditProfileModal',
    'HelpModal',
    'LoginModal'
])

.directive('navbar', [
    '$http', 
    'planService', 
    'openPlanModal', 
    'editColorschemeModal',
    'editProfileModal',
    'helpModal',
    'authService',
    'Notification',
    'loginModal',
    function($http, planService, openPlanModal, editColorschemeModal, editProfileModal, helpModal, authService, Notification, loginModal) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'js/directives/navbar/navbar-directive.html',
            link: function(scope) {
                scope.isAuthenticated = authService.isAuthenticated;

                scope.getAuthedUser = authService.getUser;

                scope.logout = function() {
                    //Clear current plan, log em out, and boot em!
                    planService.makeNew();
                    authService.logout();
                };

                scope.login = loginModal.open;

                scope.togglePublic = function() {
                    planService.setPublic(!planService.plan.public)
                    .then(function(){
                        Notification.primary('Plan marked as public');
                    }, function(error){
                        Notification.error(error || 'Error changing plan visibility');
                    });
                };

                scope.isPublic = function() {
                    return planService.plan.public;
                };

                scope.newPlan = planService.makeNew;

                scope.savePlan = function() {
                    planService.save()
                    .then(function(){
                        Notification.primary('Plan Saved');
                    }, function(error){
                        Notification.error(error || 'Error Saving Plan');
                    });
                };

                //Let user open one of their own plans
                scope.openPlan = function() {
                    planService.getMine()
                    .then(function(plans) {
                        openPlanModal.open('Open Plan', plans, function(plan) {
                            if(!plan) {
                                Notification.error('You need to select a plan to load first');
                            }
                            return planService.load(plan);
                        });
                    });
                };

                scope.help = function() {
                    helpModal.open();
                };

                //Open a modal that lets users browse and open public plans
                scope.viewPublicPlans = function() {
                    planService.getPublic()
                    .then(function(plans) {
                        openPlanModal.open('Browse Public Plans', plans, function(plan) {
                            if(!plan) {
                                return console.log('No plan given to load');
                            }

                            return planService.copyPublicPlan(plan);
                        });
                    });
                };

                scope.downloadPlan = planService.downloadPlan;

                scope.uploadPlan = planService.uploadPlan;

                scope.editColorscheme = function() {
                    editColorschemeModal.open(planService.plan.colorscheme);
                };

                scope.editProfile = editProfileModal.open;
            }
        };
    }]);

