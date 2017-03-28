(function () {
    'use strict';

    angular.module('AuthService', [])

        .service('authService', ['$q', '$http', function($q, $http) {
            var LOCAL_TOKEN_KEY = 'CoursePlannerTokenKey';
            var AUTH_USER = 'authUser';
            var isAuthenticated = false;
            var authToken;
            var authUser;

            function loadUserCredentials() {
                var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                var user = JSON.parse(window.localStorage.getItem(AUTH_USER));
                if (token && user) {
                    useCredentials(token, user);
                }
            }

            function storeUserCredentials(token, user) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
                window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
                useCredentials(token, user);
            }

            function useCredentials(token, user) {
                isAuthenticated = true;
                authToken = token;
                authUser = user;

                // Set the token as header for your requests!
                $http.defaults.headers.common.Authorization = authToken;
            }

            function destroyUserCredentials() {
                authToken = undefined;
                isAuthenticated = false;
                authUser = undefined;
                $http.defaults.headers.common.Authorization = undefined;
                window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                window.localStorage.removeItem(AUTH_USER);
            }

            var authenticate = function(provider) {
                return $q(function(resolve, reject) {
                    $auth.authenticate(provider)
                    .then(function(response){
                        //Success! signed in with provider
                        storeUserCredentials(response.data.token, response.data.user);
                        resolve(response.data.msg);
                    })
                    .catch(function(response){
                        //Something went wrong
                        reject({ msg: result.data.msg, fields: result.data.fields });
                    });
                });
            };

            var logout = function() {
                destroyUserCredentials();
            };

            loadUserCredentials();

            return {
                authenticate: authenticate,
                logout: logout,
                authenticatedUser: function () {return authUser;},
                isAuthenticated: function() {return isAuthenticated;},
            };
        }])

        .factory('AuthInterceptor', function ($rootScope, $q) {
            return {
                responseError: function (response) {
                    $rootScope.$broadcast({
                        401: 'Not Authenticated',
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        })

        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        });
}());
