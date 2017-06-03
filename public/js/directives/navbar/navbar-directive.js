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
    'LoginModal',
    'NotificationService'
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
    'notificationService',
    function($http, planService, openPlanModal, editColorschemeModal, editProfileModal, helpModal, authService, Notification, loginModal, notificationService) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'js/directives/navbar/navbar-directive.html',
            scope: {
                user: '='
            },
            link: function(scope) {
                scope.isAuthenticated = authService.isAuthenticated;

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

                scope.downloadPlan = planService.downloadPlan;

                scope.uploadPlan = planService.uploadPlan;

                scope.editColorscheme = function() {
                    editColorschemeModal.open(planService.plan.colorscheme);
                };

                scope.editProfile = editProfileModal.open;

                //Handle an icon indicator of if the plan has been changed
                var originalPlan = JSON.parse(JSON.stringify(planService.plan));
                scope.planSaved = function() {
                    //If there's nothing, nothing to save!
                    if(!originalPlan){
                        return true;
                    }

                    //If it has no id, plan not saved
                    if(!originalPlan._id){
                        return false;
                    }

                    //If they're not equal, a change was made
                    if(!angular.equals(originalPlan, planService.plan)){
                        return false;
                    }

                    //If nothing else said no, guess we saved it!
                    return true;
                };

                //When the plan is changed - specifically if it is saved, loaded, etc
                //update our original plan
                notificationService.on('plan-changed', function(){
                    originalPlan = JSON.parse(JSON.stringify(planService.plan));
                });
            }
        };
    }]);

