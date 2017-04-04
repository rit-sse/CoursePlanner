'use strict';

angular.module('CourseDirective', ['ui.bootstrap', 'labeled-inputs', 'PlanService'])

.directive('course', ['$uibModal', 'planService', function($uibModal, planService) {
    return {
        restrict:'E',
        templateUrl: 'js/directives/course/course-directive.html',
        scope: {
            colorscheme: '=',
            course: '=',
            deleteCourse: '=delete',
            readonly: '='
        },
        link: function(scope, element) {
            if(scope.readonly === true) {
                return; //If readonly, don't allow double click
            }

            //TODO move this to somewhere more efficient
            planService.updateColors();

            element.on('dblclick',function() {
                //If this modal is someday needed somewhere else, abstract this to a modal service
                //and call courseEditModal.open(course);
                //(or something like that idfk)
                var modalInstance = $uibModal.open({
                    templateUrl: 'js/directives/course/course-edit-modal.html',
                    animation: false,
                    backdrop: false,
                    size: 'sm',
                    controller: ['$scope', function(modalScope) {
                        //Dynamically disable tabbing to the color picker
                        //NOTE: THIS IS A BAD THING TO DO
                        //setTimeout is a HACK
                        //However, I don't have a better/easier way to do this
                        //If this causes problems in the future, I apologize
                        setTimeout(function(){
                            var colorPickerTags = document.getElementsByName('dept-color');
                            colorPickerTags.forEach(function(tag){
                                tag.tabIndex = -1;
                            }); 
                        }, 100);

                        modalScope.c = JSON.parse(JSON.stringify(scope.course)); //clone object so it doesnt bind

                        //This variable helps us be a bit sneaky
                        //So here is the scoop:
                        //When the user creates a new course, if that course has a
                        //new dept (i.e. we dont have a color picked out for it yet)
                        //we want to pre-load that department code with a new neat color,
                        //right?
                        //Also, if the user types in an existing dept code, we want to load the 
                        //existing color, right?
                        //Well, what if the user has already picked out their sweet new color,
                        //but then we change it on them? That would be rude, wouldn't it?
                        //So here we save the color upon opening the modal - we know the user
                        //hasn't changed it yet. Then, as the user types a new department code,
                        //we update this color if WE change the color. If the user winds up
                        //changing the color, it will be different and we keep their decision -
                        //i.e. we do not override their color choice.
                        var colorThatTheUserDidntChange = scope.colorscheme[scope.course.dept];

                        modalScope.deptColor = scope.colorscheme[scope.course.dept];

                        modalScope.$watch('c.dept', function(newVal, oldVal){
                            if(newVal === oldVal) {
                                return;
                            }

                            //If the user hasn't changed the color, set the color to the new dept's color
                            if(modalScope.deptColor === colorThatTheUserDidntChange) {
                                modalScope.deptColor = scope.colorscheme[newVal] || randomColor();                                
                                //Since WE just changed the color, update our variable
                                //so we will still know when the USER picks the color and not us
                                colorThatTheUserDidntChange = modalScope.deptColor;
                            }
                        });

                        modalScope.addPrereq = function(){
                            modalScope.c.prereqs.push({
                                dept: modalScope.prereq.dept,
                                num: modalScope.prereq.num
                            });
                            modalScope.prereq = {}; //clear prereq form
                        };

                        modalScope.removePrereq = function(prereq){
                            var index = modalScope.c.prereqs.indexOf(prereq);
                            modalScope.c.prereqs.splice(index, 1);
                        };

                        modalScope.save = function(){
                            //Copy the properties over
                            for (var property in modalScope.c) {
                                if (modalScope.c.hasOwnProperty(property)) {
                                    scope.course[property] = modalScope.c[property];      
                                }
                            }

                            //Pick a new color if we need to, otherwise set it based on the user's choice
                            scope.colorscheme[scope.course.dept] = modalScope.deptColor;

                            modalInstance.close();
                        };

                        modalScope.delete = function(){
                            scope.deleteCourse(scope.course);
                            modalInstance.close();
                        };

                        modalScope.cancel = function(){
                            modalInstance.close();
                        };
                    }]
                });
            });
        }
    };
}]);
