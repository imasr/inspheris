'use strict';
angular.module('inspherisProjectApp')
        .controller('imageVideoGalleryCtrl', function ($scope, $http, galleryModal, apiMediaManager, $filter, $timeout,apiFiles) {
            /*$scope.galArray = [{
             src: 'images/media/Cover1.png',
             title: 'Pic 1'
             }, {
             src: 'images/media/Cover1.png',
             title: 'Pic 2'
             }];*/
            $scope.popupTitle = null;
            $scope.dataLoadSuccess = false;
            $scope.thumbCount = 4;
            $scope.update=function (arg) {
              $scope.selectedIndex=arg;
            }
            
            $scope.modalData = $scope.$parent.ngDialogData;
            $scope.gallerytype = $scope.modalData.type;
            if ($scope.gallerytype == "documents") {
                $scope.popupTitle = "File Detail";
                $scope.galArray = [];
                if ($scope.modalData.data.length > 0) {
                    var uids = [];
                    for (var i = 0; i < $scope.modalData.data.length; i++) {
                        uids.push($scope.modalData.data[i].uid);
                        if(!$scope.modalData.data[i].isInternal){
                        	$scope.galArray.push($scope.modalData.data[i]);
                        }else{
                        	$scope.galArray.push(null);
                        }
                    }

                    apiMediaManager.getFilesByUids({'uid': uids}).then(function (data) {
                        if(data != undefined && data.length > 0){
                        	angular.forEach(data, function(val, key){
               		 			var index = uids.indexOf(val.uid);
               		 			val.isInternal = true;
               		 			$scope.galArray[index] = val;
               		 		});
                        }

//                        if ($scope.modalData.other.selectedUid) {
//                            $scope.selectedIndex = $scope.galArray.indexOf($filter('filter')($scope.galArray, {uid: $scope.modalData.other.selectedUid})[$scope.modalData.other.selectedIndex]);
//                        } else {
//                            $scope.selectedIndex = $scope.galArray.indexOf($filter('filter')($scope.galArray, {uid: uids[$scope.thumbCount - 1]})[0]);
//                        }
                        $scope.selectedIndex = 0;
                        if ($scope.modalData.other.selectedIndex) {
                            $scope.selectedIndex = $scope.modalData.other.selectedIndex;
                        }
                        $scope.dataLoadSuccess = true;
                    }, function (err) {
                    });
                }


            } else {
                $scope.selectedIndex = 0;
                $scope.popupTitle = "File Detail";
                if ($scope.modalData.other.selectedIndex) {
                    $scope.selectedIndex = $scope.modalData.other.selectedIndex;
                }
                
                if($scope.gallerytype == "videos"){
                	$scope.galArray = [];
                	var videoNames = [];
                    for (var i = 0; i < $scope.modalData.data.length; i++) {
                        if(!$scope.modalData.data[i].internalVideo){       	
                        	videoNames.push($scope.modalData.data[i].embedVideoTitle);
                        }else{
                        	videoNames.push($scope.modalData.data[i].videoName);
                        }
                        $scope.galArray.push($scope.modalData.data[i]);
                    }
                	angular.forEach($scope.modalData.data, function(val, key){
                		if(val.internalVideo){
                			apiFiles.checkFileExistByUrl(val.videoUrl).then(function(data){
                				var index = videoNames.indexOf(val.videoName);
               		 			val.fileExist = data;
               		 			$scope.galArray[index] = val;
                			}, function(err){
                				notifyModal.showTranslated('something_went_wrong', 'error', null);
                			});
                		}
       		 		});
                }else{
                	$scope.galArray = $scope.modalData.data;
                }
            }


            // angular.element(document).ready(function (){
            //  setTimeout(function(){
            // 	 window.CANAL.initPlayers();
            //  }, 200);
            // });

            /*if($scope.modalData.type == 'images'){
             $scope.galArray = $scope.modalData.data;
             }
             else if($scope.modalData.type == 'videos'){
             $scope.galArray = $scope.modalData.data;
             }*/


            /*var imagesArray = [];
             var parentArrayLen = $scope.modalData.length;
             angular.forEach($scope.modalData, function(val, key){
             imagesArray.push({
             src: val.path,
             thumb: val.thumbGalleryUrl,
             title: val.fileName
             });
             if(key == (parentArrayLen - 1)){
             $scope.galArray = imagesArray
             }
             });*/
            $scope.closeImgaVideoGalleryPopup = function () {
                galleryModal.hide();
            };
        });
