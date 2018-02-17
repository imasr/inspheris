'use strict';

angular.module('inspherisProjectApp')
  .controller('RequestCommunityCtrl', function ($scope, $http, $filter, Config,requestCommunityModal, notifyModal, apiCommunity) {

  	$scope.title = "";
  	$scope.description = "";
  	$scope.reason = "";
  	$scope.isPublishing = false;

	
	$scope.submit = function(){
		var postData = {};
		var errorData = {
			flag: false,
			message: ''
		};
		if(!$filter('isValidName')($scope.title)){
			errorData.flag = true;
			errorData.message = 'Enter valid title';
		}
		else{
			postData.label = $scope.title;
		}
		if(!$filter('isBlankString')($scope.description)){
			postData.description = $scope.description;
		}
		if(!$filter('isBlankString')($scope.reason)){
			postData.reason = $scope.reason;
		}
		if(!$scope.isPublishing){
			if(!errorData.flag){
				$scope.isPublishing = true;
				apiCommunity.request(postData).then(function(data){
					notifyModal.show('A request community submited successfully.', 'success');
					$scope.closeThisDialog({flag: 'ok', data: data})
				}, function(err){
					$scope.isPublishing = false;
				});
			}
			else{
				notifyModal.showTranslated(errorData.message, 'error', null);
			}
		}
	};
  });