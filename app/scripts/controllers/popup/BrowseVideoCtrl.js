'use strict';

angular.module('inspherisProjectApp')
        .controller('BrowseVideoCtrl', function ($scope, $rootScope, $compile, videoBrowsePreviewModal, $http, Config, apiFiles, apiCommunity, apiMediaManager,
        		notifyModal,$filter,uiModals,updateVideoImage,$timeout) {
                        
            $scope.list = {selectedVideo: ''};
            $scope.allVideos = [];
            $scope.loadAllInternalVideos = function(){
            	apiMediaManager.getInternalVideos().then(function (data) {
                	if(typeof(data.code) != 'undefined' && data.code != null){
                		var message= $filter('translate')(data.message);
                		var title = $filter('translate')('Error');
                		uiModals.alertModal(null,title, message);
                	}else{
                    	$scope.allVideos = data;
                	}    
                }, function (err) {
                });
            };
            
            $scope.loadAllInternalVideos();
            
            $scope.openVideoBrowsePreviewModal = function (dt) {
                var modal = videoBrowsePreviewModal.show($scope, dt);
                modal.closePromise.then(function (data) {
                    if (data.value.flag == 'ok') {
                        $scope.closeThisDialog({flag: 'ok', data: data.value})
                    }
                });
            }
            
            $scope.updateVideoThumb = function (video) {
            	var postData = {
            			videoName : video.videoName,
            			videoThumbUrl : video.thumbUrl,
            			isDefaultThumb : video.isDefaultThumb
            	};

            	var modal = video.isDefaultThumb ? updateVideoImage.show({action: "create", type: 'image', data: postData}) : updateVideoImage.show({action: "edit", type: 'image', data: postData});
            	modal.closePromise.then(function (data){
            		if(data.value.flag == 'ok'){
            			$timeout(function(){
            				$scope.$apply(function() {
            					$scope.loadAllInternalVideos();
            				});
            			},100);
            		}
            	});
            };
        });