'use strict';

angular.module('inspherisProjectApp')
  .controller('MainCtrl', function (isAppInitialized, $scope, cachedData, $stateParams, $state, $location, $timeout, $rootScope,
   		$http, userRights, Config, apiCarousel, apiFeedData, galleryModal, apiWidget,  $cookieStore, notifyModal, sharedData,
                $interval, apiCarouselTemplate, $filter, apiPinCommunity,apiTermsOfUse,termsConditionModal) {

    //display options
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor,
      showViewMoreBtn: false
    };
    if($rootScope.userData.role){
	$scope.userCanCreateContent = ($rootScope.userData.role == 'GlobalCommunityManager') ? true : false;
    	$scope.userCanPinCommunity = $scope.userCanCreateContent;
    }
	$scope.userCanSeeAdminWidget = ($rootScope.userData.role == 'GlobalCommunityManager' || $rootScope.userData.administrator == true) ? true : false;
    //for view more feeds
    $scope.page = 0;
  
    $scope.feeds = [];
    $scope.eventSources =[
            [
                {
                  "title": "Example Private Event #1",
                  "description": "This is private event #1 for Zachary Nevin",
                  "start": 1419580244,
                  "end": 1419753044
                },
                {
                  "title": "This is second event",
                  "description": "This is private event #2 for Zachary Nevin",
                  "start": 1419580244,
                  "end": 1419666644
                }
              ]
        ];
    $scope.uiConfig = {
      calendar:{
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    
    if($rootScope.isShowTermsOfUse){
    	apiTermsOfUse.check().then(function(data){
    		$scope.terms = {agree: data};
    		if(!$scope.terms.agree){
        		termsConditionModal.show($scope);
        	}
    	            
    	    $scope.showPolicyPopup = function(){
    	        termsConditionModal.showPolicyPDF($scope);
    	    }
        }, function(err){
        });
    }
    
    $scope.showContentSlider = 'hide';
    $scope.showContentSliderFun = function() {
      if($scope.showContentSlider == 'show')
        $scope.showContentSlider = 'hide';
      else
        $scope.showContentSlider = 'show';
    };
    $rootScope.menu={mobWidget: false};
    $scope.activeWidgets = [];
    $scope.getActiveWidget = function(){
      apiWidget.filteredWidget(null).then(function(data){
          if(data.length){
              $rootScope.menu.mobWidget = true;
          }
        $timeout(function(){
          $scope.activeWidgets = data;
        });
      }, function(err){
      });
    };
    $scope.getActiveWidget();
    $scope.userCanEditWidget = userRights.isUserHasRightToEditWidget($rootScope.userData) ? true : false;

    $scope.showWidgetSlider = 'hide';
    $scope.showWidgetSliderFun = function() {
      if($scope.showWidgetSlider == 'show')
        $scope.showWidgetSlider = 'hide';
      else
        $scope.showWidgetSlider = 'show';
    };

    $scope.resetPageData = function(){
      $scope.feeds = [];
      $scope.page = 0;
    };
    
    $scope.imageSlideshow = [];
    $scope.secondSlider = [];

    $scope.activeView = $rootScope.customTemplate.layout != undefined ? $rootScope.customTemplate.layout.toLowerCase() : "list";//value can be 'grid' or 'list'

    $scope.calendarEvents = [];
    for(var i= 0; i< 5; i++){
      var tempString = '2014-09-0'+(i+1);
      var tempObj = {};

      tempObj.title = "This is event "+(i+1);
      tempObj.date = tempString;

      $scope.calendarEvents.push(tempObj);
    }

    $scope.imageSlideNext = function(){
      $('#image_slider_wide').carousel('next');
    };
    $scope.imageSlidePrev = function(){
      $('#image_slider_wide').carousel('prev');
    };
    $scope.contentSlideNext = function(){
      $('#content_slider').carousel('next');
    };
    $scope.contentSlidePrev = function(){
      $('#content_slider').carousel('prev');
    };

    $scope.widgetSlideNext = function(){
      $('#widget_slider').carousel('next');
    };
    $scope.widgetSlidePrev = function(){
      $('#widget_slider').carousel('prev');
    };

    $scope.toggleView = function(viewtype){
      $scope.activeView = viewtype;
      $timeout(function(){
        $(window).trigger('resize');
      });
    }
    
    $scope.showPopup = function(divRef){
      $('div',divRef).css("display","none");
    };

    // load pinned contents
    if($rootScope.enablePinArticleFeature){
	    $scope.getPinnedContents = function () {
	    	apiFeedData.getPinnedContents().then(function (data) {
	    		$scope.pinnedContents = data;
	
	    		if ($scope.pinnedContents && $scope.pinnedContents.length > 0) {
	    			for (var i = 0; i < $scope.pinnedContents.length; i++) {
	    				angular.forEach($scope.pinnedContents[i].blocks, function (val, key) {
	    					switch (val.type) {
	                        	case 'heading':
	                        		$scope.pinnedContents[i].heading = val;
	                        		break;
	                            case 'richText':
	                            	$scope.pinnedContents[i].richText = val;
	                            	break;
	    					}
	    				});
	    			}
	    		}
	    	}, function (err) {
	    	});
	    };
	    $scope.showTumbType = 'community';
	    $scope.getPinnedContents();
	    $scope.disableGetFeedData = false;
	    $scope.enableTootip = false; // for enable toottip   
	    $scope.getConfig = function () {
		    var config = sharedData.findConfig("PROFILE_TOOTIP");
		    if (typeof (config.name) != 'undefined') {
		    	$scope.enableTootip = config.value ? true : false;
		    }
	    }
	  
	    $scope.getConfig();
	
	    $scope.showLastActivityDate = true;
	    $scope.referer = 'HP';
	    $scope.showLastActivityUser = true;
    }
    //End load pinned contents
    
    // PIN COMMUNITY : load contents of pinned communities
    if($rootScope.enablePinCommunityFeature){
	    $scope.getContentsOfPinnedCommunity = function () {
	    	apiPinCommunity.filteredContentsOnPinnedCommunity().then(function (data) {
	        	$scope.pinnedCommunities = data;
	       	}, function (err) {
	      	});
	    };
	    $scope.getContentsOfPinnedCommunity();
    }
    // END PIN COMMUNITY : load contents of pinned communities
    $scope.itemsPerPage = $rootScope.customTemplate.numberOfFeeds != undefined ? $rootScope.customTemplate.numberOfFeeds : 10;    
    $scope.getFeedData = function(){
    	$scope.disableGetFeedData = true;
    	apiFeedData.getFeeds({language: $rootScope.currentLanguage.code, page: ++$scope.page,showPinnedArticle: !$rootScope.enablePinArticleFeature,itemsPerPage: $scope.itemsPerPage}).then(function(data){
    		$scope.disableGetFeedData = false;
    		$scope.md.status = 2;//finished loading
    		$rootScope.onSearch = false;
    		$scope.feeds = $scope.feeds.concat(data);
    		$scope.md.showViewMoreBtn = ($scope.feeds.length == ($scope.page * $scope.itemsPerPage)) ? true : false;
    	}, function(err){
    		$scope.disableGetFeedData = false;
    		$scope.md.status = 3;//loaading
    	});
    };

    if(isAppInitialized == 'success'){
      //$scope.resetPageData();
      if($rootScope.userData.homePageLanding){
        sharedData.landingPage($rootScope.userData.homePageLanding);
      }//if userData.homePageLanding
      //$scope.page++;
      $scope.getFeedData();
    }
    
    $scope.carouselTemps=[];
    apiCarouselTemplate.allTemplates().then(function(data){
		$scope.carouselTemps=data;
      }, function(err){
		  
      });  
    apiCarousel.getData().then(function(data){
        if(data && data.sliderLevel1){
          $scope.imageSlideshow = data.sliderLevel1;
		angular.forEach(data.sliderLevel1,function(val,key){
			if(val.type == 'advertisement'){
				val.temp =  $filter('filter')( $scope.carouselTemps, {id:val.adTemplate})[0];
			}
		});
        }
        if(data && data.sliderLevel2){
          if(data.sliderLevel2.length < 4){
            $scope.secondSlider = data.sliderLevel2;
          }
          else{
            $scope.secondSlider = data.sliderLevel2.slice(0,4);
          }
        }
      }, function(err){
      });
    
    $scope.openGalleryPopup = function(){
      galleryModal.show();
    };
    

    $scope.updateFeed = function(data, action){
      var feedslen = $scope.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.feeds[i].uid == data.uid){
          if(action == 'remove')
            $scope.feeds.splice(i, 1);
          else if(action == 'replace')
            $scope.feeds[i] = data;
          break;
        }
      }
      //cachedData.put('homeFeeds', $scope.feeds);
    };
    $scope.fetchAndReoderFeeds = function(data){
      //there must be feed's uid parameter in data
      var feedslen = $scope.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.feeds[i].uid == data.uid){
          apiFeedData.getFetchFeed({uid: data.uid, responseType: "feed"}).then(function(fdata){
            $timeout(function(){
              $scope.$apply(function(){
                $scope.feeds.splice(i, 1);
                $scope.feeds.unshift(fdata);
              });  
            });
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          break;
        }
      }
      //cachedData.put('homeFeeds', $scope.feeds);
    };
	$scope.getFeed = function(data){
      //there must be feed's uid parameter in data
          apiFeedData.getFetchFeed({uid: data, responseType: "feed"}).then(function(fdata){
		var feedIndex = $scope.feeds.indexOf($filter('filter')($scope.feeds, {uid:data})[0]);
		apiFeedData.getComments({content: data, itemsPerPage: $rootScope.uiConfig.cmntsPerPage}).then(function(data1){
				fdata.comments =data1;
				fdata.commentCount = data1.length;
		});
		$scope.feeds[feedIndex]=fdata;
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
    };
    
    var languageChnage = $rootScope.$on('language.changed', function (event, data) {
      //feth feeds once language is fetched
      if($rootScope.currentLanguage){
        $scope.resetPageData();
        $scope.getFeedData($rootScope.currentLanguage);
      }
    });
    var feedTranslatedEvent = $scope.$on('feed.translated', function(event, data) {
      var feedslen = $scope.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.feeds[i].sourceId){
          if(($scope.feeds[i].sourceId == data.sourceId) || ($scope.feeds[i].sourceId == data.uid)){
            $timeout(function(){
              $scope.$apply(function(){
                $scope.feeds[i] = data;
              });  
            });
            break;
          }  
        }
        else{
          if(($scope.feeds[i].uid == data.sourceId) || ($scope.feeds[i].uid == data.uid)){
            $timeout(function(){
              $scope.$apply(function(){
                $scope.feeds[i] = data;
              });  
            });
            break;
          }
        }
      }
    });
    var feedAddedEvent = $scope.$on('feed.added', function(event, data) {
      cachedData.remove('homeFeeds');
      $state.reload();
      //scroll to top of the page
      $(window).scrollTop(0);
    });
    var feedEditEvent = $scope.$on('feed.edited', function(event, data) {
      //$state.reload();
      //$scope.fetchAndReoderFeeds(data);
      cachedData.remove('homeFeeds');
      apiFeedData.getFetchFeed({uid: data.uid, responseType: "feed"}).then(function(fdata){
          $scope.updateFeed(fdata, 'replace');
      }, function(err){
          notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    });
    var feedCommentedEvent = $scope.$on('feed.commented', function(event, data) {
      cachedData.remove('homeFeeds');
      $scope.fetchAndReoderFeeds({uid: data.content});
    });
    var feedDeletedEvent = $scope.$on('feed.deleted', function(event, data) {
      $scope.updateFeed({uid: data}, 'remove');
    });
	
     $scope.reoderFeeds = function(data){
      var feedslen = $scope.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.feeds[i].uid == data.uid){
		var feedTemp = $scope.feeds[i];	
		$timeout(function(){
		  $scope.$apply(function(){
		 $scope.feeds.unshift($scope.feeds[i]);
			$scope.feeds.splice(i+1, 1);
		  });  
		});
	        break;
        }
      }
    };
	
    var feedsRefresh = $rootScope.$on('home.feeds.refresh', function(event, data) {
      $scope.resetPageData();
      $scope.getFeedData($rootScope.currentLanguage);
    });
    
    var feedsReorder = $rootScope.$on('home.feeds.reorder', function(event,data) {
	if(data.feed.referenceUid!=undefined){
		$scope.getFeed (data.feed.referenceUid);
	}
	 angular.forEach($scope.feeds,function(val,key){
		 if(val.referenceUid!=undefined && (val.referenceUid == data.feed.referenceUid || val.referenceUid == data.feed.uid)){
			apiFeedData.getComments({content: val.uid, itemsPerPage: $rootScope.uiConfig.cmntsPerPage}).then(function(data){
				val.comments =data;
				val.commentCount = data.length;
			});
		 }
	}); 
	$scope.reoderFeeds({uid: data.feed.uid});
    });

    var feedsReorder = $rootScope.$on('home.feeds.comment.deleted', function(event,data) {
    	angular.forEach($scope.feeds,function(val,key){
    		if((!data.feed.referenceUid && data.feed.uid == val.uid) || (val.referenceUid!=undefined && (val.referenceUid == data.feed.referenceUid || val.referenceUid == data.feed.uid))){
				angular.forEach(val.comments, function(cmnt, key){
					if(cmnt.uid == data.cmtuid){
						val.comments.splice(key, 1);
			            	val.commentCount--;
			            }
				});
    		}
    	}); 
    });

    

    $scope.$on("$destroy", function(){
      //clear all listeners
      feedTranslatedEvent();
      languageChnage();
      feedAddedEvent();
      feedEditEvent();
      feedDeletedEvent();
      feedsRefresh();
      feedCommentedEvent();
    });
  });//controller