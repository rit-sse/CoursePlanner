'use strict';

angular.module('CoursePlanner', [
    'labeled-inputs',
    'cfp.hotkeys',
    'satellizer',
    'ui-notification',
    'ngTagsInput',

    'CoursePlannerRoutes',
    'HomeController',
    'BrowseController',
    'AuthService',

    'NavbarDirective',
    'RegisterDirective',
    'YearsDirective',
    'CourseDirective'
])

//Satellizer config (for authentication)
.config(['$authProvider', 'GOOGLE_CONFIG', function($authProvider, GOOGLE_CONFIG){
    $authProvider.google({
        clientId: GOOGLE_CONFIG.clientId,
        url: '/api/user/google'
    });

    $authProvider.loginUrl = '/api/user/login';
    $authProvider.signupUrl = '/api/user/signup';
}])

.config(['NotificationProvider', function(NotificationProvider){
    NotificationProvider.setOptions({
        positionX: 'right',
        positionY: 'bottom'
    });
}])

.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
})

.run(function(){
    //Prevent browser default keybindings
    //Turning off jshint warnings because this uses jquery
    //Dont use jquery
    /* jshint -W117 */
    $(document).bind('keydown', function(e) {
    /* jshint +W117 */

        //Prevent ctrl+s
        if(e.ctrlKey && (e.which === 83)) {
            e.preventDefault();
        }


        //Prevent ctrl+h
        if(e.ctrlKey && (e.which === 72)) {
            e.preventDefault();
        }
    });
});

