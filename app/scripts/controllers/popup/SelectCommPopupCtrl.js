'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('SelectCommPopupCtrl', function ($scope, $rootScope, $compile, $http, Config, selectCommunityModal, apiCommunity, sharedData) {

    $scope.selCommList = [];
    $scope.commSelection = [];

    /*if($scope.$parent.selectedCommunities.length > 0){
      $scope.commSelection = $scope.$parent.selectedCommunities;
    }*/
    
    if(typeof($scope.$parent.ngDialogData) != 'undefined' && typeof($scope.$parent.ngDialogData.comType) != 'undefined'){
    	$scope.commSelection = $scope.$parent.ngDialogData.data;
    }else if(typeof($scope.$parent.ngDialogData) != 'undefined'){
        //ngDialogData containes the array of community uids
        $scope.commSelection = $scope.$parent.ngDialogData;
     }
   

    apiCommunity.getCommunitiesData().then(function (data){
      //$scope.selCommList = data;
    	if(typeof($scope.$parent.ngDialogData.comType)  != 'undefined' && $scope.$parent.ngDialogData.comType == 'private'){
    		 $scope.selCommList = sharedData.getPublicCommunities(data, $rootScope.userData);
    	}else{
    		 $scope.selCommList = sharedData.getUserCommunities(data, $rootScope.userData);
    	}    
    }, function(err){
      //error
    });

    $scope.toggleCommSelection = function(comm){
      /*var idx = $scope.commSelection.indexOf(comm);
      if(idx > -1){
        $scope.commSelection.splice(idx, 1);
      }
      else{
        $scope.commSelection.push(comm);
      }*/
      var len = $scope.commSelection.length;
      var flag = false;
      if(len > 0){
        for(var i=0; i< len; i++){
          if(comm.uid == $scope.commSelection[i].uid){
            $scope.commSelection.splice(i, 1);
            break;
          }
          else if(i == (len-1)){
            $scope.commSelection.push(comm);
          }
        }
      }
      else{
        $scope.commSelection.push(comm);
      }
    };
    $scope.getCheckedStatus = function(comm){
      /*var idx = $scope.commSelection.indexOf(comm);
      if(idx > -1)
        return true;
      else
        return false;*/
      var len = $scope.commSelection.length;
      var flag = false;
      for(var i=0; i< len; i++){
        if(comm.uid == $scope.commSelection[i].uid){
          flag = true;
          break;
        }
      }
      return flag;
    };
    $scope.doneCommunitySelect = function(){
        $scope.$emit("communitiesSelected", $scope.commSelection);
        selectCommunityModal.hide();
    };
    $scope.closeSelectCommPopup = function(){
        //update the shared communilt list in apiCreateAritcle service
        selectCommunityModal.hide();
    };
	 $scope.searchCommunity = function(){
		var query = $scope.searchText;	
		var searchCommunityUrl = '/api/community/list';
        $http({method: 'GET', url: searchCommunityUrl, params: {searchText: query}}).
        then(function onSuccess(response) {
            var data = response.data; 
            $scope.selCommList = sharedData.getUserCommunities(data, $rootScope.userData);
        }, function onError(response) {
        });        
    };
  });