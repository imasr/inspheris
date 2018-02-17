'use strict';
angular.module('inspherisProjectApp')
  .controller('UserListCtrl', function ( $scope, $rootScope, apiCommunity, notifyModal) {
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      data: null
    };
    switch($scope.userlistData.type){
      case 'followerList':
      case 'contributorList':
        $scope.md.status = 1;
        if($scope.userlistData.for == 'community'){
          apiCommunity.getCommunityMember({communityUid: $scope.userlistData.uid, mode: $scope.userlistData.type}).then(function(data){
            $scope.md.data = data;
            $scope.md.status = 2;
          }, function(err){
            $scope.md.status = 3;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        }
      break;
      case 'feedLikes':
      case 'feedHashtags':
        $scope.md.status = 2;
      break;
    }
  });