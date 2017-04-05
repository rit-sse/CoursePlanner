'use strict';

angular.module('SchoolService',[])

.service('schoolService', ['$http', '$q', function($http, $q) {
    var self = this;

    var schools;

    self.getSchools = function(){
        if(schools) {
            return $q.when(schools);
        }

        return $http.get('/api/school/get-schools')
        .then(function(response){
            schools = response.data;
            return schools;
        }, function(response){
            console.log(response);
        });
    };
}]);
