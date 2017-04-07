'use strict';

//Wrapper for satellizer
//Basically only exists so we have somewhere to keep the user data
angular.module('AuthService', ['satellizer', 'ui-notification'])

.service('authService', ['$auth', '$http', 'Notification', function($auth, $http, Notification) {

    var user;

    // On startup, if authed, get the user data
    if($auth.isAuthenticated()){
        $http.get('/api/user/getCurrentUser')
            .then(function(response){
                user = response.data;
            }, function(response){
                //Something went wrong
                Notification.error(response.message);
            });
    }

    var authenticate = function(provider){
        return $auth.authenticate(provider)
            .then(function(response){
                //Success! Logged in with provider
                Notification.success('Logged in');
                user = response.data.user;
                return user;
            }, function(response){
                //Failure. Something went wrong
                Notification.error(response.message);
            });
    };

    var logout = function() {
        $auth.logout();
        user = null;
        Notification.primary('Logged out');
    };

    var updateData = function(userData) {
        return $http.post('/api/user/update', userData)
        .then(function(response){
            Notification.success('Update Completed');
            user = response.data;
            return user;
        }, function(response){
            Notification.error(response.message);
        });
    };

    return {
        authenticate: authenticate,
        logout: logout,
        isAuthenticated: $auth.isAuthenticated,
        getUser: function () { return user; },
        updateData: updateData
    };
}]);
