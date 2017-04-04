'use strict';

var semesterHandledEnter = false;

angular.module('TextView', [])


.directive('textView', [function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/directives/text-view/text-view.html',
        scope: {
            plan: '='
        },
        link: function(scope, elem){
            elem.bind('keydown keypress', function(event) {
                if(event.which === 13) {
                    event.preventDefault();
                    if(semesterHandledEnter) {
                        console.log('Kid did it');
                        semesterHandledEnter = false;
                        return;
                    }
                    console.log('Year caught this');
                }
            });
        }
    };
}])

.directive('semesterTextView', [function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/directives/text-view/semester-text-view.html',
        scope: {
            semester: '='
        },
        link: function(scope, elem){
            elem.bind('keydown keypress', function(event) {
                if(event.which === 13) {
                    event.preventDefault();
                    semesterHandledEnter = true;
                    scope.semester.classes.push({
                        name: "A New Course",
                        dept: "DEPT",
                        num: "000",
                        credits: 0,
                        prereqs: []
                    });
                    scope.$apply();
                }
            });

            scope.delete = function(course){
                scope.semester.classes.splice(
                    scope.semester.classes.indexOf(course), 1
                );
            };
        }
    };
}]);
