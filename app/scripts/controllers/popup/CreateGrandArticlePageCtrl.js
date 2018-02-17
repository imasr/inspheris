'use strict';

angular.module('inspherisProjectApp') 
  .controller('CreateGrandArticlePageCtrl', function ($scope, $rootScope,$translate,$filter,sharedData, grandArticlePageModal,mediaService,managerImagesModal,cropImagesModal,confirmModal,$timeout,notifyModal) {

	  $scope.popupData = $scope.$parent.ngDialogData;

	  $scope.modalStatus = {
	      status: 2,
	      headerImgDim: {w: sharedData.articleHeaderImage.min.width, h: sharedData.articleHeaderImage.min.height},
	      translationService: $rootScope.translationService
	  };
	  
	  $scope.sortingLog = [];
	  $scope.caBlocksArray = [];
	  $scope.editPageId = null;
	  
	  //for ritchText block
	  $scope.caRitchTxtObj = {type: 'richText', content: '', modifiedBlock: false};

	  //for quote block
	  $scope.caQuoteObj = {type: 'quote', content: '', modifiedBlock: false};
	    
	  //for URL Block
	  $scope.caUrlObj = {type: 'url', path: '', modifiedBlock: false};
	  
	  //for event block
	  $scope.caEventObj = {type: 'event', title: '', dateFrom: '', timeFrom: '', dateTo: '', timeTo: '', location: '', description: '', invitedPeoples: '',uid:'',participateEventExtension: true,limitSeatOfEvent: false,totalNumberOfSeat: 1, modifiedBlock: false};
	
	  //for linkEmbed block
	  $scope.caLinkObj = {type: 'linkEmbed', title: '', description: '', files: null, modifiedBlock: false};
	  
	  //for doucument block
	  $scope.caDocObj = {type: 'document', title: '', description: '', files: null, modifiedBlock: false};
	    
	  $scope.headingBlock = {
			  type: 'heading',
	  	      title: '',
	  	      subTitle: '',
	  	      uid: null,
	  	      path: null,
	  	      imageHeader: '',
	  	      imageGridviewThumb: '',
	  	      imageGridviewSmallThumb: '',
	  	      headerImageColor: 'rgba(0, 0, 0, 0.6)',
	  	      modifiedBlock: false,
	  	      imageHeaderPosX: 0,
	  	      imageHeaderPosY: 0,
	  	      imageHeaderBackgroundColor: 'transparent',
	  	      imageHeaderAngle : 0,
	  	      imageGridviewThumbPosX : 0,
	  	      imageGridviewThumbPosY : 0,
	  	      imageGridviewThumbBackgroundColor: 'transparent',
	  	      imageGridviewThumbAngle : 0,
	  	      imageGridviewSmallThumbPosX : 0,
	  	      imageGridviewSmallThumbPosY : 0,
	  	      imageGridviewSmallThumbBackgroundColor: 'transparent',
	  	      imageGridviewSmallThumbAngle :0,
	  	      smallImage : false,
	  	      backGroundThumbViewer : '#f5f5ff',
	  	      imageHeaderWidth : "100%"
	  	      
	  };
	  
	//---------for editing page--------------
	  $scope.fillBlocksData = function(blocks){
		  if(blocks.length > 0){
			  angular.forEach(blocks, function(val, key){
				  switch(val.type){
				  	case 'heading':
				  		$scope.headingBlock.title = val.title;
				  		$scope.headingBlock.subTitle = val.subTitle;

				  		if(typeof(val.imageHeader) != 'undefined'){
			                $scope.headingBlock.uid = val.uid;
			                $scope.headingBlock.path = val.path;
			                $scope.headingBlock.imageHeader = val.imageHeader + "?t=" + new Date().getTime();
			                $scope.headingBlock.imageGridviewThumb = val.imageGridviewThumb;
			                $scope.headingBlock.imageGridviewSmallThumb = val.imageGridviewSmallThumb;
			                $scope.headingBlock.headerImageColor = val.headerImageColor;
			                $scope.headingBlock.imageHeaderPosX = val.imageHeaderPosX;
			                $scope.headingBlock.imageHeaderPosY = val.imageHeaderPosY;
			                $scope.headingBlock.imageHeaderBackgroundColor = val.imageHeaderBackgroundColor;
			                $scope.headingBlock.imageHeaderAngle = val.imageHeaderAngle;
			                $scope.headingBlock.imageGridviewThumbPosX = val.imageGridviewThumbPosX;
			                $scope.headingBlock.imageGridviewThumbPosY = val.imageGridviewThumbPosY;
			                $scope.headingBlock.imageGridviewThumbBackgroundColor = val.imageGridviewThumbBackgroundColor;
			                $scope.headingBlock.imageGridviewThumbAngle = val.imageGridviewThumbAngle;
			                $scope.headingBlock.imageGridviewSmallThumbPosX = val.imageGridviewSmallThumbPosX;
			                $scope.headingBlock.imageGridviewSmallThumbPosY = val.imageGridviewSmallThumbPosY;
			                $scope.headingBlock.imageGridviewSmallThumbBackgroundColor= val.imageGridviewSmallThumbBackgroundColor;
			                $scope.headingBlock.imageGridviewSmallThumbAngle = val.imageGridviewSmallThumbAngle;
			                $scope.headingBlock.smallImage = val.smallImage;
	                
			                var image = new Image();
			                image.src = val.imageHeader;
			                image.onload = function(){
			                	var ratio = $scope.getViewRatio();
			                	if(val.smallImage){
			                		$scope.headingBlock.imageHeaderWidth = Math.round(image.width / ratio) + "px";
			                	}	
			                };
	                
			                if($scope.headingBlock.imageHeaderBackgroundColor != 'transparent'){
			              	  $scope.headingBlock.backGroundThumbViewer = $scope.headingBlock.imageHeaderBackgroundColor;
			                }else{
			              	  $scope.headingBlock.backGroundThumbViewer = '#f5f5ff';
			                }
				  		}
				  		break;
				  	case 'richText':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'videoGallery':
				  	case 'video':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'url':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'documentGallery':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'event':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'imageGallery':  
				  	case 'ImageGallery':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  	case 'linkEmbed':
				  		$scope.caBlocksArray.push(val);
				  		break;
				  };//switch         
			  });
		  	}
	  };
	    
	  //init
	  if($scope.popupData.action == 'create'){
		  $scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
	  }else if($scope.popupData.action == 'edit'){
		  var editData = $scope.popupData.data;
		  $scope.editPageId = editData.id;
		  var editArticleBlocks = editData.blocks;
		  if(editArticleBlocks.length > 0){
			  $scope.fillBlocksData(editArticleBlocks);
		  }
	  }
	  
	  $scope.showCaSection = function(secName){
		  switch(secName) {
		  	case 'caText':
		  		$scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
		  		break;
		  	case 'caUplodDocGallery':
		  		$scope.caBlocksArray.push(angular.copy(sharedData.docGalleryObj));
		  		break;
		  	case 'caUploadDocument':
		  		$scope.caBlocksArray.push(angular.copy($scope.caDocObj));
		  		break;
		  	case 'caUploadImg':
		  		$scope.caBlocksArray.push(angular.copy(sharedData.imgGalleryObj));
		  		break;
		  	case 'caUploadVdo':
		  		$scope.caBlocksArray.push(angular.copy(sharedData.vdoGalleryObj));
		  		break;
		  	case 'caUploadUrl':
		  		$scope.caBlocksArray.push(angular.copy($scope.caUrlObj));
		  		break;
		  	case 'caUploadQuote':
		  		$scope.caBlocksArray.push(angular.copy($scope.caQuoteObj));
		  		break;
		  	case 'caUploadEvent':
		  		$scope.caBlocksArray.push(angular.copy($scope.caEventObj));
		  		break;
		  	case 'caLinkEmbed':
		  		$scope.caBlocksArray.push(angular.copy($scope.caLinkObj));
		  		break;	  
		  	default:
		  		$scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
		  }
	  };
	  
	  $scope.addContentBlock = function(type){
		  if(type == 'imageGallery' || type == 'ImageGallery'){
			  type = 'images'
		  }else if(type == 'videoGallery' || type =='VideoGallery'){
			  type = 'videos'
		  }else if(type == 'documentGallery'){
			  type = 'documents';
		  }

		  switch(type){
		  	case 'ritchText':
		  		$scope.showCaSection("caText");  
		  		break;
		  	case 'images':
		  		$scope.showCaSection("caUploadImg");
		  		break;
		  	case 'videos':
		  		$scope.showCaSection("caUploadVdo");
		  		break 
		  	case 'documents':
		  		$scope.showCaSection("caUplodDocGallery");
		  		break;
		  	case 'quote':
		  		$scope.showCaSection("caUploadQuote");
		  		break;
		  	case 'url':
		  		$scope.showCaSection("caUploadUrl");
		  		break;
		  	case 'event':
		  		$scope.showCaSection("caUploadEvent");
		  		break;
		  }
	  };
	  
	  $scope.removeBlock = function(indexVal){
		  $scope.caBlocksArray.splice(indexVal, 1);
	  };
	  
	  $scope.sortableBlocks = {
			  update: function(e, ui) {
			  },
			  stop: function(e, ui) {
				  $scope.$broadcast("rebuild.ckeditor", null);
			  },
			  cancel: ".fixed"
	  };
	  
	  $scope.prepareBlocksData = function(){
		  var errorData = {
				  flag: false,
				  message: ''
		  };
	      
		  var blockdata = [];
		  $scope.caBlocksArray.forEach(function(val, key){
			  switch(val.type) {
	          	case 'richText':
	          		var plainText = sharedData.htmlToText(val.content);
	                if($filter('isBlankString')(plainText) && !$filter('isEmbedHtml')(val.content)){
	                	errorData.flag = true;
	                	errorData.message = 'Enter_text_content';
	                }
	                blockdata.push({
	                	type: 'richText',
	                	content: val.content,
	                	modifiedBlock: val.modifiedBlock
	                });
	                break;
	          	case 'imageGallery':
	          	case 'ImageGallery':
	            	var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'image');
	                var img_files = tempObj.data;
	                errorData = tempObj.error;

	                blockdata.push({
	                	type: 'ImageGallery',
	                	images: img_files,
	                	modifiedBlock: val.modifiedBlock
	                });
	                
	                break;
	          	case 'documentGallery':
	                var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'document');
	                var doc_files = tempObj.data;
	                errorData = tempObj.error;

	                blockdata.push({
	                	type: 'documentGallery',
	                	documents: doc_files,
	                	modifiedBlock: val.modifiedBlock
	                });
	                break;
	          	case 'event':
	                var obj = sharedData.getEventDataToPost(val);
	                errorData = obj.error;
	                blockdata.push({
	                    uid: obj.data.uid ? obj.data.uid : undefined,
	                    type: 'event',
	                    title: obj.data.title,
	                    dateFrom: obj.data.dateFrom,
	                    dateTo : obj.data.dateTo,
	                    location : obj.data.location,
	                    description: obj.data.description,
	                    invitedPeopleUids : obj.data.invitedPeoples,
	                    modifiedBlock: val.modifiedBlock,
	                    participateEventExtension: val.participateEventExtension,
	                    limitSeatOfEvent: val.limitSeatOfEvent,
	                	  totalNumberOfSeat: val.totalNumberOfSeat
	                  });
	                break;
	          	case 'videoGallery':
	                var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'embeddedVideo');
	                var vdo_files = tempObj.data;
	                errorData = tempObj.error;

	                blockdata.push({
	                	type: 'videoGallery',
	                	videos: vdo_files,
	                	modifiedBlock: val.modifiedBlock
	                });
	                break;
	          	case 'url':
	          		if(!$filter('isBlankString')(val.path)){
	          			if($filter('isValidUrl')(val.path)){
	          				blockdata.push({
	          					type: 'url',
	          					path: val.path,
	          					modifiedBlock: val.modifiedBlock
	          				});
	          			}else{
	          				errorData.flag = true;
	          				errorData.message = 'Enter_valid_url_in_url_block';
	          			}
	                }else{
	                	errorData.flag = true;
	                	errorData.message = 'Enter_url_in_url_block';
	                }
	                break;
	          	case 'quote':
	          		if(val.content == ''){
	          			errorData.flag = true;
	          			errorData.message = 'Enter_quote_in_quote_block';
	                }
	                blockdata.push({
	                    type: 'quote',
	                    content: val.content,
	                    modifiedBlock: val.modifiedBlock
	                });
	                break;
	  	      case 'linkEmbed':
	  	    	  if(val.links.length > 0){
	  	    		  blockdata.push({
	  	    			  type: val.type,
	  	    			  links: val.links,
	  	    			  modifiedBlock: val.modifiedBlock
	                  });
	  	    	  }else{
	  	    		  errorData.flag = true;
	                  errorData.message = 'Enter_link_in_url_block';
	              }
	  	    	  break;
			  }
		  });
		  return {data: blockdata, error: errorData};
	  };
	  
	  

	  $scope.cropDetail = [{
		  	w: sharedData.articleHeaderImage.min.width, 
		  	h: sharedData.articleHeaderImage.min.height,
		  	title: "Article image"
	  	}, 
	  	{
	  		w: sharedData.articleHeaderImage.medium.width, 
	  		h: sharedData.articleHeaderImage.medium.height, 
	  		resize: true,
	  		title: "Grid view thumbnail"
	  	}, 
	  	{
	  		w: sharedData.articleHeaderImage.small.width, 
	  		h: sharedData.articleHeaderImage.small.height, 
	  		resize: true,
	  		title: "List view thumbnail"
	  	}];
	    
	  $scope.smallImageDetail = [{
		  	w: sharedData.articleSmallHeaderImage.min.width, 
		  	h: sharedData.articleSmallHeaderImage.min.height,
		  	title: "Article image"
	  	}, 
	  	{
	  		w: sharedData.articleSmallHeaderImage.medium.width, 
	  		h: sharedData.articleSmallHeaderImage.medium.height, 
	  		resize: true,
	  		title: "Grid view thumbnail"
	  	}, 
	  	{
	  		w: sharedData.articleSmallHeaderImage.small.width, 
	  		h: sharedData.articleSmallHeaderImage.small.height, 
	  		resize: true,
	  		title: "List view thumbnail"
	  	}];
	  
	  $scope.removeHeaderImage = function(){
		  $scope.headingBlock.uid = null;
	      $scope.headingBlock.path = null;
	      $scope.headingBlock.imageHeader = '';
	      $scope.headingBlock.imageGridviewThumb = '';
	      $scope.headingBlock.imageGridviewSmallThumb = '';
	      $scope.headingBlock.smallImage = false;
	      $scope.headingBlock.imageHeaderPosX= 0;
	      $scope.headingBlock.imageHeaderPosY= 0;
	      $scope.headingBlock.imageHeaderBackgroundColor= 'transparent';
	      $scope.headingBlock.imageHeaderAngle = 0;
	      $scope.headingBlock.backGroundThumbViewer = '#f5f5ff';
	      $scope.smallImageDetail[0].url =  '';
	      $scope.smallImageDetail[1].url =  '';
	      $scope.smallImageDetail[2].url =  '';
	    };

	    $scope.getViewRatio = function(){
	    	var widthResize = $('.res-rectangle').outerWidth();
	    	return sharedData.articleSmallHeaderImage.min.width / widthResize;
	    }
	    
	    $scope.getWidthOfAspectRatio = function(images){
	    	var ratio = $scope.getViewRatio();
	    	var imgWidth = 0;
	    	if(images.angle != 0){
	    		if( (images.angle % 180) != 0 || (images.angle % 360) != 0){
	    			imgWidth = Math.round(images.resize.height / ratio);
	    		}else{
	    			imgWidth = Math.round(images.resize.width / ratio);
	    		}
	    	}else{
	    		imgWidth = Math.round(images.resize.width / ratio);
	    	}

	    	return imgWidth + "px";
	    	
	    }
	    
	    $scope.getHeaderImgHeight = function(){
	      var h = sharedData.getHeightOfAspectRatio(sharedData.articleHeaderImage.min.width, sharedData.articleHeaderImage.min.height);
	      return h;
	    };
	    
	    $scope.$watch('headingBlock', function(newValue, oldValue) {
	      if(newValue !== oldValue){
	        $scope.headingBlock.modifiedBlock = true;
	      }
	    }, true);
	    
	    $scope.$watch('caBlocksArray',function(newValue, oldValue) {
	      if(newValue.length == oldValue.length){
	        angular.forEach(newValue, function(val, key) {
	          if(!angular.equals(newValue[key], oldValue[key])){
	            if(val.type == "richText"){
	              $scope.caBlocksArray[key].modifiedBlock = true;
	            }
	          }
	        });  
	      }
	    }, true);

	    $scope.cropImagesPopup = function(indexVal){
	      cropImagesModal.show();
	    };

	    $scope.getMaxImageDimention = function(){
	        var maxImageW = 0;
	        var maxImageH = 0;
	        angular.forEach($scope.cropDetail, function(val, key){
	          if(val.w > maxImageW)
	            maxImageW = val.w;
	          if(val.h > maxImageH)
	            maxImageH = val.h;
	        });
	        return ({w: maxImageW, h: maxImageH});
	      }
	    
	    $scope.fillImageData = function(data){
	    	 $scope.headingBlock.uid = data.value.imagedata.data.uid;
	         $scope.headingBlock.path = data.value.imagedata.data.urls[0];
	         $scope.headingBlock.imageHeader = data.value.imagedata.data.urls[1];
	         $scope.headingBlock.imageGridviewThumb = data.value.imagedata.data.urls[2];
	         $scope.headingBlock.imageGridviewSmallThumb = data.value.imagedata.data.urls[3];
	         
	         $scope.headingBlock.imageHeaderPosX = data.value.imagedata.data.images[0].posX;
	         $scope.headingBlock.imageHeaderPosY = data.value.imagedata.data.images[0].posY;
	         $scope.headingBlock.imageHeaderBackgroundColor = data.value.imagedata.data.images[0].backgroundColor;
	         $scope.headingBlock.imageHeaderAngle = data.value.imagedata.data.images[0].angle;
	         $scope.headingBlock.imageHeaderWidth =  $scope.getWidthOfAspectRatio(data.value.imagedata.data.images[0]);
	         
	         $scope.headingBlock.imageGridviewThumbPosX = data.value.imagedata.data.images[1].posX;
	         $scope.headingBlock.imageGridviewThumbPosY = data.value.imagedata.data.images[1].posY;
	         $scope.headingBlock.imageGridviewThumbBackgroundColor = data.value.imagedata.data.images[1].backgroundColor;
	         $scope.headingBlock.imageGridviewThumbAngle = data.value.imagedata.data.images[1].angle;
	         
	         $scope.headingBlock.imageGridviewSmallThumbPosX = data.value.imagedata.data.images[2].posX;
	         $scope.headingBlock.imageGridviewSmallThumbPosY = data.value.imagedata.data.images[2].posY;
	         $scope.headingBlock.imageGridviewSmallThumbBackgroundColor = data.value.imagedata.data.images[2].backgroundColor;
	         $scope.headingBlock.imageGridviewSmallThumbAngle = data.value.imagedata.data.images[2].angle;
	    }
	    
	    $scope.uploadShowSelectHeaderImage = function($files){
	      var tempdata = {};
	      if($files){
	        tempdata = {
	          action: 'crop',
	          files: $files,
	          cdimentions: $scope.cropDetail
	        }
	        
	        var maxImageDimention = $scope.getMaxImageDimention();
	        if($files.length > 0){
	            $files.forEach(function(val, key){
	            	mediaService.localImgSize(val)
		            .then(function(imageSize){
		            	 if((imageSize.width < maxImageDimention.w) || (imageSize.height < maxImageDimention.h)){
		            		 tempdata.action = 'manager';
		            		 
		            		 //Init data
		            		 tempdata.cdimentions  =$scope.smallImageDetail;
		            		 
		            		 
		            		 var modal = managerImagesModal.show(tempdata);
		            		 modal.closePromise.then(function (data){
		                            if(data.value.flag == 'ok'){
		                              //$scope.imageLevel1 = data.value.cropdata.data;
		                              $scope.fillImageData(data);
		                              $scope.getWidthOfAspectRatio(data.value.imagedata.data.images[0]);
		                              if($scope.headingBlock.imageHeaderBackgroundColor != 'transparent'){
		                            	  $scope.headingBlock.backGroundThumbViewer = $scope.headingBlock.imageHeaderBackgroundColor;
		                              }else{
		                            	  $scope.headingBlock.backGroundThumbViewer = '#f5f5ff';
		                              }
		                              $scope.headingBlock.smallImage = true;
		                            }
		                          });
		                  }else{
		                    	  var modal = cropImagesModal.show(tempdata);
		                          modal.closePromise.then(function (data){
		                            if(data.value.flag == 'ok'){
		                              //$scope.imageLevel1 = data.value.cropdata.data;
		                              $scope.headingBlock.uid = data.value.cropdata.data.uid;
		                              $scope.headingBlock.path = data.value.cropdata.data.urls[0];
		                              $scope.headingBlock.imageHeader = data.value.cropdata.data.urls[1];
		                              $scope.headingBlock.imageGridviewThumb = data.value.cropdata.data.urls[2];
		                              $scope.headingBlock.imageGridviewSmallThumb = data.value.cropdata.data.urls[3];
		                              $scope.headingBlock.smallImage = false;
		                            }
		                          });
		                  }
		            });
	            });//for each
	           }
	      } 
	    };
	    $scope.showSelectHeaderImage = function($files){
	      if($files.length > 0){
	        if($files[0].size > 5242880){ 
	          var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
	          modal.closePromise.then(function (data) {
	              if(data.value == 'ok'){
	                $scope.uploadShowSelectHeaderImage($files);
	              }
	          });
	        }
	        else{
	          $scope.uploadShowSelectHeaderImage($files);
	        }
	      }
	      else{
	      }
	    };

	    $scope.recropHeaderImage = function(){
	      
	      var tempdata = {
	        action: 'recrop',
	        image: {
	          uid: $scope.headingBlock.uid,
	          url: $scope.headingBlock.path
	        },
	        cdimentions: $scope.cropDetail
	      };
	      var modal = cropImagesModal.show(tempdata);
	      modal.closePromise.then(function (data){
	        if(data.value.flag == 'ok'){
	          //$scope.imageLevel1 = data.value.cropdata.data;
	          $scope.headingBlock.uid = $scope.headingBlock.imageHeader = $scope.headingBlock.imageGridviewThumb = $scope.headingBlock.imageGridviewSmallThumb = null;
	          $timeout(function(){
	            $scope.headingBlock.uid = data.value.cropdata.data.uid;
	            $scope.headingBlock.imageHeader = data.value.cropdata.data.urls[1];
	            $scope.headingBlock.imageGridviewThumb = data.value.cropdata.data.urls[2];
	            $scope.headingBlock.imageGridviewSmallThumb = data.value.cropdata.data.urls[3];
	            $scope.headingBlock.smallImage = false;
	          });
	        }
	      });
	    };
	    
	    $scope.reModifiedHeaderImage = function(){
	    	//Article image
	    	$scope.smallImageDetail[0].url =  $scope.headingBlock.imageHeader;
	    	$scope.smallImageDetail[0].posX = $scope.headingBlock.imageHeaderPosX;
	    	$scope.smallImageDetail[0].posY = $scope.headingBlock.imageHeaderPosY;
	    	$scope.smallImageDetail[0].backgroundColor = $scope.headingBlock.imageHeaderBackgroundColor;
	    	$scope.smallImageDetail[0].angle = $scope.headingBlock.imageHeaderAngle;
	    	
	    	//Grid-view image
	    	$scope.smallImageDetail[1].url =  $scope.headingBlock.imageGridviewThumb;
	    	$scope.smallImageDetail[1].posX = $scope.headingBlock.imageGridviewThumbPosX;
	    	$scope.smallImageDetail[1].posY = $scope.headingBlock.imageGridviewThumbPosY;
	    	$scope.smallImageDetail[1].backgroundColor = $scope.headingBlock.imageGridviewThumbBackgroundColor;
	    	$scope.smallImageDetail[1].angle = $scope.headingBlock.imageGridviewThumbAngle;
	    	
	    	//List-view image
	    	
	    	$scope.smallImageDetail[2].url =  $scope.headingBlock.imageGridviewSmallThumb;
	    	$scope.smallImageDetail[2].posX = $scope.headingBlock.imageGridviewSmallThumbPosX;
	    	$scope.smallImageDetail[2].posY = $scope.headingBlock.imageGridviewSmallThumbPosY;
	    	$scope.smallImageDetail[2].backgroundColor = $scope.headingBlock.imageGridviewSmallThumbBackgroundColor;
	    	$scope.smallImageDetail[2].angle = $scope.headingBlock.imageGridviewSmallThumbAngle;
	    	
	    	var tempdata = {
	    	        action: 'remanager',
	    	        image: {
	    	          uid: $scope.headingBlock.uid,
	    	          url: $scope.headingBlock.path
	    	        },
	    	        cdimentions: $scope.smallImageDetail
	    	 };
	    	var modal = managerImagesModal.show(tempdata);
	    	modal.closePromise.then(function (data){
	            if(data.value.flag == 'ok'){
	              $scope.headingBlock.uid = $scope.headingBlock.imageHeader = $scope.headingBlock.imageGridviewThumb = $scope.headingBlock.imageGridviewSmallThumb = null;
	              $timeout(function(){
	            	  $scope.fillImageData(data);
	            	  if($scope.headingBlock.imageHeaderBackgroundColor != 'transparent'){
	                	  $scope.headingBlock.backGroundThumbViewer = $scope.headingBlock.imageHeaderBackgroundColor;
	                  }else{
	                	  $scope.headingBlock.backGroundThumbViewer = '#f5f5ff';
	                  }
	                  $scope.headingBlock.smallImage = true
	              });
	            }
	          });
	    }

	    $scope.$on('headerImageSelected', function(event, data){
	      $scope.headingBlock.imageHeader = data.imageHeader;
	      $scope.headingBlock.imageGridviewThumb = data.imageGridviewThumb;
	      $scope.headingBlock.imageGridviewSmallThumb = data.imageGridviewSmallThumb;
	    });
	    
	    $scope.addPage = function(){
	    	var errorData = {
	    	        flag: false,
	    	        message: ''
	    	};
	    	
	        $scope.createArticleBlocks = [];
	        var headingBlock = {
	          type: 'heading',
	          title: $scope.headingBlock.title,
	          subTitle: $scope.headingBlock.subTitle,
	          modifiedBlock: $scope.headingBlock.modifiedBlock
	        };
	        if($scope.headingBlock.title == ''){
	          errorData.flag = true;
	          errorData.message = 'enter_article_title';
	        }
	        
	        var title = $scope.headingBlock.title;
	        if($scope.headingBlock.imageHeader != ''){
	          headingBlock.imageHeader = $scope.headingBlock.imageHeader;
	          headingBlock.imageGridviewThumb = $scope.headingBlock.imageGridviewThumb;
	          headingBlock.imageGridviewSmallThumb = $scope.headingBlock.imageGridviewSmallThumb;
	          headingBlock.headerImageColor = $scope.headingBlock.headerImageColor;
	          
	          headingBlock.imageHeaderPosX = $scope.headingBlock.imageHeaderPosX;
	          headingBlock.imageHeaderPosY = $scope.headingBlock.imageHeaderPosY;
	          headingBlock.imageHeaderBackgroundColor = $scope.headingBlock.imageHeaderBackgroundColor;
	          headingBlock.imageHeaderAngle = $scope.headingBlock.imageHeaderAngle;
	          
	          headingBlock.imageGridviewThumbPosX = $scope.headingBlock.imageGridviewThumbPosX;
	          headingBlock.imageGridviewThumbPosY = $scope.headingBlock.imageGridviewThumbPosY;
	          headingBlock.imageGridviewThumbBackgroundColor = $scope.headingBlock.imageGridviewThumbBackgroundColor;
	          headingBlock.imageGridviewThumbAngle = $scope.headingBlock.imageGridviewThumbAngle;
	          
	          headingBlock.imageGridviewSmallThumbPosX = $scope.headingBlock.imageGridviewSmallThumbPosX;
	          headingBlock.imageGridviewSmallThumbPosY = $scope.headingBlock.imageGridviewSmallThumbPosY;
	          headingBlock.imageGridviewSmallThumbBackgroundColor =  $scope.headingBlock.imageGridviewSmallThumbBackgroundColor;
	          headingBlock.imageGridviewSmallThumbAngle = $scope.headingBlock.imageGridviewSmallThumbAngle;
	          headingBlock.smallImage = $scope.headingBlock.smallImage;
	        }
	        $scope.createArticleBlocks.push(headingBlock);

	        var preparedBlocks = $scope.prepareBlocksData();
	        angular.forEach(preparedBlocks.data, function(val, key){
	        	$scope.createArticleBlocks.push(val);
	        });
	        if(preparedBlocks.error.flag){
	            errorData = preparedBlocks.error;
	        }

	        var data = {
	        		title : title,
	        		blocks : $scope.createArticleBlocks
	        };
	        
	        if($scope.editPageId != null && $scope.editPageId != undefined){
	        	data.id = $scope.editPageId;
	        }
	        
	        if(errorData.flag == false){
		        if($scope.popupData.action == 'create'){
			        $rootScope.$broadcast('create.grand.article.page', data);
		        }else if($scope.popupData.action == 'edit'){
		        	data.index = $scope.popupData.pageIndex;
		        	$rootScope.$broadcast('edit.grand.article.page', data);
		        }

		        $scope.closeThisDialog({flag: 'cancel', data: null});
	        }else{
	        	notifyModal.showTranslated(errorData.message, 'error', null);
	        }
	    };
});
