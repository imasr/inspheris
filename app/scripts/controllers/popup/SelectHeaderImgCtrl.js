'use strict';

angular.module('inspherisProjectApp')
  .controller('SelectHeaderImgCtrl', function ($scope, $rootScope, $compile, $http, Config,selectHeaderImageModal, apiMediaUpload, clientCrop, notifyModal, $q, sharedData) {
    
    $scope.headerImageData = {};
    $scope.truewidth = 0;
    $scope.trueheight = 0;

    $scope.remoteImg = {};
    $scope.remoteImg.isReady = false; //convert to true once remote image ready to display
    $scope.imageLoader = false;
    $scope.remoteImg.uid = "";
    $scope.remoteImg.url = "";
    $scope.uploader = new apiMediaUpload();
    $scope.cropper = new apiMediaUpload();
    $scope.localCropArr = [{
      file: '',
      image: {
        width: '',
        height: ''
      },
      cropSize: []
    }];

    $scope.getHeaderImgHeight = function(){
      //calculates the percentage height of header image to show thumbnail on FE properly
      var h = sharedData.getHeightOfAspectRatio(sharedData.articleHeaderImage.min.width, sharedData.articleHeaderImage.min.height);
      return h;
    };

    $scope.getRemoteImageWidhtHeight = function(url){
      var deferred = $q.defer();
      var img = new Image();
        img.onload = function(){
          var w = this.width;
          var h = this.height;
          deferred.resolve({width: w, height: h});
        };
        img.src = $scope.$parent.ngDialogData.path;
      return deferred.promise;
    };

    if($scope.$parent.ngDialogData){
      if($scope.$parent.ngDialogData.imageHeader && $scope.$parent.ngDialogData.imageHeader != ''){
        $scope.imageLoader = true;

        $scope.getRemoteImageWidhtHeight($scope.$parent.ngDialogData.path).then(function(data){
          $scope.truewidth = data.width;
          $scope.trueheight = data.height;
          $scope.imageLoader = false;
          $scope.remoteImg.uid = $scope.$parent.ngDialogData.uid;
          $scope.remoteImg.url = $scope.$parent.ngDialogData.path;
          $scope.remoteImg.isReady = true;
        }, function(err){
        });
      }
    }

    $scope.coloseHeaderImage = function(){
      $scope.uploader.cancel();
      $scope.cropper.cancel();
      selectHeaderImageModal.hide();
    };

    $scope.onHeaderImgSelect = function($files ,evt){
      evt.stopPropagation();
      evt.preventDefault();
          //image object to get the width and height of selected image
          var image  = new Image();
          $files.forEach(function(entry, key){
            var f = entry;
            var FR= new FileReader();
            FR.onload = function(e) {
              //filepath = e.target.result
              image.src = e.target.result;
              image.onload = function(){
                var img_width = this.width;
                var img_height = this.height;
                if(img_width < 500 || img_height < 280){
                  alert("Plese select image of minimum 500 X 280 dimension");
                }
                else{
                    //upload image in temp folder on server to get temporary path to show image for cropping
                    $scope.truewidth = img_width;
                    $scope.trueheight = img_height;
                    //show loader
                    $scope.imageLoader = true;
                    $scope.localCropArr[0].file = f;
                    $scope.localCropArr[0].image.width = img_width;
                    $scope.localCropArr[0].image.height = img_height;
                    

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
                  }, function(data){
                  });
                }//else
              };
            };
            FR.readAsDataURL(f);
          });//for each
    };
    $scope.cropImageInfo = [];
    $scope.cropImageHeaderInfo = {};
    $scope.cropArticleHeader = function(cords) {
        $scope.cropped=true;
        /*var rx = cords.minwidth / cords.w;
        var ry = cords.minheight / cords.h;*/
        var rx = 279 / cords.w; //preview width
        var ry = 160 / cords.h; //preview height

        /*var width = Math.round(rx * parseFloat(cords.boundx));
        var height = Math.round(ry * parseFloat(cords.boundy));*/
        var width = Math.round(rx * parseFloat($scope.truewidth));
        var height = Math.round(ry * parseFloat($scope.trueheight));

        var marginLeft = Math.round(rx * cords.x);
        var marginTop = Math.round(ry * cords.y);
          
          $('#capreview_img').css({
            width: width + 'px',
            height: height + 'px',
            marginLeft: '-' + marginLeft + 'px',
            marginTop: '-' + marginTop + 'px'
          });
          $scope.cropImageHeaderInfo = {
            left: cords.x,
            top: cords.y,
            width: cords.w,
            height: cords.h
          };
    };
    $scope.cropGridThumbInfo = {};
    $scope.cropGridThumb = function(cords) {
        var rx = 300 / cords.w; //preview width
        var ry = 300 / cords.h; //preview height

        var width = Math.round(rx * parseFloat(cords.boundx));
        var height = Math.round(ry * parseFloat(cords.boundy));
        var marginLeft = Math.round(rx * cords.x);
        var marginTop = Math.round(ry * cords.y);

        $scope.cropGridThumbInfo = {
            left: cords.x,
            top: cords.y,
            width: cords.w,
            height: cords.h
          };
    };
    $scope.cropGridThumbSmallInfo = {};
    $scope.cropGridThumbSmall = function(cords) {
        var rx = 100 / cords.w; //preview width
        var ry = 100 / cords.h; //preview height

        var width = Math.round(rx * parseFloat(cords.boundx));
        var height = Math.round(ry * parseFloat(cords.boundy));
        var marginLeft = Math.round(rx * cords.x);
        var marginTop = Math.round(ry * cords.y);

        $scope.cropGridThumbSmallInfo = {
            left: cords.x,
            top: cords.y,
            width: cords.w,
            height: cords.h
          };
    };

    $scope.cropImages = function(){
      $scope.cropImageInfo = [];
      if(isNaN($scope.cropImageHeaderInfo.width) || isNaN($scope.cropGridThumbInfo.width) || isNaN($scope.cropGridThumbSmallInfo.width)){
        alert("Select crop area of all the thumbnail first")
      }
      else{
        $scope.cropImageInfo.push($scope.cropImageHeaderInfo);
        $scope.cropImageInfo.push($scope.cropGridThumbInfo);
        $scope.cropImageInfo.push($scope.cropGridThumbSmallInfo);

        var imgCropData = {
                            uid: $scope.remoteImg.uid, 
                            path: $scope.remoteImg.url,
                            images: $scope.cropImageInfo,
                            type: 'articleHeader'
                          };

        $scope.cropper.cropImage(imgCropData, null).then(function(data){
          if(data.status == 'success'){
            $scope.headerImageData.imageHeader = data.data.urls[0];
            $scope.headerImageData.imageGridviewThumb = data.data.urls[5];
            $scope.headerImageData.imageGridviewSmallThumb = data.data.urls[10];
            $scope.$emit('headerImageSelected', $scope.headerImageData);
            $scope.coloseHeaderImage();
          }
        },function(err){
          JSON.stringify("crop error: "+JSON.stringify(err));
        });

      }
    };

  });
