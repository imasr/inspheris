angular.module('inspherisProjectApp')
  .controller('SidebarMenuController', function ($scope,apiUsefulLinks) {
	  apiUsefulLinks.showSidebarLinks().then(function (data) {
	      $scope.links = data;
	  }, function (err) {
	  });   
  });