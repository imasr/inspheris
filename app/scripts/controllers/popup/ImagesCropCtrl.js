'use strict';
angular.module('inspherisProjectApp')
  .controller('ImagesCropCtrl', function ($scope, $timeout, $http, $translate, clientCrop, sharedData, mediaService, apiMediaUpload, notifyModal) {

    //$scope.imagesToCrop = [{url: '/api/attachment?file=attachments/7581b928-601f-4a96-bf09-0e5c8f0e547f/Forest_Edge___Background_by_Ratow.jpg'}];

    $scope.modalData = $scope.$parent.ngDialogData;
    $scope.cropDimentions = $scope.modalData.cdimentions;
    $scope.selectedCropDim = [];

    angular.forEach($scope.cropDimentions, function(val, key){
      //initialize the array in which we will store the crop detials of selected images
      var obj = {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
        if(($scope.modalData.resize) || (val.resize)){
          obj.resize = {
            width: val.w,
            height: val.h
          };
        }
      $scope.selectedCropDim.push(obj);
    });  

    $scope.imagesToCrop = [];
  
    $scope.uploader = new apiMediaUpload();
    $scope.cropper = new apiMediaUpload();
    $scope.remoteImg = {};
    $scope.imageLoader = false;
    $scope.remoteImg.isReady = false; //convert to true once 
    $scope.remoteImg.uid = "";
    $scope.remoteImg.url = "";
    $scope.truewidth = 0;
    $scope.trueheight = 0;

    $scope.getMaxImageDimention = function(){
      var maxImageW = 0;
      var maxImageH = 0;
      angular.forEach($scope.cropDimentions, function(val, key){
        if(val.w > maxImageW)
          maxImageW = val.w;
        if(val.h > maxImageH)
          maxImageH = val.h;
      });
      return ({w: maxImageW, h: maxImageH});
    }
    $scope.isValidImageToCrop = function(file){
      var maxImageW = 0;
      var maxImageH = 0;
      angular.forEach($scope.cropDimentions, function(val, key){
        if(val.w > maxImageW)
          maxImageW = val.w;
        if(val.h > maxImageH)
          maxImageH = val.h;
      });
      mediaService.localImgSize(file)
          .then(function(imageSize){
            if((imageSize.width < maxImageW) || (imageSize.height < maxImageH)){
              
              notifyModal.showTranslated('select_image_of_x_size', 'error', {w: maxImageW, h: maxImageH});
                return false;
            }
            else{
              return true; //ready to crop
            }
          });
    }; //isValidImageToCrop

    $scope.cropArticleHeader = function(cords, arrindex) {
        //var rx = cords.minwidth / cords.w;
        //var ry = cords.minheight / cords.h;
        var rx = 279 / cords.w; //preview width
        var ry = 160 / cords.h; //preview height

        //var width = Math.round(rx * parseFloat(cords.boundx));
        //var height = Math.round(ry * parseFloat(cords.boundy));
        var width = Math.round(rx * parseFloat($scope.truewidth));
        var height = Math.round(ry * parseFloat($scope.trueheight));

        $scope.imagesToCrop[arrindex].cropDetail.left = cords.x;
        $scope.imagesToCrop[arrindex].cropDetail.top = cords.y;
        $scope.imagesToCrop[arrindex].cropDetail.width = cords.w;
        $scope.imagesToCrop[arrindex].cropDetail.height = cords.h;
    };

    $scope.cropSelection = function(cords, index) {
        /*
        var rx = 100 / cords.w; //preview width
        var ry = 100 / cords.h; //preview height

        var width = Math.round(rx * parseFloat(cords.boundx));
        var height = Math.round(ry * parseFloat(cords.boundy));
        var marginLeft = Math.round(rx * cords.x);
        var marginTop = Math.round(ry * cords.y);
        */
        $scope.selectedCropDim[index].left = cords.x;
        $scope.selectedCropDim[index].top = cords.y;
        $scope.selectedCropDim[index].width = cords.w;
        $scope.selectedCropDim[index].height = cords.h;
    };


    $scope.uploadImageinTemp = function($files){
      var maxImageDimention = $scope.getMaxImageDimention();// maximum image size calculated upon the passed crop dimentions
      if($files.length > 0){
        $files.forEach(function(val, key){
          mediaService.localImgSize(val)
          .then(function(imageSize){
            
            if((imageSize.width < maxImageDimention.w) || (imageSize.height < maxImageDimention.h)){
              
              notifyModal.showTranslated('select_image_of_x_size', 'error', {w: maxImageDimention.w, h: maxImageDimention.h});
              
              $scope.closeThisDialog({flag: "cancel", cropdata: null});
            }
            else{

              $files.forEach(function(entry, key){
                var f = entry;
                //upload image in temp folder on server to get temporary path to show image for cropping
                $scope.truewidth = imageSize.width;
                $scope.trueheight = imageSize.height;
                //show loader
                $scope.imageLoader = true;
                
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
            }//else if image is of propre size
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

    $scope.cropImages = function(){
      var errorData = {
        flag: false,
        message: ''
      };
      angular.forEach($scope.selectedCropDim, function(val, key){
        if(val.left <= 0 && val.top <= 0 && val.width <= 0 && val.height <=0){
          errorData.flag = true;
          errorData.message = 'err_crop_area_not_selected';
        }
      });

      var postdata = {
        uid: $scope.remoteImg.uid,
        path: $scope.remoteImg.url,
        images: $scope.selectedCropDim
      };


      if(!errorData.flag){
        $scope.cropper.cropImage(postdata, null).then(function(data){
          $scope.closeThisDialog({flag: "ok", cropdata: data});
        }, function(err){
          notifyModal.showTranslated("something_went_wrong", 'error', null);
        });
      }
      else{
        notifyModal.showTranslated(errorData.message, 'error');
      }
    };
    $scope.closeCropImagePopup = function(){
      $scope.closeThisDialog({flag: "cancel", cropdata: null});
    };


    if($scope.modalData.action == "crop"){
      $scope.uploadImageinTemp($scope.modalData.files);
    }
    else if($scope.modalData.action == "recrop"){
      $scope.imageLoader = true;
      $scope.remoteImg.isReady = false;
      if($scope.modalData.image.uid && $scope.modalData.image.url){
        mediaService.remoteImgSize($scope.modalData.image.url).then(function(data){
          $scope.truewidth = data.width;
          $scope.trueheight = data.height;
          var maxImageDimention = $scope.getMaxImageDimention($scope.truewidth, $scope.trueheight);
          if(($scope.truewidth < maxImageDimention.w) || ($scope.trueheight < maxImageDimention.h)){
        
              notifyModal.showTranslated('select_image_of_x_size', 'error', {w: maxImageDimention.w, h: maxImageDimention.h});
              
              $scope.closeThisDialog({flag: "cancel", cropdata: null});
            }//if image is not in proper size
            else{
            $scope.remoteImg.uid = $scope.modalData.image.uid;
            $scope.remoteImg.url = $scope.modalData.image.url;
            $timeout(function(){
              $scope.imageLoader = false;
              $scope.remoteImg.isReady = true;
            });
          }//else
        }, function(err){
          notifyModal.showTranslated("something_went_wrong", 'error', null);
        });
      }
    }

    $scope.$on('$destroy', function(){
      $scope.uploader.cancel();
      $scope.cropper.cancel();
    });
  });