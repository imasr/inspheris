'use strict';

angular.module('inspherisProjectApp')
  .controller('CommunityHomeCtrl', function (isAppInitialized, $stateParams, secondMenuService, $state, $rootScope, $timeout, $scope, Config, sharedData, userRights, UiConfig, apiFeedData, apiArticle, apiCommunity, shareFeedModal, apiWidget, createCommunityModal, confirmModal, cachedData, communityMemberMgrModal, memberViewerModal,notifyModal,uiModals,$filter,$http,apiEvent,participantModal,$q) {

    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor,
      showViewMoreBtn: false
    };
    $scope.Communitypages=true;
    $scope.pathFolders = [];
    
    $scope.typeCommunityTab = null;
    //display options
    $scope.feedTranslateOptn = UiConfig.feedTranslateOptn;

    $scope.feeds = [];
    $scope.feed = null;
    $scope.activeWidgets = [];
    $rootScope.menu={mobWidget: false};
    $scope.showDocumentUploadBlk = UiConfig.showDocumentUploadBlock ? userRights.userCanCreateContent($rootScope.userData) : false;
    $scope.userCanEditWidget = userRights.isUserHasRightToEditCommunityWidget($stateParams.commuid, $rootScope.userData) ? true : false;
    
    $scope.hideshowdrop=false;
    $scope.comm = [];
    $scope.menuTabs = [];
    $scope.tabsFirstArray = [];
    $scope.tabsSecondArray = [];
    $scope.currentTab = null;
    $scope.stickyCoverPrams = {
      top: 50,
      offset: 0
    };
    $scope.coverImageCss = {'height':'70px'}; //used for managing sticky cover image

    //for view more feeds
    $scope.totalFeeds = 0;
    $scope.total = 0;
    $scope.page = 0;
    $scope.pinnedTab = false;
    $scope.count = new Array(parseInt(8));
    $scope.coverData = {
      type: 'community', //this type is used in UserListCtrl, don't change this
      uid: null,
      label: '',
      subtitle: '',
      followerCount: 0,
      contributorCount: 0,
      bannerUrl: null,
      logoUrl: null,
      logoHref: null,
      isPrivate: false,
      showCoverEditBtn: false,
      isReady: false,
      showFollosers: true,
      showContributors: true,
      showSubscribeBtn: {
        flag: false,
        title: '',//Subscribe, Unsubscribe,
        val: '' //not subscribe, subscribe
      }
    };

    $scope.documentArray = [];
    $scope.hashtags = [];

    $scope.switchViewButton = ($state.current.name == "app.communityHomeWithArticle") ? false : true;
    $scope.activeView = 'list';//show or hide the switch view buttons on second menu

    $scope.selectedAuthorUids = [];
    $scope.dateFrom = null;
    $scope.dateTo = null;
    
    $scope.initializeData = function(){
    	var deferred = $q.defer();
    	var pr0 = apiFeedData.getContentAuthorsByCommunityOrAuthor({communityUid: $stateParams.commuid});
    	$q.all([pr0]).then(function(data){

    		//for data[0]
    		$scope.authors = data[0];
    		deferred.resolve("success");
    	}, function(err){
    		notifyModal.showTranslated('something_went_wrong', 'error', null);
    		deferred.resolve("error");
    	});
    	return deferred.promise;
    };
    $scope.initializeData().then(function(msg){

    });
    
    $scope.stopPropagation = function(event){
        event.stopPropagation();
    };
    
    $scope.selectedLanguage = {
      name: "Display in",
      code: null
    };
    $scope.languageOptions = angular.copy($rootScope.languages);
    $scope.feedLanguageChanged = function(selected){
      var params = {
        language: $scope.selectedLanguage.code
      };
      if($scope.feed.sourceId){
        params.uid = $scope.feed.sourceId;
      }
      else{
        params.uid = $scope.feed.uid; 
      }
      apiFeedData.getFetchFeed(params).then(function(data){
           $rootScope.$broadcast('feed.translated', data);
        }, function(err){
        });
    };
    
    $scope.resetPageData = function(){
      $scope.feeds = [];
      $scope.page = 0;
    };

    $scope.showComUserMgr = function(){
      communityMemberMgrModal.show({community: $scope.comm});
    };

    $scope.getActiveWidget = function(){
      apiWidget.filteredWidget({communityUid : $stateParams.commuid}).then(function(data){
          if(data.length){
              $rootScope.menu.mobWidget = true;
          }
        $scope.activeWidgets = data;
      }, function(err){
      });
    };
    
    // to improve performance should load widget only on communit page
    if($stateParams.articleid == undefined || $stateParams.articleid == ''){
    	$scope.getActiveWidget();
    }    

    $scope.coverEdit = function(){
      var modal = createCommunityModal.show({action: 'edit', type: 'community', mode:'info', data: {'uid' : $stateParams.commuid}});
      modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              //community edited sucessfully now reload the page
              $state.reload();
            }
          });
    };

    $scope.changeProfilePic = function(){
      var modal = createCommunityModal.show({action: 'edit', type: 'community', mode:'images', data: {'uid' : $stateParams.commuid}});
      modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              //community edited sucessfully now reload the page
              $state.reload();
            }
          });
    };

    $scope.toggleView = function(viewtype){
      $scope.activeView = viewtype;
      $timeout(function(){
        $(window).trigger('resize');
      }, 100);
    };
    
    $scope.article = {
      heading: null,
      topImage: null,
      bottomImage: null
    };
    
    $scope.showfilters=function(active){
        if($scope.hideshowdrop===true){
            $scope.hideshowdrop=false;
            $scope.activeViewFilter='';
        }else{
            $scope.hideshowdrop=true;
            $scope.activeViewFilter=active;
        }
    };
    
    $scope.show=true;
    $scope.show1=true;
    $scope.show2=true;
    $scope.show3=true;
    $scope.hide=true;
    $scope.hide={}
    $scope.clickhow=function(event){
        console.log(event)
        if($scope.hide,   $scope.hide){
            $scope.hide.event=false;
        }else{
            $scope.hide.event=true;
        }
    }
    $scope.feedProject=[  
        {  
           "phase":"Development",
           "child":[{
                "plan1":"planification development",
                "plan2":"widget de module"
            }]
        },{  
           "phase":"Communictaion",
             "child":[{
                "plan1":"planification development",
                "plan2":"widget de module"
            }]
        },{  
           "phase":"HR",
              "child":[{
                "plan1":"planification development",
                "plan2":"widget de module"
            }]
        },{  
           "phase":"Stretegies de communiction",
             "child":[{
                "plan1":"planification development",
                "plan2":"widget de module"
            }]
        }
    ];
    $scope.feedProject2=[  
        {  
           "phase":"DCF",
            "child":[{
                "plan1":"planification development",
                "user":"Anjan",
                "content":"Mail failure reported",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "lock":true,
                "attachment":true,
                "comment":true,
                "repeat":true
            },{
                "plan1":"planification development",
                "user":"Hong",
                "content":"content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":false
            },{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"closed old tickets",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":true
            }]
        },{  
           "phase":"R&D V4",
            "child":[{
                "plan1":"Mail failure reported",
                "user":"Vaibhav",
                "content":"closed old tickets",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":false
            },{
                "plan1":"planification development",
                "user":"thomas",
                "content":"closed old tickets",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":false
            }]
        },{  
           "phase":"Arabic Version",
            "child":[{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"Content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":true,
                "comment":true,
                "repeat":false
            },{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"Content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":true
            }]
        },{  
           "phase":"Gestion project et Teamwork",
            "child":[{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":true
            },{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":false,
                "comment":false,
                "repeat":true
            }]
        },{  
           "phase":"Bureaux",
           "child":[{
                "plan1":"planification development",
                "user":"Vaibhav",
                "content":"content demo platform",
                "more":"more",
                "start_date":"Thu March 10th,2017",
                "due_date":"Thu March 10th,2018",
                "lock":true,
                "attachment":true,
                "comment":true,
                "repeat":true
            }]
        }
    ];
    $scope.activity=[  
    {  
       "task":"completedtask",
       "name":"Anjan BHATTRAI",
       "edited":"Teamwork one community tab ",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true",
       "icon":true,
       "imageLogo":"/images/no_image_user.png"
    },{  
       "task":"opened task",
       "name":"Apil Karki",
       "edited":"Teamwork Profile page ",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true",
       "icon":false,
       "imageLogo":"/images/no_image_user.png"
    },{  
       "task":"edited task",
       "name":"Vaibhav",
       "edited":"page on one community tab ",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true",
       "icon":false,
       "imageLogo":"/images/no_image_user.png"
    },{  
       "task":"closed task",
       "name":"kim honglee",
       "edited":"Teamwork Profile page",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true"
    //      "imageLogo":"/images/no_image_user.png"
    },{  
       "task":"task",
       "name":"Anjan Bhattrai",
       "edited":"Teamwork Profile page  ",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true",
       "icon":false,
       "imageLogo":"/images/no_image_user.png"
    },{  
       "task":"admmin",
       "name":"Vaibhav",
       "edited":"Teamwork Profile  tab ",
       "completed":"false",
       "List":"AXL",
       "creationTime":"2.30pm",
       "lock":"true",
       "icon":false,
       "imageLogo":"/images/no_image_user.png"
    }

]
            
    $scope.getArticleData = function(){
      $scope.md.status = 1;
      apiArticle.getArticle({uid: $stateParams.articleid,track: $stateParams.track,referer: $stateParams.referer}).then(function(data){
    	  if(typeof(data.data.code) != 'undefined' && data.data.code != null){
    		  var message= $filter('translate')(data.data.message);
    		  var title = $filter('translate')('Error');
    		  uiModals.alertModal(null,title, message);
    	  }   
        $scope.feed = data.data;
        //$scope.showFeedEditButton = userRights.isUserHasRightToEditAricle($scope.feed, $rootScope.userData);

        if(typeof($scope.feed.hashtags) != 'undefined'){
          $scope.hashtags = $scope.feed.hashtags;
        }
        angular.forEach($scope.feed.blocks, function(val, key) {
          switch (val.type){
            case 'heading':
              $scope.article.heading = val;
              break;
            case 'topImage':
              $scope.article.topImage = val;
              break;
            case 'bottomImage':
              $scope.article.bottomImage = val;
              break;
          }
        });
        $scope.md.status = 2;
      }, function(err){
      });
    };
    $scope.setCommentFocus = function  () {
      $scope.$broadcast('setFocusToCommentBox', null);
    };
    $scope.disableGetFeedData = false;
        
    $scope.getFeedData = function(param){
        
      if(!$stateParams.articleid){
          $scope.disableGetFeedData = true;
        //apiFeedData.filteredFeeds(param);
        if(!param){
          param = {};
        }
        param.language = $rootScope.currentLanguage.code;
        param.page = ++$scope.page;
        
        /**#6[V5.5] Master Article filter inside profile and Communities**/
        if($scope.selectedAuthorUids != undefined && $scope.selectedAuthorUids.length > 0){
        	param.authorFilters = $scope.selectedAuthorUids;
        }
        
        if($scope.dateFrom != null && $scope.dateFrom != ''){
        	param.dateFromFilter = $filter('date')($scope.dateFrom,'MM/dd/yyyy');
        }

        if($scope.dateTo != null && $scope.dateTo != ''){
        	param.dateToFilter =  $filter('date')($scope.dateTo,'MM/dd/yyyy');
        }
        /**END**/
        
        $rootScope.onSearch = false;
        if($scope.currentTab !== undefined){
        	if($scope.currentTab.tabType !== 'home'){
        		param.communityUid = $stateParams.commuid;
        		param.tabUid = $scope.currentTab.uid;
        		param.tabType = $scope.currentTab.tabType;
        		$scope.typeCommunityTab = $scope.currentTab.tabType;
        		$scope.md.status = 1;
        		param.track = 'communitytab';
        		if($rootScope.enablePinCommunityFeature){
        			param.pinnedTab = $scope.currentTab.pinnedTab;
        		}
                apiFeedData.getContentsByCommunityTab(param).then(function(data){
                    $scope.disableGetFeedData = false;
                    $scope.md.status = 2;//finished loading
                    if(typeof(data.code) != 'undefined' && data.code != null){
              		  var message= $filter('translate')(data.message);
              		  var title = $filter('translate')('Error');
              		  uiModals.alertModal(null,title, message);              	  
              	    }else{
                      $scope.feeds = $scope.feeds.concat(data);
                      //$scope.md.showViewMoreBtn = ($scope.feeds.length == ($scope.page * 10)) ? true : false;
                      $scope.md.showViewMoreBtn = (data && data.length < 10) ? false : true;
                    }
                }, function(err){
                    $scope.disableGetFeedData = false;
                  $scope.md.status = 3;//loaading
                });
        	}else{
            	param.community = $stateParams.commuid; 
        		$scope.md.status = 1;
                apiFeedData.filteredFeeds(param).then(function(data){
                    $scope.disableGetFeedData = false;
                    $scope.md.status = 2;//finished loading
                    if(data){
                      $scope.feeds = $scope.feeds.concat(data);
                      //$scope.md.showViewMoreBtn = ($scope.feeds.length == ($scope.page * 10)) ? true : false;
                      $scope.md.showViewMoreBtn = (data && data.length < 10) ? false : true;
                    }
                }, function(err){
                    $scope.disableGetFeedData = false;
                  $scope.md.status = 3;//loaading
                });
        	}
        }
        
      }
    };
   
    /** #6[V5.5] Master Article filter inside profile and Communities **/
    //filter author
	$scope.filterAuthors = function ($event, authorUid) {
		if ($event.target.checked) {
			$scope.selectedAuthorUids.push(authorUid);
		} else {
			var index = $scope.selectedAuthorUids.indexOf(authorUid);
			if (index !== -1) {
				$scope.selectedAuthorUids.splice(index, 1);
			}
		}
		
    	$scope.resetPageData();
    	$scope.getFeedData(null);
	};
    
    //filter by date from
    $scope.filterDateFrom = function (dt){
    	$scope.dateFrom = dt;
    	$scope.resetPageData();
    	$scope.getFeedData(null);
    };

    //filter by date to
    $scope.filterDateTo = function (dt){
    	$scope.dateTo = dt;
    	$scope.resetPageData();
    	$scope.getFeedData(null);
    };
    /** END #6[V5.5]**/
   
    $scope.setSelectedTab = function(tabdata){
    	
      
      $scope.activeView = 'list';
	    $scope.currentTab = tabdata;
	    if($scope.currentTab.pinnedTab){
	    	$scope.pinnedTab = true;
	    }
      if(tabdata.tabType.toLowerCase() == 'home'){
        $scope.switchViewButton = true; //disable toggle button for home tab
        $scope.getFeedData(null);
      }else if("gdrive" == tabdata.tabType || "files" == tabdata.tabType || "projectmanagement" == tabdata.tabType){
    	  $scope.switchViewButton = false; //disable toggle button for home tab
          $scope.getFeedData(null);
      }else if("quickpost" == tabdata.tabType){      
    	  $scope.activeView = 'list';
    	  $scope.getFeedData({tabUid: tabdata.uid});
      }
      else{
        /*
        $scope.coverImageCss = {'height':'110px'};
        $scope.stickyCoverPrams.top = 50;
        $scope.stickyCoverPrams.offset = 0;
        */
        $scope.activeView = 'grid';
        $scope.getFeedData({tabUid: tabdata.uid});
      }
    };//setSelectedTab

    $scope.deleteFeed = function(feedId){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            apiFeedData.delete(feedId);
//            $state.reload();
          }
      });
    };
    
    var changeTab = function () {
        secondMenuService.changeTab($scope.menuTabs, UiConfig, function (tabFirst, tabSec) {
            $scope.tabsFirstArray = tabFirst;
            $scope.tabsSecondArray = tabSec;
        });
    };
    
    $scope.generateMenu = function(){
    	var communityName = encodeURIComponent( $scope.comm.label);
      if(typeof($scope.comm.tabs)  != 'undefined' && $scope.comm.tabs.length > 0){
    	  $scope.menuTabs = [];
    	  for(var i=0 ; i< $scope.comm.tabs.length ; i++){
    		  if(($scope.comm.tabs[i].tabType.toLowerCase() != 'wiki' && $scope.comm.tabs[i].tabType.toLowerCase() != 'projectmanagement') || 
    				  ($scope.comm.tabs[i].tabType.toLowerCase() == 'projectmanagement' && $rootScope.isTeamworkCommunityTab) ){
    			  $scope.menuTabs.push($scope.comm.tabs[i]);
    		  }
    	  }
        //$scope.menuTabs = $scope.comm.tabs;
        angular.forEach($scope.menuTabs, function(val, key){
        	if(val.tabType != 'home'){
        		val.href = $state.href("app.communityHomeWithTab", {name: communityName, commuid: $scope.comm.uid, activetab: val.uid, track: 'communitytab', referer: val.tabType});
        	}else{
        		val.href = $state.href("app.communityHomeWithTab", {name: communityName, commuid: $scope.comm.uid, activetab: 'home', track: 'communitytab', referer: 'home'});
        	}
          
        });
        var len = $scope.menuTabs.length;

        if(len > 0){
          //set first tab selected
          if(typeof($stateParams.activetab) != 'undefined'){
        	  if($stateParams.activetab == 'home'){
        		  for(var i=0; i< len; i++){
        			  if($scope.menuTabs[i].tabType == $stateParams.activetab){
        				  $scope.setSelectedTab($scope.menuTabs[i]);
        				  break; 
                      }
                  }
        	  }else{
        		  for(var i=0; i< len; i++){
                      if($scope.menuTabs[i].uid == $stateParams.activetab){
                        $scope.setSelectedTab($scope.menuTabs[i]);
                        break; 
                      }
                    }
        	  }
            
          }
          else{
//        	if($scope.menuTabs[0].tabType != 'home'){
//        		$state.go("app.communityHomeWithTab", {name: communityName, commuid: $scope.comm.uid, activetab: $scope.menuTabs[0].uid, track: 'communitytab', referer: $scope.menuTabs[0].tabType});
//        	}else{
//                $scope.setSelectedTab($scope.menuTabs[0]);
//        	} 
        	  $scope.setSelectedTab($scope.menuTabs[0]);
          }
        }
        //generate the array to show the responsive menu
                    
        if (len > UiConfig.maxTabs) {
            changeTab();
            window.onresize = function () {
                changeTab();
            };
        } else {
//          $scope.tabsFirstArray =  $scope.menuTabs;
            changeTab();
            window.onresize = function () {
                changeTab();
            };
        }
    }
    };
    
    $scope.prepareCoverData = function(){
      var comm = $scope.comm;
      $scope.coverData.isReady = false;
      //prepare cover data, before calling this function assign community data in $scope.comm
      $scope.coverData.uid = comm.uid;
      $scope.coverData.label = comm.label;
      var communityName = encodeURIComponent( comm.label);
      $scope.coverData.followerCount = comm.followerCount;
      $scope.coverData.contributorCount = comm.contributorCount;
      $scope.coverData.bannerUrl = comm.headerBannerUrl;
      $scope.coverData.logoUrl = comm.headerLogoUrl;
      $scope.coverData.logoHref = $state.href("app.communityHome", {name: communityName, commuid: $scope.comm.uid});
      $scope.coverData.showCoverEditBtn = comm.canEdit;
      $scope.isPrivate = (comm.privated == 1 ? true : false);
      var isSubscirbed = ((comm.statusOfCurrentUser == 'CommunityManager') || (comm.statusOfCurrentUser == 'Follower') || (comm.statusOfCurrentUser == 'Contributor') || (comm.statusOfCurrentUser == 'Subscriber')) ? true : false;
      $scope.coverData.showSubscribeBtn = {
        flag:  (comm.statusOfCurrentUser == 'Contributor' || comm.statusOfCurrentUser == 'CommunityManager') ? false : true,  
        title:  isSubscirbed ? 'Unsubscribe' : 'Subscribe',
        val: isSubscirbed ? 'unfollow' : 'follow'
      };

      $timeout(function(){
        $scope.coverData.isReady = true;
      });
    };
    //$rootScope.initializeApp().then(function(data){});
    if(isAppInitialized == 'success'){
        apiCommunity.getCommunityByUid({'uid' : $stateParams.commuid}).then(function(data){
            $scope.comm = data;
            $scope.prepareCoverData();
            if($scope.comm.bannerUid){
              $scope.stickyCoverPrams.top = -138; //100
              $scope.stickyCoverPrams.offset = 188; //150
              $scope.coverImageCss = {'height':'260px'};
            }

            $scope.generateMenu();

            if($stateParams.articleid){
              $scope.getArticleData();
            }
          }, function(err){
          });
    }
    
    // load pinned contents
    $scope.getPinnedContents = function(){
    	var param = {};
        param.communityUid = $stateParams.commuid;
    	if($stateParams.activetab !== undefined){
    		if($stateParams.referer !== 'home'){
    			param.communityTabUid = $stateParams.activetab;
    		}
    	}
        apiFeedData.getPinnedContents(param).then(function(data){
            $scope.pinnedContents = data;
            
            if($scope.pinnedContents && $scope.pinnedContents.length > 0){
            	for(var i=0 ; i< $scope.pinnedContents.length ; i++){
                    angular.forEach($scope.pinnedContents[i].blocks, function(val, key) {
                        switch (val.type){
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
        }, function(err){
        });
    };
    
    $scope.showTumbType = 'user';
    $scope.showLastActivityDate = true;
    $scope.showLastActivityUser = true;
    $scope.referer = 'CTYHP';
    if($stateParams.activetab !== undefined){
		if($stateParams.referer !== 'home'){
			$scope.showTumbType = 'author';
			$scope.showLastActivityDate = false;
			$scope.showLastActivityUser = false;
			$scope.referer = 'TABList';
		}
	}
    //$scope.getPinnedContents();
    
    $scope.enableTootip = false; // for enable toottip   
    $scope.getConfig = function(){
    	var config = sharedData.findConfig("PROFILE_TOOTIP");
    	if(typeof(config.name) != 'undefined'){
    		 $scope.enableTootip = config.value ? true : false;
    	}
    }    
    $scope.getConfig();
    //End load pinned contents

    // user participate/cancel event
    $scope.participateEvent = function(event,action){
    	if(action == 'cancel'){
    		var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Are you sure cancel participate this event ?"});
            modal.closePromise.then(function (data) {
            	if(data.value == 'ok'){
            		$scope.participate(event.uid,action);       
                }
            });
    	}else{
    		if(event != undefined && event != null){
        		if(event.limitSeatOfEvent && 
        				((event.waitingList != undefined && event.waitingList.length > 0) || 
        						(event.participants != undefined && event.participants.length > 0 && event.totalNumberOfSeat == event.participants.length))){
        			var modal = confirmModal.showTranslated($scope, {title: "Warning", message: "event session is full"});
        	        modal.closePromise.then(function (data) {
        	        	if (data.value == 'ok') {
        	        		$scope.participate(event.uid,action);
        	        	}
        	        });
        		}else{
            		$scope.participate(event.uid,action);
        		}
        	}
    	}
    };
    
    $scope.participate = function(eventUid,action){
    	apiEvent.participateEvent({eventUid : eventUid, action: action}).then(function(data){
    		if(typeof(data.code) != 'undefined' && data.code != null){
    			var message= $filter('translate')(data.message);
          		var title = $filter('translate')('Error');
          		uiModals.alertModal(null,title, message);
    		}else{
    			$state.reload();
    		}
    	}, function(err){
    		notifyModal.showTranslated('something_went_wrong', 'error', null);
    	});
    }
    //show all participants of event
    $scope.showAllParticipants = function(eventUid,status){
    	var data = {
    			eventUid : eventUid,
    			status : status
    	}
    	var modal = participantModal.show(null, {data: data});
    };
    
    $scope.follow = function(followAction){
      apiCommunity.follow({uid : $scope.comm.uid, action: followAction}).then(function(data){
        $scope.comm = data;
        $scope.prepareCoverData();
        //$scope.community = angular.copy(data);
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };
    $scope.showSubscribeBtn = true;
    $scope.subscribe = function(subscribeAction){
      $scope.showSubscribeBtn = false;
      apiCommunity.subscribe({uid : $scope.comm.uid, action: subscribeAction}).then(function(data){
        if(typeof(data.code) != 'undefined' && data.code != null){
        	var message= $filter('translate')(data.message);
      		var title = $filter('translate')('Error');
      		uiModals.alertModal(null,title, message);
        }else{
        	$scope.showSubscribeBtn = true;
	        apiCommunity.getCommunityByUid({uid:$stateParams.commuid}).then(function(data){       	  	  
	            $scope.comm = null;
	            $timeout(function(){
	              $scope.comm = data;
	              $scope.prepareCoverData();	              
	            });
	        }, function(err){
	        });
        }
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
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
    };
    //events
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
    };

    var languageChnage = $rootScope.$on('language.changed', function (event, data) {
      //feth feeds once language is fetched
      if($rootScope.currentLanguage && ($state.current.name != "app.communityHomeWithArticle")){
        $scope.resetPageData();
        if($scope.currentTab.tabType.toLowerCase() == 'home'){
        	$scope.getFeedData(param);
        }else {
        	var param = {tabUid: $scope.currentTab.uid};
        	$scope.getFeedData(param);
        }
      
      }
    });
    var feedDeletedEvent = $scope.$on('feed.deleted', function(event, data) {
      if($state.current.name == "app.communityHomeWithArticle"){
        if($scope.feed.uid == data){
        var tabslen = $scope.comm.tabs.len;
          $state.go("app.communityHomeWithTab", {name: $stateParams.name, commuid: $stateParams.commuid, activetab: $stateParams.activetab});
        }
      }//if
      else{
        $scope.updateFeed({uid: data}, 'remove');
      }//else
    });
    var feedAddedEvent = $scope.$on('feed.added', function(event, data) {
      cachedData.remove("homeFeeds"); //clear cached homefeeds data
      if($state.current.name != "app.communityHomeWithArticle"){
        $state.reload();
      }
    });
    var feedEditEvent = $scope.$on('feed.edited', function(event, data) {
      cachedData.remove("homeFeeds"); //clear cached homefeeds data
      if($state.current.name == "app.communityHomeWithArticle"){
        //if article home page, reload the page
        if(data.uid == $scope.feed.uid){
          $state.reload();
        }
      }
      else{
        //update the feed in feeds array
        apiFeedData.getFetchFeed({uid: data.uid, responseType: "feed"}).then(function(fdata){
          $scope.updateFeed(fdata, 'replace');
        }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
      }
    });
    var feedCommentedEvent = $scope.$on('feed.commented', function(event, data) {
      cachedData.remove('homeFeeds');
      $scope.fetchAndReoderFeeds({uid: data.content});
    });
    var feedTranslatedEvent = $scope.$on('feed.translated', function(event, data) {
      if($stateParams.articleid){
        $state.go('app.communityHomeWithArticle', {name: $stateParams.name, commuid: $stateParams.commuid, activetab: $stateParams. activetab, articleid: data.uid});
      }else{
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
      }
    });
    var followStatusChange = $rootScope.$on('community.followed.unfollowed', function (event, data) {
      //feth feeds once language is fetched
    });
    $scope.$on("$destroy", function(){
      //clear all listeners
      //feedUpdateEvent();
      languageChnage();
      feedAddedEvent();
      feedEditEvent();
      feedDeletedEvent();
      feedTranslatedEvent();
      feedCommentedEvent();
      followStatusChange();
    });
    $scope.printArticle = function(){
      window.print();
    };
    $scope.showMemberViewer = function(data){
      var modal = memberViewerModal.show(data);
    };
    
    $scope.getHeaderImgHeight = function(){
        //calculates the percentage height of header image to show thumbnail on FE properly
        var h = sharedData.getHeightOfAspectRatio(sharedData.articleHeaderImage.min.width, sharedData.articleHeaderImage.min.height);
        return h;
      };
      
      $scope.openRoot = function(){
    	  var param = {};
    	  param.community = $stateParams.commuid;
    	  param.track = $stateParams.track;
    	  param.communityUid = $stateParams.commuid;
		  param.tabUid = $stateParams.activetab
		  param.tabType = 'gdrive';
		  
    	  apiFeedData.getContentsByCommunityTab(param).then(function(data){
          		if(typeof(data.code) != 'undefined' && data.code != null){
              		  var message= $filter('translate')(data.message);
              		  var title = $filter('translate')('Error');
              		  uiModals.alertModal(null,title, message);
          		}else{
          			 $scope.pathFolders.splice(0,$scope.pathFolders.length);
                     $scope.feeds.splice(0,$scope.feeds.length);
                     $scope.feeds = $scope.feeds.concat(data);
                     
          		}   
                     
          }, function(err){
                  });
      }
      
      $scope.folderIds = [];
      $scope.positionIndex = [];
      $scope.refeshFolder = function(){
    	  var param = {};
    	  param.community = $stateParams.commuid;
    	  param.track = $stateParams.track;
    	  param.communityUid = $stateParams.commuid;
		  param.tabUid = $stateParams.activetab
		  param.tabType = 'gdrive';		  
		  param.refresh = true;
		  if($scope.pathFolders.length > 0){
			  for(var i = 0; i<$scope.pathFolders.length; i++){
				  if($scope.pathFolders[i].id != 'undefined'){
					  $scope.folderIds.push($scope.pathFolders[i].id);
				  }				  
			  }
				$http.get('/api/content/navigation',{params: {folders: $scope.folderIds,tabUid:$stateParams.activetab}}).then(function onSuccess(response) {
					var data = response.data;
					$scope.folderIds.splice(0,$scope.folderIds.length);
					if(data.length >0){
						for(var j =0; j<data.length; j++){
							for(var k =0 ; k<$scope.pathFolders.length; k++){
								if(data[j].folderId == $scope.pathFolders[k].id){
									var index = $scope.pathFolders.indexOf($scope.pathFolders[k]);
									if(index > -1){
										$scope.positionIndex.push(index);
									}		             				
								}
							}							
						}
						if($scope.positionIndex.length >0){
							for(var v = 0; v < $scope.positionIndex.length; v++){								
								var x = $scope.positionIndex[v];
								$scope.pathFolders.splice($scope.positionIndex[v]);
							}								
						}
						
						if($scope.pathFolders.length >0){
							param.folderId = $scope.pathFolders[$scope.pathFolders.length-1].id;
						}else{
							param.folderId = null;
						}
					}else{
						param.folderId = $scope.pathFolders[$scope.pathFolders.length-1].id;
					}
	    		  apiFeedData.getContentsByCommunityTab(param).then(function(data){
	        		if(typeof(data.code) != 'undefined' && data.code != null){
	            		  var message= $filter('translate')(data.message);
	            		  var title = $filter('translate')('Error');
	            		  uiModals.alertModal(null,title, message);
	        		}else{		 	
	                   	$scope.feeds.splice(0,$scope.feeds.length);
	                       $scope.feeds = $scope.feeds.concat(data);
	        		}
	                   
	                }, function(err){
	                });
				});
		  }else{ 
	    		  apiFeedData.getContentsByCommunityTab(param).then(function(data){
		        		if(typeof(data.code) != 'undefined' && data.code != null){
		            		  var message= $filter('translate')(data.message);
		            		  var title = $filter('translate')('Error');
		            		  uiModals.alertModal(null,title, message);
		        		}else{		 	
		                   	$scope.feeds.splice(0,$scope.feeds.length);
		                       $scope.feeds = $scope.feeds.concat(data);
		        		}
		                   
		                }, function(err){
		                });   
		  }
      }
      
      $scope.getImage = function(mimeType){
    	  return $filter('getTypeByFileNameGDrive')(mimeType);
      }
      
      $scope.openFolder = function(id,type,name,index,parentId){
      	var param = {};
      	param.community = $stateParams.commuid;
      	param.track = $stateParams.track;
      	param.communityUid = $stateParams.commuid;
  		param.tabUid = $stateParams.activetab
  		param.tabType = 'gdrive';
  		param.folderId = id;
      	if(type == "application/vnd.google-apps.folder"){
      		var folder ={};
      		folder.id = id;
      		folder.mimeType = 'application/vnd.google-apps.folder';
      		folder.name = name;
      		folder.parentId = parentId;	
      		if($scope.pathFolders.length>0){
      			if(index === ''){
      				for(var i= 0; i<$scope.pathFolders.length; i++){
          				if($scope.pathFolders[i].id == folder.id){
          					var index = $scope.pathFolders.indexOf($scope.pathFolders[i]);
             				$scope.pathFolders.splice(index,1);
          				}
          				if($scope.pathFolders[i] != undefined){
          				if($scope.pathFolders[i].parentId != undefined ){
          					for(var j = 0; j<$scope.pathFolders[i].parentId.length; j++){
          						if($scope.pathFolders[i].parentId[j] == folder.parentId){
          							$scope.pathFolders.splice($scope.pathFolders.indexOf($scope.pathFolders[i]),1);
          							if($scope.pathFolders[i] == undefined){
          								break;
          							}
          							if($scope.pathFolders.length == 0){
          								break;
              							}
          							}
          						}
          					}         					
          				}          				
          			}
      				$scope.pathFolders.push(folder);
      			}else{
      				for(var i= 0; i<$scope.pathFolders.length; i++){
      					$scope.pathFolders.splice(index+1,$scope.pathFolders.length-index-1);
          			}
      			}			
      			
      		}else{
      			$scope.pathFolders.push(folder);
      		}
      		
      		apiFeedData.getContentsByCommunityTab(param).then(function(data){
      		if(typeof(data.code) != 'undefined' && data.code != null){
          		  var message= $filter('translate')(data.message);
          		  var title = $filter('translate')('Error');
          		  uiModals.alertModal(null,title, message);
      		}else{		 	
                 	$scope.feeds.splice(0,$scope.feeds.length);
                     $scope.feeds = $scope.feeds.concat(data);
      		}
                 
              }, function(err){
              });
      	}      	
      };  
      
});
