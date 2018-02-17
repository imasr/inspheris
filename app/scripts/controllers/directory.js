'use strict';

angular.module('inspherisProjectApp')
  .controller('DirectoryCtrl', function ($scope, $http, Config) {
	
	$scope.activeView = 'list';
	$http.get('/api/organization/directory').then(function onSuccess(response) {
		var data = response.data;
		$scope.organizations = data;
	});
	$scope.toggleView = function(view){
		$scope.activeView = view;
  };
})


.controller('OrganizationalCtrl', function ($scope, $http, Config,apiOrganization,notifyModal) {
	
	//$scope.activeView = 'list';
	$scope.enableOrgChartConfig = true;
	apiOrganization.getDirectoryByOrgChart().then(function(data){
		if(typeof(data.code) != 'undefined' && data.code != null){
			$scope.enableOrgChartConfig = false;
    	}else{
    		$scope.organizations = data;
    	}
	}, function(err){
		notifyModal.showTranslated('something_went_wrong', 'error', null);
	});
});
