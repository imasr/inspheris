'use strict';

angular.module('inspherisProjectApp')
  .controller('CommunitiesCtrl', function (isAppInitialized, $scope, $rootScope, $http, $state, Config, apiCommunity, apiGroup, requestCommunityModal,createCommunityModal, confirmModal, notifyModal, $timeout) {

    $scope.pageData = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      communities: []
    };
    $scope.selectedGropUid = 'all';
    $scope.activeView = 'grid';
    $scope.requestedCommunities = [];

    $scope.getCommunities = function(param){
      if($scope.selectedGropUid == 'all'){
      	param = ({'viewBy': 'group'});	
      }
      $scope.pageData.status = 1;
      $scope.pageData.communities = [];
      apiCommunity.getCommunitiesData(param).then(function (data){
    	  $scope.communitiesByGroup = data;
          $scope.pageData.communities = data;
          $scope.pageData.status = 2;
      }, function(err){
        $scope.pageData.status = 3;
      });
    };
  
    $scope.getRequestedCommunities = function(){
      apiCommunity.requestedCommunities().then(function (data){
          $scope.requestedCommunities = data;
      }, function(err){
      });
    };
//    $scope.getRequestedCommunities();
    $scope.declineRequestedCommunity = function(rcomObj){
      apiCommunity.declineRequestedCommunity({uid: rcomObj.uid, declined: 'declined'}).then(function(data){
        var len = $scope.requestedCommunities.length;
        for(var i=0; i<len; i++){
          if(rcomObj.uid == $scope.requestedCommunities[i].uid){
            $scope.requestedCommunities.splice(i,1);
            break;
          }
        }
      }, function(err){
        notifyModal.showTranslated("something_went_wrong", 'error', null);
      });
    };
    $scope.acceptRequestedCommunity = function(rcomObj){
      createCommunityModal.show({action: 'create', type: 'requested_community', data: rcomObj});
    };

    $scope.loadCommunityByGroup = function(groupUid){
    $scope.selectedGropUid = groupUid;
    var param = (groupUid == 'all') ? null : ({group: groupUid});
    $scope.getCommunities(param);
	};

	$scope.openRequestCommunityPopup = function(){
    requestCommunityModal.show(null);
  };

  $scope.toggleView = function(view){
    $scope.activeView = view;
  };

  $scope.deleteCommunity = function(uid){
    var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            apiCommunity.delete({'uid': uid}).then(function (data){
                angular.forEach($scope.pageData.communities, function(val, key){
                  if(val.uid == uid){
                    $scope.pageData.communities.splice(key, 1);
                  }
                });
            }, function(err){
              notifyModal.showTranslated('something_went_wrong', 'error', null);
            });
          }//if 'ok'
      });
  };
  
  $scope.loadGroups = function(){
	  apiGroup.getAll({order : true}).then(function(data){
	      $scope.communityGroups = data;
	    }, function(err){
	      notifyModal.showTranslated('something_went_wrong', 'error', null);
	    });
  };
  
  if(isAppInitialized == 'success'){    
    $timeout(function(){
      $scope.getCommunities(null);
    }, 25);
  }//if isAppInitialized

  var commAddedEvent = $scope.$on('community.added', function(event, data) {
      $state.reload();
    });
  var commEditedEvent = $scope.$on('community.edited', function(event, data) {
      var delFeedUid = data;
      apiCommunity.getCommunityByUid({'uid':data.uid}).then(function(data){
        var len = $scope.pageData.communities.length;
        for(var i=0; i<len; i++){
          if(data.uid == $scope.pageData.communities[i].uid){
            $scope.pageData.communities[i] = data;
            break;
          }
        }
      }, function(err){
        notifyModal.showTranslated("something_went_wrong", 'error', null);
      });
    });

  $scope.$on("$destroy", function(){
    //clear all listeners
    commAddedEvent();
    commEditedEvent();
  });

});
