'use strict';
angular.module('inspherisProjectApp')
.controller('VisitorCtrl', function ($scope, $rootScope,apiInteraction){
	 $scope.modalData = $scope.$parent.ngDialogData;	 
	 $scope.visitors = [];
	 
	 $scope.loadData = function(){
		 apiInteraction.getVisitor({date:$scope.modalData.date}).then(function(data){
			 $scope.visitors = data;
	     }, function(err){
	     });
	 }
	 
	 $scope.loadData();
	 

 });
 