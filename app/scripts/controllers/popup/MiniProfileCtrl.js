'use strict';
angular.module('inspherisProjectApp')
.controller('MiniProfileCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams, apiPeoples){

	$scope.userDetail = {};
	$scope.peopleApi = new apiPeoples();  
	$scope.peopleApi.userProfile({uid: $scope.uidUser}).then(function(data){
         $scope.userDetail = data;
         if(data.speciality){
       	  $scope.userDetail.speciality = data.speciality.replace(/\n/g, '<br/>');
         }
         if(data.hobbies){
       	  $scope.userDetail.hobbies = data.hobbies.replace(/\n/g, '<br/>');
         }
         
         
         $scope.userDetail.userlink = $rootScope.generateLink('userProfilePage',  $scope.userDetail);
         
         if(data.telephone){
        	 $scope.userDetail.telephone = $scope.userDetail.telephone.replace(/\s/g, '');
        	 $scope.userDetail.telephone = $scope.userDetail.telephone.replace(/(.{2})/g, "$1 ");
         }
         if(data.mobilephone){
        	 $scope.userDetail.mobilephone = $scope.userDetail.mobilephone.replace(/\s/g, '');
        	 $scope.userDetail.mobilephone = $scope.userDetail.mobilephone.replace(/(.{2})/g, "$1 ");
         }
         if($scope.userDetail.firstName && $scope.userDetail.lastName){
        	 $scope.userDetail.initials = ($scope.userDetail.firstName.charAt(0) +""+$scope.userDetail.lastName.charAt(0)).toUpperCase();
           }
       }, function(err){
         //notifyModal.showTranslated("something_went_wrong", 'error', null);
       });
 });