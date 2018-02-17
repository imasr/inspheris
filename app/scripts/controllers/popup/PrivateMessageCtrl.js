'use strict';
angular.module('inspherisProjectApp')
.controller('PrivateMessageCtrl', function ($scope, $rootScope, apiPeoples){
	$scope.feed = $scope.$parent.ngDialogData;
	
	$scope.users = [];
	$scope.peopleApi = new apiPeoples();

	$scope.getUserList = function() {
			$scope.peopleApi.getPeoples().then(function(data){
		        $scope.users = data;
		      }, function(err){
		     });
	 }
	
	$scope.getKeywords = function(viewValue) {
        if($scope.keyWordApi){
          $scope.keyWordApi.cancel();
        }
      $scope.keyWordApi = new apiPeoples();
        return $scope.keyWordApi.suggestUser({q: viewValue}).then(function(data) {
          var temp = [];
          angular.forEach(data, function(val){
            temp.push({label: val.firstName + " " + val.lastName,uid:val.uid});
          });
          $scope.users = temp;
          return $scope.users;
        });
    };
    
    $scope.textDetail=[];
    $scope.keyWordSelected = function(item){
       var detail={k:item.uid,v:item.label};
	   $scope.textDetail.push(detail);
      return '@' + item.label;
    };
	
	//$scope.getUserList();
	
	$scope.selectedUsers = [];
	$scope.userSelected = function(user){
	      var idx = $scope.selectedUsers.indexOf(user.uid);
	      if(idx > -1){
	        //already selected remove it
	        $scope.selectedUsers.splice(idx, 1);
	      }
	      else{
	        //not selected add in selected list
	       $scope.selectedUsers.push(user.uid); 
	      }
	    };
 });
 