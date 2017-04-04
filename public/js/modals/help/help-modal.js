'use strict';

angular.module('HelpModal', ['ui.bootstrap', 'cfp.hotkeys'])

.service('helpModal', ['$uibModal', 'hotkeys', function($uibModal, hotkeys) {
    var self = this;

    self.open = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/help/help-modal.html',
            animation: false,
            backdrop: false,
            controller: ['$scope', function(modalScope){
                modalScope.close = modalInstance.close;
            }]
        });
    };

    hotkeys.add({
        combo: 'ctrl+h',
        description: 'Open Help',
        callback: function() {
            self.open();
        }
    });
}]);

