'use strict';

angular.module('inspherisProjectApp')
.controller('YammerEmbedCtrl', function ($scope, $rootScope ,createYammerModal){
	
    $scope.yammerData = $scope.ngDialogData;
	
    $scope.closeCreateYammerPopup = function(){
		
      createYammerModal.hide();
    };
	
	$scope.addYammer = function(_data)
	{	 
		 $rootScope.$broadcast("onAddYammerData" , _data);	
		 $scope.closeCreateYammerPopup();		 
	}
});