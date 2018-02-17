'use strict';
angular.module('inspherisProjectApp')
.controller('UserPinnedPostCtrl', function ($state, $q, $scope, $rootScope, $timeout, $filter, $stateParams, notifyModal, uiModals, confirmModal, createUserPinnedPostModal,
		apiPinnedPostOfUser, profilePinDetailsModal, apiFeedData, memberViewerModal) {

	$scope.isCurrentUser = $rootScope.userData.uid == $stateParams.uid ? true : false;
	$scope.showPreBtn = false;
	$scope.showNextBtn = false;
	$scope.page = 1;
	
        if($(window).width()>=992){
            $scope.size = $scope.isCurrentUser ? 3 : 4;
        }
        if($(window).width()<=991 && $(window).width()>=768){
            $scope.size = $scope.isCurrentUser ? 2 : 4;
        }
        if($(window).width()<=767){
            $scope.size = $scope.isCurrentUser ? 1 : 4;
        }
        $scope.countwidth992=true;
        $scope.countwidth991=true;
        $scope.countwidth768=true;
	$(window).resize(function() {
            if($(window).width()>=992){
                $scope.size = $scope.isCurrentUser ? 3 : 4;
                if($scope.countwidth992){
                    $scope.initializeData();
                    $scope.countwidth992=false;
                    $scope.countwidth991=true;
                    $scope.countwidth768=true;
                }
            }
            if($(window).width()<=991 && $(window).width()>=768){
                $scope.size = $scope.isCurrentUser ? 2 : 4;
                if($scope.countwidth991){
                    $scope.initializeData();
                    $scope.countwidth992=true;
                    $scope.countwidth991=false;
                    $scope.countwidth768=true;
                }
            }
            if($(window).width()<=767){
                $scope.size = $scope.isCurrentUser ? 1 : 4;
                if($scope.countwidth768){
                    $scope.initializeData();
                    $scope.countwidth992=true;
                    $scope.countwidth991=true;
                    $scope.countwidth768=false;
                }
            }
            
        });

    $scope.initializeData = function(){
		var deferred = $q.defer();
		//load pinned posts of user
		var pr0 = apiPinnedPostOfUser.getPinnedPostsOfUser({userUid:$stateParams.uid,size: $scope.size});
		$q.all([pr0]).then(function(data){
			if(typeof(data[0].code) != 'undefined' && data[0].code != null){
				var message= $filter('translate')(data[0].message);
        		var title = $filter('translate')('Error');
        		uiModals.alertModal(null,title, message);
			}else{
				$scope.totalItems = data[0].total;
				$scope.pinnedPosts = data[0].rows;
			}
			deferred.resolve("success");
		}, function(err){
			notifyModal.showTranslated('something_went_wrong', 'error', null);
			deferred.resolve("error");
		});
		return deferred.promise;
	};
	 
	$scope.initializeData().then(function(msg){
		if($scope.page*$scope.size < $scope.totalItems){
			$scope.showNextBtn = true;
		}
	}, function(errmsg){

	});
	 
	$scope.getPosts = function () {
		var params = {
				userUid : $stateParams.uid,
				page: $scope.page,
				size: $scope.size
		}
		apiPinnedPostOfUser.getPinnedPostsOfUser(params).then(function (data) {
			if(typeof(data.code) != 'undefined' && data.code != null){
				var message= $filter('translate')(data.message);
        		var title = $filter('translate')('Error');
        		uiModals.alertModal(null,title, message);
			}else{
				$scope.totalItems = data.total;
				$scope.pinnedPosts = data.rows;
			}
        }, function (err) {
            notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
    };   
    
    $scope.onClickNext = function () {
    	$scope.page++;
    	$scope.getPosts();
    	
    	$scope.showPreBtn = true;
    	if($scope.page*$scope.size >= $scope.totalItems){
			$scope.showNextBtn = false;
		}
    };
    
    $scope.onClickPrev = function () {
    	$scope.page--;
    	$scope.getPosts();
    	if($scope.page == 1){
    		$scope.showPreBtn = false;
		}
    	
    	if($scope.page*$scope.size < $scope.totalItems){
			$scope.showNextBtn = true;
		}
    };
    
    //add new
    $scope.addNewPin = function () {
    	var modal = createUserPinnedPostModal.show(null, {action: 'create', type: 'user pinned post', data: null});
		modal.closePromise.then(function (data){
			if(data.value.flag == 'ok'){
				$scope.getPosts();
			}
		});	
    };
    
    //edit
    $scope.editPin = function (pinId) {
        var modal = createUserPinnedPostModal.show(null, {action: 'edit', type: 'user pinned post', data: pinId});
        modal.closePromise.then(function (data) {
            if (data.value.flag == 'ok') {
            	$scope.getPosts();
            }
        });
    };
    
    //copy
    $scope.copyPin = function (pin) {
    	if(pin != null && pin != undefined){
    		if(pin.currentUserPinned){
                notifyModal.showTranslated('This has already pinned before', 'error', null);
    		}else if(pin.sourcePinUser){
                notifyModal.showTranslated('This post was got from your profile', 'error', null);
    		}else {
	    		var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Copy pin confirm"});
	            modal.closePromise.then(function (data) {
	                if (data.value == 'ok') {
	                	apiPinnedPostOfUser.copy(pin.id).then(function (data) {
	                        if (typeof (data.code) != 'undefined' && data.code != null) {
	                            var message = $filter('translate')(data.message);
	                            var title = $filter('translate')('Error');
	                            uiModals.alertModal(null, title, message);
	                        } else {
	                            notifyModal.showTranslated('Copied pin success', 'success', null);
	                            $timeout(function(){
	                        		$scope.$apply(function() {
	                                    $state.reload();
	                        		});
	                        	},100);
	                        }
	                    }, function (err) {
	                   	 	notifyModal.showTranslated("something_went_wrong", 'error', null);
	                    });
	                }
	            });
    		}
    	}
    };
    
    //delete
    $scope.deletePin = function (pinId) {
    	 var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "Delete pin confirm"});
         modal.closePromise.then(function (data) {
             if (data.value == 'ok') {
            	 apiPinnedPostOfUser.deleteById(pinId).then(function (data) {
                     if (typeof (data.code) != 'undefined' && data.code != null) {
                         var message = $filter('translate')(data.message);
                         var title = $filter('translate')('Error');
                         uiModals.alertModal(null, title, message);
                     } else {
                         notifyModal.showTranslated('Deleted pin success', 'success', null);
                         $state.reload();
                     }
                 }, function (err) {
                	 notifyModal.showTranslated("something_went_wrong", 'error', null);
                 });
             }
         });
    };
    
    //#16[V5.5] : Clicking on pinned content: [Image, video]: Open a popup with information
    $scope.showDetails = function (pin) {
    	if(pin && pin.pinType != 'Link'){
    		profilePinDetailsModal.show({pin : pin});
    	}
    }
    
    //#16[V5.5] : like the pinned
    $scope.likePin = function (pin) {
    	var optn = null;
        if(pin.userLikedPost){
        	optn = "DELETE";
        }else{
        	optn = "POST";
        }

        var type = "user pinned post";

        apiFeedData.like(pin.id, optn,type).then(function(data){
        	if (typeof (data.code) != 'undefined' && data.code != null) {
                var message = $filter('translate')(data.message);
                var title = $filter('translate')('Error');
                uiModals.alertModal(null, title, message);
            } else {
            	$timeout(function(){
            		$scope.$apply(function() {
            			if(optn == "POST"){
	        				pin.userLikedPost = true;
	        				pin.likeCount++;
	        				pin.likeUid = data.data.uid;
            			}else if(optn == "DELETE"){
	        				pin.userLikedPost = false;
	        				pin.likeCount--;
            			}
            		});
            	},100);
            }
        }, function(err){
        	notifyModal.showTranslated("something_went_wrong", "error", null);
        });
    };
    
    $scope.showMemberViewer = function(pinId){
    	memberViewerModal.show({"uid": pinId, "for": "feed", type: "userPinnedPostLikes"});
    };
})
.controller('CreateUserPinnedPostCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$q,$stateParams,notifyModal, uiModals, confirmModal, cropImagesModal, 
		embededCodeFromUrl, apiPinnedPostOfUser, sharedData, updateImageOfEmbedLinkModal){
	
	$scope.modalData = $scope.$parent.ngDialogData;
    $scope.pinTypes = [];
    $scope.pinTypeSelected = {value: "Link"};
    
	$scope.linkPreview = 'invalid';
	$scope.linkData = {};
	$scope.description = '';
	$scope.title = '';
	$scope.isValidLink = false;
	$scope.embededCodeFromUrl = null;
    $scope.pinImg = null;
    
    $scope.videoPreview = 'invalid';
    $scope.videoData = {};
    $scope.isValidVideo = false;
	 
    $scope.initializing = true;
    var tempSeartText = '', filterTextTimeout = null;
	var watchYoutubeUrl = $scope.$watch('linkEmbed', function (val) {
		if (filterTextTimeout ||  typeof(val) == 'undefined'){
			//cancel search if text length is zero or search text has changed
			$timeout.cancel(filterTextTimeout);
		}
		tempSeartText = val;
		if($scope.initializing){
			filterTextTimeout = $timeout(function() {
				if(tempSeartText != '' && typeof(tempSeartText) != 'undefined'){  
					if($scope.embededCodeFromUrl){
						//if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
						$scope.embededCodeFromUrl.cancel('cancelled');
					}
					$scope.embededCodeFromUrl = new embededCodeFromUrl();
					$scope.embededCodeFromUrl.getEmbedded(tempSeartText).then(function(data){
						if (data.html && data.thumbnail_url && $scope.pinTypeSelected.value == 'Video') {
                            $scope.videoPreview = data.html;
                            $scope.videoData = {
                                embedVideo: data.html,
                                embedVideoTitle: data.title,
                                thumbUrl: data.thumbnail_url,
                                url : data.url,
                                description : data.description
                            };
                            $scope.isValidVideo = true;      
                        }else if(data.type == 'link' && $scope.pinTypeSelected.value == 'Link'){		        	
							var image = new Image();
							image.src = data.provider_url + "/favicon.ico";
							var faviconUrl = '';
							if(image.width > 0 && image.height > 0){
								faviconUrl = data.provider_url + "/favicon.ico";
							}
			        	 
							$scope.isValidLink = true;  
							$scope.linkPreview = 'valid';
							$scope.linkData = {
			        			 location : data.provider_url,
			        			 description : data.description,
			        			 title : data.title,
			        			 thumbnail_width : data.thumbnail_width,
			        			 path : data.url,
			        			 thumbnail_url : data.thumbnail_url,
			        			 version : data.version,
			        			 subTitle : data.provider_name,
			        			 type : data.type,
			        			 thumbnail_height : data.thumbnail_height,
			        			 favicon :  faviconUrl
							}		        	 
						}else{
							notifyModal.showTranslated("Invalid link", 'error', null);
						}
					}, function(err){
						//error
						$scope.linkPreview = 'invalid';
						notifyModal.showTranslated("invalid_url_or_enable_cross_origin_acess", 'error', null);	
					});
				}else{
					//cancel if search text length is less than zero
					if($scope.embededCodeFromUrl){
						$scope.embededCodeFromUrl.cancel();
					}
				}
			}, 500);
		}
	});
	
	$scope.$on("$destroy", function(){
		if($scope.embededCodeFromUrl){
			$scope.embededCodeFromUrl.cancel();
		}
		watchYoutubeUrl();
	});
	
	$scope.updateLink = function(){
		if($scope.modalData.action == 'edit' && ($scope.pinTypeSelected.value == "Link" || $scope.pinTypeSelected.value == "Video")){
			$scope.initializing = true;
		}
	};
	
	$scope.getPinImgHeight = function(){
		var h = sharedData.getHeightOfAspectRatio(sharedData.communityImageSize.logo.min.width, sharedData.communityImageSize.logo.min.height);
		return h;
	};
	
	$scope.pinImageSelect = function($files, $event){
		if($files.length > 0){
			if($files[0].size > 5242880){
				var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
				modal.closePromise.then(function (data) {
					if(data.value == 'ok'){
						$scope.uploadPinImageSelect($files);
					}
				});
	        }else{
	        	$scope.uploadPinImageSelect($files);
	        }
		}
	};
	
    $scope.uploadPinImageSelect = function($files){
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
        		$scope.pinImg = null;
        		$timeout(function(){
        			$scope.pinImg = data.value.cropdata.data;
        		});
        	}
        });
    };
    
    $scope.recropPinImage = function(){
    	var tempdata = {};
    	tempdata = {
    			action: 'recrop',
    			image: {
    				uid: $scope.pinImg.uid,
    				url: $scope.pinImg.urls[0]
    			},
    			cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
    			resize: true
    	};
		  
    	var modal = cropImagesModal.show(tempdata);
    	modal.closePromise.then(function (data){
    		if(data.value.flag == 'ok'){
    			$scope.pinImg = null;
    			$timeout(function(){
    				$scope.$apply(function() {
    					//update the bindings on UI
    					$scope.pinImg = angular.copy(data.value.cropdata.data);
    				});
    			},100);
    		}
    	});
    };
    
	$scope.initializeData = function(){
		var deferred = $q.defer();
		var pr0 = apiPinnedPostOfUser.getPinTypes();
		$q.all([pr0]).then(function(data){
			//for data[0]
			angular.forEach(data[0], function (val, key) {
				$scope.pinTypes.push({
					value: val
				});
			});
			deferred.resolve("success");
		}, function(err){
			notifyModal.showTranslated('something_went_wrong', 'error', null);
			deferred.resolve("error");
		});
		return deferred.promise;
	};
	 
	 $scope.initializeData().then(function(msg){
		 if(($scope.modalData.action == 'edit') && ($scope.modalData.data)){
			 apiPinnedPostOfUser.getById($scope.modalData.data).then(function(data){
				 if(typeof(data.code) != 'undefined' && data.code != null){
        			 var message= $filter('translate')(data.message);
        			 var title = $filter('translate')('Error');
        			 uiModals.alertModal(null,title, message);
        		 }else{
        			 $scope.pinTypeSelected = {value: data.pinType};
        			 if(data.pinType == 'Link'){
        				 $scope.initializing = false;
        				 $scope.linkEmbed = data.link.path;
        				 $scope.linkPreview = 'valid';
        				 $scope.linkData = data.link;
        			 }else if(data.pinType == 'Text'){
        				 $scope.description = data.description;
        				 $scope.title = data.title;  
        			 }else if(data.pinType == 'Video'){
        				 $scope.initializing = false;
        				 $scope.linkEmbed = data.video.url;
        				 $scope.videoPreview = data.video.embedVideo;
        				 $scope.videoData = data.video;
        			 }
        			 
    				 if(data.image){
    					 $scope.pinImg = {
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

	 }, function(errmsg){

	 });
	 
	 $scope.resetData = function(){
		 $scope.linkData = {};
		 $scope.title = '';
		 $scope.description = '';
		 $scope.pinImg = null;
		 $scope.videoData = {};
		 $scope.linkEmbed = '';
		 $scope.videoPreview = 'invalid';
	 };
	 
	 $scope.selectPinType = function(selected){
		 var currentPinType = $scope.pinTypeSelected;
		 if($scope.modalData.action == 'create'){
			 $scope.pinTypeSelected = selected;
			 $scope.resetData();
		 }else if($scope.modalData.action == 'edit' && currentPinType.value != selected.value){ 
			 var modal = confirmModal.showTranslated($scope, {title: "Warning", message: "Clear content of pin confirm"});
	         modal.closePromise.then(function (data) {
	             if (data.value == 'ok') {
	            	 $scope.pinTypeSelected = selected;
	            	 $scope.resetData();
	             }else{
	            	 $scope.pinTypeSelected = currentPinType;
	             }
	         });
		 }
	 };
	 
	 //update image
	 $scope.updateImage = function(){
		 var modal = $scope.pinImg ? updateImageOfEmbedLinkModal.show({action: "edit", type: 'image', data: $scope.pinImg}): updateImageOfEmbedLinkModal.show({action: "create", type: 'image', data: null});
		 modal.closePromise.then(function (data){
			 if(data.value.flag == 'ok'){
				 $scope.pinImg = null;
				  $timeout(function(){
					  $scope.$apply(function() {
						  //update the bindings on UI
						  $scope.pinImg = angular.copy(data.value.data);
						  $scope.linkPreview = 'valid';
					  });
				  },100);

			 }
		 });
	 };
	 
	 // save
	 $scope.savePin = function(){
		 var errorData = {
				false: false,
		        message: ''
		 };
		 
		 if($scope.pinTypeSelected.value == 'Link' && Object.keys($scope.linkData).length === 0){
			 errorData.flag = true;
			 errorData.message = 'Enter Link';
		 }
		 
		 if($scope.pinTypeSelected.value == 'Text' && $scope.title == ''){
			 errorData.flag = true;
			 errorData.message = 'Enter title';
		 }
			
		 if($scope.pinTypeSelected.value == 'Video' && Object.keys($scope.videoData).length === 0){
			 errorData.flag = true;
			 errorData.message = 'Enter Video URL';
		 }
		 
		 var postdata = {
				 pinType : $scope.pinTypeSelected.value,
				 link : $scope.linkData,
				 title : $scope.title,
				 description : $scope.description,
				 video : $scope.videoData
		 };

		 if($scope.pinImg){
			 if($scope.pinImg.uid){
				 postdata.imageUid = $scope.pinImg.uid;
			 }
		 }
		 
		 if (!errorData.flag) {
             var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Save pin confirm"});
             modal.closePromise.then(function (data) {
                 if (data.value == 'ok') {
                     if ($scope.modalData.action == 'create') {
                    	 apiPinnedPostOfUser.create(postdata).then(function (data) {
                    		 if(typeof(data.code) != 'undefined' && data.code != null){
                    			 var message= $filter('translate')(data.message);
                    			 var title = $filter('translate')('Error');
                    			 uiModals.alertModal(null,title, message);
                    		 }else{
	                             $scope.closeThisDialog({flag: 'ok', data: data});
	                             notifyModal.showTranslated('Pin saved success', 'success', null);
	                             $state.reload();
                    	 	}
                         }, function (err) {
                             notifyModal.showTranslated('something_went_wrong', 'error', null);
                         });
                     } else if ($scope.modalData.action == 'edit') {
                    	 apiPinnedPostOfUser.edit($scope.modalData.data, postdata).then(function (data) {
                    		 if(typeof(data.code) != 'undefined' && data.code != null){
                    			 var message= $filter('translate')(data.message);
                    			 var title = $filter('translate')('Error');
                    			 uiModals.alertModal(null,title, message);
                    		 }else{
	                    		 $scope.closeThisDialog({flag: 'ok', data: data});
	                             notifyModal.showTranslated('Pin edited success', 'success', null);
	                             $state.reload();
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
})
.controller('ViewUserPinnedPostDetailsCtrl', function ($scope){
	$scope.popupData = $scope.$parent.ngDialogData;
	$scope.pin = $scope.popupData.pin;
});


