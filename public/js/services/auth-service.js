'use strict';

//Wrapper for satellizer
//Basically only exists so we have somewhere to keep the user data
angular.module('AuthService', ['satellizer', 'ui-notification', 'LocalStorageModule', 'NotificationService'])

.service('authService', ['$auth', '$http', '$q', 'Notification', 'localStorageService', 'notificationService',
function($auth, $http, $q, Notification, localStorageService, notificationService) {

    var user;

    var authenticate = function(provider){
        return $auth.authenticate(provider)
        .then(function(response){
            //Success! Logged in with provider
            Notification.success('Logged in');
            setUser(response.data.user);
            return user;
        }, function(response){
            //Failure. Something went wrong
            Notification.error(response.message);
        });
    };

    //Create an account using email and password
    var signup = function(email, password){
        return $auth.signup({ email: email, password: password })
        .then(function(){
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
        delUser();
        Notification.primary('Logged out');
    };

    var updateData = function(userData) {
        return $http.post('/api/user/update', userData)
        .then(function(response){
            Notification.success('Update Completed');
            setUser(response.data);
            return user;
        }, function(response){
            Notification.error(response.message);
        });
    };


    function setUser(user){
        user = user;
        localStorageService.set('user', user);
        notificationService.notify('user-changed', user);
    }

    function getUser(){
        //If not authed, reject 
        if(!$auth.isAuthenticated()){
            return $q.reject();
        }

        //If authed and user not set, get out of local storage
        if(!user){
            user = localStorageService.get('user', user);

            //If we tried to get it out of local storage and it is still null,
            //  get data from server
            if(!user){
                return $http.get('/api/user/getCurrentUser')
                .then(function(response){
                    setUser(response.data);
                    return user;
                }, function(response){
                    //Something went wrong
                    Notification.error(response.message);
                });
            }
        }
        
        return $q.when(user);
    }

    function delUser(){
        user = null;
        localStorageService.remove('user');
        notificationService.notify('user-changed', null);
    }

    return {
        authenticate: authenticate,
        login: login,
        signup: signup,
        logout: logout,
        isAuthenticated: $auth.isAuthenticated,
        getUser: getUser,
        updateData: updateData
    };
}]);
