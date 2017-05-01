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

    //Create an account using email and password
    var signup = function(email, password){
        return $auth.signup({ email: email, password: password })
        .then(function(response){
            //Success! Registered with email/password
            // TODO Redirect user here to login page or perhaps some other intermediate page
            // that requires email address verification before any other part of the site
            // can be accessed.
            Notification.success('Register success');
            return login(email, password);
        }, function(response){
            //Failure. Something went wrong
            Notification.error(response.data.message);
        });
    };

    //For login via email aka local login
    var login = function(email, password){
        return $auth.login({ email: email, password: password })
        .then(function(response){
            //Success! Logged in with email/password
            Notification.success('Logged in');
            user = response.data.user;
            return user;
        }, function(response){
            //Failure. Something went wrong
            Notification.error(response.data.message);
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
        login: login,
        signup: signup,
        logout: logout,
        isAuthenticated: $auth.isAuthenticated,
        getUser: function () { return user; },
        updateData: updateData
    };
}]);
