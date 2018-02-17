'use strict';
angular.module('inspherisProjectApp')
.controller('NotificationParticipantCtrl', function ($scope, $rootScope,$filter,uiModals,notifyModal,apiInteraction){
	 $scope.modalData = $scope.$parent.ngDialogData;
	 apiInteraction.getParticipants({date:$scope.modalData.date,action:$scope.modalData.action,eventId:$scope.modalData.eventId}).then(function(data){
 		if(typeof(data.code) != 'undefined' && data.code != null){
 			var message= $filter('translate')(data.message);
       		var title = $filter('translate')('Error');
       		uiModals.alertModal(null,title, message);
 		}else{
 			$scope.participants = data;
 		}
 	}, function(err){
 		notifyModal.showTranslated('something_went_wrong', 'error', null);
 	});
 });
 