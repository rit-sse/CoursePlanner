'use strict';

/**
 * REST endpoints for Plan data
 * @namespace api/plan
 */

var Plan = require('../models/plan');
var User = require('../models/user');
var ensureAuthenticated = require('./user').ensureAuthenticated;

var endpoints = {
    /** 
     * Get all of the logged in user's plans 
     * @function 
     * @memberof api/plan
     * @instance
     */
    getMine: function(req, res) {
        Plan.find({
            user: req.user
        })
        .then(function(plans) {
            res.send(plans);
        })
        .catch(function(err) {
            res.status(500).send(err);
        });
    },

    /** 
     * Get all of the public plans at the user's school
     * @function 
     * @memberof api/plan
     * @instance
     */
    getPublic: function(req, res) {
        User.findById(req.user)
        .then(function(user){
            return Plan.find({
                school: user.school,
                public: true
            })
            .populate('school');
        })
        .then(function(plans) {
            res.json(plans);
        })
        .catch(function(error) {
            res.status(500).send(error || 'Unable to load public plans');
        });
    },

    /** 
     * Send the plan data for the given plan ID (if the user is authorized)
     * @function 
     * @memberof api/plan
     * @param req.query.planId The _id of the plan
     * @instance
     */
    load: function(req, res) {
        Plan.findOne({
            _id: req.query.planId
        })
        .populate('school')
        .then(function(plan) {
            if(!plan) {
                return res.status(500).send('Plan not found');
            }

            if(plan.user.toString() !== req.user.toString()) {
                return res.status(401).send('Not authorized to load this plan');
            }
            
            res.send(plan);

            //Update that the user was editing this plan most recently
            return User.update({
                _id: req.user
            }, {
                lastPlan: plan._id 
            }, {});
        })
        .catch(function(error){
            res.status(500).send(error);  
        });
    },

    /** 
     * Send the plan data for the plan that the user was most recently editing
     * @function 
     * @memberof api/plan
     * @param req.query.planId The _id of the plan
     * @instance
     */
    loadMostRecentPlan: function(req, res) {
        User.findById(req.user)
        .then(function(user){
            req.query.planId = user.lastPlan;
            endpoints.load(req, res);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    },

    /** 
     * Saves plan to db and returns created plan
     * @function save
     * @memberof api/plan
     * @param req.body._id The _id of the plan
     * @param req.body.title New title of the plan
     * @param req.body.years New json object holding the plan data
     * @param req.body.public New public flag value
     * @param req.body.colorscheme New colorscheme data
     * @instance
     */
    save: function(req, res) {
        //If it has an _id, it probably is already in our db
        if(req.body._id){
            return Plan.findOneAndUpdate({
                _id: req.body._id,
                user: req.user //can only save it if it is theirs
            }, {
                title : req.body.title,
                years : req.body.years,
                public: req.body.public,
                details: req.body.details,
                tags: req.body.tags,
                school: req.body.school,
                colorscheme: req.body.colorscheme
            }, {
                new: true //return the updated object
            })
            .populate('school')
            .then(function(plan) {
                res.send(plan);
            })
            .catch(function(err){
                return res.status(500).send(err);
            });
        }

        User.findById(req.user)
        .then(function(user){
            return Plan.create({
                title  : req.body.title,
                years  : req.body.years,
                public : req.body.public,
                school : req.body.school,
                colorscheme: req.body.colorscheme,
                user   : user._id
            });
        })
        .then(function(plan) {
            res.json(plan);
        })
        .catch(function(err) {
            res.status(500).send(err || 'An error occurred saving the plan');
        });
    },

    /** 
     * Makes given plan private
     * @function
     * @memberof api/plan
     * @instance
     */
    makePrivate: function(req, res) {
        helpers.setPublic(req, res, false);
    },

    /**
     * Makes given plan public
     * @function 
     * @memberof api/plan
     * @instance
     */
    makePublic: function(req, res) {
        helpers.setPublic(req, res, true);
    }
};

var helpers = {
    setPublic: function(req, res, newPublicValue) {
        if(req.body._id) {
            return Plan.findOneAndUpdate({
                _id: req.body._id,
                user: req.user
            }, {
                public: newPublicValue
            }, {
                new: true //return the updated object
            })
            .populate('school')
            .then(function(plan) {
                res.send(plan);
            })
            .catch(function(err){
                res.status(500).send(err);
            });
        }

        res.status(500).send('No Plan id provided');
    }
};

var init = function(router) {
    //Mounted on '/api/plan'
    router.get('/getMine', ensureAuthenticated, endpoints.getMine);
    router.get('/getPublic', ensureAuthenticated, endpoints.getPublic);
    router.get('/load', ensureAuthenticated, endpoints.load);
    router.get('/loadMostRecentPlan', ensureAuthenticated, endpoints.loadMostRecentPlan);
    router.post('/save', ensureAuthenticated, endpoints.save);
    router.post('/makePrivate', ensureAuthenticated, endpoints.makePrivate);
    router.post('/makePublic', ensureAuthenticated, endpoints.makePublic);
};

module.exports = {
    init: init
};
