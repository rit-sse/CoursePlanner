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

//Configure the base url if necessary
.config(['$httpProvider', 'URL_BASE', function($httpProvider, URL_BASE) {
    $httpProvider.interceptors.push(function(){
        return {
            request: function(config){
                //Check if this is a call to our api
                if(config.url.indexOf('/api') === 0) {
                    //If it is, put the url base in front of any api calls
                    //i.e. in our prod server right now our app is mounted on
                    //sseprod.se.rit.edu/courseplanner
                    //so if the config.url is only /api/plan/getMine
                    //we need to change it to /courseplanner/api/plan/getMine
                    //If it is a dev environment, URL_BASE can be the empty string
                    config.url = URL_BASE + config.url;
                }
                return config;
            }
        };
    });
}])


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

