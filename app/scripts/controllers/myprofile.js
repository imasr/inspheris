'use strict';

angular.module('inspherisProjectApp')
  .controller('MyProfileCtrl', function (isAppInitialized, secondMenuService, $scope, $stateParams, $q, $state, $rootScope, $http,
		  $timeout, UiConfig, $translate, apiFeedData, userRights, apiPeoples, apiCommunity, notifyModal, createUserModal, cachedData,
		  sharedData, apiInteraction, uiModals, $filter,apiWidget,apiUserSpeciality, profilePinDetailsModal, apiPinnedPostOfUser,$window) {
    
    $scope.peopleApi = new apiPeoples();
    $scope.pageData = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      feeds: [],
      showViewMoreBtn: false
    };
    $rootScope.menu={mobWidget: false};
    $scope.menuTabs = [];
    $scope.currentTab = null;
    $scope.userData = null;
    $scope.userProfileData = null;
    $scope.feedStatusDropDown = false;
    $scope.hideshowdrop=false;
    $scope.usersCommunities = {
      status: 0, //{0: ideal, 1: loading, 2: loaded, 3: error}
      data: []
    };

    $scope.coverImageCss = {'height':'260px'};
    $scope.stickyCoverPrams = {
      top: -139,
      offset: 139
    };

    $scope.switchViewButton = ($stateParams.activetab.toLowerCase() == 'about' || $stateParams.activetab.toLowerCase() == 'myboard') ? false : true;
    $scope.activeView = 'list';//show or hide the switch view buttons on second menu

    //for view more feeds
    $scope.page = 0;

    $scope.coverData = {
      type: 'userprofile', //this type is used in UserListCtrl, don't change this
      label: '',
      firstName: '',
      lastName: '',
      subtitle: '',
      followerCount: 0,
      contributorCount: 0,
      bannerUrl: null,
      logoUrl: null,
      showCoverEditBtn: false,
      isPrivate: false,
      isReady: false,
      showFollosers: false,
      showContributors: false,
	  active : true,
	  showFollowerBtn: true,
	  isCurrentUser : false,
	  isFollowed : false, // check current user are following this user
	  isShowBadge : false,
	  badgeImageUrl : null
    };  

    $scope.fileTypes = [];
    $scope.authors = [];
    $scope.communities = [];
    $scope.feedStatusSelection=[];
    $scope.feedStatusSelection.push({text: "Archived",val: "Archived"},{text: "Draft",val: "Draft"},
    		{text: "publish",val: "publish"},{text: "Publication scheduled",val: "Publication scheduled"});
    if($rootScope.workflowLevel == 1){
    	$scope.feedStatusSelection.push({text: "Pending For Validation",val: "Pending For Validation"});
    }
    $scope.selectedCommunityUids = [];
	$scope.selectedAuthorUids = [];
    $scope.dateFrom = null;
    $scope.dateTo = null;
    
    $scope.initializeData = function(){
    	var deferred = $q.defer();
    	if($stateParams.activetab.toLowerCase() != 'about' && $stateParams.activetab.toLowerCase() != 'myboard'){
	    	$scope.peopleApi = new apiPeoples();
	    	var pr0 = apiFeedData.getContentAuthorsByCommunityOrAuthor({isProfile : true,authorUid: $stateParams.uid});
	    	var pr1 = apiCommunity.getCommunitiesData({format:'list'});
	    	$q.all([pr0,pr1]).then(function(data){
	
	    		//for data[0]
	    		$scope.authors = data[0];
	
	    		//for data[1]
	    		$scope.communities = data[1];
	    		deferred.resolve("success");
	    	}, function(err){
	    		notifyModal.showTranslated('something_went_wrong', 'error', null);
	    		deferred.resolve("error");
	    	});
    	}
    	return deferred.promise;
    };
    $scope.initializeData().then(function(msg){

    });
    $scope.showfilters=function(active){
        if($scope.hideshowdrop===true){
            $scope.hideshowdrop=false;
            $scope.activeViewFilter='';
        }else{
            $scope.hideshowdrop=true;
            $scope.activeViewFilter=active;
        }
    };
    if($rootScope.userData.uid == $stateParams.uid){
    	$scope.coverData.isCurrentUser = true;
    }
    
    $scope.toggleView = function(viewtype){
      $scope.activeView = viewtype;
      $timeout(function(){
        $(window).trigger('resize');
      }, 100);
    };

    $scope.resetPageData = function(){
      $scope.pageData.feeds = [];
      $scope.page = 0;
    };
    $scope.disableGetFeedData = false;
    $scope.getFeedData = function(){
        $scope.disableGetFeedData = true;
      var postParam = {language: $rootScope.currentLanguage.code, author: $stateParams.uid};
      if($stateParams.activetab){
        if($stateParams.activetab.toLowerCase() != 'activities')
        postParam.status = $stateParams.activetab.toLowerCase();
      }
      if($stateParams.activetab.toLowerCase() == 'about'){
    	
//        $scope.peopleApi.getUser({uid: $stateParams.uid}).then(function(data){
//          $scope.userProfileData = data;
//          if(data.speciality){
//        	  $scope.userProfileData.speciality = data.speciality.replace(/\n/g, '<br/>');
//          }
//          if(data.hobbies){
//        	  $scope.userProfileData.hobbies = data.hobbies.replace(/\n/g, '<br/>');
//          }
//          $scope.coverData.isFollowed = $scope.userProfileData.followed; 	
//          
//        }, function(err){
//          notifyModal.showTranslated("something_went_wrong", 'error', null);
//        });
        $scope.usersCommunities.status = 1;
        apiCommunity.getUserCommunitise({userUid: $stateParams.uid,format: 'full'}).then(function(data){
          $scope.usersCommunities.status = 2;
          $scope.usersCommunities.data = data;
        }, function (err) {
          $scope.usersCommunities.status = 3;
        });

        apiWidget.getUserWidget({userUid: $stateParams.uid}).then(function(data){
            $scope.userWidgets = data;
        }, function (err) {
        });

        $scope.enableSendNotification = false; // for enable send notification visit
        var config = sharedData.findConfig("NOTIFICATION_VISIT");
        if(typeof(config.name) != 'undefined'){
        	$scope.enableSendNotification = config.value ? true : false;
        }


        //For send notification function if guest visit profile
        if($rootScope.userData.uid != $stateParams.uid && $scope.enableSendNotification){
        	//$scope.interaction = new apiInteraction();
        	var postData = {};
        	postData.action = 'visit';
        	postData.sourceType = 'profile';
        	postData.sourceUid = $rootScope.userData.uid;
        	postData.targetUid = $stateParams.uid;
        	
        	apiInteraction.create(postData).then(function(data){
        	 }, function(err){
               notifyModal.showTranslated("something_went_wrong", 'error', null);
             });
        	
//        	$scope.peopleApi.create({currentUserUid: $rootScope.userData.uid, targetUserUid:$stateParams.uid }).then(function(data){
//              }, function(err){
//                notifyModal.showTranslated("something_went_wrong", 'error', null);
//              });
        	
        	
        }
      }
      else if($stateParams.activetab.toLowerCase() != 'about' && $stateParams.activetab.toLowerCase() != 'myboard'){
          if($stateParams.activetab.toLowerCase() == "draft" || $stateParams.activetab.toLowerCase() == "publish" || $stateParams.activetab.toLowerCase() == "activities"){
	          if(UiConfig.showFeedStatusDropdown){
	            $scope.feedStatusDropDown = true;
	          }
          }
          
          if($stateParams.activetab.toLowerCase() == "draft"){
        	  if($scope.draftFilters != null && $scope.draftFilters.length > 0){
            	  $scope.isMyDraft = false;
            	  $scope.isDraftOfOtherUser = false;
            	  for(var i = 0 ; i < $scope.draftFilters.length ; i++){
            		  if($scope.draftFilters[i].type == 'myDrafts' && $scope.draftFilters[i].selected == true){
            			  $scope.isMyDraft = true;
            		  }else if($scope.draftFilters[i].type == 'draftsOfOtherUsers' && $scope.draftFilters[i].selected == true){
            			  $scope.isDraftOfOtherUser = true;
            		  }
            	  }
            	  
            	  if($scope.isMyDraft == true && $scope.isDraftOfOtherUser == true){
            		  postParam.darftFilter = 'allDrafts';
                  }else if ($scope.isMyDraft == true){
                	  postParam.darftFilter = 'myDrafts';
                  }else if ($scope.isDraftOfOtherUser == true){
                	  postParam.darftFilter = 'draftsOfOtherUsers';
                  }else if ($scope.isMyDraft == false && $scope.isDraftOfOtherUser == false){
                	  postParam.darftFilter = 'notAllDrafts';
                  }
              }
          }else if($stateParams.activetab.toLowerCase() == "activities"){
        	  if($rootScope.writePrivateMessageFeature == true && $scope.activityFilters != null && $scope.activityFilters.length > 0){
            	  $scope.isMyActivity = false;
            	  $scope.isPrivateMessage = false;
            	  for(var i = 0 ; i < $scope.activityFilters.length ; i++){
            		  if($scope.activityFilters[i].type == 'myActivities' && $scope.activityFilters[i].selected == true){
            			  $scope.isMyActivity = true;
            		  }else if($scope.activityFilters[i].type == 'privateMessage' && $scope.activityFilters[i].selected == true){
            			  $scope.isPrivateMessage = true;
            		  }
            	  }
            	  
            	  if($scope.isMyActivity == true && $scope.isPrivateMessage == true){
            		  postParam.activityFilter = 'allActivities';
                  }else if ($scope.isMyActivity == true){
                	  postParam.activityFilter = 'myActivities';
                  }else if ($scope.isPrivateMessage == true){
                	  postParam.activityFilter = 'privateMessage';
                  }else if ($scope.isMyActivity == false && $scope.isPrivateMessage == false){
                	  postParam.activityFilter = 'notAllActivities';
                  }
              }else{
            	  postParam.activityFilter = 'myActivities';
              }
          }         
      
          $scope.pageData.status = 1;
          postParam.page = ++$scope.page;
          
          /**#6[V5.5] Master Article filter inside profile and Communities**/
          if($scope.feedStatusSelection != undefined && $scope.feedStatusSelection.length > 0){
        	  var statusFilters = [];
        	  angular.forEach($scope.feedStatusSelection, function(s, key){
        		  if(s.selected != undefined && s.selected){
        		  	statusFilters.push(s.val);
        		  }
        	  });
        	  postParam.statusFilters = statusFilters;
          }
          
          if($scope.selectedCommunityUids != undefined && $scope.selectedCommunityUids.length > 0){
        	  postParam.communityFilters = $scope.selectedCommunityUids;
          }
          
          if($scope.selectedAuthorUids != undefined && $scope.selectedAuthorUids.length > 0){
        	  postParam.authorFilters = $scope.selectedAuthorUids;
          }
          
          if($scope.dateFrom != null && $scope.dateFrom != ''){
        	  postParam.dateFromFilter = $filter('date')($scope.dateFrom,'MM/dd/yyyy');
          }

          if($scope.dateTo != null && $scope.dateTo != ''){
        	  postParam.dateToFilter =  $filter('date')($scope.dateTo,'MM/dd/yyyy');
          }
          /**END**/
          
          if($stateParams.activetab.toLowerCase() != 'activities'){
	          apiFeedData.filteredFeeds(postParam).then(function(data){
                      $scope.disableGetFeedData = false;
	             $scope.pageData.status = 2;
	            $scope.pageData.feeds = $scope.pageData.feeds.concat(data);
	            //$scope.pageData.showViewMoreBtn = ($scope.pageData.feeds.length == ($scope.page * 10)) ? true : false;
	            $scope.pageData.showViewMoreBtn = (data && data.length < 10) ? false : true;
	          }, function(err){
                      $scope.disableGetFeedData = false;
	          });
          }else{
        	  apiFeedData.getActivitiesOfUser(postParam).then(function(data){
                      $scope.disableGetFeedData = false;
 	             $scope.pageData.status = 2;
 	            $scope.pageData.feeds = $scope.pageData.feeds.concat(data);
 	            //$scope.pageData.showViewMoreBtn = ($scope.pageData.feeds.length == ($scope.page * 10)) ? true : false;
 	            $scope.pageData.showViewMoreBtn = (data && data.length < 10) ? false : true;
 	          }, function(err){
                      $scope.disableGetFeedData = false;
 	          });
          }
      }else if($stateParams.activetab.toLowerCase() == "myboard"){
    	  if($stateParams.postId){
    		  apiPinnedPostOfUser.getById($stateParams.postId).then(function(data){
    			  if(typeof(data.code) != 'undefined' && data.code != null){
    				  var message= $filter('translate')(data.message);
    				  var title = $filter('translate')('Error');
    				  uiModals.alertModal(null,title, message);
    			  }else{
    	    		  var pin = data;
    	    		  if(pin){
    	    			  if(pin.pinType == 'Link'){
    	    				  $window.open(pin.link.path, '_blank');
    	    			  }else{
    	    				  profilePinDetailsModal.show({pin : pin});
    	    			  }
    	    		  }
    			  }
    		  }, function(err){
    			  notifyModal.showTranslated('something_went_wrong', 'error', null);
    		  });
    	  }    	  
      }    
    };
    
    /** #6[V5.5] Master Article filter inside profile and Communities **/    
    // filter status
    $scope.filterStatus = function(){
    	$scope.resetPageData();
    	$scope.getFeedData();
    };
    
	 //filter community
    $scope.filterCommunities = function ($event, communityUid) {
        if ($event.target.checked) {
        	$scope.selectedCommunityUids.push(communityUid);
        } else {
            var index = $scope.selectedCommunityUids.indexOf(communityUid);
            if (index !== -1) {
                $scope.selectedCommunityUids.splice(index, 1);
            }
        }

    	$scope.resetPageData();
    	$scope.getFeedData();
    };
    
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
    	$scope.getFeedData();
	};
    
    //filter by date from
    $scope.filterDateFrom = function (dt){
    	$scope.dateFrom = dt;
    	$scope.resetPageData();
    	$scope.getFeedData();
    };

    //filter by date to
    $scope.filterDateTo = function (dt){
    	$scope.dateTo = dt;
    	$scope.resetPageData();
    	$scope.getFeedData();
    };
    /** END #6[V5.5]**/
    
    /*
    $scope.fakeMenuJSON = [
      {
        "tabName": "Activities",
        "tabType": "Activities",
        "tabOrder": 1,
        "tabSelected": true
      },
      {
        "tabName": "About",
        "tabType": "About",
        "tabOrder": 2,
        "tabSelected": true
      },
      {
        "tabName": "Comments",
        "tabType": "Comments",
        "tabOrder": 3,
        "tabSelected": true
      },
      {
        "tabName": $translate('Communities').then(function (translation) {
            $scope.popupTitle = translation;
          });,
        "tabType": "Communities",
        "tabOrder": 4,
        "tabSelected": true
      },
      {
        "tabName": "Draft",
        "tabType": "Draft",
        "tabOrder": 5,
        "tabSelected": true
      },
      {
        "tabName": "Archive",
        "tabType": "Archive",
        "tabOrder": 5,
        "tabSelected": true
      }
    ];
    */

    $scope.activityFilters = [{name : "All Activities", type: "myActivities",selected: true},{name : "Private message on my wall",type: "privateMessage",selected: true}];
    $scope.fakeMenuJSON = [
      //"Activities", "About", "Comments", "Communities", "Draft", "Archived"
    ];
    if($rootScope.writePrivateMessageFeature == true){
    	$scope.fakeMenuJSON.push({tabName: "Activities", tabType: "Activities",activityFilters: $scope.activityFilters});
    }else{
    	$scope.fakeMenuJSON.push({tabName: "Activities", tabType: "Activities"});
    }

    $scope.fakeMenuJSON.push({tabName: "About", tabType: "About"});
    if($rootScope.isShowUserProject == true || $rootScope.isShowUserExperience == true || $rootScope.isShowUserPinnedPost == true){
    	$scope.fakeMenuJSON.push({tabName: "My Board", tabType: "myBoard"});
    }
    $scope.draftFilters = [];
    if($rootScope.userData.uid == $stateParams.uid){
    	if($rootScope.userData.manager == true){
    		$scope.draftFilters = [{name : "My Drafts", type: "myDrafts",selected: true},{name : "Drafts Of Users (who are in the community where I am the CM)",type: "draftsOfOtherUsers",selected: true}];
    		$scope.fakeMenuJSON.push({tabName: "My draft", tabType: "Draft",draftFilters : $scope.draftFilters}, {tabName: "My Publish", tabType: "Publish"});
    	}else{
    		$scope.fakeMenuJSON.push({tabName: "My draft", tabType: "Draft"}, {tabName: "My Publish", tabType: "Publish"});
    	}
    }else{
    	/*
    	 * Card 965 :
    	 * - If there are not workflow (workflowLevel == 0) => SO all users can NOT see tabs draft and publication on profile page of others users. 
    	 * - IF worflows is active then :
    	 *      + Contributor => can NOT see tabs draft and publication on profile page of others users 
    	 *      + CM => can ONLY see tabs draft and publication on profile page of users of its communities.
    	 *      + GCM or Admin => can see tabs draft and publication on profile page of all users
    	 */
    	if($rootScope.workflowLevel != 0 && 
    			($rootScope.userData.role == 'GlobalCommunityManager' || 
    					($rootScope.userData.manager == true && $rootScope.userData.memberUids != null && $rootScope.userData.memberUids.length > 0 
    							&& $rootScope.userData.memberUids.indexOf($stateParams.uid) != -1))){
    		$scope.fakeMenuJSON.push({tabName: "My draft", tabType: "Draft"}, {tabName: "My Publish", tabType: "Publish"});
    	}
    }
    
    var changeTab = function () {
        secondMenuService.changeTab($scope.menuTabs, UiConfig, function (tabFirst, tabSec) {
            $scope.tabsFirstArray = tabFirst;
            $scope.tabsSecondArray = tabSec;
        });
    };
    
    $scope.generateMenu = function(){
        /*
        $scope.menuTabs = $scope.fakeMenuJSON;
        angular.forEach($scope.menuTabs, function(val, key){
          val.href = "#!/myprofile/"+val.tabName;
        });
        */
        var len = $scope.menuTabs.length;
        $scope.tabsSecondArray = [];
        $scope.tabsSecondArray = [];
        /*
        if(len > 0){
          //set first tab selected
          if(typeof($stateParams.activetab) != 'undefined'){
            $scope.currentTab = {
              tabName: $stateParams.activetab,
              tabType: $stateParams.activetab
            };
          }
          else{
            $scope.currentTab = {
              tabName: $stateParams.activetab,
              tabType: $stateParams.activetab
            };
            //$scope.currentTab = $scope.menuTabs[0];
          }
        }
        */

        //set current tab
        if(typeof($stateParams.activetab) != 'undefined'){
          for(var i=0; i<len; i++){
            if($stateParams.activetab.toLowerCase() == $scope.menuTabs[i].tabType.toLowerCase()){
              $timeout(function() {
                $scope.currentTab = $scope.menuTabs[i];
              });
              break;
            }
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
    };


//    if($stateParams.activetab.toLowerCase() == 'activities' && $scope.coverData.isFollowed){
//    	 $scope.coverData.isWriteQuickpost = true;
//    }
    $scope.changeProfilePic = function(){
      var modal = createUserModal.show({action: "edit", type: 'images', data: {uid: $scope.userData.uid}});
      modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              $rootScope.initializeApp();
              $state.reload();
            }
          });
    };
    $scope.coverEdit = function(){
      var modal = createUserModal.show({action: "edit", type: 'info', data: {uid: $scope.userData.uid}});
      modal.closePromise.then(function (data){
            if(data.value.flag == 'ok'){
              $rootScope.initializeApp();
              $state.reload();
            }
          });
    };
    
    $scope.followerUser = function(action){
        $scope.followApi = new apiPeoples();
        $scope.followApi.followUser({personUid : $stateParams.uid, action: action}).then(function(data){
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
    };
    
    $scope.prepareCoverData = function(){
    	var params = {uid: $stateParams.uid};
    	
    	if($stateParams.activetab.toLowerCase() != 'about'){
    		params.format = "list";
    	}
        $scope.peopleApi.getUser(params).then(function(data){
            //if userid is of current user 
            $scope.userData = data; 
            $scope.userProfileData = data;
            if(data.speciality){
          	  $scope.userProfileData.speciality = data.speciality.replace(/\n/g, '<br/>');
            }
            if(data.hobbies){
          	  $scope.userProfileData.hobbies = data.hobbies.replace(/\n/g, '<br/>');
            }
            
            if(data.customFields != null && data.customFields.length > 0){
            	$scope.customFields = []; 
            	for (var i=0 ; i< data.customFields.length ; i++){
            		if(data.customFields[i].name == "Initials Name"){
            			$scope.userProfileData.initialsName = data.customFields[i].value;
            		}else if(data.customFields[i].name == "Date Of Entry"){
            			$scope.userProfileData.dateOfEntry = data.customFields[i].value;
            		}else if(data.customFields[i].name == "Date Df"){
            			$scope.userProfileData.dateDf = data.customFields[i].value;
            		}else{
            			$scope.customFields.push(data.customFields[i]);
            		}
            	}
            	$scope.userProfileData.customFields = $scope.customFields;
            }
            $scope.coverData.showCoverEditBtn = userRights.isUserHasRightToEditUserProfile($scope.userData, $rootScope.userData);

            if(!$scope.userData.bannerUrl){
              $scope.stickyCoverPrams.top = 50;
              $scope.stickyCoverPrams.offset = 0;
              $scope.coverImageCss = {'height':'70px'};
            }

            $scope.coverData.label = $scope.userData.firstName+" "+$scope.userData.lastName;
            $scope.coverData.firstName = $scope.userData.firstName;
            $scope.coverData.lastName = $scope.userData.lastName;
            $scope.coverData.followerCount = $scope.userData.followerCount;
            $scope.coverData.contributorCount = $scope.userData.contributorCount;
            $scope.coverData.bannerUrl = $scope.userData.headerBannerUrl;
            $scope.coverData.logoUrl = $scope.userData.headerLogoUrl;
            $scope.coverData.isReady = true;
            $scope.coverData.active = $scope.userData.active;

            if (!$rootScope.followUserFeature){
            	$scope.coverData.showFollowerBtn = false;
            	$scope.coverData.isFollowed = false;
            }else{
    	        if($rootScope.userData.uid == $stateParams.uid){
    	        	$scope.coverData.showFollowerBtn = false;
    	        }else{
    	        	$scope.coverData.isFollowed = $scope.userData.followed; 	
    	        }
            }
            
            if ($rootScope.isShowUserBadge){
            	$scope.coverData.isShowBadge = true;
            	
            	if($scope.userData.badge){
            		$scope.coverData.badgeImageUrl = $scope.userData.badge.image.url;
            	}
            }
        
          }, function(err){
            notifyModal.showTranslated('fetch_userdetail_failed', 'error', null);
          });
        
          angular.forEach($scope.fakeMenuJSON, function(val, key){
            $scope.menuTabs.push({
                uid: 'tabmenu'+key,
                tabName: val.tabName,
                tabType: val.tabType.toLowerCase(),
                tabOrder: key,
                tabSelected: true,
                href : "#!/myprofile/"+$stateParams.uid+"/"+val.tabType,
                draftFilters : val.draftFilters,
                activityFilters : val.activityFilters,
                userUid :$stateParams.uid 
            });
          });

          $scope.generateMenu();
          $scope.getFeedData();
    };
    
    //$rootScope.initializeApp().then(function(data){});
    if(isAppInitialized == 'success'){
    	$scope.prepareCoverData();
    }

    $scope.stopPropagation = function(event){
        event.stopPropagation();
    };
    $scope.checkFilters = function(event,filter){
    	if (event.target.checked) {
    		filter.selected = true;
    	} else {
    		filter.selected = false;
    	}
    	$scope.resetPageData();
        $scope.getFeedData();
    };
      
    $scope.updateFeed = function(data, action){
      var feedslen = $scope.pageData.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.pageData.feeds[i].uid == data.uid){
          if(action == 'remove')
            $scope.pageData.feeds.splice(i, 1);
          else if(action == 'replace')
            $scope.pageData.feeds[i] = data;
          break;
        }
      }
    };
    
    //#1038 : Genfit - show projects and experiences  
    $scope.projectPage = 1;
    $scope.experiencePage = 1;
    $scope.size = 2;
	$scope.getSpecialities = function (type,active) {
		var params = {
				userUid : $stateParams.uid,
				type : type,
				page: type == 'Project' ? $scope.projectPage : $scope.experiencePage,
				size: $scope.size,
				active: active
		}
		apiUserSpeciality.getUserSpecialities(params).then(function (data) {
			if(typeof(data.code) != 'undefined' && data.code != null){
				var message= $filter('translate')(data.message);
        		var title = $filter('translate')('Error');
        		uiModals.alertModal(null,title, message);
			}else{
				if(type == 'Project'){
					if($scope.projectPage > 1){
						$scope.userProfileData.projects.rows = $scope.userProfileData.projects.rows.concat(data.rows);
					}else{
						$scope.userProfileData.projects = data;
					}
				}else if(type == 'Experience'){
					$scope.userProfileData.experiences.rows = $scope.userProfileData.experiences.rows.concat(data.rows);
				}
			}
        }, function (err) {
            notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
    }; 
    
    $scope.showProjects = function(type){
    	$scope.projectPage = 1;
    	$scope.getSpecialities('Project', type == 'present' ? true : false);
    };
    
    $scope.viewMoreProjects = function(type){
    	$scope.projectPage++;
    	$scope.getSpecialities('Project', type == 'present' ? true : false);
    };
    
    $scope.viewMoreExperiences = function(){
    	$scope.experiencePage++;
    	$scope.getSpecialities('Experience', null);
    };
    
    //events
    $scope.fetchAndReoderFeeds = function(data){
      //there must be feed's uid parameter in data
      var feedslen = $scope.pageData.feeds.length;
      for(var i=0; i<feedslen; i++){
        if($scope.pageData.feeds[i].uid == data.uid){
          apiFeedData.getFetchFeed({uid: data.uid, responseType: "feed"}).then(function(fdata){
            $timeout(function(){
              $scope.$apply(function(){
                $scope.pageData.feeds.splice(i, 1);
                $scope.pageData.feeds.unshift(fdata);
              });  
            });
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          break;
        }
      }
    };

    var feedAddedEvent = $scope.$on('feed.added', function(event, data) {
      //$scope.getFeedData();
      cachedData.remove("homeFeeds"); //clear cached homefeeds data
      $state.reload();
    });
    var feedEditEvent = $scope.$on('feed.edited', function(event, data) {
      cachedData.remove("homeFeeds"); //clear cached homefeeds data
      //update the feed in feeds array
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
    var feedTranslatedEvent = $scope.$on('feed.translated', function(event, data) {
      var feedslen = $scope.pageData.feeds.length;
        for(var i=0; i<feedslen; i++){
          if($scope.pageData.feeds[i].sourceId){
            if(($scope.pageData.feeds[i].sourceId == data.sourceId) || ($scope.pageData.feeds[i].sourceId == data.uid)){
              $timeout(function(){
                $scope.$apply(function(){
                  $scope.pageData.feeds[i] = data;
                });  
              });
              break;
            }
          }
          else{
            if(($scope.pageData.feeds[i].uid == data.sourceId) || ($scope.pageData.feeds[i].uid == data.uid)){
              $timeout(function(){
                $scope.$apply(function(){
                  $scope.pageData.feeds[i] = data;
                });  
              });
              break;
            }
          }
        }
    });
    var feedDeletedEvent = $scope.$on('feed.deleted', function(event, data) {
      cachedData.remove("homeFeeds"); //clear cached homefeeds data
      $scope.updateFeed({uid: data}, 'remove');
    });

    var languageChangeEvent = $rootScope.$on('language.changed', function (event, data) {
      //feth feeds once language is fetched
      if($stateParams.activetab.toLowerCase() != 'about' && $stateParams.activetab.toLowerCase() != 'myboard'){
        $scope.resetPageData();
        $scope.getFeedData();
      }
    });

    $scope.$on("$destroy", function(){
      //clear all listeners
      feedAddedEvent();
      feedEditEvent();
      feedDeletedEvent();
      languageChangeEvent();
      feedTranslatedEvent();
    });
    
    $scope.showIcon = false;
    $scope.showActivitiyIcon = false;
    $scope.selectedTabDraft = function(event, tab){
    	 if(typeof(tab.draftFilters) != 'undefined'){
    		 if(angular.element(event.currentTarget).hasClass("open")){
    			 $scope.showIcon = false;
    		 }else{
    			 $scope.showIcon = true;
    		 }
    	 }else if(typeof(tab.activityFilters) != 'undefined'){
    		 if(angular.element(event.currentTarget).hasClass("open")){
    			 $scope.showActivitiyIcon = false;
    		 }else{
    			 $scope.showActivitiyIcon = true;
    		 }
    	 }	 	 
     }
     
    var profileWidget =[
         {
            title: "User Skills",
            type: "UserSkills",
            uid: "d3278fd1-fb4e-406d-91a8-7d5167d25b0e",
            defaultWidget: true,
            active: true
        },{
            title: "User Hobbies",
            type: "UserHobbies",
            uid: "95b6534c-1fdd-4e91-937c-d479af16897b",
            defaultWidget: true,
            active: false
        },{
            title: "User Followers",
            type: "UserFollowers",
            uid: "ab36631b-f629-4cff-9cfd-ca19b191524a",
            defaultWidget: true,
            active: $rootScope.followUserFeature && $scope.userProfileData != null && $scope.userProfileData.followers ? true : false
        },{
            title: "User Followings",
            type: "UserFollowings",
            uid: "42543667-58bb-4c0e-8cd0-7a88dd6ab336",
            defaultWidget: true,
            active: $rootScope.followUserFeature && $scope.userProfileData != null && $scope.userProfileData.followings ? true : false
        },{
            title: "User Hashtag",
            type: "UserHashtag",
            uid: "c109f407-9a48-4de9-bd29-7acd8a8d3986",
            defaultWidget: true,
            active: true
        },{
            title: "User Calendar",
            type: "UserCalendar",
            uid: "a3fcabb8-8e3e-4da2-b0e2-41c3cbed6623",
            defaultWidget: true,
            active: false
        },{
            title: "User Actions",
            type: "UserActions",
            uid: "1ae54e9f-0043-4fff-9a7e-d6ba9704a113",
            defaultWidget: true,
            active: false
        },
     ];
      $scope.activeWidgets = [];
     angular.forEach(profileWidget, function(value){
         if(value.active){
             $scope.activeWidgets.push(value);
         }
     });
     if($scope.activeWidgets){
         $rootScope.menu.mobWidget = true;
     }
  });
