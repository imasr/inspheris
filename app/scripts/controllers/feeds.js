'use strict';

angular.module('inspherisProjectApp')
  .controller('FeedCtrl', function ($scope, $rootScope, $translate, $state,$stateParams, $timeout, $filter, confirmModal, Config, createArticleModal, shareFeedModal, apiFeedData, galleryModal, editQuickpostModal, notifyModal, sharedData) {
            $scope.isIEbrowser = false;
            if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1))
            {
                $scope.isIEbrowser = true;
            }
  this.$onInit = function(){
    $scope.feed = this.feed;
    $scope.showFeedStatus = this.showFeedStatus;
    if($scope.feed != null){
    	$scope.fd = {
    		      creationDate: $filter('date')($scope.feed.creationDate, $rootScope.localDateFormat)
    		    };


    $scope.readMoreText = $filter('translate')("read+");
    $scope.showTumbType = (($state.current.name == 'app.home') || ($state.current.name == 'app.myprofile')) ? "community" : "user";
    if($state.current.name=='app.search.category' || (typeof($stateParams.activetab)!= 'undefined' && $stateParams.activetab !='home')){
    	$scope.showTumbType = "author";
    }
    $scope.showLastActivityDate = true;
    if(($state.current.name == 'app.communityHomeWithTab' && (typeof($stateParams.activetab)!= 'undefined' && $stateParams.activetab !='home')) || $state.current.name == 'app.search.category'){
    	$scope.showLastActivityDate = false;
    }

    // tracking for stat module
    $scope.referer = '';
    if($state.current.name == 'app.home'){
    	$scope.referer = 'HP';
    }else if($state.current.name == 'app.communityHome' || ($state.current.name == 'app.communityHomeWithTab' && typeof($stateParams.activetab)!= 'undefined')){
    	if(typeof($stateParams.referer)!= 'undefined' && $stateParams.referer != 'home'){
    		$scope.referer = 'TABList';
    	}else{
    		$scope.referer = 'CTYHP';
    	}
    }

    $scope.isHeaderImage = false;
    $scope.headerImg = {
      imageHeader: null,
      imageGridviewThumb: null,
      imageGridviewSmallThumb: null,
      imageGridviewThumbPosX: 0,
      imageGridviewThumbPosY: 0,
      imageGridviewThumbBackgroundColor: 'transparent',
      smallImage : false,
      imageGridviewSmallThumbPosX : 0,
      imageGridviewSmallThumbPosY : 0,
      imageGridviewSmallThumbBackround : 'transparent'

    };
    $scope.sharedType = '';
    $scope.artTitle = '';
    $scope.artSubTitle = '';
    $scope.artText = '';
    $scope.mediaGalleryType = '';
    $scope.mediaGalleryFiles = [];
    $scope.gotFirstTextBlock = false;
    $scope.actSentence = null;
    $scope.headerImageColor = '';//initialize it as angular css object for ng-style if header image is present
    $scope.mediaThumbInfo = {
      type: null, //image,doc,video
      count: 0,
      url: ''
    };
    $scope.activityGenerator = {
          username: '',
          artType: $scope.feed.type,
          community: '',
          commlink: encodeURI("#/")
        };
    $scope.eventBlock = null;
    $scope.feedStatusSelection = [];

    $scope.selectedFeedStatus = {text: 'Select', val: null};

    if($scope.feed.editionStatus){
      if($scope.feed.editionStatus == 'draft'){
    	$scope.feed.editionStatus = 'Draft';
      }
      $scope.selectedFeedStatus = {
        text: $scope.feed.editionStatus,
        val: $scope.feed.editionStatus
      };
    }

    $scope.feedStausLoader = false;

    $scope.device = false;
    var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if (mobile) {
        var userAgent = navigator.userAgent.toLowerCase();
        if ((userAgent.search("android") > -1) && (userAgent.search("mobile") > -1)){
        	//ANDROID MOBILE
        	$scope.device = true;
        }else if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1)){
        	//ANDROID TABLET
        	$scope.device = true;
        }else if ((userAgent.search("blackberry") > -1)){
        	//BLACKBERRY DEVICE
        	$scope.device = true;
        }else if ((userAgent.search("iphone") > -1)){
        	//IPHONE DEVICE
        	$scope.device = true;
        }else if ((userAgent.search("ipad") > -1)){
        	//IPAD DEVICE
        	$scope.device = true;
        }
    }

    $scope.userDetail = null; // For mini user tooltip
    $scope.enableTootip = false; // for enable toottip
    if($scope.feed.type != "quickpost"){
        $scope.artTitle = $filter('highlight')($scope.feed.title, $rootScope.highlightText);
    }
    if($scope.feed.blocks){
      if($scope.feed.blocks.length > 0){
        angular.forEach($scope.feed.blocks, function(val, key) {
          switch(val.type) {
            case 'heading':
                if(typeof(val.imageHeader) != 'undefined'){
                  $scope.isHeaderImage = true;
                  $scope.headerImg = {
                    imageHeader: val.imageHeader,
                    imageGridviewThumb: val.imageGridviewThumb,
                    imageGridviewThumbPosX: val.imageGridviewThumbPosX,
                    imageGridviewThumbPosY: val.imageGridviewThumbPosY,
                    imageGridviewThumbBackgroundColor: val.imageGridviewThumbBackgroundColor,
                    imageGridviewSmallThumb: val.imageGridviewSmallThumb,
                    imageGridviewSmallThumbPosX : val.imageGridviewSmallThumbPosX,
                    imageGridviewSmallThumbPosY : val.imageGridviewSmallThumbPosY,
                    imageGridviewSmallThumbBackroundColor : val.imageGridviewSmallThumbBackgroundColor,
                    smallImage : val.smallImage
                  }
                  $scope.headerImageColor = {'background-color': val.headerImageColor};
                }
                if(typeof(val.title) != 'undefined'){
                  //$scope.artTitle = val.title;
                  $scope.artTitle = $filter('highlight')(val.title, $rootScope.highlightText);
                }
                if(typeof(val.subTitle) != 'undefined'){
                  //$scope.artSubTitle = val.subTitle;
                  $scope.artSubTitle = $filter('highlight')(val.subTitle, $rootScope.highlightText);
                }
                break;
            case 'image':
              if($scope.feed.type == 'wiki'){
                $scope.isHeaderImage = true;
                $scope.headerImg = {
                  imageHeader: val.largeUrl,
                  imageGridviewThumb: val.thumbGalleryUrl,
                  imageGridviewSmallThumb: val.thumbGalleryUrl
                }
                //$scope.headerImageColor = {'background-color': val.headerImageColor};
              }
              break;
            case 'richText':
                if(!$scope.gotFirstTextBlock){
                  //$scope.artText = val.content;
                  $scope.artText = $filter('highlight')(val.content, $rootScope.highlightText);
                  $scope.gotFirstTextBlock = true;
                }
                break;
            case 'text':
                if(!$scope.gotFirstTextBlock){
                  //$scope.artText = val.title;
                  $scope.artText = $filter('highlight')(val.title, $rootScope.highlightText);
                  $scope.gotFirstTextBlock = true;
                }
                break;
            case 'ImageGallery':
            case 'imageGallery':
              if(($scope.feed.type == 'quickpost') || ($scope.feed.type == 'imageGallery') || ($scope.feed.type == 'follower quickpost')){
            	  $scope.mediaGalleryType = 'imageGallery';
                  $scope.mediaGalleryFiles = val.images;
              }else if(($scope.feed.type == 'share' && $scope.feed.sharedCommunityTab != 'undefined' && $scope.feed.sharedCommunityTab.tabType != 'article')){
            	  $scope.mediaGalleryType = 'imageGallery';
                  $scope.mediaGalleryFiles = val.images;
              }
              //disabled specifically for Canal
              /*if($scope.feed.type == 'imageGallery'){
                $scope.mediaThumbInfo = {
                  type: 'image',
                  count: val.images.length,
                  url: val.images[0].thumbGalleryUrl
                };
              }*/
              break;
            case 'documentGallery':
              if($scope.feed.type == 'document' || $scope.feed.type == 'quickpost' || $scope.feed.type == 'follower quickpost'){
                $scope.mediaGalleryType = 'documentGallery';
                $scope.mediaGalleryFiles = val.documents;
                /*$scope.mediaGallery.push({type: 'imageGallery'});
                $scope.mediaGallery.push({images: val.images});*/
              }else if(($scope.feed.type == 'share' && $scope.feed.sharedCommunityTab != 'undefined' && $scope.feed.sharedCommunityTab.tabType != 'article')){
                  $scope.mediaGalleryType = 'documentGallery';
                  $scope.mediaGalleryFiles = val.documents;
              }
              break;
            case 'videoGallery':
              if($scope.feed.type == 'quickpost' || $scope.feed.type == 'follower quickpost'){
                $scope.mediaGalleryType = 'videoGallery';
                $scope.mediaGalleryFiles = val.videos;
                /*$scope.mediaGallery.push({type: 'imageGallery'});
                $scope.mediaGallery.push({images: val.images});*/
              }else if(($scope.feed.type == 'share' && $scope.feed.sharedCommunityTab != 'undefined' && $scope.feed.sharedCommunityTab.tabType != 'article')){
            	  $scope.mediaGalleryType = 'videoGallery';
                  $scope.mediaGalleryFiles = val.videos;
              }
              break;
            case 'event':
              if($scope.feed.type == 'event' || ($scope.feed.type == 'share')){
				if($scope.eventBlock == undefined || $scope.eventBlock == null){
					$scope.eventBlock = val;
				}

                if($scope.artTitle == undefined || $scope.artTitle == null){
					$scope.artTitle = $filter('highlight')(val.title, $rootScope.highlightText);
				}

				if($scope.artSubTitle == undefined || $scope.artSubTitle == null){
					$scope.artSubTitle = $filter('highlight')(val.location, $rootScope.highlightText);
				}

              }
              break;
            case 'linkEmbed':
            	if($scope.feed.type == 'quickpost' || $scope.feed.type == 'follower quickpost'){
                    $scope.mediaGalleryType = 'linkEmbed';
                    $scope.mediaGalleryFiles = val.links;
                 }
            	break;
            case 'reference':
            	$scope.sharedType = val.refType;
              break;
          }
        });
      }
    }

    if($scope.feed.type == 'follower quickpost'){
    	$scope.showFeedStatus = false;
    }else if($scope.showFeedStatus){

    	$scope.feedStatusSelection.push({text: "Archived",val: "Archived"},{text: "Draft",val: "Draft"},{text: "publish",val: "publish"});
      if(($rootScope.userData.uid == $scope.feed.author.uid) || ($scope.feed.community != undefined && $scope.feed.community.canEdit)){
        $scope.showFeedStatus = true;
      }
      /*else if($rootScope.userData.communityRoles){
        var ucrl = $rootScope.userData.communityRoles;
        var roleLen = ucrl.length;
        for(var i = 0; i<roleLen; i++){
          if((ucrl[i].communityUid == $scope.feed.community.uid && ucrl[i].role == 'CommunityManager')){
            $scope.showFeedStatus = true;
            break;
          }
          else{
            $scope.showFeedStatus = false;
          }
        }
      }*/
    }
    /*$scope.isHeaderImage = function(view) {
      var imgurl = '';
      if(typeof($scope.feed.content.heading.imageHeader) != 'undefined'){
        return true;
      }
      else{
        return false;
      }
    };*/

    if($scope.feed.translate){
    	var feedTranslatedEvent = $scope.$on('comment.translated', function(event, data,comments) {
    		$scope.feed = data;
    		$scope.feed.comments=comments;
            $scope.gotFirstTextBlock = false;
            if($scope.feed.blocks){
                if($scope.feed.blocks.length > 0){
                  angular.forEach($scope.feed.blocks, function(val, key) {
                    switch(val.type) {
                      case 'heading':
                          if(typeof(val.imageHeader) != 'undefined'){
                            $scope.isHeaderImage = true;
                            $scope.headerImg = {
                              imageHeader: val.imageHeader,
                              imageGridviewThumb: val.imageGridviewThumb,
                              imageGridviewSmallThumb: val.imageGridviewSmallThumb
                            }
                            $scope.headerImageColor = {'background-color': val.headerImageColor};
                          }
                          if(typeof(val.title) != 'undefined'){
                            //$scope.artTitle = val.title;
                            $scope.artTitle = $filter('highlight')(val.title, $rootScope.highlightText);
                          }
                          if(typeof(val.subTitle) != 'undefined'){
                            //$scope.artSubTitle = val.subTitle;
                            $scope.artSubTitle = $filter('highlight')(val.subTitle, $rootScope.highlightText);
                          }
                          break;
                      case 'image':
                        if($scope.feed.type == 'wiki'){
                          $scope.isHeaderImage = true;
                          $scope.headerImg = {
                            imageHeader: val.largeUrl,
                            imageGridviewThumb: val.thumbGalleryUrl,
                            imageGridviewSmallThumb: val.thumbGalleryUrl
                          }
                          //$scope.headerImageColor = {'background-color': val.headerImageColor};
                        }
                        break;
                      case 'richText':
                          if(!$scope.gotFirstTextBlock){
                            //$scope.artText = val.content;
                            $scope.artText = $filter('highlight')(val.content, $rootScope.highlightText);
                            $scope.gotFirstTextBlock = true;
                          }
                          break;
                      case 'text':
                          if(!$scope.gotFirstTextBlock){
                            //$scope.artText = val.title;
                            $scope.artText = $filter('highlight')(val.title, $rootScope.highlightText);
                            $scope.gotFirstTextBlock = true;
                          }
                          break;
                      case 'ImageGallery':
                      case 'imageGallery':
                        if(($scope.feed.type == 'quickpost') || ($scope.feed.type == 'share') || ($scope.feed.type == 'imageGallery') || ($scope.feed.type == 'follower quickpost')){
                          $scope.mediaGalleryType = 'imageGallery';
                          $scope.mediaGalleryFiles = val.images;
                        }
                        //disabled specifically for Canal
                        /*if($scope.feed.type == 'imageGallery'){
                          $scope.mediaThumbInfo = {
                            type: 'image',
                            count: val.images.length,
                            url: val.images[0].thumbGalleryUrl
                          };
                        }*/
                        break;
                      case 'documentGallery':
                        if($scope.feed.type == 'document' || $scope.feed.type == 'quickpost' || $scope.feed.type == 'share' || $scope.feed.type == 'follower quickpost'){
                          $scope.mediaGalleryType = 'documentGallery';
                          $scope.mediaGalleryFiles = val.documents;
                          /*$scope.mediaGallery.push({type: 'imageGallery'});
                          $scope.mediaGallery.push({images: val.images});*/
                        }
                        break;
                      case 'videoGallery':
                        if($scope.feed.type == 'quickpost' || $scope.feed.type == 'share' || $scope.feed.type == 'follower quickpost'){
                          $scope.mediaGalleryType = 'videoGallery';
                          $scope.mediaGalleryFiles = val.videos;
                          /*$scope.mediaGallery.push({type: 'imageGallery'});
                          $scope.mediaGallery.push({images: val.images});*/
                        }
                        break;
                      case 'event':
                        if($scope.feed.type == 'event'){
							if($scope.eventBlock == undefined || $scope.eventBlock == null){
								$scope.eventBlock = val;
							}

							if($scope.artTitle == undefined || $scope.artTitle == null){
								$scope.artTitle = $filter('highlight')(val.title, $rootScope.highlightText);
							}

							if($scope.artSubTitle == undefined || $scope.artSubTitle == null){
								$scope.artSubTitle = $filter('highlight')(val.location, $rootScope.highlightText);
							}
                        }
                        break;
                    }
                  });
                }
              }

    });
  }

    /*
    var feedEditEvent = $scope.$on('feed.edited', function(event, data) {

    });

    $scope.$on("$destroy", function(){
      //clear all listeners
      feedEditEvent();
    });
    */
  }
    $scope.feedStautsChanged = function(selected){
      $scope.feedStausLoader = true;
      apiFeedData.changeStatus({uid: $scope.feed.uid, editionStatus: selected.val}).then(function(data){
        $scope.feedStausLoader = false;
        $scope.selectedFeedStatus = selected;
        notifyModal.showTranslated('status_update_suceess', 'success', null);
        $scope.selectedFeedStatus = angular.copy(selected);
      }, function(err){
        $scope.feedStausLoader = false;
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };

    $scope.getConfig = function(){
    	var config = sharedData.findConfig("PROFILE_TOOTIP");
    	if(typeof(config.name) != 'undefined'){
    		 $scope.enableTootip = config.value ? true : false;
    	}
    }
    $scope.getConfig();

    $scope.generateActSentence = function(argument) {
      //*** specific for canal branch ***
      if($scope.feed.community && $scope.feed.lastAction && $scope.feed.lastActivityUser){
    	  var communityTab = $stateParams.activetab;
    	  var lastAction =  typeof(communityTab) != 'undefined' && communityTab != 'home' ? "create" : $scope.feed.lastAction;
          var userdetail = typeof(communityTab) != 'undefined' && communityTab != 'home' ? $scope.feed.author : $scope.feed.lastActivityUser;
          $scope.isShowWroteFor = false;
          if(lastAction == 'create'){
        	  if(!$scope.feed.isOwner && $scope.feed.isTransferred){
        		  userdetail = $scope.feed.wroteFor;
        		  $scope.isShowWroteFor = true;
        	  }else{
        		  userdetail = $scope.feed.author;
        	  }
          }
	  if(typeof($rootScope.onSearch) != 'undefined' && $rootScope.onSearch){
        	  lastAction = "create";
        	  if(!$scope.feed.isOwner && $scope.feed.isTransferred){
        		  userdetail = $scope.feed.wroteFor;
        		  $scope.isShowWroteFor = true;
        	  }else{
        		  userdetail = $scope.feed.author;
        	  }
          }

          if(typeof($scope.feed.editionStatus) != 'undefined' && $scope.feed.editionStatus.toLowerCase() == 'draft'){
        	  lastAction = "draft";
        	  if(!$scope.feed.isOwner && $scope.feed.isTransferred){
        		  userdetail = $scope.feed.wroteFor;
        		  $scope.isShowWroteFor = true;
        	  }else{
        		  userdetail = $scope.feed.author;
        	  }
          }

          $scope.userDetail =  userdetail;

          $scope.activityGenerator.username = userdetail.firstName+" "+userdetail.lastName;

          $scope.activityGenerator.community = $scope.feed.community.label;

          $scope.activityGenerator.userlink = $rootScope.generateLink('userProfilePage', userdetail);

          $scope.activityGenerator.commlink = $rootScope.generateLink('communityHomePage', $scope.feed.community);

          if($scope.enableTootip){
        	  if( !$scope.device){
        		  $scope.activityGenerator.toolTipEvent = "onmouseover='showTooltip(this,event)'  onmouseleave='showTooltip(this,event)'";
        	  }

          }

          switch(lastAction){
            case 'create':
              if($scope.activityGenerator.artType == "imageGallery"){
            	  $translate('user_published_imageGallery_in_community', $scope.activityGenerator).then(function (translation) {
                      $scope.actSentence = translation;
                    });
              }else{
            	  $translate('user_published_type_in_community', $scope.activityGenerator).then(function (translation) {
                      $scope.actSentence = translation;
                   });
              }
            break;
            case 'edit':
              if($scope.activityGenerator.artType == "imageGallery"){
            	  $translate('user_published_imageGallery_in_community', $scope.activityGenerator).then(function (translation) {
                      $scope.actSentence = translation;
                    });
              }else{
            	  $translate('user_published_type_in_community', $scope.activityGenerator).then(function (translation) {
                      $scope.actSentence = translation;
                    });
              }
            break;
            case 'comment':
	            if($scope.activityGenerator.artType == "imageGallery"){
	            	$translate('user_commented_imageGallery_in_community', $scope.activityGenerator).then(function (translation) {
	                    $scope.actSentence = translation;
	                  });
	            }else{
	            	$translate('user_commented_type_in_community', $scope.activityGenerator).then(function (translation) {
	                    $scope.actSentence = translation;
	                  });
	            }
            break;
            case 'draft':
            	 if($scope.activityGenerator.artType == "imageGallery"){
            		 $translate('user_created_draft_imageGallery_in_community', $scope.activityGenerator).then(function (translation) {
                         $scope.actSentence = translation;
            		 });
            	 }else{
            		 $translate('user_created_draft_type_in_community', $scope.activityGenerator).then(function (translation) {
                     $scope.actSentence = translation;
            		 });
            	 }
            break;
          }//switch

      }else if ($scope.feed.type == "follower quickpost"){
    	  $scope.activityGenerator.username = $scope.feed.author.firstName+" "+$scope.feed.author.lastName;
    	  $scope.activityGenerator.userlink = $rootScope.generateLink('userProfilePage', $scope.feed.author);
    	  $scope.userDetail = $scope.feed.author;  //for mini profile tool-tip
    	  if($scope.enableTootip){
        	  if( !$scope.device){
        		  $scope.activityGenerator.toolTipEvent = "onmouseover='showTooltip(this,event)'  onmouseleave='showTooltip(this,event)'";
        	  }
          }
    	  $translate('user_write_on_your_wall', $scope.activityGenerator).then(function (translation) {
              $scope.actSentence = translation;
            });
      }

      if($scope.feed.type == "share"){
        var len = $scope.feed.blocks.length;

        for(var i=0; i<len; i++){
          if($scope.feed.blocks[i].type == 'reference'){
            $scope.activityGenerator.artType = $scope.feed.blocks[i].refType;
            $scope.sharedType = $scope.feed.blocks[i].refType;
            break;
          }
        }
        if($scope.activityGenerator.artType == "imageGallery"){
        	$translate('user_shared_imageGallery_in_community', $scope.activityGenerator).then(function (translation) {
                $scope.actSentence = translation;
             });
        }else{
        	$translate('user_shared_type_in_community', $scope.activityGenerator).then(function (translation) {
                $scope.actSentence = translation;
              });
        }

      }
    };
    $scope.generateActSentence();

    $scope.getHeaderImage = function(view) {
      var imgurl = '';
      if(view == 'grid'){
        if(typeof($scope.feed.content.heading.imageGridviewThumb) != 'undefined')
          imgurl = 'url('+$scope.feed.content.heading.imageGridviewThumb+')';
      }
      if(view == 'list'){
        if(typeof($scope.feed.content.heading.imageGridviewSmallThumb) != 'undefined')
          imgurl = 'url('+$scope.feed.content.heading.imageGridviewSmallThumb+')';
      }
      return imgurl;
    };

    $scope.deleteFeed = function(feedId){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            apiFeedData.delete(feedId);
//            $state.reload();
          }
      });
    };

    $scope.goToArticle = function(){
      $state.go("app.communityHomeWithArticle", { name: $scope.feed.community.label, commuid: $scope.feed.community.uid, activetab: $scope.feed.communityTab.uid, articleid: $scope.feed.uid});
    };

    var feedCommentedEvent = $scope.$on('feed.changeActSentence', function(event) {
       $scope.generateActSentence();
    });
    }
  });
