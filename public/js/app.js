angular.module('CoursePlanner', [
    'labeled-inputs',
    'cfp.hotkeys',
    'satellizer',
    'ui-notification',
    'CoursePlannerRoutes',
    'HomeController',
    'AuthService',

    'NavbarDirective',
    'RegisterDirective',
    'YearsDirective',
    'CourseDirective'
])

//Satellizer config (for authentication)
.config(['$authProvider', 'GOOGLE_CONFIG', function($authProvider, GOOGLE_CONFIG){
    $authProvider.google({
        clientId: GOOGLE_CONFIG.clientId,
        url: '/api/user/google'
    });
}])

.config(['NotificationProvider', function(NotificationProvider){
    NotificationProvider.setOptions({
        positionX: 'right',
        positionY: 'bottom'
    });
}])

//filters by name, dept, dept-num, num, and description
.filter('courseSearch',function() {
    return function(items,query) {
        var filtered = [];
        query = query.toLowerCase();
        //split the query to see if it matches DEPT-NUM form
        var splitQ = query.split(/[\s\-]+/);
        var item,dept,num;
        for(var i = 0; i < items.length; ++i) {
            item = items[i];
            dept = item.dept.toLowerCase();
            num  = item.num.toLowerCase();
            if(~item.name.toLowerCase().indexOf(query))
                filtered.push(item);
            else if(~dept.indexOf(query))
                filtered.push(item);
            else if(~num.indexOf(query))
                filtered.push(item);
            else if(~item.details.toLowerCase().indexOf(query))
                filtered.push(item);
            //check DEPTNUM form
            else if( ~(dept+num).indexOf(query))
                filtered.push(item);
            //check DEPT-NUM form
            else if(splitQ.length === 2 && ~dept.indexOf(splitQ[0]) && ~num.indexOf(splitQ[1]))
                filtered.push(item);
        }

        return filtered;
    };
})

.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
})

.run(function(){
    //Prevent browser default keybindings
    $(document).bind('keydown', function(e) {
        //Prevent ctrl+s
        if(e.ctrlKey && (e.which === 83)) {
            e.preventDefault();
        }


        //Prevent ctrl+h
        if(e.ctrlKey && (e.which === 72)) {
            e.preventDefault();
        }
    });
});

