angular.module('NavbarDirective',[
    'ui.bootstrap', 
    'PlanService', 
    'AuthService', 
    'SchoolService', 
    'OpenPlanModalService',
    'EditColorschemeModal',
    'HelpModal'
])

.directive('navbar', [
    '$http', 
    '$uibModal', 
    'planService', 
    'openPlanModal', 
    'editColorschemeModal',
    'helpModal',
    '$auth',
    function($http, $uibModal, planService, openPlanModal, editColorschemeModal, helpModal, $auth) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'js/directives/navbar/navbar-directive.html',
            link: function(scope) {
                scope.isAuthenticated = $auth.isAuthenticated;

                scope.getAuthedUser = function(){
                    return {};
                };

                scope.logout = function() {
                    //Clear current plan, log em out, and boot em!
                    planService.makeNew();
                    $auth.logout();
                };

                scope.login = function() {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'js/directives/navbar/navbar-login-modal.html',
                        animation: false,
                        backdrop: false,
                        size: 'sm',
                        controller: ['$scope', '$auth', function(modalScope, $auth) {
                            modalScope.authenticate = $auth.authenticate;

                            modalScope.cancel = function(){
                                modalInstance.close();
                            };
                        }]
                    });
                };

                scope.register = function() {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'js/directives/navbar/navbar-register-modal.html',
                        animation: false,
                        backdrop: false,
                        size: 'sm',
                        controller: ['$scope', 'schoolService', function(modalScope, schoolService) {
                            modalScope.user = {};

                            schoolService.getSchools()
                                .then(function(schools) {
                                    modalScope.schools = schools;
                                });

                            modalScope.register = function(){
                                //TODO
                            };

                            modalScope.cancel = function(){
                                modalInstance.close();
                            };
                        }]
                    });
                };

                scope.togglePublic = function() {
                    planService.setPublic(!planService.plan.public);
                };

                scope.isPublic = function() {
                    return planService.plan.public;
                };

                scope.newPlan = planService.makeNew;

                scope.savePlan = planService.save;

                //Let user open one of their own plans
                scope.openPlan = function() {
                    planService.getMine()
                    .then(function(plans) {
                        openPlanModal.open('Open Plan', plans, function(plan) {
                            if(!plan) {
                                return console.log('No plan given to load');
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

                scope.download = planService.downloadPDF;

                scope.editColorscheme = function() {
                    editColorschemeModal.open(planService.plan.colorscheme);
                };
            }
        };
    }]);

