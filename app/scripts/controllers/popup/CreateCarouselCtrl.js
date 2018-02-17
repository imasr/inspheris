'use strict';
angular.module('inspherisProjectApp')
  .controller('CreateCarouselCtrl', function ( $scope, $rootScope, $timeout, $filter, createCarouselModal, apiMediaUpload, mediaService, apiCarousel, notifyModal, cropImagesModal, videoUrlModal, sharedData,apiCarouselTemplate){
      

      $scope.md = {
        status: 1,  //0: ideal, 1: fetching, 2: fetched, 3: error
        message: 'please wait...'
      };

      $scope.modalData = $scope.$parent.ngDialogData;
      $scope.uploader1 = new apiMediaUpload();
      $scope.uploader2 = new apiMediaUpload();
      
      $scope.title = '';
      $scope.subTitle = '';
      $scope.url = '';
      $scope.description = '';
      //$scope.backgroundColor = 'rgba(0,0,0,0.65)';
      //$scope.titleColor = 'rgba(255,255,255,1)';
      $scope.displayTitle = true;
      $scope.openNewTab = false;
      $scope.editTemplate=false;
      $scope.editUid = null;
      $scope.embededVideo = null;
      $scope.notDisplayBackgroundColor = false;
      var textlabel = $filter('translate')('Templates');
      $scope.templates=[];
      apiCarouselTemplate.allTemplates().then(function(data){
		$scope.templates=data;
		$scope.selectedTemplate = $scope.templates[0];   
      }, function(err){
		  
      });  
	 
	$scope.viewTemplate = function(selectedTemplate){
		$scope.editTemplate=!$scope.editTemplate;
	};
	
	$scope.saveTemplate=function(template){
		apiCarouselTemplate.updateTemplate(template).then(function(data){
			$scope.editTemplate=false;
		},function(error){
		});
	}
	
	$scope.myStyle = {};
	 $scope.changeColor = function (color) {
		$scope.myStyle={'background-color': '#' + color};
	};
  
      $scope.valImg1 = {
        width: sharedData.carousel.wide.width,
        height: sharedData.carousel.wide.height
      };
      $scope.valImg2 = {
        width: sharedData.carousel.small.width,
        height: sharedData.carousel.small.height
      };

      $scope.imageLevel1 = null;
      $scope.imageLevel2 = null;

      $scope.sliderTypes = [
        {
          text: 'Image',
          value: 'image'
        },
        {
          text: 'Video',
          value: 'video'
        },
        {
          text: 'Advertisement',
          value: 'advertisement'
        }
      ];
      $scope.selctedSliderType = {
        text: 'Image',
        value: 'image'
      };
      $scope.sliderTypeChanged = function(selected){
      };
      
      $scope.openVideoUrlModal = function(){
        var modal = videoUrlModal.show($scope);
        modal.closePromise.then(function (data) {
            if(data.value.flag == 'ok'){
              if(data.value.data != ''){
                $scope.embededVideo = data.value.data;
              }
            }
        });
      };

      $scope.onLevel1ImageSelect = function($files, event){
        if($files.length > 0){
          /*
          for recropping image
          tempdata = {
              action: 'recrop',
              image: {
                url: ----,
                uid: ----
              }
            }
          */
          var tempdata = {};
          if($files){
            tempdata = {
              action: 'crop',
              files: $files,
              cdimentions: [{w: $scope.valImg1.width, h: $scope.valImg1.height}],
              resize: true
            } 
          }
          var modal = cropImagesModal.show(tempdata);
          modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              $scope.imageLevel1 = data.value.cropdata.data;
            }
          });
        }
        else{
        }
      };
      $scope.recropLevel1Image = function(){
        var tempdata = {};
        tempdata = {
            action: 'recrop',
            image: {
              uid: $scope.imageLevel1.uid,
              url: $scope.imageLevel1.urls[0]
            },
            cdimentions: [{w: $scope.valImg1.width, h: $scope.valImg1.height}],
            resize: true
          };
        var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.imageLevel1 = null;
            $timeout(function(){
              $scope.imageLevel1 = data.value.cropdata.data;
            });
          }
        });
      };

      $scope.onLevel2ImageSelect = function($files, event){
        if($files.length > 0){
          var tempdata = {};
          if($files){
            tempdata = {
              action: 'crop',
              files: $files,
              cdimentions: [{w: $scope.valImg2.width, h: $scope.valImg2.height}],
              resize: true
            } 
          }
          var modal = cropImagesModal.show(tempdata);
          modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              $scope.imageLevel2 = data.value.cropdata.data;
            }
          });
        }
        else{
        }
      };
      $scope.recropLevel2Image =function(){
        var tempdata = {};
        
        tempdata = {
          action: 'recrop',
          image: {
              url: $scope.imageLevel2.urls[0],
              uid: $scope.imageLevel2.uid
            },
          cdimentions: [{w: $scope.valImg2.width, h: $scope.valImg2.height}],
          resize: true
        }; 
        
        var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.imageLevel2 = null;
            $timeout(function(){
              $scope.imageLevel2 = data.value.cropdata.data;
            });
          }
        });
      };

      $scope.doneCarousel = function(){
        var errorData = {
          flag: false,
          message: ''
        };

        var postData = {};
        if($scope.editUid){
          postData.uid = $scope.editUid;
        }
        postData.titleColor = $scope.titleColor;
        postData.backgroundColor = $scope.backgroundColor;
        postData.openSameTab = !$scope.openNewTab;
        postData.displayTitle = $scope.displayTitle;
        postData.type = $scope.selctedSliderType.value;
	postData.displayBackgroundColor = !$scope.notDisplayBackgroundColor;
        if($scope.selctedSliderType.value=='advertisement'){
        	postData.adTemplate = $scope.selectedTemplate.id;
        }
        if($scope.selctedSliderType.value == 'video'){
          if($scope.embededVideo){
            postData.embedVideo = $scope.embededVideo.embedVideo;
            postData.thumbUrl = $scope.embededVideo.thumbUrl;
          }
          else{
            errorData.flag = true;
            errorData.message = "Add_embeded_video";
          }
        }
        
        if(!$filter('isBlankString')($scope.title)){
          postData.title = $scope.title;
        }
        if(!$filter('isBlankString')($scope.subTitle)){
          postData.subTitle = $scope.subTitle;
        }
        if(!$filter('isBlankString')($scope.url)){
          postData.url = $scope.url;
        }
        if(!$filter('isBlankString')($scope.description)){
          postData.description = $scope.description;
        }
        if(!$filter('isBlankString')($scope.adDate)){
       	    var date = $filter('date')($scope.adDate,'yyyy-MM-dd HH:mm:ss');
            postData.adDate = date;
         }
        if(!$filter('isBlankString')($scope.adPrice)){
            postData.adPrice = $scope.adPrice;
         }
        if(!$filter('isBlankString')($scope.adDiscount)){
            postData.adDiscount = $scope.adDiscount;
         }
        
    
        /*
        if($scope.title == ''){
          errorData.flag = true;
          errorData.message = "Enter title.";
        }
        */
        if($scope.selctedSliderType.value == 'image' || $scope.selctedSliderType.value=='advertisement'){
          if($scope.imageLevel1){
            postData.imageLevel1 = $scope.imageLevel1.uid;
          }
          if($scope.imageLevel2){
            postData.imageLevel2 = $scope.imageLevel2.uid;
            //delete postData.imageLevel2.uploadStatus;
          }
          if(!$scope.imageLevel1 && !$scope.imageLevel2){
            errorData.flag = true;
            errorData.message = "Upload_Image";
          }
        }
        if(errorData.flag){
          notifyModal.showTranslated(errorData.message, 'error', null);
        }
        else{
          apiCarousel.create(postData).then(function(data){
            $scope.closeThisDialog({flag: 'ok', data: data});
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        }
      };

      $scope.$on("$destroy", function(){
        $scope.uploader1.cancel();
        $scope.uploader2.cancel();
      });

      if($scope.modalData){
        if($scope.modalData.action == 'edit'){
          $scope.editUid = $scope.modalData.data.uid;
          apiCarousel.getByUid($scope.editUid).then(function(data){
            if(data){
              $scope.editUid = data.uid;
              if(data.title){
                $scope.title = data.title;
              }
              if(data.subTitle){
                $scope.subTitle = data.subTitle;
              }
              if(data.description){
                $scope.description = data.description;
              }
              if(data.url){
                $scope.url = data.url;  
              }
              if(data.titleColor){
                $scope.titleColor = data.titleColor;
              }
              if(data.backgroundColor){
                $scope.backgroundColor = data.backgroundColor;
              }

              $scope.openNewTab = !data.openSameTab;
              $scope.displayTitle = data.displayTitle;
              $scope.adPrice = data.adPrice;
              $scope.adDiscount = data.adDiscount;
	      $scope.notDisplayBackgroundColor = !data.displayBackgroundColor;
              if(data.adTemplate){
			$scope.selectedTemplate=$filter('filter')( $scope.templates, {id:data.adTemplate})[0];
              }
	      if(data.adDate){
		$scope.adDate = $filter('newDate')(data.adDate);
	  }       
              if(data.imageLevel1){
                //$scope.imageLevel1 = angular.copy(data.imageLevel1);
                $scope.imageLevel1 = {
                  uid: data.imageLevel1.uid,
                  urls: [
                    data.imageLevel1.url,
                    data.imageLevel1.sliderUrl
                  ]
                };
              }
              if(data.imageLevel2){
                //$scope.imageLevel2 = angular.copy(data.imageLevel2);
                $scope.imageLevel2 = {
                  uid: data.imageLevel2.uid,
                  urls: [
                    data.imageLevel2.url,
                    data.imageLevel2.sliderUrl
                  ]
                };
              }
            }
            //selctedSliderType.type = $scope.modalData.data.type;
            if(data.type == 'image'){
              $scope.selctedSliderType = {
                text: 'Image',
                value: 'image'
              };
            }
            else if(data.type == 'video'){
              $scope.selctedSliderType = {
                text: 'Video',
                value: 'video'
              };
              $scope.embededVideo = {
                embedVideo: data.embedVideo,
                thumbUrl: data.thumbUrl
              };
            }

            else if(data.type == 'advertisement'){
              $scope.selctedSliderType = {
                text: 'Advertisement',
                value: 'advertisement'
              };
            }

            $scope.md.status = 2;
          }, function(err){
            $scope.md.status = 3;
          });
        }
        else{
          $scope.md.status = 2;
        }
      }
  });