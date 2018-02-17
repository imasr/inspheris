'use strict';

angular.module('inspherisProjectApp')
  .controller('LoginCtrl', function ($scope, $http, authService, $rootScope, ngDialog, uiModals) {
	
	$scope.login = function (user) {
		if(user == undefined){
			var modal = uiModals.alertModal($scope, "Warning", 'Please enter username and password.');
			modal.closePromise.then(function (data) {
			});
		}
		else{
			if(user.password == undefined){
				user.password = "";
			}
			if(user.username != undefined || user.password != ""){
				authService.login(user, function(response) {
					authService.setCredentials(user);
				});
			}
		}	
    };
  });
