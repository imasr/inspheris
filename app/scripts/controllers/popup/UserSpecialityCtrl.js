'use strict';
angular.module('inspherisProjectApp')
.controller('CreateUserSpecialityCtrl', function ($scope, $rootScope,$timeout,$filter,$q,$stateParams,notifyModal, uiModals, confirmModal, cropImagesModal, 
		apiUserSpeciality, sharedData, dateTimeService){
	
	$scope.modalData = $scope.$parent.ngDialogData;
	$scope.title = '';
    $scope.image = null;
    $scope.active = true;
    $scope.publishDates = {
    		startDt: null,
    		endDt: null
    };
    
    //get publish start date && publish end date
    $scope.getPublishStartEndDate = function(stDt, endDt){
    	var errorData = {
    			flag: false,
    			message: ''
    	};
	  
    	var publishStartDateTime = null;
    	if(stDt){
    		var stTime = new Date("January 01, 1970 00:00:00");
    		publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
    	}
		 
    	var publishEndDateTime = null;
    	if(endDt){
    		var endTime = new Date("January 01, 1970 00:00:00");
    		publishEndDateTime = dateTimeService.dateTimeToMsec(endDt, endTime);
    	}
	      
    	if(endDt){
    		if(publishEndDateTime <= publishStartDateTime){
    			errorData.flag = true;
    			errorData.message = 'publish_end_date_should_greater_than_start_date';
    		}
    	}
    	return ({startDtTime: publishStartDateTime, endDtTime: publishEndDateTime, error: errorData});
    };
    
	$scope.getImageHeight = function(){
		var h = sharedData.getHeightOfAspectRatio(sharedData.communityImageSize.logo.min.width, sharedData.communityImageSize.logo.min.height);
		return h;
	};
	
	$scope.selectImage = function($files, $event){
		if($files.length > 0){
			if($files[0].size > 5242880){
				var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
				modal.closePromise.then(function (data) {
					if(data.value == 'ok'){
						$scope.uploadImageSelect($files);
					}
				});
	        }else{
	        	$scope.uploadImageSelect($files);
	        }
		}
	};
	
    $scope.uploadImageSelect = function($files){
    	var tempdata = {};
        if($files){
        	tempdata = {
	            action: 'crop',
	            files: $files,
	            cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
	            resize: true
        	}
        }
        var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
        	if(data.value.flag == 'ok'){
        		$scope.image = null;
        		$timeout(function(){
        			$scope.image = data.value.cropdata.data;
        		});
        	}
        });
    };
    
    $scope.recropImage = function(){
    	var tempdata = {};
    	tempdata = {
    			action: 'recrop',
    			image: {
    				uid: $scope.image.uid,
    				url: $scope.image.urls[0]
    			},
    			cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
    			resize: true
    	};
		  
    	var modal = cropImagesModal.show(tempdata);
    	modal.closePromise.then(function (data){
    		if(data.value.flag == 'ok'){
    			$scope.image = null;
    			$timeout(function(){
    				$scope.$apply(function() {
    					//update the bindings on UI
    					$scope.image = angular.copy(data.value.cropdata.data);
    				});
    			},100);
    		}
    	});
    };

    if(($scope.modalData.action == 'edit') && ($scope.modalData.data)){
    	apiUserSpeciality.getById($scope.modalData.data).then(function(data){
    		if(typeof(data.code) != 'undefined' && data.code != null){
    			var message= $filter('translate')(data.message);
    			var title = $filter('translate')('Error');
    			uiModals.alertModal(null,title, message);
    		}else{
    			$scope.title = data.title;
    			$scope.active = data.active;
    			$scope.projectCode = data.projectCode;
    			$scope.description = data.description;
    			$scope.position = data.position;
    			$scope.location = data.location;
				$scope.link = data.link;
				if(data.dateFrom){
					$scope.publishDates.startDt = ($filter('newDate')(data.dateFrom)).getTime();
				}  
   				 
				if(data.dateTo){
   				 	$scope.publishDates.endDt = ($filter('newDate')(data.dateTo)).getTime();
				}   
    			
				if(data.image){  				 	
    				$scope.image = {
						 uid: data.image.uid,
						 urls: [
						        data.image.originalUrl,
						        data.image.url
						        ]
    				};
    			}
    		}
    	}, function(err){
    		notifyModal.showTranslated('something_went_wrong', 'error', null);
    	});
    }
	 
    // save
    $scope.saveSpeciality = function(){
		 var errorData = {
				false: false,
		        message: ''
		 };

		 if($scope.title == ''){
			 errorData.flag = true;
			 errorData.message = 'Enter title';
		 }
			
		 var postdata = {
				 specialityType : $scope.modalData.type,
				 title : $scope.title,
				 active : $scope.active
		 };

		 if($scope.image){
			 if($scope.image.uid){
				 postdata.imageUid = $scope.image.uid;
			 }
		 }
		 
		 var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.endDt);
		 if(publishTiming.error.flag){
			 errorData.flag = true;
			 errorData.message = publishTiming.error.message;
		 }
			
		 if(publishTiming.startDtTime){
			 postdata.dateFrom = publishTiming.startDtTime;
		 }
			
		 if(publishTiming.endDtTime){
			 postdata.dateTo = publishTiming.endDtTime;
		 }
		 
		 var content = {
				 type : $scope.modalData.type,
				 projectCode : $scope.projectCode,
				 description : $scope.description,
				 position : $scope.position,
				 location : $scope.location,
				 link : $scope.link
		 } 
		 postdata.content = content;
		 
		 if (!errorData.flag) {
             var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Save " + $scope.modalData.type + " Confirm"});
             modal.closePromise.then(function (data) {
                 if (data.value == 'ok') {
                     if ($scope.modalData.action == 'create') {
                    	 apiUserSpeciality.create(postdata).then(function (data) {
                    		 if(typeof(data.code) != 'undefined' && data.code != null){
                    			 var message= $filter('translate')(data.message);
                    			 var title = $filter('translate')('Error');
                    			 uiModals.alertModal(null,title, message);
                    		 }else{
	                             $scope.closeThisDialog({flag: 'ok', data: data});
	                             notifyModal.showTranslated($scope.modalData.type + ' Saved Success', 'success', null);    
                    	 	}
                         }, function (err) {
                             notifyModal.showTranslated('something_went_wrong', 'error', null);
                         });
                     } else if ($scope.modalData.action == 'edit') {
                    	 apiUserSpeciality.edit($scope.modalData.data, postdata).then(function (data) {
                    		 if(typeof(data.code) != 'undefined' && data.code != null){
                    			 var message= $filter('translate')(data.message);
                    			 var title = $filter('translate')('Error');
                    			 uiModals.alertModal(null,title, message);
                    		 }else{
	                    		 $scope.closeThisDialog({flag: 'ok', data: data});
	                             notifyModal.showTranslated($scope.modalData.type + ' Edited Success', 'success', null);
                    		 }
                         }, function (err) {
                             notifyModal.showTranslated('something_went_wrong', 'error', null);
                         });
                     }
                 }
             });
         } else {
        	 notifyModal.showTranslated(errorData.message, 'error', null);
         }
	 };
});


