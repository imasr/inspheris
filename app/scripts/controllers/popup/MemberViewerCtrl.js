'use strict';
angular.module('inspherisProjectApp')
  .controller('MemberViewerCtrl', function ( $scope, $rootScope, apiCommunity, apiFeedData, notifyModal) {
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      data: [],
      popupTitle: '',
      noDataMessage: '',
      itemsPerPage: 50,
      showViewMoreBtn : false,
      pageNumber: 0,
      popupCss: {
        "min-height": "200px",
        "max-height": (window.innerHeight-150)+"px",
        "overflow-x": "hidden",
        "overflow-y": "scroll",
        'padding': '10px 0px'
      }
    };
    if($scope.$parent.ngDialogData){
      //if we are shoing popup then this will initialize the data
      $scope.userlistData = $scope.$parent.ngDialogData;
    }
    $scope.fetchCommunityMembers = function(msg){
      $scope.md.status = (msg == 'initial') ? 1 : $scope.md.status;
      apiCommunity.getCommunityMember({communityUid: $scope.userlistData.uid, mode: $scope.userlistData.type, itemsPerPage: $scope.md.itemsPerPage, page: ++$scope.md.pageNumber}).then(function(data){
              $scope.md.data = $scope.md.data.concat(data);
              $scope.md.showViewMoreBtn = ($scope.md.data.length == ($scope.md.pageNumber * $scope.md.itemsPerPage)) ? true : false;
              $scope.md.status = (msg == 'initial') ? 2 : $scope.md.status;
            }, function(err){
              $scope.md.status = (msg == 'initial') ? 3 : $scope.md.status;
              notifyModal.showTranslated('something_went_wrong', 'error', null);
            });
    };

    $scope.fetchFeedLikesMembers = function(msg){
      $scope.md.status = (msg == 'initial') ? 1 : $scope.md.status;
      var param = {itemsPerPage: $scope.md.itemsPerPage, page: ++$scope.md.pageNumber};
      if($scope.userlistData.type == "feedLikes"){
        param.content = $scope.userlistData.uid;
      }
      else if($scope.userlistData.type == "commentLikes"){
        param.comment = $scope.userlistData.uid;
      }else if($scope.userlistData.type == "followerQuickpostLikes"){
        param.followerQuickpostUid = $scope.userlistData.uid;
      }else if($scope.userlistData.type == "userPinnedPostLikes"){
    	  param.userPinnedPostId = $scope.userlistData.uid;
      }

      apiFeedData.getLikes(param).then(function(data){
              $scope.md.data = $scope.md.data.concat(data);
              $scope.md.showViewMoreBtn = ($scope.md.data.length == ($scope.md.pageNumber * $scope.md.itemsPerPage)) ? true : false;
              $scope.md.status = (msg == 'initial') ? 2 : $scope.md.status;
            }, function(err){
              $scope.md.status = (msg == 'initial') ? 3 : $scope.md.status;
              notifyModal.showTranslated('something_went_wrong', 'error', null);
            });
    };    
      
    switch($scope.userlistData.type){
      case 'followerList':
      case 'contributorList':
        $scope.md.popupTitle = ($scope.userlistData.type == 'contributorList') ? 'Contributors' : 'Followers';
        $scope.md.noDataMessage = ($scope.userlistData.type == 'contributorList') ? 'No contributors found' : 'No followers found';
        if($scope.userlistData.for == 'community'){
          $scope.fetchCommunityMembers('initial');
        }
      break;
      case 'feedLikes':
      case 'commentLikes':
      case 'followerQuickpostLikes':
      case 'userPinnedPostLikes':
        $scope.md.popupTitle = "Member who liked";
        $scope.md.noDataMessage = "No_Results_found";
        $scope.fetchFeedLikesMembers("initial");
      break;
      case 'feedHashtags':
        $scope.md.status = 2;
      break;
    }

    $scope.viewMoreMembers = function(){
      switch($scope.userlistData.type){
        case 'followerList':
        case 'contributorList':
          $scope.fetchCommunityMembers("viewmore");
        break;
        case 'feedLikes':
        case 'followerQuickpostLikes':	
        case 'userPinnedPostLikes':
          $scope.fetchFeedLikesMembers("viewmore");
        break;
      }
    };
    
    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
      if($scope.$parent.ngDialogData){
        $scope.closeThisDialog({flag: 'cancel', data: null});
      }
    });
  });