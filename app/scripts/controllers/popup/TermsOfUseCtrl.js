'use strict';
angular.module('inspherisProjectApp')
.controller('TermsOfUseCtrl', function ($scope,apiTermsOfUse){
	
	$scope.sign = function(){
		apiTermsOfUse.sign().then(function(data){
			//close popup
			$scope.closeThisDialog({flag: 'cancel', data: null});
        }, function(err){
        });
	};	 
 });
 