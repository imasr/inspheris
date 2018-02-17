'use strict';
angular.module('inspherisProjectApp')
.controller('ParticipantCtrl', function ($scope, $rootScope,apiEvent){
	 $scope.modalData = $scope.$parent.ngDialogData.data;
	 var eventUid = $scope.modalData.eventUid;
	 var status = $scope.modalData.status;
	 apiEvent.getAllParticipantsOfEvent({eventUid : eventUid,status : status}).then(function(data){
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
 