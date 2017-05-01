'use strict';

angular.module('UploadPlanModal', ['ui.bootstrap'])

.service('uploadPlanModal', ['$uibModal', function($uibModal) {
    var self = this;

    self.open = function() {
        var modalInstance = $uibModal.open({
            template:
            '<div id="upload-plan-modal">'+
                '<div class="modal-header"><button type="button" class="close" data-dismiss="upload-plan-modal" ng-click="close()" aria-label="Close"><span aria-hidden="true">&times;</span></button><h3 class="modal-title">Upload Plan</h3></div>'+
                '<div class="modal-body">'+
                    '<input type="file" onchange="angular.element(this).scope().uploadFile(this.files)"/>'+
                '</div>'+
            '</div>',
            animation: false,
            backdrop: false,
            controller: ['$scope', function(modalScope){
                modalScope.close = modalInstance.close;

                modalScope.uploadFile = function(files) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        if(e) {
                            console.log(e);
                        }
                        var text = reader.result;
                        modalInstance.close(JSON.parse(text));
                    };

                    reader.readAsText(files[0]);
                };
            }]
        });
        return modalInstance;
    };
}]);
