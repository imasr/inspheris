'use strict';
angular.module('inspherisProjectApp')
  .controller('DocumentViewerCtrl', function ($scope, $rootScope, $compile, notifyModal, documentViewerModal) {
   
    //get array of documents passed from parent scope
    $scope.documents = $scope.$parent.ngDialogData;

    $scope.closeModal = function(){
      documentViewerModal.hide();
    };
  });