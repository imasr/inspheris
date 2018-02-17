'use strict';

angular.module('inspherisProjectApp') 
  .controller('CreateArticleCtrl', function ($scope, $rootScope, notifyModal, $filter, $compile, $http, $translate, Config, apiFeedData,
  	 		selectCommunityModal, selectHeaderImageModal, createArticleModal, ngDialog, apiCommunity, apiTemplate,  selectLocationModal,
    			selectPeopleModal, cropImagesModal, galleryModal, mediaService, managerImagesModal,  previewArticleModal, confirmModal, $q,
     			$window, $timeout, dateTimeService, sharedData,apiAgenda,uiModals,
				userRights,apiPinCommunity,
				createYammerModal,grandArticlePageModal,apiPeoples) {
    
	
    $scope.headerImageColorAlpha = 0.6;
    //$scope.headerImageColor = 'rgba(0, 0, 0)';
    $scope.contentBlocksStatus = {
      caText: true,
      caUploadImg: true,
      caUploadVdo: true,
      caUploadUrl: true,
      caUplodDocGallery: true,
      caUploadQuote: true,
      caUploadEvent: true,
      caWiki: true
    };
	
	// Yammerdata
	$scope.yammerData = [] ;
    
    if($rootScope.enablePinArticleFeature){
    	$scope.userCanPinContent = userRights.isUserHasRightToPinContent($rootScope.userData) ? true : false;
    }
    $scope.pinCommunityTabSelectOptions = [];
    $scope.pinCommunityUids = [];
    $scope.pinCommunityTabSelected = {
        text: "Choose The Pin Tab"
    };
    $scope.popupData = $scope.$parent.ngDialogData;
    $scope.popupTitle = null;
    $scope.modalStatus = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      headerImgDim: {w: sharedData.articleHeaderImage.min.width, h: sharedData.articleHeaderImage.min.height},
      translationService: $rootScope.translationService
    };
    $scope.cropDetail = [
            {
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
    
    $scope.smallImageDetail = [
                         {
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
    
    $scope.isPublishing = false;

    $scope.feed = null; //will have the data of article which we want to edit

    $scope.configureBlocks = ['ritchText', 'imageGallery', 'videoGallery', 'url', 'documentGallery', 'quote', 'event', 'wiki', 'twitter', 'google', 'facebook', 'shrepoint'];
    
    $translate('Select_block_template').then(function (translation) {
      $scope.tplBlockSelected = {
        text: translation,
        uid: null
      };
    });
    
    $scope.communitylist = [];
    $scope.communityForTabsSelection = [];
	  $scope.tabSelection = [];
    //testing drag drop sortable list
    /*var tmpList = [];
    for (var i = 1; i <= 3; i++){
      tmpList.push({
        text: 'Item ' + i,
        value: i
      });
    }*/
  
    $scope.artLanguage = $rootScope.currentLanguage.code;
    $scope.translatedLanguages = [];
    
    $scope.commSelectOptions = [];//used to select single community
    $scope.selectedCommUid = {
              text: "Select",
              commid: null
            };

    $scope.caBlocksArray = [];

    $scope.zenModeImages = {
      top: {
        data: '',
        modifiedBlock: false
      },
      bottom: {
        data: '',
        modifiedBlock: false
      }
    };

    /*$scope.headerImageInfo = {
      imageHeader: '',
      imageGridviewThumb: '',
      imageGridviewSmallThumb: ''
    };*/
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
    	/*if(!$scope.headingBlock.smallImage){
    		return "100%";
    	}	
    	return widthResize * 100 / sharedData.articleSmallHeaderImage.min.width;*/
    	return imgWidth + "px";
    	
    }
    
    $scope.getHeaderImgHeight = function(){
      //calculates the percentage height of header image to show thumbnail on FE properly
      var h = sharedData.getHeightOfAspectRatio(sharedData.articleHeaderImage.min.width, sharedData.articleHeaderImage.min.height);
      return h;
    };
    
    /*-------------for template------------------*/
    $scope.templateInfo = {
      name: '',
      description: '',
      active: true
    };

    $scope.$watch('headingBlock', function(newValue, oldValue) {
      if(newValue !== oldValue){
        $scope.headingBlock.modifiedBlock = true;
      }
    }, true);
    $scope.$watch('zenModeImages.top', function(newValue, oldValue) {
      if(newValue !== oldValue){
        $scope.zenModeImages.top.modifiedBlock = true;
      }
    }, true);
    $scope.$watch('zenModeImages.bottom', function(newValue, oldValue) {
      if(newValue !== oldValue){
        $scope.zenModeImages.bottom.modifiedBlock = true;
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
    
    $scope.createArticleBlocks = []; //to be passed to create article
    $scope.editArtUid = null;
    $scope.selectedCommLabel = 'Community name/Category name';
    $scope.selectedCommunities = [];
    $scope.selectedTabsLabel = $filter('translate')("select_community_tab");

    //more widget options
    $scope.newsFeedIt = true;
    $scope.displayEventOnCommunity = $rootScope.isShowFullCalendar ? true : false;
    $scope.displayEventOnHomePage = $rootScope.isShowFullCalendar ? true : false;
    $scope.displayInCommunityCalendar = false;
    $scope.allowComment = true;
    $scope.addTwitterBlock = false;
    $scope.addGplusBlock = false;
    $scope.addFacebookBlock = false;
    $scope.addSharepointBlock = false;
    //for AuthorizeShare
    $scope.authorizeShare = true;
    $scope.shareWithCommunity = false;
    $scope.shareWithTab = false;
    $scope.showEditAuthorizeShare = false;
    $scope.isPin = false;
    $scope.isOwner = true;
    $scope.writeForUserUid = '';
    $scope.selectedNewAuthor = $filter('translate')("Write Author For");
    
    /*---Get Authorize Share*/
    $scope.authorizeShareTied  = function(communities, communitiesTabs){
    	var communityShare = [];
    	if(communities != null){
    		angular.forEach(communities, function(val, key){
    			communityShare.push(val.authorizeShare.toString());
          });
    		
        	if(communityShare.indexOf("on") > -1 || communityShare.indexOf("custom") > -1){
        		$scope.shareWithCommunity = true;
        		$scope.authorizeShare = true;
        		
        	}else{
        		$scope.shareWithCommunity = false;
        		$scope.authorizeShare = false;
        	}
    	}
    	
    	
    	
    	if(communitiesTabs != null && $scope.shareWithCommunity){
    		
    		var communityTabShare = [];
    		angular.forEach(communitiesTabs, function (val, key) {
                angular.forEach(val.tabs, function (tb, i) {
                	if(tb.selected){
            			communityTabShare.push(tb.authorizeShare.toString());
        			}
                 });
              });
    		if(communityTabShare.indexOf("true") > -1){
    			$scope.shareWithTab = true;
    			$scope.authorizeShare = true;
    		}else{
    			$scope.shareWithTab = false;
    			$scope.authorizeShare = false;
    		}
    	}
    }
    
    $scope.publishDates = {
      startDt: null,
      startTime: null,
      endDt: null,
      endTime: null
    };
    $scope.publishStartDt = '';
    $scope.publishStartTime = '';
    $scope.publishEndDt = '';
    $scope.publishEndTime = '';

    //for ritchText block
    $scope.caRitchTxtBlocks = [];
    $scope.caRitchTxtObj = {type: 'richText', content: '', modifiedBlock: false};
    $scope.sortingLog = [];
  
    //for quote block
    $scope.caQuoteObj = {type: 'quote', content: '', modifiedBlock: false};
    //for URL Block
    $scope.caUrlObj = {type: 'url', path: '', modifiedBlock: false};
    //for event block
    $scope.caEventObj = {type: 'event', title: '', dateFrom: '', timeFrom: '', dateTo: '', timeTo: '', location: '', description: '', invitedPeoples: '',uid:'',participateEventExtension: true,limitSeatOfEvent: false,totalNumberOfSeat: 1, modifiedBlock: false};
        //for wiki block
    $scope.caWikiObj = {type: 'wiki', title:'', subtitle:'', content: '', modifiedBlock: false, image: ''};
    
    //for linkEmbed block
    $scope.caLinkObj = {type: 'linkEmbed', title: '', description: '', files: null, modifiedBlock: false};
    
    $scope.getPublishStartEndDate = function(stDt, stTime, endDt, endTime){
      var errorData = {
        flag: false,
        message: ''
      };
      /*
      if(val.dateTo == '' || val.timeTo == '' || typeof(val.dateTo) == 'undefined' || typeof(val.timeTo) == 'undefined' || !val.dateTo || !val.timeTo){
        errorData.flag = true;
        errorData.message = "Select event end date-time";
      }
      else{
        dtTo = dateTimeService.dateTimeToMsec(val.dateTo, val.timeTo);
      }
      */

      var publishStartDateTime = null;
      if(stDt && stTime){
        /*
        publishStartDateTime = $filter('date')(stDt,'MM/dd/yyyy')+","+$filter('date')(stTime,'hh:mm a');
        publishStartDateTime = Date.parse(publishStartDateTime);
        */
        publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
      }
      var publishEndDateTime = null;
      if(endDt && endTime){
        /*
        publishEndDateTime = $filter('date')(endDt,'MM/dd/yyyy')+","+$filter('date')(endTime,'hh:mm a');
        publishEndDateTime = Date.parse(publishEndDateTime);
        */
        publishEndDateTime = dateTimeService.dateTimeToMsec(endDt, endTime);
      }
      //for error hadling
      if(stDt){
        if(!stTime){
          errorData.flag = true;
          errorData.message = 'select_publish_start_time';
        }
      }
      else if(stTime){
        if(!stDt){
          errorData.flag = true;
          errorData.message = 'select_publish_start_date';
        }
      }
      
      if(endDt){
        if(!endTime){
          errorData.flag = true;
          errorData.message = 'select_publish_end_time';
        }
      }
      else if(endTime){
        if(!endDt){
          errorData.flag = true;
          errorData.message = 'select_publish_end_date';
        }
      }
      
      if(stDt && stTime){
        var currentDateTime = Date.parse(new Date());
        if((publishStartDateTime <= currentDateTime) && ($scope.popupData.action == 'create')){
          //if we are creating article then only we will show this message
          errorData.flag = true;
          errorData.message = 'publish_start_date_should_greater_than_current_date';
        }
        else if(endDt && endTime){
          if(publishEndDateTime <= publishStartDateTime){
            errorData.flag = true;
            errorData.message = 'publish_end_date_should_greater_than_start_date';
          }
        }
      }
      else if(endDt && endTime){
        if(publishEndDateTime <= publishStartDateTime){
          errorData.flag = true;
          errorData.message = 'publish_end_date_should_greater_than_start_date';
        }
      }
      return ({startDtTime: publishStartDateTime, endDtTime: publishEndDateTime, error: errorData});
    };

    // //$scope.artSections = ['caText','caUplodDocGallery','caUploadImg','caUploadVdo','caUploadUrl','caUploadQuote','caUploadEvent','caWiki'];
    // $scope.isDisabledBlock = function (blk) {
    //   //to add disabled class on blocks
    //   if(blk == "caUploadVdo"){
    //     //disable video block if not creating article
    //     if($scope.popupData.type != 'article')  
    //       return true;
    //   }
    //   else if(($scope.popupData.type != 'article') && ($scope.popupData.type != 'content'))
    //     return true;
    //   else return false;
    // };
    $scope.showCaSection = function(secName){
     // if(($scope.popupData.type == 'article') || ($scope.popupData.type == 'content')){
        //if popup is for article or content management then only user can add the block
        var tempPopupType = null;
        switch(secName) {
              case 'caText':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content'){
	                  $scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
	                  tempPopupType = 'article';
            	  }
                  break;
              case 'caUplodDocGallery':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'documentGallery' || $scope.popupData.type == 'content' || $scope.popupData.type == 'event'){
	                  $scope.caBlocksArray.push(angular.copy(sharedData.docGalleryObj));
	                  tempPopupType = 'documentGallery';
            	  }
                  break;
              case 'caUploadDocument':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'documentGallery' || $scope.popupData.type == 'content' || $scope.popupData.type == 'event'){
					  
            		  $scope.caBlocksArray.push(angular.copy($scope.caDocObj));
            	  }
                  break;
              case 'caUploadImg':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'imageGallery' || $scope.popupData.type == 'content' || $scope.popupData.type == 'event'){
            		  $scope.caBlocksArray.push(angular.copy(sharedData.imgGalleryObj));
            		  tempPopupType = 'imageGallery';
            	  }
            	  break;
              case 'caUploadVdo':
                    if($scope.popupData.type == 'article' || $scope.popupData.type == 'event'){
                    	$scope.caBlocksArray.push(angular.copy(sharedData.vdoGalleryObj));
                    }
                    break;
              case 'caUploadUrl':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content'){
            		  $scope.caBlocksArray.push(angular.copy($scope.caUrlObj));
            	  }
            	  break;
              case 'caUploadQuote':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content'){
            		  $scope.caBlocksArray.push(angular.copy($scope.caQuoteObj));
            	  }
            	  break;
              case 'caUploadEvent':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'event' || $scope.popupData.type == 'content'){
            		  //code to show event block
            		  $scope.caBlocksArray.push(angular.copy($scope.caEventObj));
            		  tempPopupType = 'event';
            	  }
            	  break;
              case 'caWiki':
                  $scope.caBlocksArray.push(angular.copy($scope.caWikiObj));
                  break;
              case 'caLinkEmbed':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content' || $scope.popupData.type == 'event'){
	            	  if($scope.caBlocksArray.length > 0){
	            		  $scope.caBlocksArray.push(angular.copy($scope.caLinkObj));
	                      tempPopupType = 'linkEmbed';
	            	  }
            	  }
            	  break;
				 case 'caYammerEmbed':
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content' || $scope.popupData.type == 'event'){
	            	  if($scope.caBlocksArray.length > 0){
	            		  $scope.caBlocksArray.push(angular.copy($scope.caLinkObj));
	                      tempPopupType = 'yammerEmbed';
	            	  }
            	  }
            	  break;				  
              case 'caGrandArticle':
            	  if($scope.popupData.type == 'content'){
            		  tempPopupType = 'grandArticle';
            		  $scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
            	  }
                  break;
              default:
            	  if($scope.popupData.type == 'article' || $scope.popupData.type == 'content'){
            		  $scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
            	  }
        }
        if($scope.popupData.type == "content" && tempPopupType){
          //if there are no blocks added yet, and we don't know what type of article we are creating then only call this functino, it should execute only once
          $scope.popupData.type = tempPopupType;
          var type = $scope.popupData.type;
          if(type === 'documentGallery'){
        	  type = 'document';
          }else if(type === 'grandArticle'){
        	  type = 'article';
          }
          $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, type,$rootScope.enablePinCommunityFeature,null);
          if($scope.communityForTabsSelection.length == 1 && $scope.communityForTabsSelection[0].tabs.length == 1){
            	$scope.communityForTabsSelection[0].tabs[0].selected = true;
            	$scope.authorizeShareTied(null, $scope.communityForTabsSelection);
           }
          $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
          //choose pin tab
          if($scope.selectedCommunities != undefined && $scope.selectedCommunities.length >0){
          	
          	var pinCommunityUids = [];
          	for(var i = 0 ; i< $scope.selectedCommunities.length ; i++){ 
          		if($scope.selectedCommunities[i].isPinnedCommunity == true){
          			pinCommunityUids.push($scope.selectedCommunities[i].uid);
          		}
          		if($scope.isPinCommunity == false){
          			$scope.isPinCommunity = $scope.selectedCommunities[i].isPinnedCommunity;
          		}           		
          	}
          	
          	if(pinCommunityUids != undefined && pinCommunityUids.length > 0){                    
                  $scope.getPinnedCommunityTabs(pinCommunityUids);
          	}
          }
          $scope.preparePopup();
        }
      //}
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
        case 'wiki':
          $scope.showCaSection("caWiki");
          break;
      }
    };
    
    $scope.cropImagesPopup = function(indexVal){
      cropImagesModal.show();
    };

    //for doucument block
    $scope.caDocObj = {type: 'document', title: '', description: '', files: null, modifiedBlock: false};

    $scope.addDocumentBlock = function(){
      $scope.caBlocksArray.push(angular.copy($scope.caDocObj));
    };

    //---------for editing article--------------
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
            case 'topImage':
              $scope.zenModeImages.top.data = val;
              $scope.zenModeImages.top.data.url = val.path;
              break;
            case 'bottomImage':
              //$scope.zenModeImages.bottom.path = val.path;
              $scope.zenModeImages.bottom.data = val;
              $scope.zenModeImages.bottom.data.url = val.path;
              break;
            case 'richText':
              //addContentBlock('ritchText');
              $scope.caBlocksArray.push(val);
              break;
            case 'videoGallery':
            case 'video':
                //$scope.addContentBlock('video');
                $scope.caBlocksArray.push(val);
            break;
            case 'url':
                //$scope.addContentBlock('url');
                $scope.caBlocksArray.push(val);
            break;
            case 'documentGallery':
                // $scope.addContentBlock('documents');
                $scope.caBlocksArray.push(val);
            break;
            case 'event':
                //$scope.addContentBlock('event');
                $scope.caBlocksArray.push(val);
            break;
            case 'wiki':
                //$scope.addContentBlock('wiki');
                $scope.caBlocksArray.push(val);
            break;
            case 'imageGallery':  
            case 'ImageGallery':
                 //addContentBlock('image');
                 $scope.caBlocksArray.push(val);
            break;
            case 'linkEmbed':
                $scope.caBlocksArray.push(val);
            break;
          };//switch
          
        });
      }
    };
    $scope.fillEditData = function(edata) {
        $scope.editArtUid = edata.uid;

        if(edata.template){
        	if(edata.type == 'grandArticle'){
        		$scope.grandArticleTemplateSelected = {
  	                  text: edata.template.name,
  	                  uid: edata.template.uid
  	          };
        	}else{
	          $scope.templateSelected = {
	                  text: edata.template.name,
	                  uid: edata.template.uid
	          };
        	}
        }

      /*  if(typeof(edata.community) != 'undefined'){
          $scope.selectedCommunities.push(edata.community);
          $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
        }

        $scope.selectedCommUid = {
          text: edata.community.label,
          commid: edata.community.uid
        };*/

        if(edata.communityTab){
          //set selected community tab
         /* $scope.communityForTabsSelection = [];
          $scope.communityForTabsSelection.push(edata.community);
          $scope.communityForTabsSelection[0].tabs = [];
          var obj = angular.copy(edata.communityTab);
          obj.selected = true;
          $scope.communityForTabsSelection[0].tabs.push(obj); 
		  
		      //set community tab for edit document
		      $scope.tabsSelection = {};
          $scope.tabsSelection.text = edata.community.label;
          $scope.tabsSelection.tabs = [];
          edata.communityTab.selected = true;
		  
          $scope.tabsSelection.tabs.push(edata.communityTab);
		      $scope.tabSelection.push(edata.communityTab.uid);
		      $scope.selectedCommUid.commid = edata.community.uid; */

          if(edata.community.uid){
              //show popup with preselected community
              var commlen = $scope.communitylist.length;
              for(var i=0; i<commlen; i++){
                if($scope.communitylist[i].uid == edata.community.uid){
                  $scope.selectedCommunities.push($scope.communitylist[i]);
                  $scope.selectedCommUid = {
                    text: $scope.communitylist[i].label,
                    commid: $scope.communitylist[i].uid,
                    tabs : $scope.communitylist[i].tabs
                  };
                  break;
                }
              }//for 
            }//if popupData.data.communityUid
          var type = $scope.popupData.type == 'grandArticle' ? 'article' : $scope.popupData.type;
           $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, type,$rootScope.enablePinCommunityFeature,null);
            angular.forEach($scope.communityForTabsSelection, function (val, key) {
              angular.forEach(val.tabs, function (tb, i) {
            	  //Remove all selected by default for edit
            	  tb.selected = false;
                 if(edata.communityTab.uid == tb.uid) {
                  tb.selected = true;
                }
               });
            });
            
            $scope.authorizeShareTied($scope.selectedCommunities, $scope.communityForTabsSelection);
        }
        
        $scope.publishDates.startDt = edata.publishStartDt;
        $scope.publishDates.startTime = edata.publishStartTime;
        $scope.publishDates.endDt = edata.publishEndDt;
        $scope.publishDates.endTime = edata.publishEndTime;
        
        $scope.newsFeedIt = edata.newsFeed == true ? !edata.newsFeed : edata.newsFeed;
        $scope.isOwner = edata.isOwner;
        $scope.writeForUserUid = edata.writeForUserUid;
        $scope.newsFeedIt = edata.newsFeed == true ? !edata.newsFeed : edata.newsFeed;
        $scope.allowComment = edata.allowComment;
        $scope.displayInCommunityCalendar = edata.displayInCommunityCalendar;
        $scope.caHashTag = edata.hashtags;
        $scope.displayEventOnCommunity = edata.displayEventOnCommunity;
        $scope.displayEventOnHomePage = edata.displayEventOnHomePage;
        $scope.authorizeShare = edata.authorizeShare;
        $scope.isPin = edata.isPin;
        $scope.grandArticlePages = edata.grandArticlePages;
        if(edata.pinnedCommunity != null && edata.pinnedCommunity != ''){
        	$scope.pinCommunityTabSelected = {
                    text: edata.pinnedCommunity.communityTab.tabName,
                    id : edata.pinnedCommunity.id
        	};
        	$scope.isPinCommunity = true;
        }
        
        var editArticleBlocks = edata.blocks;
        if(editArticleBlocks.length > 0){
          $scope.fillBlocksData(editArticleBlocks);//this will populate the data of heading block
          //$scope.caBlocksArray = editArticleBlocks;
        }
    };
    
    $scope.templateOptions = [];
    $scope.tplBlockOptns = [];
    $scope.selectedFeedStatus = {text: 'Select', val: null};
    $scope.feedStatusSelection = [];
    $scope.initializeData = function(){
      var deferred = $q.defer();

      var pr0 = apiCommunity.getCommunitiesData();
      var pr1 = apiTemplate.getTemplates();
      var pr2 = apiTemplate.getBlockTemplates();
      var pr3 = apiFeedData.statusList();
      
      $q.all([pr0, pr1, pr2, pr3]).then(function(data){
            //for data[0]
            //$scope.communitylist = data[0];
            $scope.communitylist = sharedData.getUserCommunities(data[0], $rootScope.userData);
            //empty the array
            $scope.ddSelectOptions = [];
            $scope.communitySelected = {
                text: "Community name/Category name"
            };
            $scope.communitylist.forEach(function(entry){
              var tempObj = {};
              tempObj.text = entry.label;
              tempObj.commid = entry.uid;
			  tempObj.tabs = entry.tabs;
			  tempObj.isPinnedCommunity = entry.isPinnedCommunity;
              $scope.ddSelectOptions.push(tempObj);
            });

            //for data[1]
            $scope.templateOptions = [];
            if(typeof($scope.templateSelected) == 'undefined' || typeof($scope.templateSelected.text) == 'undefined'){
              //if template is not already selected
              $scope.templateSelected = {
                    text: data[1][0].name,
                    uid: data[1][0].uid
                };
            }
            
            $scope.grandArticleTemplateOptions = [];
          
            data[1].forEach(function(val, key){
            	if(val.type == 'Content'){
            		$scope.templateOptions.push({text: val.name, uid: val.uid});
            	}else if(val.type == 'GrandArticle'){
            		$scope.grandArticleTemplateOptions.push({text: val.name, uid: val.uid});
            	}
            });
            
            if(typeof($scope.grandArticleTemplateSelected) == 'undefined' || typeof($scope.grandArticleTemplateSelected.text) == 'undefined'){
                //if template is not already selected
            	$scope.grandArticleTemplateSelected = $scope.grandArticleTemplateOptions[0];           	
            }

          //for data[2]
          $scope.tplBlockOptns = [];
          data[2].forEach(function(val, key){
                $scope.tplBlockOptns.push({text: val.name, uid: val.uid});
          });

          //for data[3]
          angular.forEach(data[3], function(val, key){
            $scope.feedStatusSelection.push({
                  text: val,
                  val: val
                });
          });
          deferred.resolve("success");
      }, function(err){
        deferred.reject(err);
      });//q.all
      return deferred.promise;
    };
  	$scope.quickpostCommSelecte = function(selected,type){
        $scope.selectedCommunities = [];
        $scope.selectedCommunities.push(selected);
        $scope.isPinCommunity = false;
        //choose pin tab
        if($scope.selectedCommunities != undefined && $scope.selectedCommunities.length >0){
        	
        	var pinCommunityUids = [];
        	for(var i = 0 ; i< $scope.selectedCommunities.length ; i++){ 
        		if($scope.selectedCommunities[i].isPinnedCommunity == true){
        			pinCommunityUids.push($scope.selectedCommunities[i].commid);
        		}
        		if($scope.isPinCommunity == false){
        			$scope.isPinCommunity = $scope.selectedCommunities[i].isPinnedCommunity;
        		}           		
        	}
        	
        	if(pinCommunityUids != undefined && pinCommunityUids.length > 0){ 
        		$scope.pinCommunityTabSelected = {
        				text: "Choose The Pin Tab"
        		};                  
                $scope.getPinnedCommunityTabs(pinCommunityUids);
        	}
        }
        switch(type){
          case 'article':
          case 'event':
          case 'imageGallery':
          case 'grandArticle':
            $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, type,$rootScope.enablePinCommunityFeature,null);
          break;
          case 'documentGallery':
            $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, 'document',$rootScope.enablePinCommunityFeature,null);
          break;
        }
    };

    $scope.preparePopup = function () {
      if(typeof($scope.popupData) != 'undefined'){
        //common function for all to set selected community
        if($scope.popupData.action == "create"){
          if($scope.popupData.data && $scope.popupData.data.communityUid){
              //show popup with preselected community
              var commlen = $scope.communitylist.length;
              for(var i=0; i<commlen; i++){
                if($scope.communitylist[i].uid == $scope.popupData.data.communityUid){
                  $scope.selectedCommunities.push($scope.communitylist[i]);
                  $scope.selectedCommUid = {
                    text: $scope.communitylist[i].label,
                    commid: $scope.communitylist[i].uid,
                    tabs : $scope.communitylist[i].tabs
                  };
                  var communityArray = [];
                  communityArray.push($scope.communitylist[i]);
                  var type = $scope.popupData.type;
                  if(type === 'documentGallery'){
                	  type = 'document';
                  }else if(type === 'grandArticle'){
                	  type = 'article';
                  }
                  $scope.communityForTabsSelection = sharedData.communityTabSelectionData(communityArray, type,$rootScope.enablePinCommunityFeature,null);
                  if($scope.communityForTabsSelection.length == 1 && $scope.communityForTabsSelection[0].tabs.length == 1){
                  	$scope.communityForTabsSelection[0].tabs[0].selected = true;
                  	$scope.authorizeShareTied(null, $scope.communityForTabsSelection);
                  }
                  $scope.selectedCommLabel = sharedData.joinCommunityLabels(communityArray);
                  break;
                }
              }//for 
              $scope.authorizeShareTied($scope.selectedCommunities, null);
            }//if popupData.data.communityUid
        }
        
        if($scope.popupData.type == 'article' && $scope.popupData.action == 'create'){
          //$scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
          $scope.popupTitle = 'Create article';
          if($scope.popupData.data){
          }//if popupdata.data
        }//$scope.popupData.action=='create'
        else if($scope.popupData.type == 'article' && $scope.popupData.action == 'edit'){
          $scope.popupTitle = 'Edit_article';

          apiFeedData.getArticleById($scope.popupData.data.uid).then(function(data){
            $scope.feed = data;
            $scope.artLanguage = data.language;

            var editArticleData = apiFeedData.prepareEditArtData($scope.feed);

              $scope.selectedFeedStatus = {
                  text: $scope.feed.editionStatus,
                  val: $scope.feed.editionStatus
                };
              $scope.fillEditData(editArticleData);
              $scope.modalStatus.status = 2;
          }, function(err){
            $scope.modalStatus.status = 3;
          });
          //$scope.fillEditData($scope.popupData.data);
        }
        else if($scope.popupData.type == 'grandArticle' && $scope.popupData.action == 'create'){
            $scope.popupTitle = 'Create grand article';
        }
        else if($scope.popupData.type == 'grandArticle' && $scope.popupData.action == 'edit'){
        	$scope.popupTitle = 'Edit grand article';

            apiFeedData.getArticleById($scope.popupData.data.uid).then(function(data){
            	$scope.feed = data;
            	$scope.artLanguage = data.language;

            	var editArticleData = apiFeedData.prepareEditArtData($scope.feed);

            	$scope.selectedFeedStatus = {
            			text: $scope.feed.editionStatus,
            			val: $scope.feed.editionStatus
            	};
            	$scope.fillEditData(editArticleData);
            	$scope.modalStatus.status = 2;
            }, function(err){
            	$scope.modalStatus.status = 3;
            });
        }
        else if($scope.popupData.type == 'template' && $scope.popupData.action == 'create'){
          $scope.popupTitle = 'Create_article_template';

          $scope.caBlocksArray.push(angular.copy($scope.caRitchTxtObj));
          $scope.modalStatus.status = 2;
        }
        else if($scope.popupData.type == 'template' && $scope.popupData.action == 'edit'){
          $scope.popupTitle = 'Edit_article_template';

          apiTemplate.getByUid($scope.popupData.data.uid).then(function(data){

            $scope.templateInfo = {
              name: data.name,
              description: data.description,
              active: data.active
            };
            
            $scope.templateSelected = {
                    text: data.templateType.name,
                    uid: data.templateType.uid
            };
            
            var blocksData = [];
            if(data.blocks.length > 0){ 
              var editData = apiFeedData.prepareEditArtData(data);
              $scope.fillBlocksData(editData.blocks);
            }
            
            $scope.modalStatus.status = 2;
          }, function(err){
            $scope.modalStatus.status = 3;
          });
        }
        else if($scope.popupData.type == 'event' && $scope.popupData.action == 'create'){
          
            //$scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, 'event');

          $scope.popupTitle = 'Create_event';
          //$scope.caBlocksArray.push(angular.copy($scope.caEventObj));
          $scope.modalStatus.status = 2;
        }
        else if($scope.popupData.type == 'event' && $scope.popupData.action == 'edit'){

          $scope.popupTitle = 'Edit_event';


          apiFeedData.getArticleById($scope.popupData.data.uid).then(function(data){
            $scope.feed = data;
            var editArticleData =  apiFeedData.prepareEditArtData(data);
              $scope.fillEditData(editArticleData)
              $scope.modalStatus.status = 2;
          }, function(err){
            $scope.modalStatus.status = 3;
          });
          //$scope.fillEditData($scope.popupData.data);
        }
        else if($scope.popupData.type == 'documentGallery' && $scope.popupData.action == 'create'){
        


            var tempDocObj = angular.copy(sharedData.docGalleryObj);
            if($scope.popupData.data){
              if($scope.popupData.data.filesFrom){
                tempDocObj.filesFrom = $scope.popupData.data.filesFrom;
              }
            }
            $timeout(function(){
            
              $scope.popupTitle = 'Create_Document';

              //$scope.caBlocksArray.push(tempDocObj);
              $scope.$apply();
            });
            $scope.modalStatus.status = 2;
        }
        else if(($scope.popupData.type == 'documentGallery' || $scope.popupData.type == 'imageGallery') && $scope.popupData.action == 'edit'){
          
          $scope.popupTitle = ($scope.popupData.type == 'documentGallery') ? "Edit Document" : "Edit_Image_Gallery";
          
          apiFeedData.getArticleById($scope.popupData.data.uid).then(function(data){
            $scope.feed = data;
            var editArticleData = apiFeedData.prepareEditArtData(data);
              $scope.fillEditData(editArticleData)
              $scope.modalStatus.status = 2;
          }, function(err){
            $scope.modalStatus.status = 3;
          });
          //$scope.fillEditData($scope.popupData.data);
        }
        else if($scope.popupData.type == 'imageGallery' && $scope.popupData.action == 'create'){
          $scope.popupTitle = "Create_Image_Gallery";
          //$scope.caBlocksArray.push(angular.copy(sharedData.imgGalleryObj));
          $scope.modalStatus.status = 2;
        }
        else{
          $scope.popupTitle = 'Content creation';
          $scope.modalStatus.status = 2;
        }
      }
    };

	  //initializeData
    $scope.initializeData().then(function(success){
      //$scope.$parent.ngDialogData
      //for editing
      $scope.modalStatus.status = 1;
      $scope.preparePopup();
      //if scope.parent.popupData
    }, function(err){
        //something went wrong
    });
    $scope.feedStausLoader = false;
    $scope.feedStautsChanged = function(selected){
      $scope.selectedFeedStatus = selected;
    };

    //*********************************
    $scope.sortableBlocks = {
        update: function(e, ui) {
          //do nothing
        },
        stop: function(e, ui) {
          $scope.$broadcast("rebuild.ckeditor", null);
        },
        cancel: ".fixed"
    };

    $scope.removeBlock = function(indexVal){
      $scope.caBlocksArray.splice(indexVal, 1);
      if(($scope.caBlocksArray.length <= 0) && ($scope.popupData.action != 'edit')){
        //if removed all blocks and in create mode, reinitialize the popup
    	  if($scope.popupData.type == 'grandArticle'){
    		  $scope.grandArticleTemplateSelected = $scope.grandArticleTemplateOptions[0];
    	  }
        $scope.popupData.type = 'content';
        $scope.preparePopup();
      }
    };
    
	$scope.closeCreateYammerPopup = function() 
	{
		 createYammerModal.hide();
	}
    $scope.closeCreateArticlePopup = function(){
      if($scope.popupData.type == 'article' || $scope.popupData.type == 'grandArticle'){
        if($scope.headingBlock.title == '') {
          createArticleModal.hide();
        }
        else {
          if (!$scope.editArtUid) {
            //if article is not in edit mode
            
            var modal = confirmModal.showSaveDraftConfirm($scope, {title:"Save_in_draft",  message: "artice_save_draft_confirmation_msg"});
            modal.closePromise.then(function (data) {
                if(data.value == 'save'){
                  $scope.publishArticle('draft');
                }
                else if(data.value == 'close'){
                  createArticleModal.hide();
                }
            });
            
          }
          else {
            createArticleModal.hide();
          }
        }
      }
      else{
        createArticleModal.hide();
      }
    };

    $scope.eventUids=[];
    $scope.removeEventBlock = function(eventUid,indexVal){
	 //remove from agenda
	$scope.caBlocksArray.splice(indexVal, 1);
		if(($scope.caBlocksArray.length <= 0) && ($scope.popupData.action != 'edit')){
			//if removed all blocks and in create mode, reinitialize the popup
		$scope.popupData.type = 'content';
		$scope.preparePopup();
	} 
	$scope.eventUids.push(eventUid);
    };
	
  	$scope.ddSelectOptions = [];
  	$scope.communitySelected = {};
  	$scope.isPinCommunity = false;
  	$scope.selectCommunity = function(){
  		$scope.isPinCommunity = false;
  	  var selectedCommunities = [];
  	  var array = [];
  	  for(var i = 0 ; i < $scope.selectedCommunities.length ; i++){
  		  if(array.indexOf($scope.selectedCommunities[i].label) === -1){
  			  array.push($scope.selectedCommunities[i].label);
  			selectedCommunities.push($scope.selectedCommunities[i]);
  		  }
  	  }
      var modal = selectCommunityModal.show(selectedCommunities);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.selectedCommunities = data.value.data;
            
            //choose pin tab
            if($scope.selectedCommunities != undefined && $scope.selectedCommunities.length >0){
            	
            	var pinCommunityUids = [];
            	for(var i = 0 ; i< $scope.selectedCommunities.length ; i++){ 
            		if($scope.selectedCommunities[i].isPinnedCommunity == true){
            			pinCommunityUids.push($scope.selectedCommunities[i].uid);
            		}
            		if($scope.isPinCommunity == false){
            			$scope.isPinCommunity = $scope.selectedCommunities[i].isPinnedCommunity;
            		}           		
            	}
            	
            	if(pinCommunityUids != undefined && pinCommunityUids.length > 0){                    
                    $scope.getPinnedCommunityTabs(pinCommunityUids);
            	}
            }
            
            
            $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
            var type = $scope.popupData.type;
            if(type === 'documentGallery'){
            	type = 'document';
            }else if(type === 'grandArticle'){
            	type = 'article';
            }
            $scope.authorizeShareTied($scope.selectedCommunities, null);
            $scope.selectedTabs = [];
            if($scope.communityForTabsSelection.length > 0){
            	angular.forEach($scope.communityForTabsSelection, function(val, key){
            		angular.forEach(val.tabs, function(tb, i){
            			if(tb.selected || tb.defaultSelected){
            				$scope.selectedTabs.push({
            					uid : tb.uid,
            					defaultSelected : tb.defaultSelected,
            					selected : tb.selected
            				});
            			}
            		});
            	});
            }

            $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, type,$rootScope.enablePinCommunityFeature,$scope.selectedTabs);
            if($scope.communityForTabsSelection.length == 1 && $scope.communityForTabsSelection[0].tabs.length == 1){
            	$scope.communityForTabsSelection[0].tabs[0].selected = true;
            	$scope.authorizeShareTied(null, $scope.communityForTabsSelection);
            }
          }
        });
  	};

  	$scope.getPinnedCommunityTabs = function (pinnedCommunities) {
  		apiPinCommunity.getPinnedCommunityTabs({communityUid : pinnedCommunities}).then(function (data) {
  			$scope.pinCommunityTabSelectOptions = [];
  			angular.forEach(data, function(val, key){			
  				$scope.pinCommunityTabSelectOptions.push({
  					text: val.communityTab.tabName,
  					id: val.id
  				});
  			});
        }, function (err) {
        });
    };
    
    $scope.stopPropagation = function(event){
    	var tabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
	    if(tabUids.length > 0){
	    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
	        $scope.selectedTabsLabel +=  " (" + tabUids.length + ")";
	    }else{
	    	$scope.selectedTabsLabel = $filter('translate')("select_community_tab");
	    }
	  $scope.authorizeShareTied(null, $scope.communityForTabsSelection);
      event.stopPropagation();
      
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
      //selectHeaderImageModal.show($scope, $scope.headingBlock);
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

    $scope.bindTemplate = function(tdata) {
      var editData = apiFeedData.prepareEditArtData(tdata);
      if(editData.blocks.length > 0){
        $scope.fillBlocksData(editData.blocks);
      }
    };

    $scope.$watch('tplBlockSelected',function(newval, oldval) {
      if(newval != oldval){
          if($scope.tplBlockSelected.uid){
            apiTemplate.getByUid($scope.tplBlockSelected.uid).then(function(data) {
              $scope.bindTemplate(data);
            }, function(err) {
            });
          }//if tplBlockSelected.uid
      }
    });

    $scope.templateChanged = function(tpl){
    };
    
    $scope.grandArticleTemplateChanged = function(tpl){
    };
    
    $scope.addGrandArticlePage = function(){
    	grandArticlePageModal.show(null, {action: 'create', type: 'grandArticlePage', data: null});
    };
    
    $scope.removeGrandArticlePage = function(index,pageId){
    	if(pageId != undefined && pageId != ''){
    		var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_grand_article_page_confirm"});
    		modal.closePromise.then(function (data) {
    			if (data.value == 'ok') {
    				apiFeedData.deleteGrandArticlePage(pageId).then(function (data) {
    					if(typeof(data.code) != 'undefined' && data.code != null){
    	            		var message= $filter('translate')(data.message);
    	            		var title = $filter('translate')('Error');
    	            		uiModals.alertModal(null,title, message);
    	            	}else{
    	            		$scope.grandArticlePages.splice(index,1);
    	            	}
    				}, function (err) {
    					notifyModal.showTranslated('something_went_wrong', 'error', null);
    				});
    			}
    		});
    	}else{
    		$scope.grandArticlePages.splice(index,1);
    	}
    };
    
    $scope.editGrandArticlePage = function(index){
    	grandArticlePageModal.show(null, {action: 'edit', type: 'grandArticlePage', data: $scope.grandArticlePages[index], pageIndex: index});
    };
    
    $scope.sortableGrandArticlePageOptions = {
			stop: function(e, ui) {
			}
	};
    
    $scope.tplBlockChanged = function(tpl){
      $scope.tplBlockSelected = angular.copy(tpl);
    };

    $scope.editTplBlockChanged = function(tpl){
      $scope.closeThisDialog({flag: 'cancel', data: null});
      $rootScope.openEditTemplatePopup(tpl);
    };

    /*-----for widget: automated translation-------*/
    $scope.$on('widgetLanguageSelected', function(event, data) {
      $scope.artLanguage = data.from;
      $scope.translatedLanguages = data.to;
    });

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
                }
                else{
                  errorData.flag = true;
                  errorData.message = 'Enter_valid_url_in_url_block';
                }
              }
              else{
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
            case 'wiki':
              if(val.content == '' || val.title == ''){
                errorData.flag = true;
                errorData.message = 'Enter_wiki_detail_in_wiki_block';
              }
              blockdata.push({
                  type: 'wiki',
                  title: val.title,
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
    };//prepareBlocksData()

    $scope.getHashtagString = function(){
      var hashtagList = '';
      angular.forEach($scope.caHashTag, function(val, key){
        hashtagList += val.text;
        if(key != ($scope.caHashTag.length - 1))
          hashtagList += ', ';
      });
      return hashtagList;
    };
    
    $scope.grandArticlePages = [];
    $rootScope.$on('create.grand.article.page', function(event, data){
        $scope.grandArticlePages.push(data);
    });
    
    $rootScope.$on('edit.grand.article.page', function(event, data){
    	var index = data.index;
    	if (index !== -1) {
    		$scope.grandArticlePages[index] = data;
    	}
    });
    
    $scope.prepareGrandArticlePageBlocksData = function(grandArticlePageBlocks){
        var errorData = {
          flag: false,
          message: ''
        };
        var blockdata = [];
        grandArticlePageBlocks.forEach(function(val, key){
           switch(val.type) {
		  		case 'heading':
		  			
		  			var headingBlock = {
		  				type: 'heading',
		  				title: val.title,
		  				subTitle: val.subTitle,
		  				modifiedBlock: val.modifiedBlock
		  			}
		  			
		  			
			  		if(typeof(val.imageHeader) != 'undefined'){
		                
				        headingBlock.imageHeader = val.imageHeader;
	  			        headingBlock.imageGridviewThumb = val.imageGridviewThumb;
	  			        headingBlock.imageGridviewSmallThumb = val.imageGridviewSmallThumb;
	  			        headingBlock.headerImageColor = val.headerImageColor;
	  			        
	  			        headingBlock.imageHeaderPosX = val.imageHeaderPosX;
	  			        headingBlock.imageHeaderPosY = val.imageHeaderPosY;
	  			        headingBlock.imageHeaderBackgroundColor = val.imageHeaderBackgroundColor;
	  			        headingBlock.imageHeaderAngle = val.imageHeaderAngle;
	  			        
	  			        headingBlock.imageGridviewThumbPosX = val.imageGridviewThumbPosX;
	  			        headingBlock.imageGridviewThumbPosY = val.imageGridviewThumbPosY;
	  			        headingBlock.imageGridviewThumbBackgroundColor = val.imageGridviewThumbBackgroundColor;
	  			        headingBlock.imageGridviewThumbAngle = val.imageGridviewThumbAngle;
	  			        
	  			        headingBlock.imageGridviewSmallThumbPosX = val.imageGridviewSmallThumbPosX;
	  			        headingBlock.imageGridviewSmallThumbPosY = val.imageGridviewSmallThumbPosY;
	  			        headingBlock.imageGridviewSmallThumbBackgroundColor =  val.imageGridviewSmallThumbBackgroundColor;
	  			        headingBlock.imageGridviewSmallThumbAngle = val.imageGridviewSmallThumbAngle;
	  			        headingBlock.smallImage = val.smallImage;
			  		}
		  			blockdata.push(headingBlock);
		  		break;
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
            	  var files = val.files != undefined ? val.files : val.images;
            	  if(files != undefined && files.length > 0){
            		 files.forEach(function(val, key){
            			 val.uploadStatus = 2;
            		 })
            	  }
                var tempObj = sharedData.getMediaGalleryDataToPost(files, 'image');
                var img_files = tempObj.data;
                errorData = tempObj.error;

                blockdata.push({
                  type: 'ImageGallery',
                  images: img_files,
                  modifiedBlock: val.modifiedBlock
                });
                
                break;
              case 'documentGallery':
             	  var files = val.files != undefined ? val.files : val.documents;
            	  if(files != undefined && files.length > 0){
            		 files.forEach(function(val, key){
            			 val.uploadStatus = 2;
            		 })
            	  }
                var tempObj = sharedData.getMediaGalleryDataToPost(files, 'document');
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
              	  var files = val.files != undefined ? val.files : val.videos;
            	  if(files != undefined && files.length > 0){
            		 files.forEach(function(val, key){
            			 val.uploadStatus = 2;
            		 })
            	  }
                var tempObj = sharedData.getMediaGalleryDataToPost(files, 'embeddedVideo');
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
                  }
                  else{
                    errorData.flag = true;
                    errorData.message = 'Enter_valid_url_in_url_block';
                  }
                }
                else{
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
    
    $scope.$watch('isOwner', function (val) {
    	if(val == "false" || val == false){
    		if($scope.selectedCommunities.length <= 0){
    			uiModals.alertModal(null, $filter('translate')('Warning'), $filter('translate')('Select_Community'));
    			$scope.isOwner = true;
    		}

    		var communityUids = [];
    		$scope.selectedCommunities.forEach(function(val, key){
    			if(communityUids.indexOf(val.uid) == -1){
    				communityUids.push(val.uid);
    			}	
    		});
    		
    		// load users who have role create content on communities
    		var params = {
    				uid : communityUids
    		}
    	    $scope.peopleApi = new apiPeoples();
    	    $scope.peopleApi.getUsersHaveRoleCreationContentOnCommunity(params).then(function(data){
    	    	$scope.users = data;
    	    }, function(err){
    	    });
    	}
    });
    
    $scope.selectNewAthor = function(user){
    	$scope.selectedNewAuthor = user.firstName + " " + user.lastName;
    	$scope.writeForUserUid = user.uid;
    };
    
    //prevent dropdown hiding if clicked on input type inside it
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });
    
    $scope.stopPropagationEvent = function(event){
        event.stopPropagation();
   };
      
    $scope.disablePublishArticle = false;
    $scope.publishArticle = function(status){
      var errorData = {
        flag: false,
        message: ''
      };
      if($scope.selectedCommunities.length <= 0){
    	  errorData.flag = true;
          errorData.message = "Select_Community";
      }
      
      var ctyTabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
      if(ctyTabUids.length <= 0){
        errorData.flag = true;
        errorData.message = "select_community_tab";
      }


      var hashtagList = $scope.getHashtagString();

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
      if($scope.headingBlock.imageHeader != ''){
        //headingBlock.uid = $scope.headingBlock.uid;
        //headingBlock.path = $scope.headingBlock.path;
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

      if(typeof($scope.templateSelected.uid) == 'undefined'){
        errorData.flag = true;
        errorData.message = "select_block_template";
      }

      if($scope.templateSelected.text == "Zen Mode"){
        if($scope.zenModeImages.top.data != ''){
          /*
          $scope.createArticleBlocks.push({
            type: 'topImage',
            path: $scope.zenModeImages.top.path,
            modifiedBlock: $scope.zenModeImages.top.modifiedBlock
          });
          */
          $scope.createArticleBlocks.push({
            type: 'topImage',
            topImage: $scope.zenModeImages.top.data.uid
          });
        }
        if($scope.zenModeImages.bottom.data != ''){
          /*
          $scope.createArticleBlocks.push({
            type: 'bottomImage',
            path: $scope.zenModeImages.bottom.path,
            modifiedBlock: $scope.zenModeImages.bottom.modifiedBlock
          });
          */
          $scope.createArticleBlocks.push({
            type: 'bottomImage',
            bottomImage: $scope.zenModeImages.bottom.data.uid
          });
        }
        if($scope.zenModeImages.top.data == '' || $scope.zenModeImages.bottom.data == ''){
          errorData.flag = true;
          errorData.message = 'Select top/bottom image for zen template';
        }
      }
      
      var preparedBlocks = $scope.prepareBlocksData();
      angular.forEach(preparedBlocks.data, function(val, key){
        $scope.createArticleBlocks.push(val);
      });
      if(preparedBlocks.error.flag){
        errorData = preparedBlocks.error;
      }

      var selectedCommunities = [];
      if($scope.selectedCommunities.length > 0){
        angular.forEach($scope.selectedCommunities, function(val, key){
          selectedCommunities.push(val.uid);
        });
      }
      else{
        errorData.flag = true;
        errorData.message = "Select_Community";
      }
      
      
      var data = {
        language: $scope.artLanguage,
        translatedLanguages: $scope.translatedLanguages,
        //community : selectedCommunities,
        ctyTabUids : ctyTabUids,
        status: status,
        allowComment: $scope.allowComment,
        isOwner: $scope.isOwner,
        displayInCommunityCalendar: $scope.displayInCommunityCalendar,
//        templateUid: $scope.templateSelected.uid,
        newsFeed: $scope.newsFeedIt,
        displayEventOnCommunity : $scope.displayEventOnCommunity,
        displayEventOnHomePage : $scope.displayEventOnHomePage,
        authorizeShare : $scope.authorizeShare,
        isPin : $scope.isPin,
        blocks : $scope.createArticleBlocks
      };
      
      if($scope.isOwner == "false" || $scope.isOwner == false){
    	  data.writeForUserUid = $scope.writeForUserUid; 
      }
      if(status == "draft"){
        data.status = "draft";
      }
      var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.startTime, $scope.publishDates.endDt, $scope.publishDates.endTime);
      if(publishTiming.error.flag){
        errorData.flag = true;
        errorData.message = publishTiming.error.message;
      }
      if(publishTiming.startDtTime){
        data.publicationStartDate = publishTiming.startDtTime;
      }
      if(publishTiming.endDtTime){
        data.publicationEndDate = publishTiming.endDtTime;
      }
      
      if($scope.pinCommunityTabSelected != null && $scope.pinCommunityTabSelected.id != undefined && $scope.pinCommunityTabSelected.id != ''){
    	  data.pinCommunityId = $scope.pinCommunityTabSelected.id;
      }
      
      if(hashtagList != ''){
        data.hashtag = hashtagList;
      }
      if($scope.artLanguage == '' || $scope.artLanguage == 'undefined'){
        errorData.flag = true;
        errorData.message = "select_article_language";
      }

      if($scope.editArtUid){
        data.uid = $scope.editArtUid;
      }

      if($scope.popupData.type == 'grandArticle'){
    	  data.templateUid = $scope.grandArticleTemplateSelected.uid;
    	  if($scope.grandArticlePages.length > 0){
    		  var grandArticlePagesData = [];
    		  angular.forEach($scope.grandArticlePages, function(val, key){
    			  var page = {
    					  id : val.id,
    					  title : val.title,
    					  subTitle : val.subTitle
    			  }
    			  
    			  $scope.createGrandArticlePageBlocks = [];
    			  var preparedGrandArticlePageBlocks = $scope.prepareGrandArticlePageBlocksData(val.blocks);
        	      angular.forEach(preparedGrandArticlePageBlocks.data, function(val, key){
        	    	  $scope.createGrandArticlePageBlocks.push(val);
        	      });
        	      if(preparedGrandArticlePageBlocks.error.flag){
        	    	  errorData = preparedGrandArticlePageBlocks.error;
        	      }
        	      
        	      page.blocks = $scope.createGrandArticlePageBlocks;
        	      grandArticlePagesData.push(page);
    		  });
    		  data.grandArticlePages = grandArticlePagesData;
    	  }else{
    		  errorData.flag = true;
    		  errorData.message = "Add grand article page";
    	  }
      }else{
    	  data.templateUid = $scope.templateSelected.uid;
      }
      
      if(status == 'preview'){
         previewArticleModal.show(null, data);
      }
      else{
        //perfrorm publishing or save to draft action
        if(errorData.flag == false){
          //publish a new article
          $scope.isPublishing = true;
          $scope.disablePublishArticle = true;
          data.type = $scope.popupData.type; 
          apiFeedData.postArticle(data).then(function(data){
              $scope.disablePublishArticle = false;
		if($scope.eventUids.length>0){
			 angular.forEach($scope.eventUids, function(val, key){
			apiAgenda.delete(val).then(function(data){
			}, function(err){
			});	   	  
		  });
		}
              //reset the apiFeedData to fetch new data
              $scope.isPublishing = false;
              createArticleModal.hide(true);
              if($scope.popupData.type !== 'grandArticle'){
            	  sharedData.reditectToArticlePage(data);
              }

              notifyModal.showTranslated('article_create_success', 'success', null);
              if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
            	  var message= $filter('translate')('Content cannot be translated automatic.' + data.errors[0]);
            	  var title = $filter('translate')('Warning');
            	  uiModals.alertModal(null,title, message);
              }
            }, function(err){
              $scope.isPublishing = false;
              $scope.disablePublishArticle = false;
              notifyModal.showTranslated("something_went_wrong", 'error', null);
          });
        }
        else{
            $scope.disablePublishArticle = false;
          notifyModal.showTranslated(errorData.message, 'error', null);
        }
      }
      
    };//publishArticle
    $scope.showGalleryPopup = function(imageArray){
      galleryModal.show({type: 'images', data: imageArray});
    };

    /*-------------for template------------------*/
    $scope.createTemplate = function(status){
      var isEditing = false;
      var errorData = {
        flag: false,
        message: ''
      };
      var postdata = {
        name: $scope.templateInfo.name,
        description: $scope.templateInfo.description,
        templateTypeUid: $scope.templateSelected.uid,
        active: $scope.templateInfo.active
      };
      if($scope.popupData.type == 'template' && $scope.popupData.action == 'edit'){
        postdata.uid = $scope.popupData.data.uid; 
        isEditing = true;
      }

      var preparedBlocks = $scope.prepareBlocksData();
      postdata.blocks = preparedBlocks.data;
      errorData = preparedBlocks.error;

      if($scope.templateInfo.name.length <= 0){
        errorData.flag = true;
        errorData.message = "err_enter_name_of_template";
      }
      if(!errorData.flag){
        
        apiTemplate.createBlock(postdata).then(function(data){
          if(isEditing){
            notifyModal.showTranslated("template_edit_success", 'success', null);
          }
          else{
            notifyModal.showTranslated("template_create_success", 'success', null);
          }
          $scope.closeCreateArticlePopup();
        }, function(err){
          notifyModal.showTranslated("something_went_wrong", 'error', null);
        }); 
      }
      else{
        notifyModal.showTranslated(errorData.message, 'error', null);
      }
    };
  
    /*----------------- for event ----------------*/
    $scope.publishEvent = function(){
      var errorData = {
        flag: false,
        message: ''
      };
      var isEditing = false;
      var isEventBlock = false;
      var postdata = {};
      
      if($scope.popupData.action == 'edit'){
        isEditing = true;
        postdata.uid = $scope.popupData.data.uid;
      }
      
      if($scope.selectedCommunities.length <= 0){
    	  errorData.flag = true;
          errorData.message = "Select_Community";
      }

      var tabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
      if(tabUids.length > 0){
          postdata.communityTabUids = tabUids;
      }else{
          errorData.flag = true;
          errorData.message = "select_community_tab";
      }
      /*
      if($scope.tabSelection.length > 0){
      postdata.communityTabUids = $scope.tabSelection;
      }else{
      errorData.flag = true;
          errorData.message = "select_community_tab";
      }
      */
      postdata.language = $rootScope.currentLanguage.code;
      postdata.displayInCommunityCalendar = $scope.displayInCommunityCalendar;
      postdata.displayEventOnCommunity = $scope.displayEventOnCommunity;
      postdata.displayEventOnHomePage = $scope.displayEventOnHomePage;
      postdata.authorizeShare = $scope.authorizeShare;
      postdata.isPin = $scope.isPin;
      postdata.isOwner = $scope.isOwner;
      postdata.writeForUserUid = $scope.writeForUserUid;
      postdata.allowComment = $scope.allowComment;
      var hashtagList = $scope.getHashtagString();
      if(hashtagList != ''){
        postdata.hashtag = hashtagList;
      }
      postdata.newsFeed = $scope.newsFeedIt;
//      var preparedBlocks = $scope.prepareBlocksData();
//      angular.forEach(preparedBlocks.data, function(val, key){
//        $scope.createArticleBlocks.push(val);
//      });
//      if(preparedBlocks.error.flag){
//        errorData = preparedBlocks.error;
//      }
//      postdata.blocks = $scope.createArticleBlocks;
      var blocksData = [];
      $scope.caBlocksArray.forEach(function(val, key){
        switch(val.type) {
          case 'event':
            var obj = sharedData.getEventDataToPost(val);
            if(obj.error.flag){
              errorData = obj.error;
            }
			
			if(postdata.title == undefined || postdata.title == null){
				postdata.title = obj.data.title;
			}
			blocksData.push({
				uid: obj.data.uid ? obj.data.uid : undefined,
                type: 'event',
                title: obj.data.title,
                dateFrom: obj.data.dateFrom,
                dateTo : obj.data.dateTo,
                location : obj.data.location,
                description: obj.data.description,
                invitedPeopleUids : obj.data.invitedPeoples,
                modifiedBlock: val.modifiedBlock,
                participateEventExtension: obj.data.participateEventExtension,
                limitSeatOfEvent: obj.data.limitSeatOfEvent,
              	totalNumberOfSeat: obj.data.totalNumberOfSeat
            });
            isEventBlock = true;
            break;
         case 'videoGallery':
        	 var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'embeddedVideo');
             var vdo_files = tempObj.data;
             errorData = tempObj.error;

             blocksData.push({
               type: 'videoGallery',
               videos: vdo_files,
               modifiedBlock: val.modifiedBlock
             });
        	 break;
         case 'linkEmbed':
        	 if(val.links.length > 0){
        		 blocksData.push({
                   type: val.type,
                   links: val.links,
                   modifiedBlock: val.modifiedBlock
                 });
             }else{
             	errorData.flag = true;
                 errorData.message = 'Enter_link_in_url_block';
             }
        	 break;
         case 'imageGallery':
             var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'image');
             var img_files = tempObj.data;
             errorData = tempObj.error;

             blocksData.push({
               type: 'ImageGallery',
               images: img_files,
               modifiedBlock: val.modifiedBlock
             });
             
             break;
         case 'documentGallery':
             var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'document');
             var doc_files = tempObj.data;
             errorData = tempObj.error;

             blocksData.push({
               type: 'documentGallery',
               documents: doc_files,
               modifiedBlock: val.modifiedBlock
             });
             break;
        }
      });
      
      //Support video
      postdata.blocks = blocksData;
      
      if(!isEventBlock){
        errorData.flag = true;
        errorData.message = "Must_add_event_block";
      }
      
      var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.startTime, $scope.publishDates.endDt, $scope.publishDates.endTime);
      if(publishTiming.error.flag){
        errorData.flag = true;
        errorData.message = publishTiming.error.message;
      }
      if(publishTiming.startDtTime){
        postdata.publicationStartDate = publishTiming.startDtTime;
      }
      if(publishTiming.endDtTime){
        postdata.publicationEndDate = publishTiming.endDtTime;
      }

      if($scope.pinCommunityTabSelected != null && $scope.pinCommunityTabSelected.id != undefined && $scope.pinCommunityTabSelected.id != ''){
    	  postdata.pinCommunityId = $scope.pinCommunityTabSelected.id;
      }
      
      if(!errorData.flag){
        //post data successfully
        apiFeedData.postFeed(postdata, 'event').then(function(data){       	

          sharedData.reditectToArticlePage(data);
          notifyModal.showTranslated('event_create_success', 'success', null);

          $scope.closeCreateArticlePopup();
//          if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
//          	var message= $filter('translate')('Content cannot be translated automatic.' + data.errors[0]);
//          	var title = $filter('translate')('Warning');
//          	uiModals.alertModal(null,title, message);
//          }
        }, function(err){
          notifyModal.showTranslated("something_went_wrong", 'error', null);
        });
      }
      else{
        notifyModal.showTranslated(errorData.message, 'error', null);
      }
    };

    /*for document gallery*/
    $scope.publishFeed = function(optn){
      if(!$scope.isPublishing){

        var errorData = {
          flag: false,
          message: ''
        };

        var isEditing = false;
        var isEventBlock = false;

        var postdata = {};
        var blockdata = [];

        if($scope.popupData.action == 'edit'){
          isEditing = true;
          postdata.uid = $scope.popupData.data.uid;
        }
        
        if($scope.selectedFeedStatus.val){
          postdata.status = $scope.selectedFeedStatus.val;
        }

        var preparedBlocks = $scope.prepareBlocksData();
        angular.forEach(preparedBlocks.data, function(val, key){
          $scope.createArticleBlocks.push(val);
        });
        angular.forEach(preparedBlocks.data, function(val, key){
          blockdata.push(val);
        });
        postdata.blocks = blockdata;
        errorData = preparedBlocks.error;
        
//        if($scope.selectedCommUid.commid){
//          postdata.community = $scope.selectedCommUid.commid;
//        }
//        else{
//          errorData.flag = true;
//          errorData.message = "Select_Community";
//        }
        if($scope.selectedCommunities.length <= 0){
      	  	errorData.flag = true;
            errorData.message = "Select_Community";
        }
        var tabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
        if(tabUids.length > 0){
            postdata.communityTabUids = tabUids;
        }else{
            errorData.flag = true;
            errorData.message = "select_community_tab";
        }
      
        postdata.language = $rootScope.currentLanguage.code;
        
        var headingBlock = {
          type: 'heading',
          title: $scope.headingBlock.title,
          subTitle: $scope.headingBlock.subTitle,
          modifiedBlock: $scope.headingBlock.modifiedBlock
        };
        if($scope.headingBlock.title == ''){
          errorData.flag = true;
          errorData.message = 'Enter_Title';
        }
        blockdata.push(headingBlock);

        var hashtagList = sharedData.generateHashtagString($scope.caHashTag);
        if(hashtagList != ''){
          postdata.hashtag = hashtagList;
        }

        postdata.newsFeed = $scope.newsFeedIt;
        postdata.allowComment = $scope.allowComment;
        postdata.isOwner = $scope.isOwner;
        postdata.writeForUserUid = $scope.writeForUserUid;
        //For authorize Share
        postdata.authorizeShare = $scope.authorizeShare;
        postdata.isPin = $scope.isPin;
        
        var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.startTime, $scope.publishDates.endDt, $scope.publishDates.endTime);
        if(publishTiming.error.flag){
          errorData.flag = true;
          errorData.message = publishTiming.error.message;
        }
        if(publishTiming.startDtTime){
          postdata.publicationStartDate = publishTiming.startDtTime;
        }
        if(publishTiming.endDtTime){
          postdata.publicationEndDate = publishTiming.endDtTime;
        }

        if($scope.pinCommunityTabSelected != null && $scope.pinCommunityTabSelected.id != undefined && $scope.pinCommunityTabSelected.id != ''){
      	  postdata.pinCommunityId = $scope.pinCommunityTabSelected.id;
        }
        
        if(!errorData.flag){
          //post data successfully
          $scope.isPublishing = true;
          switch($scope.popupData.type){
            case 'documentGallery':
              //for publishing document gallery
              apiFeedData.postFeed(postdata, 'documentGallery').then(function(data){              
                $scope.closeCreateArticlePopup();
                if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
                	var message= $filter('translate')('Content cannot be translated automatic.' + data.errors[0]);
                	var title = $filter('translate')('Warning');
                	uiModals.alertModal(null,title, message);
                }
              }, function(err){
                $scope.isPublishing = false;
                notifyModal.showTranslated('document_create_success', 'success', null);
                notifyModal.showTranslated("something_went_wrong", 'error', null);
              });
              break;
            case 'imageGallery':
              //for publishing image gallery
              apiFeedData.postFeed(postdata, 'imageGallery').then(function(data){

                sharedData.reditectToArticlePage(data);
                notifyModal.showTranslated('imageGallery_create_success', 'success', null);

                $scope.closeCreateArticlePopup();
                if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
                	var message= $filter('translate')(data.errors[0]);
                	var title = $filter('translate')('Warning');
                	uiModals.alertModal(null,title, message);
                }
              }, function(err){
                $scope.isPublishing = false;
                notifyModal.showTranslated("something_went_wrong", 'error', null);
              });
              break;
          };
        }
        else{
          notifyModal.showTranslated(errorData.message, 'error', null); 
        }
      }//if !$scope.isPublishing
    }
	
	
	/* Yammer */
	
	
	
	$scope.showYammerLogin = function()
	{
	      
		 yam.getLoginStatus(
			  function(response) {
				if (response.authResponse) {
					
					console.log(response);
					 
					yam.platform.logout(function (response) {
						console.log(response);
						console.log('LogOut');
						}) ;
					
					/*$scope.$apply(function(){
						
						yam.platform.request({
                            url: "messages.json",     //this is one of many REST endpoints that are available
                            method: "GET",
                            data: {    //use the data object literal to specify parameters, as documented in the REST API section of this developer site

                            },
                            success: function (response) { //print message response information to the console
                                $scope.$apply(function () {
									$scope.yammerData = response.messages;
                                    $rootScope.openCreateFeedPopup({type: 'yammer' , yammardata:response.messages});
                                })
                            },
                            error: function (user) {
                                alert("There was an error with the request.");
                            }
                        });
						
						//
					});
					  /* yam.connect.embedFeed({
					  "config": {
						"use_sso": false,
						"header": false,
						"footer": false,
						"showOpenGraphPreview": false,
						"defaultToCanonical": false,
						"hideNetworkName": true
					  },
					  "container": "#embedded-feed"
					});
					*/
				}
				else {
				  yam.platform.login(function (response) { //prompt user to login and authorize your app, as necessary
					if (response.authResponse) {
					  
					  
					}
				  });
				}
			  }
			);
        
	}
	
	$scope.onAddYammerData = function(data)
	{
		$rootScope.onGetYammerData(data);
	}
    
    
});
