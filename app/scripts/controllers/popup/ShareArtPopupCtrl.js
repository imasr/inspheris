'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('ShareArtPopupCtrl', function ($scope, $rootScope,$state, ngDialog, notifyModal, shareFeedModal, apiFeedData, apiCommunity,uiModals,$filter) {
    
    $scope.apiFeeds = apiFeedData;
    $scope.selectedCommUids = [];
    $scope.communitiesData = [];
    $scope.shareAction = "share";
    $scope.feed = $scope.$parent.ngDialogData;
    
    $scope.closeSharePopup = function(sdata){
      $scope.closeThisDialog({flag: 'ok', data: sdata});
    };

    apiCommunity.getCommunitiesData(null).then(function (data){
        $scope.communitiesData = data;
    }, function(err){
      //error
    });

    $scope.shareDone = function(){
      var errorData = {
        flag: false,
        message: ''
      };

      if($scope.selectedCommUids.length <= 0){
        errorData.flag = true;
        errorData.message = "Select community first.";
      }

      var postData = {
        action : $scope.shareAction,
        communityUids : $scope.selectedCommUids,
        contentUid : $scope.feed.uid
      };

      if(!errorData.flag){
        apiFeedData.shareArticle(postData).then(function(data){
        	if(typeof(data.code) != 'undefined' && data.code != null){
        		var message= $filter('translate')(data.message);
        		var title = $filter('translate')('Error');
        		uiModals.alertModal(null,title, message);
        	}else{
        		notifyModal.show("Shared successhully", "success");
                $scope.closeSharePopup(data);
                $state.reload();
        	}    
        }, function(err){
          notifyModal.show("Share Failed", "error");
        });
      }
      else{
        notifyModal.show(errorData.message, "error");
      }
    };

    $scope.communitySelected = function(comm){
      var idx = $scope.selectedCommUids.indexOf(comm.uid);
      if(idx > -1){
        //already selected remove it
        $scope.selectedCommUids.splice(idx, 1);
      }
      else{
        //not selected add in selected list
       $scope.selectedCommUids.push(comm.uid); 
      }
    };
    
    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
      $scope.closeThisDialog({flag: 'cancel', data: null});
    });
  });