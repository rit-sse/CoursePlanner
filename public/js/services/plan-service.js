'use strict';

angular.module('PlanService',['NotificationService', 'cfp.hotkeys', 'AuthService', 'UploadPlanModal'])

.service('planService', ['$http', '$q', 'notificationService', 'hotkeys', 'authService', 'uploadPlanModal',
function($http, $q, notificationService, hotkeys, authService, uploadPlanModal) {
    var self = this;

    //Function that replaces whatever is in the workspace
    //with a new plan with default values
    self.makeNew = function(){
        //NOTE that we do NOT set the school yet. 
        //Thus the basic plan info will be defined synchronously,
        //but the school for the plan will be defined asynchronously
        //
        //I say this because it is a bit tricky and someday might lead to an
        //issue if not addressed properly
        self.plan = {
            years: [],
            title: 'Untitled Plan',
            public: false,
            colorscheme: {}
        };

        if(authService.isAuthenticated()){
            return authService.getUser()
            .then(function(user){
                if(user){
                    self.plan.school = user.school;
                    notificationService.notify('plan-changed');
                }
                return self.plan;
            });
        }
    };
    self.makeNew(); //Start with a clean plan no matter what

    //auto load the most recently edited plan
    if(authService.isAuthenticated()){
        $http.get('/api/plan/loadMostRecentPlan')
        .then(function(response){
            if(response.status !== 200) {
                throw 'Response status: ' + response.status;
            }

            if(!response.data || !response.data._id) {
                console.log('Response data for trying to load the most recent plan might be crap');
                console.log(response.data);
            }

            self.plan = response.data;
            notificationService.notify('plan-changed');
        }, function(err){
            console.log('This is probably fine, it just means they havent opened a plan yet. but heres the error anyways:', err);
        });
    }

    self.getMine = function(){
        return $http.get('/api/plan/getMine')
        .then(function(response){
            if(response.status !== 200) {
                throw 'Response status: ' + response.status;
            }
            return response.data;
        }, errorHandler);
    };

    self.getPublic = function(){
        return $http.get('/api/plan/getPublic')
        .then(function(response){
            if(response.status !== 200) {
                throw 'Response status: ' + response.status;
            }
            return response.data;
        }, errorHandler);
    };

    self.load = function(plan) {
        return $http.get('/api/plan/load', { params: { planId: plan._id } })
        .then(function(response){
            self.plan = response.data;
            notificationService.notify('plan-changed');
        }, errorHandler);
    };

    self.copyPublicPlan = function(planToCopy) {
        //TODO probably want to check if their plan wasn't saved
        //before we erase their work here
        return self.makeNew()
        .then(function(){
            self.plan.years = planToCopy.years;
            self.plan.title = 'Copy of ' + planToCopy.title;
            self.plan.colorscheme = planToCopy.colorscheme;
            notificationService.notify('plan-changed');
        });
    };

    self.save = function() {
        self.updateColors();
        return $http.post('/api/plan/save', self.plan)
        .then(function(response){
            self.plan = response.data;
            notificationService.notify('plan-changed');
        }, errorHandler);
    };

    self.setPublic = function(newPublicValue) {
        var url = newPublicValue ? '/api/plan/makePublic' : '/api/plan/makePrivate';

        //TODO check if the plan has an id - if it doesnt, this won't work...
        //how do we handle that? should we save it for them if they set it public?

        return $http.post(url, self.plan)
        .then(function(response){
            self.plan = response.data;
            notificationService.notify('plan-changed');
        }, errorHandler);
    };

    //Adds colors to the colorscheme wherever necessary
    self.updateColors = function() {
        if(!self.plan.colorscheme) {
            self.plan.colorscheme = {};
        }
        //Loop through every course, and if we don't have a color for that dept,
        //create one
        self.plan.years.forEach(function(year){
            year.semesters.forEach(function(semester){
                semester.classes.forEach(function(course){
                    if(!self.plan.colorscheme[course.dept]) {
                        self.plan.colorscheme[course.dept] = randomColor();
                    }
                });
            });
        });
    };

    /**
     *  Lets the user save the json for the plan to their computer
     */
    self.downloadPlan = function() {
        //Strip out any data that might be sensitive or undesirable idfk
        var cleanedPlan = {
            years: self.plan.years,
            title: self.plan.title,
            public: false,
            colorscheme: self.plan.colorscheme
        };
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanedPlan));
        var a = document.createElement('a');
        a.setAttribute("href",     dataStr     );
        a.setAttribute("download", self.plan.title + ".json");
        a.click();
        //TODO do we need to delete that 'a' tag here? Probably not a big deal
    };

    self.uploadPlan = function() {
        uploadPlanModal.open().result.then(function(plan){
            if(plan) {
                self.plan = plan;
                notificationService.notify('plan-changed');
            }
        });
    };

    hotkeys.add({
        combo: 'ctrl+s',
        description: 'Save Plan (If logged in)',
        callback: function() {
            if(authService.isAuthenticated()) {
                self.save();
            }
        }
    });

    function errorHandler(response){
        if(response.status === -1) {
            throw 'No response from server';
        }
        throw response.data; 
    }
}]);
