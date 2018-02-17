'use strict';

angular.module('inspherisProjectApp')
  .controller('CreateQuickpostPopupCtrl', function ( $scope, $rootScope, $timeout, notifyModal) {
      
      $scope.modalData = $scope.$parent.ngDialogData;
      $scope.popupTitle = ($scope.modalData.action == "create") ? "Create quickpost" : "Edit_Quickpost";

      var feedAddedEvent = $scope.$on('feed.added', function(event, data) {
        //close this modal if feed added
        $scope.closeThisDialog({flag: 'ok', data: data});
      });
      var feedEditEvent = $scope.$on('feed.edited', function(event, data) {
        //close this modal if feed added
        if(data.type != "quickpost")
        $scope.closeThisDialog({flag: 'ok', data: data});
      });
      $scope.$on("$destroy", function(){
        feedAddedEvent();
        feedEditEvent();
      });
  });