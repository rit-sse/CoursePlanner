//app/api/user.js

(function () {
    'use strict';

    var jwt       = require('jwt-simple');
    var User = require('../models/user');
    var request = require('request');
    var config = require('../../config/config.js');
    var moment = require('moment');


    var init = function(router) {
        router.get('/getCurrentUser', ensureAuthenticated, endpoints.getCurrentUser);
        router.post('/google', endpoints.google);
        router.post('/update', ensureAuthenticated, endpoints.update);
    };

    // Generate JSON web token
    function createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, config.jwt.secret);
    }

    //Middleware to check that user is authed
    function ensureAuthenticated(req, res, next) {
        if (!req.header('Authorization')) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        }
        var token = req.header('Authorization').split(' ')[1];

        var payload = null;
        try {
            payload = jwt.decode(token, config.jwt.secret);
        }
        catch (err) {
            return res.status(401).send({ message: err.message });
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired' });
        }
        req.user = payload.sub;
        next();
    }

    var endpoints = {

        update: function(req, res) {
            User.findOneAndUpdate({
                _id: req.user
            }, {
                school: req.body.school
            }, {
                new: true
            })
            .then(function(newUserData){
                res.send(newUserData);
            })
            .catch(function(error){
                console.log(error);
                res.status(500).send(error);
            });
        },

        getCurrentUser: function(req, res) {
            if(req.user) {
                User.findById(req.user)
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(500).send(error);
                });
            } else {
                res.status(500).send('Well there is no user, but thats really weird that you hit this case');
            }
        },

        //Google login
        google: function(req, res) {
            var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
            var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
            var params = {
                code: req.body.code,
                client_id: req.body.clientId,
                client_secret: config.google.clientSecret,
                redirect_uri: req.body.redirectUri,
                grant_type: 'authorization_code'
            };

            // Step 1. Exchange authorization code for access token.
            request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
                var accessToken = token.access_token;
                var headers = { Authorization: 'Bearer ' + accessToken };

                // Step 2. Retrieve profile information about the current user.
                request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
                    if (profile.error) {
                        return res.status(500).send({message: profile.error.message});
                    }
                    // Step 3a. Link user accounts.
                    if (req.header('Authorization')) {
                        User.findOne({ google: profile.sub }, function(err, existingUser) {
                            if (existingUser) {
                                return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
                            }
                            var token = req.header('Authorization').split(' ')[1];
                            var payload = jwt.decode(token, config.jwt.secret);
                            User.findById(payload.sub, function(err, user) {
                                if (!user) {
                                    return res.status(400).send({ message: 'User not found' });
                                }
                                user.google = profile.sub;
                                user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                                user.displayName = user.displayName || profile.name;
                                user.save(function() {
                                    var token = createJWT(user);
                                    res.send({ token: token, user: user });
                                });
                            });
                        });
                    } else {
                        // Step 3b. Create a new user account or return an existing one.
                        User.findOne({ google: profile.sub }, function(err, existingUser) {
                            if (existingUser) {
                                return res.send({ token: createJWT(existingUser), user: existingUser });
                            }
                            var user = new User();
                            user.google = profile.sub;
                            user.picture = profile.picture.replace('sz=50', 'sz=200');
                            user.displayName = profile.name;
                            user.save(function(err) {
                                if(err){
                                    console.log(err);
                                }
                                var token = createJWT(user);
                                res.send({ token: token, user: user });
                            });
                        });
                    }
                });
            });
        }

    };

    module.exports = {
        init: init,
        ensureAuthenticated: ensureAuthenticated
    };

}());
