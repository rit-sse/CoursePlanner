(function () {
    'use strict';

    //Wrapper for satellizer
    //Basically only exists so we have somewhere to keep the user data
    angular.module('AuthService', ['satellizer'])

        .service('authService', ['$auth', '$http', function($auth, $http) {
        
            var user;

            // On startup, if authed, get the user data
            if($auth.isAuthenticated()){
                $http.get('/api/user/getCurrentUser')
                .then(function(response){
                    user = response.data;
                }, function(response){
                    //Something went wrong
                    console.log(response);
                });
            }

            var authenticate = function(provider){
                return $auth.authenticate(provider)
                .then(function(response){
                    //Success! Logged in with provider
                    console.log(response);
                    user = response.data.user;
                    return user;
                }, function(response){
                    //Failure. Something went wrong
                    console.log(response);
                });
            };

            var logout = function() {
                $auth.logout();
                user = null;
            };

            return {
                authenticate: authenticate,
                logout: logout,
                isAuthenticated: $auth.isAuthenticated,
                getUser: function () { return user; },
            };
        }]);
}());
