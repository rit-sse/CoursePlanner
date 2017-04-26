'use strict';

angular.module('CoursePlannerRoutes', ['ui.router', 'AuthService'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function( $stateProvider,   $urlRouterProvider,   $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        //Define States here
        $stateProvider

            .state('home', {
                url: '/', //The url for the state
                templateUrl: 'views/home.html', //The path to the html template
                controller: 'homeController', //The path to the angular controller
                resolve: {
                    user: function(authService){
                        return authService.getUser()
                        .then(function(user){
                            return user;
                        }, function(){
                            return null;
                        });
                    }
                }
            })

            .state('browse', {
                url: '/browse',
                templateUrl: 'views/browse.html',
                controller: 'browseController',
                resolve: {
                    school: function(authService){
                        return authService.getUser()
                        .then(function(user){
                            return user.school;
                        }, function(){
                            throw 'No user logged in';
                        });
                    },
                    plans: function(planService){
                        return planService.getPublic();
                    },
                    user: function(authService){
                        return authService.getUser()
                        .then(function(user){
                            return user;
                        }, function(){
                            return null;
                        });
                    }
                }
            });
    }]);
