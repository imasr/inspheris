'use strict';
angular.module('inspherisProjectApp')
  .controller('ImagesManagerCtrl', function ($scope, $timeout, $http, $translate, sharedData, mediaService, apiMediaUpload, notifyModal) {

    
    $scope.modalData = $scope.$parent.ngDialogData;
    $scope.imageDimentions = $scope.modalData.cdimentions;
    $scope.selectedImages = [];
    
    $scope.manager = new apiMediaUpload();
    $scope.uploader = new apiMediaUpload();
    $scope.remoteImg = {};
    $scope.imageLoader = false;
    $scope.remoteImg.isReady = false; //convert to true once 
    $scope.remoteImg.uid = "";
    $scope.remoteImg.url = "";
    $scope.truewidth = 0;
    $scope.trueheight = 0;
    
    $scope.closeImageManagerPopup = function(){
      $scope.closeThisDialog({flag: "cancel", cropdata: null});
    };
    
    
    
    $scope.uploadImageinTemp = function($files){
        if($files.length > 0){
          $files.forEach(function(val, key){
            mediaService.localImgSize(val)
            .then(function(imageSize){
                $files.forEach(function(entry, key){
                  var f = entry;
                  $scope.truewidth = imageSize.width;
                  $scope.trueheight = imageSize.height;
                  //show loader
                  $scope.imageLoader = true;
                  $scope.initData($scope.truewidth,$scope.trueheight);
                  $scope.uploader.uploadImgForCrop(f, null).then(function(data){
                  if(data.status == 'success'){
                      // file is uploaded successfully
                      //hide loader
                      $scope.imageLoader = false;
                      $scope.remoteImg.isReady = true;
                      if(data.data){
                        //image is uploded by encoded url API
                        $scope.remoteImg.uid = data.data.uid;
                        $scope.remoteImg.url = data.data.path;  
                      }
                  }// if successfully uploaded
                  else if(data.status == 'cancelled'){
                  }//if cancelled by user
                  }, function(err){
                    $scope.closeThisDialog({flag: "cancel", cropdata: null});
                    notifyModal.showTranslated("something_went_wrong", 'error', null);
                  }, function(data){
                  });

                });//for each
            });//mediaservice get image size
          });//for each
        }//if len>0
        //clear the input type file
        angular.forEach(
        angular.element("input[type='file']"),
        function(inputElem) {
          angular.element(inputElem).val(null);
        });
      };
      
      $scope.movingPosition = function(left,top,index){
   
    	  var percentX =  (left * 100) / $scope.imageDimentions[index].w;
    	  var percentY =  (top * 100) / $scope.imageDimentions[index].h;
    	  $scope.selectedImages[index].posX = percentX;
          $scope.selectedImages[index].posY = percentY;
      }
      $scope.resizable = function(width,height,index){
    	  
    	  $scope.selectedImages[index].resize = {
    			  width: Math.round(width),
    	          height: Math.round(height)
    	  };
      }
      
      $scope.rotate = function(angle,index){
    	  $scope.selectedImages[index].angle = angle;
      }
      
      $scope.backgroundColor = function(color, index){
    	  $scope.selectedImages[index].backgroundColor = color;
      }
      
      if($scope.modalData.action == "manager"){
          $scope.uploadImageinTemp($scope.modalData.files);
       }else if($scope.modalData.action == "remanager"){
    	   $scope.imageLoader = true;
    	   $scope.remoteImg.isReady = false;
    	   if($scope.modalData.image.uid && $scope.modalData.image.url){
    		   		mediaService.remoteImgSize($scope.modalData.image.url).then(function(data){
    		   		$scope.truewidth = data.width;
    	            $scope.trueheight = data.height;	
    		   		$scope.initData($scope.truewidth,$scope.trueheight);
    		   		$scope.remoteImg.uid = $scope.modalData.image.uid;
    	            $scope.remoteImg.url = $scope.modalData.image.url;
    	            $timeout(function(){
    	                $scope.imageLoader = false;
    	                $scope.remoteImg.isReady = true;
    	            });
    		   }, function(err){
    		       notifyModal.showTranslated("something_went_wrong", 'error', null);
    		   });
    	   }
       }

       $scope.initData = function(truewidth,trueheight){
    	   angular.forEach($scope.imageDimentions, function(val, key){
    	        //initialize the array in which we will store the images details of selected images
    	        var obj = {
    	            left: 0,
    	            top: 0,
    	            width: truewidth,
    	            height: trueheight,
    	            posX: 0,
    	            posY: 0,
    	            angle: 0,
    	            backgroundColor: 'transparent'
    	            
    	          };
    	        obj.resize = {
    	        	width: truewidth,
    	    	    height: trueheight
    	        };

    	        $scope.selectedImages.push(obj);
    	      })
       }

       $scope.saveImages = function(){
    	      var errorData = {
    	        flag: false,
    	        message: ''
    	      };
    	      angular.forEach($scope.selectedImages, function(val, key){
    	        if(val.posX > 100 || val.posY > 100 || (val.width <= 0 && val.height <=0)){
    	          errorData.flag = true;
    	          errorData.message = 'err_image_area_not_supported';
    	        }
    	      });

    	      var postdata = {
    	        uid: $scope.remoteImg.uid,
    	        path: $scope.remoteImg.url,
    	        images: $scope.selectedImages
    	      };

    	      if(!errorData.flag){
    	        $scope.manager.manageImage(postdata, null).then(function(data){
    	          $scope.closeThisDialog({flag: "ok", imagedata: data});
    	        }, function(err){
    	          notifyModal.showTranslated("something_went_wrong", 'error', null);
    	        });
    	      }
    	      else{
    	        notifyModal.showTranslated(errorData.message, 'error');
    	      }
       }
    
  })
  .controller('UploadImageCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$q,$stateParams,sharedData,notifyModal, uiModals, confirmModal, cropImagesModal){
	  $scope.img = null;
	  $scope.modalData = $scope.$parent.ngDialogData;
	  if(($scope.modalData.action == 'edit') && ($scope.modalData.data)){
		  $scope.img = $scope.modalData.data;
	  }
	  
	  $scope.onImageSelect = function($files, $event){
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
	    		  $scope.img = null;
	    		  $timeout(function(){
	    			  $scope.img = data.value.cropdata.data;
	    		  });
	    	  }
	      });
	  };
	  
	  $scope.recropImage = function(){
		  var tempdata = {};
		  tempdata = {
				  action: 'recrop',
				  image: {
					  uid: $scope.img.uid,
					  url: $scope.img.urls[0]
				  },
				  cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
				  resize: true
		  };
		  
		  var modal = cropImagesModal.show(tempdata);
		  modal.closePromise.then(function (data){
			  if(data.value.flag == 'ok'){
				  $scope.img = null;
				  $timeout(function(){
					  $scope.$apply(function() {
						  //update the bindings on UI
			              $scope.img = angular.copy(data.value.cropdata.data);
					  });
				  },100);
			  }
		  });
	  };
	  
	  $scope.uploadImage = function(){
		  if($scope.img != null){
			  $scope.closeThisDialog({flag: 'ok', data: $scope.img});
		  }else{
			  $scope.closeThisDialog({flag: 'cancel', data: null});
		  }
	  };
  })
  .controller('UploadVideoImageCtrl', function ($scope,$timeout,confirmModal,apiFiles){
	  $scope.img = null;
	  $scope.file = null;
	  $scope.modalData = $scope.$parent.ngDialogData;
	  $scope.videoName = $scope.modalData.data.videoName;
	  $scope.isDefaultThumb = $scope.modalData.data.isDefaultThumb;
	  if(($scope.modalData.action == 'edit') && ($scope.modalData.data)){
		  $scope.img = $scope.modalData.data.videoThumbUrl;
	  }
	  
	  $scope.onImageSelect = function($files, $event){
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
		  $scope.file = $files[0];
		  var reader  = new FileReader();
		  reader.onload = function(e)  {
			  $scope.img = e.target.result;
		  }
		  reader.readAsDataURL($scope.file);
	  };
	  
	  $scope.uploadImage = function(){
		  var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "upload_video_image_comfirm"});
		  modal.closePromise.then(function (data) {
			  if(data.value == 'ok'){
				  if($scope.img != null){
					  apiFiles.uploadVideoThumb($scope.file,$scope.videoName,$scope.isDefaultThumb).then(function(data){
						  $scope.img = null;
						  $timeout(function(){
							  $scope.img = data.thumbUrl;
							  $scope.closeThisDialog({flag: 'ok', data: $scope.img});
						  });
					  }, function(err) {
						  notifyModal.showTranslated("something_went_wrong", 'error', null);
					  });			  
				  }else{
					  $scope.closeThisDialog({flag: 'cancel', data: null});
				  }
			  }
		  });
	  };
  });