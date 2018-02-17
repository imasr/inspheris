'use strict';

angular.module('inspherisProjectApp')
  .controller('GlobalCtrl', function ($scope, $rootScope, offCanvas, $http, $q){

    $scope.availableThemes = [{text: "theme1"}, {text: "theme2"}, {text: "theme3"}]
    $scope.selectedTheme = {text: "theme1"};
    $scope.themeSelector = 'theme1';
    $scope.themeChanged = function(selected){
      $scope.themeSelector = selected.text;
    };
    //this.toggle = offCanvas.toggle;

    //Get properties template
    var apiUrl = "/api/custom_template";
    var parameter = {
    		featureType : 'background',
    		active : true
    }
    $scope.background = null;
    $http({method: 'GET', url: apiUrl, params : parameter}).
    then(function onSuccess(response) {
      var data = response.data;
    	 if(data.length > 1){
    		 angular.forEach(data, function(val, key){
              	if('optional' == val.type){
              		 $scope.background = val;
              	}
            });
    	 }else{
    		 $scope.background = data[0];
    	 }

    }, function onError(response) {
       var data = response.data;
   	 	deferred.reject(data);
    });
  })
  .controller('UploadSquareCtrl', function ($scope, $rootScope, offCanvas,CreateFileBrowseModal){

    this.$onInit = function() {
      if($rootScope.userData.role){
        //enable option to browse files of remote server if user is Global community manager
        $scope.showBrowseRemoteFiles = ($rootScope.userData.role == 'GlobalCommunityManager') ? true : false;
      }

      $scope.showOnlyBrowseRemoteFiles = false;
      $scope.onlyRemoteFiles = this.onlyRemoteFiles;
      if(typeof($scope.onlyRemoteFiles) != 'undefined'){
        $scope.showOnlyBrowseRemoteFiles = $scope.onlyRemoteFiles;
      }
    }
    $scope.openFileBrowsePopup = function(type){
//        CreateFileBrowseModal.show({action: 'create', type: type, mode: 'info', data: null});
        $scope.$parent.openFileBrowsePopup(type);
      };

    $scope.imgBlockAddImgs = function($files, $event){
      $scope.$parent.imgBlockAddImgs($files, $event);
    }
    $scope.showBrowseVideoPopup = function(blockIndex){
       $scope.$parent.showBrowseVideoPopup(blockIndex);
    }
    $scope.showBrowseImagePopup = function(blockIndex){
       $scope.$parent.showBrowseImagePopup(blockIndex);
    }
	$scope.openGoogleDriveBrowse = function(docType)
	{
		$scope.$parent.openGoogleDriveBrowse(docType);
	}
	$scope.showYammerLogin = function(blockIndex)
	{
		$scope.$parent.showYammerLogin(blockIndex);
	}
	
    $scope.docBlockAdddocs = function($files, $event){
      $scope.$parent.docBlockAdddocs($files, $event);
    }
    $scope.showBrowseDocumentPopup = function(blockIndex){
      $scope.$parent.showBrowseDocumentPopup(blockIndex);
    }
  })
  .controller('NotificationCtrl', function ($scope, $rootScope, apiNotification, sharedData, $interval){
    $scope.nd = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
    };
    $scope.notificationCount = 0;
    $scope.notifications = [];
    $scope.getCount = function(){
      apiNotification.count().then(function(data){
        $scope.notificationCount = data.data;
      }, function(err){
        //error
      });
    };
    $scope.getNotifications = function(){
      $scope.nd.status = 1;
      if($scope.notifications.length <= 0 || $scope.notificationCount > 0){
        $scope.notifications = [];
        apiNotification.list(null).then(function(data){
          $scope.notifications = data.data;
          $scope.nd.status = 2;
          $scope.getCount();
        }, function(err){
          //error
          $scope.nd.status = 3;
        });
      }
    };
    $scope.initialize = function(){
      $scope.getCount();
    };
    $scope.initialize();
    $interval(function(){
      $scope.initialize();
    }, sharedData.notificationsRefreshTime);
    $scope.$on("$destroy", function(){
      $interval.cancel();
    });
  })
  .controller('NotificationFeedCtrl', function ($scope, $rootScope, sharedData, apiNotification, $translate, $filter, apiInteraction,visitorModal,notificationParticipantModal){
    $scope.translatePrams = null;
    $scope.article = null;
    $scope.nd = {
      creationDate: $filter('date')($scope.notification.creationDate, $rootScope.localDateFormat),
      visitorCreationDate : $filter('date')($scope.notification.creationDate, 'd MMM',$rootScope.localDateFormat)
    };

    $scope.getArtTypeByAction = function(){
      var tempType = null;
      switch($scope.notification.action){
        case 'ask to create article':
        case 'create article':
        case 'accept to create article':
        case 'share article':
        case 'copy article':
        case 'ask to revalidate article' :
          tempType = 'article';
        break;
        case 'ask to create document':
        case 'create document':
        case 'accept to create document':
        case 'share document':
        case 'copy document':
        case 'ask to revalidate document' :
          tempType = 'document';
        break;
        case 'ask to create quickpost':
        case 'create quickpost':
        case 'accept to create quickpost':
        case 'share quickpost':
        case 'copy quickpost':
        case 'ask to revalidate quickpost' :
          tempType = 'quickpost';
        break;
        case 'ask to create wiki':
        case 'create wiki':
        case 'accept to create wiki':
        case 'share wiki':
        case 'copy wiki':
        case 'ask to revalidate wiki' :
          tempType = 'wiki';
        break;
        case 'ask to create event':
        case 'create event':
        case 'accept to create event':
        case 'share event':
        case 'copy event':
        case 'ask to revalidate event' :
          tempType = 'event';
        break;
        case 'ask to create imageGallery':
        case 'create imageGallery':
        case 'accept to create imageGallery':
        case 'share imageGallery':
        case 'copy imageGallery':
        case 'ask to revalidate imageGallery' :
          tempType = 'image gallery';
        break;
        case 'ask to create grandArticle':
        case 'create grandArticle':
        case 'accept to create grandArticle':
        case 'share grandArticle':
        case 'copy grandArticle':
        case 'ask to revalidate grandArticle' :
          tempType = 'grand article';
        break;
      }//switch
      return tempType;
    };
    switch($scope.notification.action){
      case 'like':
      case 'comment':
      case 'mentioned in comment':
    	  if($scope.notification.content){
	        $scope.actSentence = null;
	        $scope.translatePrams = {
	          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
	          sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
	          artType: $scope.notification.content ? $scope.notification.content.type : null,
		  author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
	        };
	        if($scope.notification.content){
	          $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
	          $scope.translatePrams.title = $scope.article.title;
	        }
    	  }
      break;

      case 'requested community':
        $scope.actSentence = null;
        $scope.translatePrams = {
          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
          sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
          commnuityname : $scope.notification.requestedCommunity.label
        };
      break;

      case 'create article':
      case 'create quickpost':
      case 'create document':
      case 'create wiki':
      case 'create event':
      case 'create imageGallery':
      case 'create grandArticle':
        //"<span class='unm'><a href='{{userlink}}'>{{username}}</a></span> <span class='action'> has created an {{artType}} in </span><br><span class='title'><a href='{{communitylink}}'>{{commnuityname}}</a></span>"
    	  if($scope.notification.content){
	    	  var artType = $scope.getArtTypeByAction();
	
	    	  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label
	    	  };
	    	  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
	    	  $scope.translatePrams.title = $scope.article.title;
    	  }
      break;

      case 'accept to create article':
      case 'accept to create document':
      case 'accept to create quickpost':
      case 'accept to create wiki':
      case 'accept to create event':
      case 'accept to create imageGallery':
      case 'accept to create grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();
	
    		  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
    	  }
      break;

      case 'ask to create article':
      case 'ask to create document':
      case 'ask to create quickpost':
      case 'ask to create wiki':
      case 'ask to create event':
      case 'ask to create imageGallery':
      case 'ask to create grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();

    		  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, "Draft");
    	  }
      break;
      case 'ask to revalidate article':
      case 'ask to revalidate document':
      case 'ask to revalidate quickpost':
      case 'ask to revalidate wiki':
      case 'ask to revalidate event':
      case 'ask to revalidate imageGallery':
      case 'ask to revalidate grandArticle':  
    	  if($scope.notification.community){
	        var artType = $scope.getArtTypeByAction();

	        $scope.translatePrams = {
	          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
	          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
	          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
	          artType: artType,
	          commnuityname: $scope.notification.community.label.length > 110 ? $scope.notification.community.label.substr(0, 110) + '...' : $scope.notification.community.label
	        };
	        $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, "Draft");
    	  }
      break;

      case 'modify article':
      case 'modify document':
      case 'modify quickpost':
      case 'modify wiki':
      case 'modify event':
      case 'modify imageGallery':
      case 'modify grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();

    		  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label,
		          author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
    		  $scope.translatePrams.title = $scope.article.title;
    	  }
      break;

      case 'archive article':
      case 'archive document':
      case 'archive quickpost':
      case 'archive wiki':
      case 'archive event':
      case 'archive imageGallery':
      case 'archive grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();

    		  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label,
		          author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, "Draft");
    		  $scope.translatePrams.title = $scope.article.title;
    	  }
      break;

      case 'follow to community':
      case 'subscribe to community':
        if($scope.notification.community){
          $scope.translatePrams = {
            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
            username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
            communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
            commnuityname: $scope.notification.community.label
          };
        }
      break;
      case 'follow to user':
      case 'unfollow to user':
    	  $scope.actSentence = null;
    	  $scope.translatePrams = {
    	            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
    	            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName
    	   };
    	  $scope.userProfileLink =  $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser);
      break;
      case 'write content on profile':
    	  $scope.actSentence = null;
    	  $scope.translatePrams = {
    	            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
    	            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName
    	  };
    	  $scope.userActivitiesLink =  $rootScope.generateLink('userActivitiesProfilePage', $scope.notification.targetUser);
      break;
      case 'like comment':
        $scope.translatePrams = {
          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
          text: $scope.notification.comment.text,
	 author:$scope.notification.content ? $scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName : ""
        };
      break;
      case 'share article':
      case 'share document':
      case 'share quickpost':
      case 'share wiki':
      case 'share event':
      case 'share imageGallery':
      case 'share grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();

    		  $scope.translatePrams = {
		          userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
		          username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
		          communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
		          artType: artType,
		          commnuityname: $scope.notification.community.label,
		          author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
    		  $scope.translatePrams.title = $scope.article.title;
    	  }
      break;
      case 'copy article':
      case 'copy document':
      case 'copy quickpost':
      case 'copy wiki':
      case 'copy event':
      case 'copy imageGallery':
      case 'copy grandArticle':
    	  if($scope.notification.content){
    		  var artType = $scope.getArtTypeByAction();

    		  $scope.translatePrams = {
    				  userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
    				  username: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
    				  communitylink: $rootScope.generateLink('communityHomePage', $scope.notification.community),
    				  artType: artType,
    				  commnuityname: $scope.notification.community.label,
    				  author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
    		  };
    		  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
    	  }
      break;
      case 'create digest':
      case 'preview digest':
          $scope.actSentence = null;
          $scope.translatePrams = {
            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
            digestTitle : $scope.notification.digest.title,
            digestlink :  $rootScope.generateLink('digest', $scope.notification.digest)
          };
          $scope.digestlink =  $rootScope.generateLink('digest', $scope.notification.digest);
        break;
      case 'requested community':
          $scope.actSentence = null;
          $scope.translatePrams = {
            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
            commnuityname : $scope.notification.requestedCommunity.label
          };
        break;
      case 'visit':
    	  $scope.actSentence = null;
    	  $scope.translatePrams = {
    	            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
    	            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName
    	   };
    	  break;
      case 'visitor':
    	  apiInteraction.getVisitor({date:$scope.notification.creationDate}).then(function(data){
    		  var userNames = "";
    		  for(var i = 0; i < data.length ; i++){
    			  userNames += data[i].firstName + " "+ data[i].lastName;
    			  if(data.length == 2 && i < 1){
    				  userNames += ", ";
    			  }
    			  if(i==2){
    				  break;
    			  }
    		  }
    		  var numberRemain = "";
    		  if(data.length > 2){
    			  var text = $filter('translate')('and');
    			  numberRemain = text + " " + (data.length - 2).toString() + "+";
    		  }
    		  $scope.actSentence = null;
    		  var dateVisitor =  "\""+$filter('date')($scope.notification.creationDate,'yyyy-MM-dd')+"\"";
        	  $scope.translatePrams = {
        	            userNames: userNames,
        	            remainUser:  numberRemain,
        	            date: dateVisitor
        	   };
          }, function(err){
          });

    	  break;
      case 'participate':
      case 'cancel':
	    	  apiInteraction.getParticipants({date:$scope.notification.creationDate,action:$scope.notification.action,eventId:$scope.notification.itemId}).then(function(data){
	    		  var userNames = "";
	    		  for(var i = 0; i < data.length ; i++){
	    			  userNames += data[i].firstName + " "+ data[i].lastName + " ";
	    			  if(data.length == 2 && i < 1){
	    				  userNames += ", ";
	    			  }
	    			  if(i==2){
	    				  break;
	    			  }
	    		  }
	    		  var numberRemain = "";
	    		  if(data.length > 2){
	    			  var text = $filter('translate')('and');
	    			  numberRemain = text + " " + (data.length - 2).toString() + "+";
	    		  }
	    		  $scope.actSentence = null;
	    		  var dateVisitor =  "\""+$filter('date')($scope.notification.creationDate,'yyyy-MM-dd')+"\"";
	        	  $scope.translatePrams = {
	        	            userNames: userNames,
	        	            remainUser:  numberRemain,
	        	            date: dateVisitor,
	        	            participant : {
	        	            	date: $filter('date')($scope.notification.creationDate,'yyyy-MM-dd'),
	        	            	action: $scope.notification.action,
	            	            eventId: $scope.notification.itemId
	            	       }
	        	   };
	
	        	  $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
	        	  $scope.translatePrams.title = $scope.article.title;
	        	  $scope.counter = data.length;
	          }, function(err){
	          });

    	  break;
      case 'mentioned in quickpost':
    	  if($scope.notification.content){
	    	  $scope.actSentence = null;
	          $scope.translatePrams = {
	            userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
	            sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
	            artType: $scope.notification.content ? $scope.notification.content.type : null,
	            author:$scope.notification.content.author.firstName+" "+$scope.notification.content.author.lastName
	          };
	          if($scope.notification.content){
	            $scope.article = sharedData.getTitleWithArticleLink($scope.notification.content, $scope.notification.sourceUser, null);
	            $scope.translatePrams.title = $scope.article.title;
	          }
    	  }
    	  break;
      case 'like the user pinned post':
    	  $scope.actSentence = null;
          $scope.translatePrams = {
        		  userlink: $rootScope.generateLink('userProfilePage', $scope.notification.sourceUser),
        		  sourceUser: $scope.notification.sourceUser.firstName+" "+$scope.notification.sourceUser.lastName,
        		  userPinnedPostTitle : $scope.notification.userPinnedPost.title,
        		  userPinnedPostlink :  $rootScope.generateLink('userPinnedPost', {id:$scope.notification.userPinnedPost.id,userUid: $scope.notification.targetUser.uid})
          };
          $scope.userPinnedPostlink =  $rootScope.generateLink('userPinnedPost', {id:$scope.notification.userPinnedPost.id,userUid: $scope.notification.targetUser.uid});        
          break;
    }
    $scope.showVisitor = function(date){
    	 var modal = visitorModal.show(null, {date: date});
    }

    $scope.showParticipants = function(participant){
   	 var modal = notificationParticipantModal.show(null, {date: participant.date,action:participant.action,eventId:participant.eventId});
    }
  })
  .controller('CommunityFeedCtrl', function ($scope, $rootScope, $timeout, $window, $translate, $filter, apiCommunity, apiSearch, createCommunityModal, sharedData, userRights, notifyModal,$state){
    $scope.isSubscirbed  = false;
    $scope.checkCurrentUserStatus = function(community){
          $scope.isSubscirbed = ((community.statusOfCurrentUser == 'CommunityManager') || (community.statusOfCurrentUser == 'Follower') || (community.statusOfCurrentUser == 'Contributor') || (community.statusOfCurrentUser == 'Subscriber')) ? true : false;

          $scope.showSubscribeBtn = {
            title:  $scope.isSubscirbed ? 'Unsubscribe' : 'Subscribe',
            val: $scope.isSubscirbed ? 'not subscribe' : 'subscribe'
          };
    };
            $scope.isIEbrowser = false;
            if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1))
            {
                $scope.isIEbrowser = true;
            }

    this.$onInit = function() {
      $scope.community = this.community;
      $scope.checkCurrentUserStatus($scope.community);
    }


     $scope.subscribe = function(subscribeAction){

      apiCommunity.subscribe({uid : $scope.community.uid, action: subscribeAction}).then(function(data){
        apiCommunity.getCommunityByUid({'uid':$scope.community.uid}).then(function(data){
         // $scope.comm = null;
          $timeout(function(){
            $scope.checkCurrentUserStatus(data);
          });
        }, function(err){
        });
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };
    //$scope.isUserComMgr = false;
    $scope.editCommunity = function(){
      var modal = createCommunityModal.show({action: 'edit', type: 'community', mode: 'info', data: {'uid' : $scope.community.uid}});
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            //community edited sucessfully now reload the page
            $state.reload();
          }
      });
    };
    $scope.followCommunity = function(followAction){
      //action:  'follow'  or 'not follow'
      //var followAction = 'follow';
      apiCommunity.follow({uid : $scope.community.uid, action: followAction}).then(function(data){
        if(followAction == 'follow'){
          $scope.community.followerCount++;
          //$window.location.reload();
        }
        else if(followAction == 'unfollow'){
          $scope.community.followerCount--;
          //$window.location.reload();
        }
        $scope.community.statusOfCurrentUser = data.statusOfCurrentUser;
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };
    /*
    if($rootScope.userData){
      if($rootScope.userData.communityRoles){
        $scope.isUserComMgr = userRights.isUserHasRightToEditCommunity($scope.community.uid, $rootScope.userData);
      }
    }
    */
    var followStatusChange = $rootScope.$on('community.followed.unfollowed', function (event, data) {
      //feth feeds once language is fetched
      if($scope.community.uid == data.uid){
      }
    });
    $scope.$on("$destroy", function(){
      //clear all listeners
      followStatusChange();
    });
  })
  .controller('EditWikiBlockCtrl', function ($scope, $rootScope, $timeout, $window, $filter, apiMediaUpload){
    $scope.wikiBlockAddImg = function($files){
      $scope.wikiobj.image = null;
      if($files.length > 0)
      {
          $files.forEach(function(val, key){
            $scope.wikiobj.image = {
              fileName: val.name,
              uploadStatus: '0',
              file: val,
              cancel: null
            };
            //status codes
            //0: ready to upload
            //1: uploading
            //2: uploaded
            //3: eroor in uploading

            var uploadStatus = $scope.wikiobj.image.uploadStatus;
            if(uploadStatus != '1'){
                $scope.uploadImageOneByOne();
            }
          });

      }//if len>0
      //clear the input type file
      angular.forEach(
      angular.element("input[type='file']"),
      function(inputElem) {
        angular.element(inputElem).val(null);
      });
    };
    $scope.uploadImageOneByOne = function(){
      $scope.wikiobj.image.uploadStatus = '1';
      $scope.wikiobj.image.fileName = "uploading...";
      var uploadFile = [$scope.wikiobj.image.file];
      $scope.uploader = new apiMediaUpload();
      $scope.uploader.uploadImages(uploadFile, null).then(function(data){
            if(data.status == 'success'){
                angular.forEach(data.data, function(val, key){
                  if($scope.wikiobj.image.uploadStatus == "1"){

                    $scope.wikiobj.image= {
                      uploadStatus: '2',
                      uid: val.uid,
                      fileType: val.fileType,
                      fileName: val.fileName,
                      description: val.description,
                      url: val.url,
                      thumbUrl: val.thumbUrl,
                      mediumUrl: val.mediumUrl,
                      largeUrl: val.largeUrl,
                      thumbGalleryUrl: val.thumbGalleryUrl,
                      uploadedDate: val.uploadedDate
                    };
                  }//if found uploading file
                });//for each
            }// if successfully uploaded
            else if(data.status == 'cancelled'){
              if(data.option == 'cancelAll'){
                $scope.wikiobj.image = null;
              }
            }//if cancelled by user
          }, function(err){
              var uploadStatus = $scope.wikiobj.image.uploadStatus;
              if(uploadStatus == '1' && err.status == "error"){
                $scope.wikiobj.image.fileName = "Attachment failed";
                $scope.wikiobj.image.uploadStatus= '3';
              }
          }, function(data){
          });
    };
  })
  .controller('CreateEventCtrl', function ($scope, $rootScope, $compile, $http, Config, selectPeopleModal, selectLocationModal, $log, $timeout) {


    $scope.showSelectPeoplePopup = function(){
      var modal = selectPeopleModal.show($scope.eventobj.invitedPeoples);
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.eventobj.invitedPeoples = data.value.data;
          }
        });
    };

    $scope.removePeople = function(pplindex){
      $scope.eventobj.invitedPeoples.splice(pplindex, 1);
    };

  })
  .controller('GlobleSearchCtrl', function ($scope, $rootScope, $window, $timeout, apiSearch) {
    $scope.feeds = [];
    $scope.searchText = '';
    $scope.selSearchType = false; //to show dropdwon
    $scope.searchTypes = [];
    $rootScope.onSearch = true;

    $scope.selectedType = {
      title: 'All',
      val: 'all'
    };

    $scope.searchApi = null;

    $scope.searchTypes.push($scope.selectedType);

    angular.forEach($rootScope.searchableBlocks, function(val, key){
      //generate searchable types array
      $scope.searchTypes.push({
        title: val,
        val: val.toLowerCase()
      });
    });
    $scope.clearSearch = function(){
      $("#globle_search").blur();
      $timeout(function(){
            $scope.searchText = '';
            $scope.feeds = [];
            $scope.selSearchType = false;
          });
    };
    $scope.globleSearch = function(event, element){
      if(event.which == 13 || event.keyCode == 1){
        //navigate to search result page if 'Enter' pressed
        //$scope.searchText = '';
        if($scope.searchText.length > 0){
          $location.path('/search/'+$scope.searchText+'/'+$scope.selectedType.val+'/1');
        }
      }
    };
    $scope.loadSearhWithType = function(feedtype){
      $location.path('/search/'+$scope.searchText+'/'+feedtype+'/1');
    };
    $scope.setSearchType = function(obj){
      $scope.selectedType = obj;
    };
    var tempSeartText = '', filterTextTimeout;
    $scope.$watch('searchText', function (val) {
        if (filterTextTimeout || (val.length == 0)){
          //cancel search if text length is zero or search text has changed
          $timeout.cancel(filterTextTimeout);
        }
        tempSeartText = val;

        filterTextTimeout = $timeout(function() {
            $scope.feeds = [];
            if(tempSeartText != ''){
              var param = {
                  searchType: 'quickSearch',
                  language: $rootScope.currentLanguage.code,
                  searchText: tempSeartText
                };
              if($scope.selectedType.val != 'all'){
                param.type = $scope.selectedType.val;
              }
              if($scope.searchApi){
                //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
                $scope.searchApi.cancel('cancelled');
              }
              $scope.searchApi = new apiSearch();
              $scope.searchApi.search(param).then(function(data){
                if(data){
                  $scope.feeds = data;
                }
              }, function(err){
                //error
              });

            }else{
              //cancel if search text length is less than zero
              if($scope.searchApi){
                $scope.searchApi.cancel();
              }
            }
        }, 500); // delay 250 ms
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.clearSearch();
    });
  })
  .controller('GblSearchFeedCtrl', function ($scope, $rootScope, $timeout, $window, $translate, $filter, apiSearch) {
    $scope.title = 'Temp Title';
    $scope.actiSentence = 'temp actiSentence';
    $scope.thumbStyle = '';//{'background-image' : 'url(images/feed/community_icon.png)'}
    $scope.eventBlock = '';
    $scope.feedLink = '';
    $scope.highlightText = null;
    $scope.activityGenerator = {
          username: '',
          artType: $scope.feed.type,
          community: '',
    };
    $scope.communityLabel = '';

    if(!$scope.highlightText){
      $scope.highlightText = $scope.searchText; //gets parent searchText
    }

    var len = 0;
    if(typeof($scope.feed.blocks) != 'undefined'){
      angular.forEach($scope.feed.blocks, function(val, key){
        switch(val.type){
          case 'heading':
            $scope.title = $filter('highlight')(val.title, $scope.highlightText);
            if(typeof(val.imageGridviewSmallThumb) != 'undefined'){
              $scope.thumbStyle = {'background-image' : 'url('+val.imageGridviewSmallThumb+')'};
            }
            break;
          case 'text':
            if($scope.feed.type == 'quickpost'){
              $scope.title = $filter('highlight')(val.title, $scope.highlightText);
            }
            break;
          case 'document':
            if($scope.feed.type == 'document'){
              //$scope.title = val.caption;
              $scope.title = $filter('highlight')(val.caption, $scope.highlightText);
              var filetype = $filter('getFileType')(val.fileType);
              var thumburl = '';
              switch(filetype){
                case 'pdf':
                    thumburl = 'images/media/pdf.png';
                  break;
                case 'doc':
                    thumburl = 'images/media/doc.png';
                  break;
                case 'xls':
                    thumburl = 'images/media/xls.png';
                  break;
                case 'ppt':
                    thumburl = 'images/media/xls.ppt';
                  break;
              }
              $scope.thumbStyle = {'background-image' : 'url('+thumburl+')'};
            }
            break;
          case 'event':
            if($scope.feed.type == 'event'){
              $scope.title = $filter('highlight')(val.title, $scope.highlightText);
              $scope.thumbStyle = 'event';
              $scope.eventBlock = val;
            }
            break;
          case 'community':
            //$scope.title = val.label;
            $scope.communityLabel = val.label;
            $scope.title = $filter('highlight')(val.label, $scope.highlightText);
            $scope.thumbStyle = {'background-image' : 'url('+val.thumbLogoUrl+')'};
            $scope.actiSentence = val.description;
            break;
          case 'member':
            //$scope.title = val.displayName;
            $scope.title = $filter('highlight')((val.firstName+" "+val.lastName), $scope.highlightText);
            $scope.thumbStyle = {'background-image' : 'url('+val.thumbLogoUrl+')'};
            $scope.actiSentence = val.email;
            break;
        }
      });
    }

    //'<span>Article</span> By <span class="unm">John Swensson</span> in <sapn class="comm">Executies News</sapn> <span class="time">10h ago</span>'
    $scope.generateActSentence = function(argument) {
      if(typeof($scope.feed.author) != 'undefined' && typeof($scope.feed.community) != 'undefined'){
        $scope.activityGenerator.username = $scope.feed.author.firstName+" "+$scope.feed.author.lastName;
        //$scope.activityGenerator.userlink = "#/myprofile/"+$scope.feed.author.uid+"/Activities";
        $scope.activityGenerator.community = $scope.feed.community.label;
      }

      $scope.activityGenerator.artType = $scope.feed.type;

      $translate('type_by_user_in_community', $scope.activityGenerator).then(function (translation) {
        $scope.actiSentence = translation + "<span class='time'>&nbsp;"+$filter('timeago')($scope.feed.creationDate)+"</span>";
      });
    };

    switch($scope.feed.type){
      case 'article':
      case 'quickpost':
      case 'event':
        $scope.generateActSentence();
        break;
    }
  })
  .controller('GeneralSearchCtrl', function ($scope, $rootScope, $filter, modalData, close, $element, $window, $timeout, $location, apiOrganization, apiSearch, sharedData) {
    $scope.feeds = [];
    $scope.visibleData = [];

    $scope.searchText = '';
    $scope.selSearchType = false; //to show dropdwon
    $scope.searchTypes = [];
    $scope.searchFocus = false;
    $scope.searchStatus = 0; //0=not serarching, 1=searching, 2 = success, 3 = error
    //$scope.hashTags = [{text: '#foodTruck'}];

    $scope.selectedType = {
      title: 'All',
      type: 'all'
    };

    //$scope.modalData = $scope.$parent.ngDialogData;
    $scope.modalData = modalData;
    $scope.hashTags = ($scope.modalData.data && $scope.modalData.data.hashtags) ? $scope.modalData.data.hashtags : null;

    $scope.searchApi = null;
    $scope.popupTitle = null;

    $scope.searchTypes.push($scope.selectedType);

    if($scope.modalData.type == 'directory'){
      $scope.popupTitle = "Staff directory";
      apiOrganization.level().then(function(data) {
        angular.forEach(data, function(val, key) {
          $scope.searchTypes.push({
            title: val,
            type: val
          });
        });
      }, function(err) {
      });
    }
    else if($scope.modalData.type == 'general'){
      $scope.popupTitle = "Search engine";
      angular.forEach($rootScope.searchableBlocks, function(val, key){
        //generate searchable types array
        $scope.searchTypes.push({
          title: val,
          type: val.toLowerCase()
        });
      });
    }

    $scope.showMoreResults = function(){

      if($scope.feeds.length > 0){
        if($scope.feeds.length > sharedData.searchResLimit){
          $scope.visibleData.push.apply($scope.visibleData, $scope.feeds.splice(0,sharedData.searchResLimit));
        }
        else{
          $scope.visibleData.push.apply($scope.visibleData, $scope.feeds.splice(0, $scope.feeds.length));
        }
      }
    };

    $scope.prepareResData = function(result){
      angular.forEach(result, function(val, key){
        $scope.feeds.push.apply($scope.feeds, val.employees);
      });
      $scope.showMoreResults();
    };

    $scope.doSearch = function(tempSeartText){
      $scope.feeds = [];
      $scope.visibleData = [];
      var hashtags = '';
      if($scope.modalData.data != undefined){
        hashtags = $scope.modalData.data.hashtags;
      }

      if(!$filter('isBlankString')(tempSeartText) || !$filter('isBlankString')(hashtags) || $scope.modalData.type == 'directory'){
        //$scope.clearSearch();
        if($scope.searchApi){
          //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
          $scope.searchApi.cancel('cancelled');
          $scope.searchStatus = 0;
        }

        $scope.searchApi = new apiSearch();
        $scope.feeds = [];
        $scope.searchStatus = 1;
        if($scope.modalData.type == 'general'){
          var param = {
            searchType: 'quickSearch',
            language: $rootScope.currentLanguage.code,
            searchText: tempSeartText,
             hashtags:hashtags
          };
          if($scope.selectedType.type != 'all'){
            param.type = $scope.selectedType.type;
          }

          $scope.searchApi.search(param).then(function(data){
            if(data){
              $rootScope.highlightText = param.searchText;
              $scope.searchStatus = 2;
              $scope.feeds = data;
              $scope.showMoreResults();
            }
          }, function(err){
            //error
            $scope.searchStatus = 3;
          });
        }//if general search
        else if($scope.modalData.type == 'directory'){
          var param = {};
          if($filter('isBlankString')(tempSeartText)){
            param.random = true;
          }
          else{
            param.searchText = tempSeartText;
          }
          if($scope.selectedType.type != 'all'){
            param.filter = [$scope.selectedType.type];
          }
          $scope.searchApi.directorySearch(param).then(function(data){
            $rootScope.highlightText = param.searchText;
            if(data){
              $scope.searchStatus = 2;
              $scope.prepareResData(data);
            }
          }, function(err){
            //error
            $scope.searchStatus = 3;
          });
        }//if directory search
      }else{
        //cancel if search text length is less than zero
        if($scope.searchApi){
          $scope.searchApi.cancel('cancelled');
        }
      }
    };

    $scope.generalSearch = function(event, element){
      /*
      //uncomment this code to enable enter strike
      if(event.keyCode == 13 || event.keyCode == 1){
         $scope.doSearch($scope.searchText);
      }
      */
    };

    $scope.setSearchType = function(obj){
      $scope.selectedType = obj;
    };

    var tempSeartText = '', filterTextTimeout;
    if($scope.modalData.type == 'general'){
      $scope.$watch('searchText', function (val) {
          $scope.feeds = [];
          $scope.visibleData = [];
          if (filterTextTimeout){
            //cancel search if text length is zero or search text has changed
            $timeout.cancel(filterTextTimeout);
            $scope.searchStatus = 0;
          }
          if($scope.searchApi){
            $scope.searchApi.cancel();
          }

          if(!$filter('isBlankString')($scope.searchText)){
            tempSeartText = $scope.searchText;
            filterTextTimeout = $timeout(function() {
                $scope.doSearch(tempSeartText);
            }, 1000); // delay 250 ms
          }
      });
    }

    $scope.close = function(flag) {
      //  Manually hide the modal using bootstrap, without using the data-dismiss attribute.
      $element.modal('hide');
      close({
          flag: flag,
          data: null
        }, 500); // close, but give 500ms for bootstrap to animate
    };

    var stateChange = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      //$scope.clearSearch();
      $scope.close('cancel');
    });

    $scope.$on("$destroy", function(){
      stateChange();
      //$scope.clearSearch();
      $rootScope.highlightText = '';
    });
  })
  .controller('CreateDocumentCtrl', function ($scope, $rootScope, apiMediaUpload) {
    $scope.uploader = null;
    $scope.addDocument = function($files) {
      var docAttached = null;
      if($files.length > 0){
        $files.forEach(function(val, key){
          docAttached = {
            fileName: val.name,
            uploadStatus: '0',
            file: val,
            cancel: null
          };
          var uploadStatus = docAttached.uploadStatus;
          $scope.document.attachedDocs = docAttached;
          if(uploadStatus != '1'){
            //$scope.uploadImageOneByOne();
            var uploadFile = [docAttached.file];
            $scope.uploader = new apiMediaUpload();
            docAttached.uploadStatus = 1;
            $scope.uploader.uploadFiles(uploadFile, null).then(function(data){
                  if(data.status == 'success'){
                    angular.forEach(data.data, function(val, key){
                      docAttached = angular.copy(val);
                      docAttached.uploadStatus = '2';
                      $scope.document.attachedDocs = docAttached;
                    });//for each
                  }// if successfully uploaded
                  else if(data.status == 'cancelled'){
                    if(data.option == 'cancelAll'){
                      docAttached = null;
                    }
                  }//if cancelled by user
                }, function(err){
                    var uploadStatus = docAttached.uploadStatus;
                    if(err.status == "error"){
                      docAttached.fileName = "Attachment failed";
                      docAttached.uploadStatus= '3';
                      $scope.document.attachedDocs = docAttached;
                    }
                });
          }//if uploadStatus != 1
        });
      }//if len>0
      //clear the input type file
      angular.forEach(
      angular.element("input[type='file']"),
      function(inputElem) {
        angular.element(inputElem).val(null);
      });
    };
    $scope.$on("$destroy", function(){
      if($scope.uploader){
        $scope.uploader.cancel(null);
      }
    });
  })
  .controller('CollectionArticleDetailPopupCtrl', function ($scope, $rootScope, ngDialog, userRights, apiArticle, collectionArticleDetail){
    $scope.feeds = $scope.$parent.ngDialogData;
    $scope.feed = null;
    $scope.hashtags = [];
    $scope.headerImageFlag = false; //used for showing header image block
    $scope.title = null;
    $scope.subTitle = null;
    $scope.templateClass = 'standardMode';

    $scope.currentArtIndex = 0;

    $scope.resetArtData = function(){
      $scope.feed = null;
      $scope.hashtags = [];
      $scope.templateClass = 'standardMode';
      $scope.title = null;
      $scope.subTitle = null;
      $scope.headerImageFlag = false;
    };
    $scope.getArticleData = function(uid){
      $scope.resetArtData();
      apiArticle.getArticle(uid).then(function(data){
        $scope.feed = data.data;
        $scope.showFeedEditButton = userRights.isUserHasRightToEditAricle($scope.feed, $rootScope.userData);
        if($scope.feed.template){
          if($scope.feed.template.name == 'Zen Mode'){
            $scope.templateClass = 'zenMode';
          }
        }
        if(typeof($scope.feed.hashtags) != 'undefined'){
          $scope.hashtags = $scope.feed.hashtags;
        }
        angular.forEach($scope.feed.blocks, function(val, key) {
          if(val.type == 'heading'){
            if(val.title){
              $scope.title = val.title;
            }
            if(val.subTitle){
              $scope.subTitle = val.subTitle;
            }
            if(typeof(val.imageHeader) != 'undefined'){
              $scope.headerImageFlag = true;
            }
          }
        });
      }, function(err){
      });
    };
    if($scope.feeds.length > 0){
      $scope.getArticleData($scope.feeds[0].uid);
    }

    $scope.peviousArticle = function(){
      $scope.feed = null;
      $scope.currentArtIndex--;
      $scope.getArticleData($scope.feeds[$scope.currentArtIndex].uid);
    };

    $scope.nextArticle = function(){
      $scope.feed = null;
      $scope.currentArtIndex++;
      $scope.getArticleData($scope.feeds[$scope.currentArtIndex].uid);
    };
    $scope.closeModal = function(){
      collectionArticleDetail.hide();
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.closeThisDialog({flag: 'cancel', data: null});
    });
  })
  .controller('FileDetailEditCtrl', function ($scope, $filter, $window, $rootScope, userRights,  $http, notifyModal, ngDialog, apiFeedData, apiArticle, collectionArticleDetail, $timeout, $q, apiMediaManager, sharedData, confirmModal, fileDetailEditorModal, galleryModal){
    $scope.isEditingMode = false;
    $scope.hashTags = [];
    $scope.fileTitle = '';
    $scope.fileDescription = '';
    $scope.version = '';
    $scope.audience = '';
    //$scope.showgallery = false;
    $scope.filterPopupData = [];
    $scope.filterPopupData.fileName = '';

    $scope.selectedLang = $rootScope.currentLanguage;
    $scope.langOptions = angular.copy($rootScope.languages);
    $scope.showFileEditButton = false;

    $scope.selectedFeedStatus = {text: 'Select', val: null};

    $scope.feedStatusSelection = [];
    apiFeedData.statusList().then(function(data){
      angular.forEach(data, function(val, key){
        $scope.feedStatusSelection.push({
              text: val,
              val: val
            });
      });
    }, function(err){
    });
    $scope.showgal=function(){
        if($scope.showgallery){
            $scope.showgallery=false;
            $(".bx-controls-direction").find("a").css({"display": "none"});
        }else{
            $scope.showgallery=true;
            $(".bx-controls-direction").find("a").css({"display": "block"});            
        }
    };
    $scope.feedStautsChanged = function(selected){
      //$scope.feedStausLoader = true;
      //$scope.feedStausLoader = false;
      $scope.selectedFeedStatus = selected;
    };

    if($scope.file.language){
      var len = $scope.langOptions.length;
      for (var i = 0; i < len; i++) {
        if($scope.file.language == $scope.langOptions[i].code){
          $scope.selectedLang = $scope.langOptions[i];
          break;
        }
      };
    }
    if($scope.file.title){
      $scope.fileTitle = $scope.file.title;
    }
    if($scope.file.description){
      $scope.fileDescription = $scope.file.description;
    }
    if($scope.file.version){
      $scope.version = $scope.file.version;
    }
    if($scope.file.hashTags){
      $scope.hashTags = $scope.file.hashTags;
    }
    if($scope.file.status){
      $scope.selectedFeedStatus = {
        text: $scope.file.status,
        val: $scope.file.status
      };
    }
    
    $scope.enableEditing = function(flag){
      //$scope.isEditingMode = !$scope.isEditingMode;
      $scope.isEditingMode = flag;

      $timeout(function() {
        $rootScope.$broadcast('redrawSlider');
      });
    };
    if($scope.$parent.ngDialogData && typeof($scope.$parent.ngDialogData.enableEditing) != 'undefined'){
      //to show edit button directly
      $scope.showFileEditButton = true;
      $scope.enableEditing(true);
    }
    $scope.showFileEditorModal = function(idx){
      //used only for documenet gallery viwer to launch one more modal to edit files
      fileDetailEditorModal.show({type: $scope.type, data: $scope.allFilesList, fileindex: idx, otherData: $scope.otherData, enableEditing: true});
    };

    $scope.saveFileDetail = function() {
      var postData = {
        uid: $scope.file.uid,
        title: $scope.fileTitle,
        description: $scope.fileDescription,
        hashTag: sharedData.generateHashtagString($scope.hashTags),
        version: $scope.version,
        language: $scope.selectedLang.code
      };
//console.log(postData);
//console.log($scope.selectedFeedStatus.val);
      if($scope.selectedFeedStatus.val){
        postData.status = $scope.selectedFeedStatus.val;
      }
      if(!$filter('isBlankString')($scope.audience)){
          postData.audience = $scope.audience;
          //console.log($scope.audience);
      }


      apiMediaManager.editFile(postData).then(function(data){
        //success
        //console.log('updatedValue',data);
        data.uploadStatus = '2';
        data.isInternal =true;
        $rootScope.$broadcast('file.edited', {data: data});
        //$scope.file = data;
        $timeout(function(){
          $scope.fileTitle = data.title;
          $scope.file.title = data.title;

          $scope.fileDescription = data.description;
          $scope.file.description = data.description;

          $scope.hashTags = data.hashTags;
          $scope.file.hashTags = data.hashTags;

          $scope.enableEditing(false);
          //$rootScope.$broadcast('redrawSlider');
          $scope.closeThisDialog({flag: 'ok', data: data});
        });
      }, function(err){
        //error in editing
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };

    $scope.openInNewTab = function(link){
      /*
       if(link.indexOf("file:") > -1){
         link = link.replace(/\//g, "\\");
       }
      */
      if (navigator.userAgent.indexOf('Firefox') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6){
          //Firefox
          if(link.indexOf("\\") == 0){
            link = "file:"+link.replace(/\\/g, "\/");
          }
         }else if (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome') + 7).split(' ')[0]) >= 15){//Chrome
         //Allow
        }else if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Version') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Version') + 8).split(' ')[0]) >= 5){//Safari
         //Allow
        }
        $window.open(link, '_blank');
    };

    $scope.deleteFile = function(uid){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            apiMediaManager.deleteFile({"uid": uid}).then(function(data){
              $rootScope.$broadcast("file.deleted", {'uid': uid});
              $timeout(function() {
                $rootScope.$broadcast('reloadSlider');
              });
            }, function(err){
              notifyModal.showTranslated('something_went_wrong', 'error', null);
            });
          }
      });
    };

    
    $scope.downloadAll = function(){
        if($scope.allFilesList && $scope.allFilesList.length > 0){
          var link = document.createElement('a');

          link.setAttribute('download', null);
          link.style.display = 'none';

          document.body.appendChild(link);
          if($scope.allFilesList.length == 1){ //If single file then-> just download that file
            var path = "/api/mediamanager?file=attachments/" + $scope.allFilesList[0].uid + "/" + $scope.allFilesList[0].fileName;
            link.setAttribute('href', path);
            link.click();
          }else{ //if multiple file -> compress as a zip and download.
            var fileUids= [];
                  var fileName = 'Documents.zip';
                  for (var i in $scope.allFilesList) {
                    fileUids.push($scope.allFilesList[i].uid);
                    }
                  var postData = {
                      fileUids: fileUids,
                      fileName: fileName
                  };

                    apiMediaManager.downloadAllFilesAsAZip(postData).then(function(data){
                      link.setAttribute('href', data); 
                      link.click();
                    }, function(err){
                        notifyModal.showTranslated('something_went_wrong', 'error', null);
                  });
          }
          
          document.body.removeChild(link);
        }            
    };

    $scope.closeImgaVideoGalleryPopup = function(){
        galleryModal.hide();
      };

      $scope.canPreview = function(url){
    	  return $filter('getTypeByFileName')(url);
      }
  })
  .controller('CarouselManagerCtrl', function ($scope, $rootScope, $timeout, $window, $translate, apiCarousel, createCarouselModal, notifyModal, $filter,$state,carouselManagerModal){
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor
      carousels: [],
      page: 1,
      showViewMoreBtn: false
    };
    $scope.levelSelOptions = [{val: 1}, {val: 2}]
    $scope.levels = [
                     {name:'Level 1', value:1},
                     {name:'Level 2', value:2}
                   ];
    $scope.sequenceNumbers = [];

    $scope.levelSelected = function(selected, index){
      $scope.md.carousels[index].level = selected.val;
    };

    $scope.fetchAllCarouselData = function(viewType){
      $scope.md.status = 1;
      if(viewType=='more'){
    	  $scope.md.page++;
    	} else{
    	  $scope.md.carousels=[];
    	  $scope.md.page=1;
    	}
      apiCarousel.getAll({page: $scope.md.page, itemsPerPage: 10, isAdmin: false}).then(function(data){
        $scope.md.carousels = $scope.md.carousels.concat(data);
        $scope.md.showViewMoreBtn = ($scope.md.carousels.length == ($scope.md.page * 10)) ? true : false;
         $scope.md.status = 2;
        /*if(data){
          var temparr = [];
          angular.forEach(data, function(val, key){
            temparr.push({name: key, val: key});
          });
          $scope.sequenceNumbers = temparr;
        }*/
      }, function(err){
        $scope.md.page--;
         $scope.md.status = 3;
      });
    };
    $scope.fetchAllCarouselData();

    $scope.deleteCarousel = function(carousel){
      apiCarousel.delete({uid: carousel.uid}).then(function(data){
        angular.forEach($scope.md.carousels, function(val, key){
          if(val.uid == carousel.uid){
            $scope.md.carousels.splice(key, 1);
          }
        });
      }, function(err){
      });
    };

    $scope.activeCarousel= function(carousel,$event){
    	if ($event.target.checked) {
    		carousel.display = true;
        }else{
        	carousel.display = false;
        }
    };
    $scope.publishCarousel = function(carousel){
      var postdata = {
            uid : carousel.uid,
            level: carousel.level,
            display: carousel.display == true ? 1 : 0,
            sequenceNumber: $filter('isBlankString')(carousel.sequenceNumber) ? 0 : carousel.sequenceNumber
          };
      apiCarousel.publish(postdata).then(function(data){
        notifyModal.showTranslated('Published successfully.', 'success');
      }, function(err){
        notifyModal.show('Unable to publish.', 'error');
      });

    };

    $scope.closeCarouselManagerPopup = function(){
    	carouselManagerModal.hide();
    	$state.reload();
    };

    $scope.openCarouselManagerPopup = function(){
      carouselManagerModal.show();
    };

    $scope.openCarouselPopup = function(){
      var modal = createCarouselModal.show({action: 'create'});
      modal.closePromise.then(function (data) {
        if(data.value.flag == 'ok'){
          $scope.fetchAllCarouselData();
        }
      });
    };
    $scope.openEditCarouselPopup = function(carousel){
      var modal = createCarouselModal.show({action: 'edit', data: {uid: carousel.uid}});
      modal.closePromise.then(function (data) {
        if(data.value.flag == 'ok'){
          $scope.fetchAllCarouselData();
        }
      });
    };
  })
  .controller('CallDocumentUploadCtrl', function ($scope, $rootScope,  $http, ngDialog, createArticleModal, $timeout, $q, sharedData, browseDocumentModal){
    $scope.myFiles = null;
    $scope.docBlockAdddocs = function($files, $event) {
      if($files.length > 0){
        sharedData.slectedDocumentFiles = null;
        sharedData.slectedDocumentFiles = $files;
        sharedData.clearSelectInput();
        createArticleModal.show(null, {action: 'create', type: 'documentGallery', data: {filesFrom: 'local'}});
      }
    };

    $scope.showBrowseDocumentPopup = function(){
      var modal = browseDocumentModal.show($scope, null);
      modal.closePromise.then(function (data) {
        if(data.value.flag == 'ok'){
          var temparr = [];
          angular.forEach(data.value.data, function(val, key){
            var dobj = angular.copy(val);
            dobj.uploadStatus = '2';
            temparr.push(dobj);
          });
          sharedData.slectedDocumentFiles = temparr;
          createArticleModal.show(null, {action: 'create', type: 'documentGallery', data: {filesFrom: 'server'}});
        }
      });
    };

  })
  .controller('UserManagerCtrl', function ($scope, $rootScope, ngDialog, apiPeoples, createUserModal, customActionsModal, apiCommunity){
    $scope.md = {
      data: $scope.$parent.ngDialogData,
      page: 0,
      itemsPerPage: 20,
      showViewMoreBtn: false
    };
    $scope.users = [];

    $scope.getUserList = function() {
      if($scope.md.data && $scope.md.data.communityUid){
        //load users of specific communiteis if received community uid
        var comuid = $scope.md.data.communityUid;
        apiCommunity.getCommunityMember({communityUid: comuid, itemsPerPage: $scope.md.itemsPerPage , page: ++$scope.md.page}).then(function (data) {
          $scope.md.showViewMoreBtn = (data && data.length < $scope.md.itemsPerPage) ? false : true;
          var tempArr = [];
          angular.forEach(data, function (val) {
            tempArr.push(val.member);
          });
          $scope.users = $scope.users.concat(tempArr);
        }, function (err) {
          // error
        });
      }
      else{
        $scope.peopleApi = new apiPeoples();
        $scope.peopleApi.getPeoples().then(function(data){
          $scope.users = data;
        }, function(err){
        });
      }
    }
    $scope.getUserList();

    $scope.showCreateUserModal = function(type, data){
      var param = null;
      var mdType = 'all';
      var action = 'create';
      switch(type){
        case "edit":
          param = {uid: data.uid};
          action = "edit";
        break;
      }
      var modal = createUserModal.show({action: action, type: mdType, data: param});
    };
    $scope.showCustomActions = function(obj){
      /*switch(obj.action){
        case 'add_position':
          var modal = customActionsModal.show({type: 'user', action: 'add_position', data: obj.data});
        break;
        case 'add_organization':
          var modal = customActionsModal.show({type: 'user', action: 'add_organization', data: obj.data});
        break;
      }*/
      var modal = customActionsModal.show({type: 'user', action: obj.action, data: obj.data});
    };
  })
  .controller('UserCreateCtrl', function ($scope, $rootScope,  $http, $filter, ngDialog, $timeout, $q, sharedData, apiPeoples, apiPosition,
		  cropImagesModal, notifyModal, confirmModal,$state,dateTimeService,apiProfileCustomField,createUserSpecialityModal,apiUserSpeciality,$stateParams){
    //uid
    $scope.peopleApi = new apiPeoples();
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.login = '';
    $scope.email = '';
    $scope.telephone = '';
    $scope.portable = '';
    $scope.displayName = '';
    $scope.address = '';
    $scope.profileImage = null;
    $scope.bannerImage = null;
    $scope.customFields = [];
    $scope.disableSubService = true;
    $scope.positionName = '';
    $scope.isGCM = ($rootScope.userData.role && $rootScope.userData.role == 'GlobalCommunityManager') ? true : false;
    $scope.isCurrentUser = $rootScope.userData.uid == $stateParams.uid ? true : false;
    $scope.popupTitle = "Create_User";

    $scope.modalStatus = {
        status: 1,  //0: ideal, 1: fetching, 2: fetched, 3: error
        message: 'please wait...'
      };

    $scope.modalData = $scope.$parent.ngDialogData;
    
    if($scope.modalData.type == 'info'){
    	//load list position
        $scope.positionSelected = {
           uid : null,
           name: "Select Position",
           level: 0
        };

    	//get positions
	    /*apiPosition.getUsersPositions().then(function(data){
	      $scope.positions = data;
	    }, function(err){
	    });*/

	    $scope.selectPosition = function(selected){
	        $scope.position = selected.uid;
	     };

	     //get services
	     $scope.serviceSelected = {
	    		 name: "Select Service"
	     };

	     $scope.getServices = new apiPeoples();
	     $scope.getServices.getFilterList({field: 'service'}).then(function(data){
	    	 var ctemp = [];
	    	 angular.forEach(data, function(val){
	    		 var obj = {name: val};
	    		 ctemp.push(obj);
	    	 });
	    	 $scope.services = ctemp;
	     }, function(err){

	     });

	     $scope.selectService = function(selected){
	    	 $scope.service = selected.name;
	    	 if($scope.service != "Select Service"){
	    		 $scope.disableSubService = false;
	    	 }
	     };

	     //get directions
	     $scope.directionSelected = {
	    		 name: "Select Direction"
	     };

	     $scope.getDirections = new apiPeoples();
	     $scope.getDirections.getFilterList({field: 'direction'}).then(function(data){
	    	 var ctemp = [];
	    	 angular.forEach(data, function(val){
	    		 var obj = {name: val};
	    		 ctemp.push(obj);
	    	 });
	    	 $scope.directions = ctemp;
	     }, function(err){

	     });

	     $scope.selectDirection = function(selected){
	    	 $scope.direction = selected.name;
	     };

	     //get contact duration date
	     $scope.contactDurationDate = {
				 startDt: null
		 };

	     //get date of birth
	     $scope.dateOfBirth = {
				 startDt: null
		 };

	     //get date of entry
	     $scope.dateOfEntry = {
				 value : {startDt: null}
		 };

	     //get user hobbies
         $scope.getUserHobby = new apiPeoples();
         $scope.getUserHobby.getUserHobbies().then(function(data){
         	$scope.userHobbies = data;
         }, function(err){
         	notifyModal.showTranslated('something_went_wrong', 'error', null);
         });

         //custom fields
	     $scope.customFields = [];
	     apiProfileCustomField.getActiveProfileCustomFields({userUid:$scope.modalData.data.uid}).then(function(data){
	    	 $scope.fields = data;
	    	 angular.forEach($scope.fields, function(val, key){
	    		 var para = {
	    				 fieldId : val.id,
	    				 userUid : $scope.userUid,
	    				 name : val.name,
	    				 searchable : val.searchable,
	    				 displayOnProfile : val.displayOnProfile,
	    				 updateable : val.updateable,
	    				 type : val.type,
	    				 selectedDropdownValue : val.updatedValue != undefined && val.updatedValue != '' ? val.updatedValue : 'Select value'
	    		 };

	    		 if(val.type != 'Dropdown'){
	    			 para.value = val.updatedValue != undefined && val.updatedValue != '' ? val.updatedValue : val.value
	    		 }else{
	    			 para.value = val.updatedValue != undefined && val.updatedValue != '' ? val.updatedValue : ''
	    		 }

	    		 if(val.dropdownValues != undefined && val.dropdownValues.length > 0){
	    			 para.dropdownValues = [];
	    			 for(var i=0 ; i< val.dropdownValues.length ; i++){
	    				 para.dropdownValues.push({label : val.dropdownValues[i]});
	    			 }
	    			 $scope.selectedValue[key]={label:para.selectedDropdownValue};
	    		 }
	    		 $scope.customFields.push(para);
	    	 });
		}, function(err){
		   notifyModal.showTranslated('something_went_wrong', 'error', null);
		});
    }

    $scope.stopPropagation = function(event){
        event.stopPropagation();
    };

    $scope.hobbies = [];
    $scope.selectedHobby = function(event,h){
    	if (event.target.checked) {
    		$scope.hobbies.push(h.name);
    	} else {
    		if($scope.hobbies != null && $scope.hobbies.length > 0){
    			var index = $scope.hobbies.indexOf(h.name);
    			if(index !== -1){
    				$scope.hobbies.splice(index,1);
    			}
    		}
    	}
    };

    if(($scope.modalData.action == 'edit') && ($scope.modalData.data.uid)){
      $scope.popupTitle = "My profile";
      $scope.modalStatus.status = 1;
      $scope.peopleApi.getUser({uid: $scope.modalData.data.uid}).then(function(data){
    	  if($scope.modalData.type == 'info'){
    		  $scope.firstName = data.firstName;
    		  $scope.lastName = data.lastName;
    		  $scope.displayName = data.displayName;
    		  $scope.email = data.email != undefined && data.email != ' ' ? data.email : '';
    		  $scope.portable= data.portable;
    		  $scope.mobilephone= data.mobilephone;
    		  $scope.telephone = data.telephone;
    		  $scope.address = data.address;
    		  $scope.office = data.office;
    		  $scope.company = data.company;
    		  $scope.speciality = data.speciality;
//    		  $scope.hobbies = data.hobbies;
    		  $scope.town = data.town;
    		  $scope.zipCode = data.zipCode;
    		  $scope.hashTag = data.hashTags;
    		  $scope.positionName = data.positionName;

    		  //load contact duration date
    		  if(data.contactDurationDate){
    			  $scope.contactDurationDate.startDt = ($filter('newDate')(data.contactDurationDate)).getTime();
    		  }

    		  //load date of birth
    		  if(data.dateOfBirth){
    			  $scope.dateOfBirth.startDt = ($filter('newDate')(data.dateOfBirth)).getTime();
    		  }

    		  if(data.hobbies){
              	  var hobbies = data.hobbies.split("\n");
              	  if(hobbies != undefined && hobbies.length > 0){
              		  for(var i=0 ; i< hobbies.length ; i++){
        				  $scope.hobbies.push(hobbies[i]);
        				  for(var j=0 ; j< $scope.userHobbies.length ; j++){
	        				  if($scope.userHobbies[j].name == hobbies[i]){
	        					  $scope.userHobbies[j].selected =true;
	        				  }
        				  }
              		  }
              	  }
    		  }

    		  if(data.positions && data.positions.length > 0){
    			  for(var i=0 ; i < data.positions.length; i++){
    				  $scope.positionSelected = data.positions[i];
    				  break;
    			  }
    		  }

    		  if(data.service != undefined && data.service != "Select Service"){
    			  $scope.serviceSelected = {name : data.service};
    			  $scope.disableSubService = false;
    		  }

    		  if(data.division != undefined && data.division != "Select Direction"){
    			  $scope.directionSelected = {name : data.division};
    		  }

    		  var editedCustomFields = [];
              if(data.customFields != null && data.customFields.length > 0){
            	  for (var i=0 ; i< data.customFields.length ; i++){
            		  if(data.customFields[i].name == "Initials Name"){
            			  $scope.initialsName = {id : data.customFields[i].fieldId , value : data.customFields[i].value};
            		  }else if(data.customFields[i].name == "Date Of Entry"){
            			  $scope.dateOfEntry = {id : data.customFields[i].fieldId , value : {startDt : data.customFields[i].value ? ($filter('newDate')(data.customFields[i].value)).getTime() : null}};
            		  }else if(data.customFields[i].name == "Date Df"){
            			  $scope.dateDf = {id : data.customFields[i].fieldId , value : data.customFields[i].value};
            		  }else{
            			  editedCustomFields.push(data.customFields[i]);
            		  }
            	  }
              }
              $scope.fields = [];
              if($scope.customFields != null && $scope.customFields.length > 0){
                  angular.forEach($scope.customFields, function(val, key){
                	  if(val.name !== "Initials Name" && val.name !== "Date Of Entry" && val.name !== "Date Df"){
                		  if(editedCustomFields != null && editedCustomFields.length > 0){
	                		  angular.forEach(editedCustomFields, function(v, k){
	                			  if(val.name == v.name){
	                				  if(val.type == "Date"){
	                					  val.value = {startDt:($filter('newDate')(v.value)).getTime()};
	                				  }else{
	                					  val.value = v.value;
	                				  }
	                			  }
	                		  });
                		  }
                		  $scope.fields.push(val);
            		  }
                  });
              }
    	  }else if ($scope.modalData.type == 'images'){
    		  if(data.logoUid){
    			  $scope.profileImage = {
    					  uid: data.logoUid,
    					  urls: [
    					         data.logoUrl,
    					         data.headerLogoUrl
    					         ]
    			  };
    		  }//if data.logoUid

    		  if(data.bannerUid){
    			  $scope.bannerImage = {
    					  uid: data.bannerUid,
    					  urls: [
    					         data.bannerUrl,
    					         data.headerBannerUrl
    					         ]
    			  };
    		  }//if data.logoUid

    	  }

        $scope.modalStatus.status = 2;
      }, function(err){
        $scope.modalStatus.status = 3;
      });
    }
    else{
      $scope.modalStatus.status = 2;
    }

    $scope.uploadBannerIamgeSelect = function($files){
      var tempdata = {};
      if($files){
        tempdata = {
          action: 'crop',
          files: $files,
          cdimentions: [{w: sharedData.communityImageSize.banner.min.width, h: sharedData.communityImageSize.banner.min.height}],
          resize: true
        }
      }
      var modal = cropImagesModal.show(tempdata);
      modal.closePromise.then(function (data){
        if(data.value.flag == 'ok'){
          $scope.bannerImage = null;
          $timeout(function(){
            $scope.bannerImage = data.value.cropdata.data;
          });
        }
      });
    };
    $scope.onBannerIamgeSelect = function($files, event){
      if($files.length > 0){
        if($files[0].size > 5242880){
          var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
          modal.closePromise.then(function (data) {
              if(data.value == 'ok'){
                $scope.uploadBannerIamgeSelect($files);
              }
          });
        }
        else{
          $scope.uploadBannerIamgeSelect($files);
        }
      }
      else{
      }
    };
    $scope.recropBannerImage = function(){
      var tempdata = {};
      tempdata = {
          action: 'recrop',
          image: {
            uid: $scope.bannerImage.uid,
            url: $scope.bannerImage.urls[0]
          },
          cdimentions: [{w: sharedData.communityImageSize.banner.min.width, h: sharedData.communityImageSize.banner.min.height}],
          resize: true
        };
      var modal = cropImagesModal.show(tempdata);
      modal.closePromise.then(function (data){
        if(data.value.flag == 'ok'){
          $scope.bannerImage = null;
          $timeout(function(){
            $scope.bannerImage = data.value.cropdata.data;
          });
        }
      });
    };

    $scope.uploadProfileIamgeSelect = function($files){
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
          $scope.profileImage = null;
          $timeout(function(){
            $scope.profileImage = data.value.cropdata.data;
          });
        }
      });
    };
    $scope.onProfileIamgeSelect = function($files, event){
      if($files.length > 0){
        if($files[0].size > 5242880){
          var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
          modal.closePromise.then(function (data) {
              if(data.value == 'ok'){
                $scope.uploadProfileIamgeSelect($files);
              }
          });
        }
        else{
          $scope.uploadProfileIamgeSelect($files);
        }
      }
      else{
      }
    };

    $scope.recropProfileIamge = function(){
      var tempdata = {};
      tempdata = {
          action: 'recrop',
          image: {
            uid: $scope.profileImage.uid,
            url: $scope.profileImage.urls[0]
          },
          cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
          resize: true
        };
      var modal = cropImagesModal.show(tempdata);
      modal.closePromise.then(function (data){
        if(data.value.flag == 'ok'){
          $scope.profileImage = null;
          $timeout(function(){
            $scope.$apply(function() {
              //update the bindings on UI
              $scope.profileImage = angular.copy(data.value.cropdata.data);
            });
          }, 100);
        }
      });
    };
    
    //get all projects(experiences) of user
	$scope.getSpecialities = function (type) {
		var params = {
				userUid : $stateParams.uid,
				type : type,
				page: 0
		}
		apiUserSpeciality.getUserSpecialities(params).then(function (data) {
			if(typeof(data.code) != 'undefined' && data.code != null){
				var message= $filter('translate')(data.message);
        		var title = $filter('translate')('Error');
        		uiModals.alertModal(null,title, message);
			}else{
				$scope.totalItems = data.total;
				$scope.specialities = data.rows;
			}
        }, function (err) {
            notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
    }; 

    $scope.selectedTabName = 'profile';
    //load data when switching tabs
    $scope.tabSelected = function (name) {
    	$scope.selectedTabName = name;
    	if(name == 'project'){
    		$scope.getSpecialities('Project');
    	}else if(name == 'experience'){
    		$scope.getSpecialities('Experience');
    	}
    };
    
    //#1038 : Add new project/experience
    $scope.addSpeciality = function (type) {
    	var modal = createUserSpecialityModal.show(null, {action: 'create', type: type, data: null});
		modal.closePromise.then(function (data){
			if(data.value.flag == 'ok'){
				$scope.getSpecialities(type);
//				$scope.closeThisDialog({flag: 'ok', data: data});
			}
		});	
    };
    
    // Edit project/experience
    $scope.editSpeciality = function (type,id) {
    	var modal = createUserSpecialityModal.show(null, {action: 'edit', type: type, data: id});
		modal.closePromise.then(function (data){
			if(data.value.flag == 'ok'){
				$scope.getSpecialities(type);
//				$scope.closeThisDialog({flag: 'ok', data: data});
			}
		});	
    };
    
    //delete project/experience
    $scope.deleteSpeciality = function (type,id) {
    	var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "Delete " + type  + " Confirm"});
        modal.closePromise.then(function (data) {
            if (data.value == 'ok') {
            	apiUserSpeciality.deleteById(id).then(function (data) {
                    if (typeof (data.code) != 'undefined' && data.code != null) {
                        var message = $filter('translate')(data.message);
                        var title = $filter('translate')('Error');
                        uiModals.alertModal(null, title, message);
                    } else {
                        notifyModal.showTranslated('Deleted ' + type + ' Success', 'success', null);
                        
                        var len = $scope.specialities.length;
                        for(var i= 0; i<len; i++){
                        	if($scope.specialities[i].id == id){
                        		$scope.specialities.splice(i,1);
                        		break;
                        	}
                        }
                    }
                }, function (err) {
               	 notifyModal.showTranslated("something_went_wrong", 'error', null);
                });
            }
        });
    };
    
    //order projects
    $scope.sortableProjectOptions = {
    	stop: function(e, ui) {
    		var postData = [];
   			if($scope.specialities != undefined){
   				var i = 1;
   				angular.forEach($scope.specialities, function(val, key)  {
   					postData.push({"id" : val.id , "sequenceNumber" : i});
   					i++;
   				});
   				
   				apiUserSpeciality.order(postData).then(function(data){
    			}, function(err){
    				notifyModal.showTranslated('something_went_wrong', 'error', null);
				});
    		}
    	}
    };
    
    //order experiences
    $scope.sortableExperienceOptions = {
    	stop: function(e, ui) {
        	var postData = [];
       		if($scope.specialities != undefined){
       			var i = 1;
       			angular.forEach($scope.specialities, function(val, key)  {
       				postData.push({"id" : val.id , "sequenceNumber" : i});
       				i++;
       			});

       			apiUserSpeciality.order(postData).then(function(data){
        		}, function(err){
        			notifyModal.showTranslated('something_went_wrong', 'error', null);
    			});
        	}
        }
    };
    $scope.changeFirstName = function(firstName){
    	$scope.firstName = firstName;
    };
    
    $scope.changeLastName = function(lastName){
    	$scope.lastName = lastName;
    };
    
    $scope.changeEmail = function(email){
    	$scope.email = email;
    };
    
    $scope.changeTelephone = function(telephone){
    	$scope.telephone = telephone;
    };
    
    $scope.changePositionName = function(positionName){
    	$scope.positionName = positionName;
    };
    
    $scope.changeZipCode = function(zipCode){
    	$scope.zipCode = zipCode;
    };
    
    $scope.changeTown = function(town){
    	$scope.town = town;
    };
    
    $scope.changeAddress = function(address){
    	$scope.address = address;
    };
    
    $scope.changeSpeciality = function(speciality){
    	$scope.speciality = speciality;
    };
    
    $scope.changeHashTag = function(hashTag){
    	$scope.hashTag = hashTag;
    };
    $scope.validateData = function(){
      var postdata = {};
      var errorData = {
        flag: false,
        message: ''
      };
      if($scope.modalData.type == 'info'){
        //we are editing user's attribute too
        if(!$filter('isValidName')($scope.firstName)){
          errorData.flag = true;
          errorData.message = "Enter first name.";
        }else{
          postdata.firstName = $scope.firstName;
        }

        if(!$filter('isValidName')($scope.lastName)){
          errorData.flag = true;
          errorData.message = "Enter last name.";
        }else{
          postdata.lastName = $scope.lastName;
        }
//
//        if(!$filter('isBlankString')($scope.login)){
//          if($filter('isValidUserName')($scope.login)){
//            postdata.login = $scope.login;
//          }
//          else{
//            errorData.flag = true;
//            errorData.message = "enter_valid_username";
//          }
//        }
//
//        if($filter('isValidEmail')($scope.email)){
//          postdata.email = $scope.email;
//        }else{
//          errorData.flag = true;
//          errorData.message = "enter_valid_email";
//        }

        postdata.email = $scope.email != undefined && $scope.email != '' ? $scope.email : ' ';

        if(!$filter('isBlankString')($scope.telephone)){
          postdata.telephone = $scope.telephone;
        }
        /* else{
          errorData.flag = true;
          errorData.message = "Enter telephone.";
        } */
        if(!$filter('isBlankString')($scope.mobilephone)){
          postdata.mobilephone = $scope.mobilephone;
        }
        if(!$filter('isBlankString')($scope.displayName)){
          postdata.displayName = $scope.displayName;
        }
        else{
          errorData.flag = true;
          errorData.message = "Enter display name.";
        }
        if(!$filter('isBlankString')($scope.address)){
           postdata.address = $scope.address;
        }

//         if(!$filter('isBlankString')($scope.office)){
//        	 postdata.office = $scope.office;
//         }

         if(!$filter('isBlankString')($scope.town)){
        	 postdata.town = $scope.town;
         }

         if(!$filter('isBlankString')( $scope.zipCode)){
        	 postdata.zipCode =  $scope.zipCode;
         }

         if(!$filter('isBlankString')($scope.company)){
        	 postdata.company = $scope.company;
         }

         if(!$filter('isBlankString')($scope.speciality)){
        	 postdata.speciality = $scope.speciality;
         }

         var hobbies = "";
         if($scope.hobbies !== undefined && $scope.hobbies.length > 0){
        	 for(var i=0 ; i< $scope.hobbies.length ; i++){
        		 hobbies += $scope.hobbies[i];
        		 if(i < $scope.hobbies.length - 1){
        			 hobbies += "\n";
        		 }
        	 }
         }
         postdata.hobbies = hobbies;

         if($scope.service !== undefined && $scope.service !== 'Select Service'){
        	 postdata.service = $scope.service;
         }

         if($scope.direction !== undefined && $scope.direction !== 'Select Direction'){
        	 postdata.division = $scope.direction;
         }

         if($scope.contactDurationDate.startDt){
        	 postdata.contactDurationDate = $scope.contactDurationDate.startDt;
         }

         if($scope.dateOfBirth.startDt){
        	 postdata.dateOfBirth = $scope.dateOfBirth.startDt;
         }

         var customFields = [];

         if($scope.initialsName != undefined){
        	 customFields.push({fieldId : $scope.initialsName.id , value : $scope.initialsName.value, name : "Initials Name"});
         }

         if($scope.dateOfEntry != undefined){
        	 customFields.push({fieldId : $scope.dateOfEntry.id , value : $scope.dateOfEntry.value.startDt, name : "Date Of Entry"});
         }

         if($scope.dateDf != undefined){
        	 customFields.push({fieldId : $scope.dateDf.id , value : $scope.dateDf.value, name : "Date Df"});
         }

         if($scope.fields != null && $scope.fields.length > 0){
        	 angular.forEach($scope.fields, function(val, key){
        		 if(val.type == "Date"){
        			 customFields.push({fieldId : val.fieldId , value : val.value.startDt, name : val.name});
        		 }else{
        			 customFields.push({fieldId : val.fieldId , value : val.value, name : val.name});
        		 }
        	 });
         }

         postdata.customFields = customFields;
         if($scope.hashTag !== undefined && $scope.hashTag.length > 0){
           var hashtagList = '';
           angular.forEach($scope.hashTag, function(val, key){
             hashtagList += val.text;
             if(key != ($scope.hashTag.length - 1))
               hashtagList += ', ';
           });
           postdata.hashTag = hashtagList;
         }
//         postdata.position = $scope.position;
         postdata.positionName = $scope.positionName;
      }else if ($scope.modalData.type == 'images'){
	      if($scope.profileImage){
	        postdata.logoUid = $scope.profileImage.uid;
	      }
	      if($scope.bannerImage){
	        postdata.bannerUid = $scope.bannerImage.uid;
	      }
      }
      if($scope.modalData.data.uid){
        postdata.uid = $scope.modalData.data.uid;
      }
      return {data: postdata, error: errorData};
    };

    $scope.createUser = function(){
      var validateddata = $scope.validateData();
      if(!validateddata.error.flag){
        if($scope.modalData.type == 'info'){
          $scope.peopleApi.create(validateddata.data).then(function(data){
            $scope.closeThisDialog({flag: 'ok', data: data});
            //$state.reload();
          }, function(err){
          });
        }else{
          var post_data = {
            uid : validateddata.data.uid,
            logoUid : validateddata.data.logoUid,
            bannerUid : validateddata.data.bannerUid
          };
          $scope.peopleApi.changePhoto(post_data).then(function(data){
            $scope.closeThisDialog({flag: 'ok', data: data});
            //$state.reload();
          }, function(err){
          });
        }
      }
      else{
        notifyModal.showTranslated(validateddata.error.message, 'error', null);
      }
    };
  })
  .controller('OrganizationManagerCtrl', function ($scope, $rootScope,  $http, ngDialog, $timeout, $q, sharedData, apiOrganization, createOrganizationModal){

    $scope.organizations = [];

    apiOrganization.getAll().then(function(data){
      $scope.organizations = data;
    }, function(err){
    });

    $scope.deleteOrganization = function(obj){
      apiOrganization.delete({uid: obj.uid}).then(function(){
        angular.forEach($scope.organizations, function(val, key){
          if(val.uid == obj.uid){
            $scope.organizations.splice(key, 1);
          }
        });
      }, function(err){
      });
    };

    $scope.showCreateOrganizationModal = function(){
      createOrganizationModal.show({action: 'create', data: null});
    };

    $scope.openEditOrganizationPopup = function(obj){
      createOrganizationModal.show({action: 'edit', data: obj});
    };
  })
  .controller('CreateOrganizationCtrl', function ($scope, $rootScope,  $http, ngDialog, $timeout, $q, sharedData, apiOrganization, createOrganizationModal, apiLanguage, notifyModal){
    $scope.modalData =  $scope.$parent.ngDialogData;
    $scope.modalStatus = {
      isReady: false,
      message: 'please wait...'
    };

    $scope.languages = [];
    $scope.organizations = [];
    $scope.level = [];

    $scope.names = [];
    $scope.description = '';

    $scope.levelOptions = [];
    $scope.selectedLevel = {label: 'Select Level', value: null};
    $scope.parentOptions = [];
    $scope.selectedPrarent = {name: 'Select Parent', uid: null};

    $scope.initializeData = function(){
      var deferred = $q.defer();
      var pr0 = apiLanguage.getLanguageList();
      var pr1 = apiOrganization.getAll();
      var pr2 = apiOrganization.level();

      $q.all([pr0, pr1, pr2]).then(function(data){
        //for data[0]
        $scope.languages = data[0];
        //for data[1]
        $scope.organizations = [1];
        angular.forEach(data[1], function(val, key) {
        $scope.parentOptions.push({uid: val.uid, name: val.name});
        });
        //for data[2]
        $scope.level = data[2];
        angular.forEach(data[2], function(val, key) {
          $scope.levelOptions.push({label: val, value: val});
        });
        deferred.resolve("success");
      }, function(err){
        deferred.reject(err);
      });//q.all
      return deferred.promise;
    };
    $scope.initializeData().then(function(message) {
      if($scope.modalData.action == 'create'){
        angular.forEach($scope.languages, function(val, key){
          $scope.names.push({name: '', language: val.code, langLbl: val.name});
        });
      }
      else if($scope.modalData.action == 'edit' && $scope.modalData.data.uid){
        apiOrganization.getByUid($scope.modalData.data.uid).then(function(data){
          $scope.selectedLevel = {label: data.level, value: data.level};

          angular.forEach(data.translations, function(val, key) {
            $scope.names.push({name: val.name, language: val.language, langLbl: val.languageName});
          });

        }, function(err){
        });
      }
    }, function(err) {
    });


    $scope.createOrganization = function() {
      var errorData = {
        flag: false,
        message: ''
      };

      var postdata = {
        names: []
      };
      if($scope.modalData.uid){
        postdata.uid = $scope.modalData.uid;
      }
      if($scope.description != ''){
        postdata.description = $scope.description;
      }

      if($scope.selectedPrarent.uid){
        postdata.parentUid = $scope.selectedPrarent.uid;
      }
      else{
        errorData.flag = true;
        errorData.message = 'Select Parent.';
      }

      if($scope.selectedLevel.value){
        postdata.level = $scope.selectedLevel.value;
      }
      else{
        errorData.flag = true;
        errorData.message = 'Select level.';
      }

      angular.forEach($scope.names, function(val, key) {
        if(val.name != ''){
          postdata.names.push({name: '', language: val.code});
        }
      });
      if(postdata.names.length <= 0){
        errorData.flag = true;
        errorData.message = 'Add the name of organization.';
      }
      if(!errorData.flag){
        //data can be posted sucessfully
        apiOrganization.create(postdata).then(function(data) {
          $scope.closeThisDialog({flag: 'ok', data: data});
        }, function(err) {
          notifyModal.show('Unable to create organization.', 'error');
        });
      }
      else{
        notifyModal.show(errorData.message, 'error');
      }
    };
  })

  .controller('CreateLinkOrHeadingCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, notifyModal, apiUsefulLinks, $filter){

    $scope.modalData = $scope.$parent.ngDialogData;

    $scope.heading = '';
    $scope.isFooter = $scope.modalData.footer;
    $scope.linkTitle = '';
    $scope.link = '';

    $scope.headingList = [];
    $scope.selectedHeading = {
      uid: null,
      heading: "Select Heading"
    };
    if($scope.modalData.data && $scope.modalData.data.footer){
        $scope.isFooter = $scope.modalData.data.footer;
    }
    if($scope.modalData.type == 'link'){
      var param = {
        footer: $scope.isFooter
      };
      apiUsefulLinks.headingList(param).then(function(data){
        $scope.headingList = data.data;
      }, function(err){
      });
      if($scope.modalData.action == 'edit'){
        $scope.linkTitle = $scope.modalData.data.title;
        $scope.link = $scope.modalData.data.link;
        $scope.isFooter = $scope.modalData.data.footer;
        $scope.selectedHeading = {
          uid: $scope.modalData.data.heading.uid,
          heading: $scope.modalData.data.heading.heading
        };
      }
    }
    else if(($scope.modalData.action == 'edit') && ($scope.modalData.type == 'heading')){
      $scope.heading = $scope.modalData.data.heading;
    }
    $scope.done = function(){
      var errorData = {
        flag: false,
        message: ''
      };
      var postdata = {
        footer : $scope.isFooter
      };
      if($scope.modalData.type == 'heading'){
        if(($scope.modalData.data) && ($scope.modalData.data.uid)){
          postdata.uid = $scope.modalData.data.uid;
        }
        if($scope.heading != ''){
          postdata.heading = $scope.heading;
        }
        else{
          errorData.flag = true;
          errorData.message = "Enter heading."
        }
      }//heading
      else if($scope.modalData.type == 'link'){
        if(($scope.modalData.data) && ($scope.modalData.data.uid)){
          postdata.uid = $scope.modalData.data.uid;
        }
        if($scope.linkTitle != ''){
          postdata.title = $scope.linkTitle;
        }
        else{
          errorData.flag = true;
          errorData.message = "Enter_Title"
        }

        //!$filter('isBlankString')(val.path)

        if($filter('isValidUrl')($scope.link)){
          postdata.link = $scope.link;
        }
        else{
          errorData.flag = true;
          errorData.message = "Enter valid url"
        }
        if($scope.selectedHeading.uid){
          postdata.headingUid = $scope.selectedHeading.uid;
        }
        else{
          errorData.flag = true;
          errorData.message = "Select Heading"
        }
      }
      if(!errorData.flag){
        if($scope.modalData.type == 'heading'){
          apiUsefulLinks.createHeading(postdata).then(function(data){
            $scope.closeThisDialog({flag: 'ok', data: data, footer: postdata.footer});
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        }
        else if($scope.modalData.type == 'link'){
          apiUsefulLinks.createLink(postdata).then(function(data){
            $scope.closeThisDialog({flag: 'ok', data: data, footer: postdata.footer});
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        }
      }
      else{
        //notifyModal.showTranslated('something_went_wrong', 'error', null);
        notifyModal.showTranslated(errorData.message, 'error', null);
      }
    };
  })
  .controller('WidgetManagerCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, apiLanguage, apiCommunity, apiWidget, notifyModal, addWidgetModal, $state, $stateParams,uiModals,$filter,confirmModal){
    $scope.md = {
      status: 0  //0: ideal, 1: fetching, 2: fetched, 3: eroor
    };
    $scope.widgets = [];

    $scope.initializeData = function(){
      $scope.md.status = 1;
      $scope.widgets = [];
      var currentState = $state.current.name;
      var param = (currentState == "app.communityHome" || currentState == "app.communityHomeWithTab" || currentState == "app.communityHomeWithArticle") ? {"communityUid": $stateParams.commuid} : null;
      apiWidget.allWidgets(param).then(function(data){
        $scope.widgets = data;
        $scope.md.status = 2;
      }, function(err){
        $scope.md.status = 3;
      });
    };
    $scope.initializeData();

    $scope.createWidget = function(){
      var modal = addWidgetModal.show({action: 'create', type: 'widget', data: null});
      modal.closePromise.then(function (data){
        if(data.value.flag == 'ok'){
          $scope.initializeData();
        }
      });

    };
    $scope.editWidget = function(wgt){
      var modal = addWidgetModal.show({action: 'edit', type: 'widget', data: wgt});
      modal.closePromise.then(function (data){
        if(data.value.flag == 'ok'){
          $scope.initializeData();
        }
      });
    };
    $scope.deleteWidget = function(wgt){
    	var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_widget_confirm"});
        modal.closePromise.then(function (data) {
        	if(data.value == 'ok'){
                apiWidget.delete({uid: wgt.uid}).then(function(data){
                    if(typeof(data.code) != 'undefined' && data.code != null){
                		var message= $filter('translate')(data.message);
                		var title = $filter('translate')('Error');
                		uiModals.alertModal(null,title, message);
                	}else{
                		var len = $scope.widgets.length;
                        for(var i= 0; i<len; i++){
                          if($scope.widgets[i].uid == wgt.uid){
                            $scope.widgets.splice(i,1);
                            break;
                          }
                        }
                	}

                }, function(err){
                	notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            }
        });
    };

  })
 .controller('CreateWidgetCtrl', function ($scope, $rootScope, $http, $timeout, $filter, $q, sharedData, dateTimeService, apiLanguage, apiCommunity, apiWidget, notifyModal, apiMediaUpload,$state, $stateParams,uiModals,confirmModal,apiAgenda){
    $scope.widgetTitle = '';
    $scope.calendarPath = '';

    $scope.communitySelection = [];
    $scope.selectedCommunity = {label: "Select_Community"}; //Select_Community
    $scope.communitySelection = [];
    $scope.selectedWidgetType = {val:"Select Widget Type"}; //Select_Widget_Type
    $scope.widgetData = null;
    $scope.isWidgetActive = false;
    $scope.widgetTypeSelection = [];
    $scope.sequenceNumber = 0;
    $scope.communitylist = [];
    $scope.selectedDisplay = {value:"Home"};
    $scope.displaySelection = [{value:"Home"},{value:"Community"}];
    $scope.selectedCommUid = {
            text: "Select_Community",
            commid: null
    };
    $scope.isPublishing = false;
    $scope.modalData = $scope.$parent.ngDialogData;

    //Variable for RSS widget
    $scope.rss = {link: '', numberOfFeeds: 5};
    $scope.logo = null;

    $scope.uploader = new apiMediaUpload();
    $scope.csvFileSelected = function($files, $event){
      $files.forEach(function(val, key){
        $scope.widgetData.csvfile = {
          fileName: val.name,
          uploadStatus: '0',
          file: val,
          cancel: null
        };
        $scope.widgetData.csvfile.uploadStatus = '1';
        $scope.widgetData.csvfile.fileName = "uploading...";
        var uploadFile = [$scope.widgetData.csvfile.file];
        $scope.uploader.uploadFiles(uploadFile, null).then(function(data){
            if(data.status == 'success'){
              angular.forEach(data.data, function(val, key){
                if($scope.widgetData.csvfile.uploadStatus == "1"){
                  var dobj = angular.copy(val);
                  dobj.uploadStatus = '2';
                  $scope.widgetData.csvfile = dobj;
                }//if found uploading file
              });//for each
            }//if uploade success
            else if(data.status == 'cancelled'){
              $scope.widgetData.csvfile = null;
            }//if cancelled uploading
          }, function(err){
            var uploadStatus = $scope.widgetData.csvfile.uploadStatus;
            if(uploadStatus == '1' && err.status == "error"){
              $scope.widgetData.csvfile.fileName = "Attachment failed";
              $scope.widgetData.csvfile.uploadStatus= '3';
            }
          }, function(data){
          });
      });
    };


    $scope.valLogo = {
            width: sharedData.foodWidgetImageSize.logo.width,
            height: sharedData.foodWidgetImageSize.logo.height
    };

    $scope.logoImageSelect = function($files, event){
    	if($files.length > 0){
    		var tempdata = {};
    		if($files){
    			tempdata = {
    					action: 'crop',
    					files: $files,
    					cdimentions: [{w: $scope.valLogo.width, h: $scope.valLogo.height}],
    					resize: true
    			}
    		}

    		$scope.uploader.uploadImages($files, null).then(function (data){
    			if(data.status == 'success'){
    				angular.forEach(data.data, function(val, key){
    					$scope.logo= {
    							id: val.id,
    							uid: val.uid,
    							fileType: val.fileType,
    							fileName: val.fileName,
    							description: val.description,
    							url: val.url,
    							thumbUrl: val.thumbUrl,
    							mediumUrl: val.mediumUrl,
    							largeUrl: val.largeUrl,
    							thumbGalleryUrl: val.thumbGalleryUrl,
    							uploadedDate: val.uploadedDate
    					};
    				});//for each
    			}
    		});
        }else{
        }
    };

    $scope.widgetTypeChanged = function(obj){

      switch(obj.val){
        case 'FCKEditor':
          $scope.widgetData = {type: 'richText', content: '', modifiedBlock: false};
        break;
        case 'ImageGallery':
          $scope.widgetData = angular.copy(sharedData.imgGalleryObj);
        break;
        case 'VideoGallery':
          $scope.widgetData = angular.copy(sharedData.vdoGalleryObj);
        break;
        case 'AutomatedCalendar':
          $scope.widgetData = {csvfile: null};
        break;
        case 'RegularCalendar':
          $scope.widgetData = [{eventName: '', startDate: '', startTime: '', endDate: '', endTime: '', eventLink: ''}];
        break;
        case 'Poll':
            $scope.widgetData = [{question: '', id: '', active: true , answers : [{answer: '', id: '', active: true}]}];
        break;
        case 'RSS':
          $scope.widgetData = {};
        break;
        case 'FoodTruck':
            $scope.widgetData = {imageUid: '', id: '',description: '', options : [{name: '', id: '', price: ''}]};
        break;
        case 'CountdownClock':
            $scope.widgetData = {startMessage: '', endMessage: '',startDate: '', startTime: ''};
        break;
        case 'BikeBooking':
            $scope.widgetData = {imageUid: '', id: '',title: ''};
        break;
        default:
          $scope.widgetData = null;
        break;
      }
    };

    $scope.addQuestion = function(){
        $scope.widgetData.push({question: '', id: '', active: true, answers : [{answer: '', id: '', active: true}]});
    };

    $scope.removeQuestion = function(index,questionId){
    	if(questionId != ''){
            apiWidget.deleteQuestion({id:questionId}).then(function(data){
            	if(typeof(data.code) != 'undefined' && data.code != null){
            		var message= $filter('translate')(data.message);
            		var title = $filter('translate')('Error');
            		uiModals.alertModal(null,title, message);
            	}else{
            		$scope.widgetData.splice(index, 1);
            	}
              }, function(err){
                notifyModal.showTranslated('something_went_wrong', 'error', null);
              });
    	}else{
    		$scope.widgetData.splice(index, 1);
    	}
    };

    $scope.addAnswer = function(index){
        $scope.widgetData[index].answers.push({answer: '', id: '', active: true});
    };

    $scope.removeAnswer = function(questionIndex,index,answerId){
    	if(answerId != ''){
            apiWidget.deleteAnswer({id:answerId}).then(function(data){
            	if(typeof(data.code) != 'undefined' && data.code != null){
            		var message= $filter('translate')(data.message);
            		var title = $filter('translate')('Error');
            		uiModals.alertModal(null,title, message);
            	}else{
            		$scope.widgetData[questionIndex].answers.splice(index, 1);
            	}
              }, function(err){
                notifyModal.showTranslated('something_went_wrong', 'error', null);
              });
    	}else{
    		$scope.widgetData[questionIndex].answers.splice(index, 1);
    	}
    };

    $scope.addFoodOption = function(){
    	$scope.widgetData.options.push({name: '', id: '', price: ''});
    };

    $scope.removeFoodOption = function(index,optionId){
    	$scope.widgetData.options.splice(index, 1);
    };

    $scope.addEvent = function(){
      $scope.widgetData.push({eventName: '', startDate: '', startTime: '', endDate: '', endTime: '', eventLink: ''});
    };
    $scope.removeEvent = function(index,eventUid){
    	if(eventUid != ''){
    		var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
    		modal.closePromise.then(function (data) {
    			if (data.value == 'ok') {
    				apiAgenda.delete(eventUid).then(function (data) {
    					if(typeof(data.code) != 'undefined' && data.code != null){
    	            		var message= $filter('translate')(data.message);
    	            		var title = $filter('translate')('Error');
    	            		uiModals.alertModal(null,title, message);
    	            	}else{
    	            		$scope.widgetData.splice(index, 1);
    	            	}
    				}, function (err) {
    					notifyModal.showTranslated('something_went_wrong', 'error', null);
    				});
    			}
    		});
    	}else{
    	      $scope.widgetData.splice(index, 1);
    	}

    };

    $scope.communityChanged = function(obj){
	$scope.selectedCommunity=obj;
    };
    $scope.stopPropagation = function(event){
      event.stopPropagation();
    };

    $scope.doneCreateWidget = function(){
      var errorData = {
        false: false,
        message: ''
      };
      var postdata = {
        title: $scope.widgetTitle,
        active: $scope.isWidgetActive
      };
      if($scope.selectedWidgetType.val == 'Select Widget Type'){
        errorData.flag = true;
        errorData.message = 'Select Widget type.';
      }
      else{
        postdata.type = $scope.selectedWidgetType.val;
      }
      if($scope.modalData.data && $scope.modalData.data.uid){
        postdata.uid = $scope.modalData.data.uid;
      }
      if(!$filter('isBlankString')($scope.widgetTitle)){
        postdata.title = $scope.widgetTitle;
      }
      else{
        errorData.flag = true;
        errorData.message = 'Enter_Title';
      }

      if($scope.selectedDisplay.value == 'Community' && $scope.selectedCommUid.commid){
    	  postdata.communityUid = $scope.selectedCommUid.commid;
      }else if($scope.selectedDisplay.value == 'Community' && !$scope.selectedCommUid.commid){
    	  errorData.flag = true;
          errorData.message = 'Select_Community';
      }


      switch($scope.selectedWidgetType.val){
        case 'FCKEditor':
          postdata.content = $scope.widgetData.content;
        break;
        case 'AutomatedCalendar':
           //postdata.path = $scope.widgetData.csvfile.url;
           if($scope.calendarPath != ''){
            postdata.path = $scope.calendarPath;
           }
        break;
        case 'ImageGallery':
          var tempdata = sharedData.getMediaGalleryDataToPost($scope.widgetData.files, 'image');
          if(!errorData.flag){
            errorData = tempdata.error;
          }
          postdata.imageUids = tempdata.data;
        break;
        case 'VideoGallery':
          var tempdata = sharedData.getMediaGalleryDataToPost($scope.widgetData.files, 'embeddedVideo');
          if(!errorData.flag){
            errorData = tempdata.error;
          }
          postdata.videos = tempdata.data;
        break;
        case 'RegularCalendar':
          var tempEvtData = [];
          var eventlen = $scope.widgetData.length;
          for(var i=0; i<eventlen; i++){
            var tempEvtObj = {};
            var val = $scope.widgetData[i];

            if(val.startDate == '' || val.startTime == '' || typeof(val.startDate) == 'undefined' || typeof(val.startTime) == 'undefined' || !val.startDate || !val.startTime){
              errorData.flag = true;
              errorData.message = "select_event_start_date_time";
              break;
            }
            if(val.endDate == '' || val.endTime == '' || typeof(val.endDate) == 'undefined' || typeof(val.endTime) == 'undefined' || !val.endDate || !val.endTime){
              errorData.flag = true;
              errorData.message = "select_event_end_date_time";
              break;
            }
            var dtFrm = dateTimeService.dateTimeToMsec(val.startDate, val.startTime);
            var dtTo = dateTimeService.dateTimeToMsec(val.endDate, val.endTime);

            if(dtFrm && dtTo){
              if(dtFrm >= dtTo){
                errorData.flag = true;
                errorData.message = "event_startdate_less_than_end_date";
                break;
              }
            }

            if(!$filter('isBlankString')(val.eventLink)){
              if(!$filter('isValidUrl')(val.eventLink)){
                errorData.flag = true;
                errorData.message = 'Enter_valid_url_in_url_block';
                break;
              }
            }
            else{
              errorData.flag = true;
              errorData.message = 'Enter_url_in_url_block';
              break;
            }

            tempEvtData.push({
              uid: val.uid ? val.uid : undefined,
              eventName: val.eventName,
              fromDate: dtFrm,
              toDate: dtTo,
              eventLink: val.eventLink,
              location: val.location
            });

          }//for

          postdata.events = tempEvtData;
        break;
        case 'Poll':
            var tempPollData = [];
            var questionLen = $scope.widgetData.length;
            if($scope.widgetData != 'undefined' && $scope.widgetData.length > 0){
            	for(var i=0; i<$scope.widgetData.length; i++){
            		var val = $scope.widgetData[i];

            		if(val.question == '' || typeof(val.question) == 'undefined'){
                        errorData.flag = true;
                        errorData.message = "input_question";
                        break;
            		}
            		var answers = [];
            		if(val.answers != 'undefined' && val.answers.length > 0){
            			for(var a=0 ; a < val.answers.length ; a++){
            				if(val.answers[a].answer == '' || typeof(val.answers[a].answer) == 'undefined'){
                                errorData.flag = true;
                                errorData.message = "input_answer";
                                break;
                    		}

            				answers.push({
            					 id: val.answers[a].id ? val.answers[a].id : undefined,
            		             answer: val.answers[a].answer,
            		             active: val.answers[a].active,
            				});
            			}
            		}
            		tempPollData.push({
                        id: val.id ? val.id : undefined,
                        question: val.question,
                        active: val.active,
                        answers : answers
                      });

            	}
            }
            postdata.questions = tempPollData;
          break;
        //RSS
        case 'RSS':
        	if($filter('isBlankString')($scope.rss.linkk)){
        		errorData.flag = true;
                errorData.message = "Enter_url_in_url_block";
                break;
        	}
        	postdata.content =  $scope.rss.link + "---" + $scope.rss.numberOfFeeds;
        break;
        case 'FoodTruck':

            if($scope.widgetData != 'undefined'){
            	if(!$scope.logo){
            		errorData.flag = true;
            		errorData.message = "upload_image";
            		break;
            	}

            	if(!$scope.widgetData.options || $scope.widgetData.options.length == 0){
            		errorData.flag = true;
            		errorData.message = "input_food_option";
            		break;
            	}

        		var options = [];
            	if($scope.widgetData.options != 'undefined' && $scope.widgetData.options.length > 0){
            		for(var i=0 ; i < $scope.widgetData.options.length ; i++){
            			if($scope.widgetData.options[i].name == '' || typeof($scope.widgetData.options[i].name) == 'undefined'){
                    		errorData.flag = true;
                    		errorData.message = "input_name_of_food";
                    		break;
            			}

            			options.push({
        					id: $scope.widgetData.options[i].id ? $scope.widgetData.options[i].id : undefined,
        					name: $scope.widgetData.options[i].name,
        					price: $scope.widgetData.options[i].price,
        					sequenceNumber: i+1
        				});
            		}
            	}
        		var tempFoodTruckData = {
        				id : $scope.widgetData.id,
        				imageUid : $scope.logo.uid,
        				description : $scope.widgetData.description,
        				options : options
        		}

        		postdata.food = tempFoodTruckData;
            }
          break;
        case 'CountdownClock':

            if($scope.widgetData != 'undefined'){

            	if(!$scope.widgetData.startMessage){
            		errorData.flag = true;
            		errorData.message = "input_start_message";
            		break;
            	}

            	if(!$scope.widgetData.endMessage){
            		errorData.flag = true;
            		errorData.message = "input_end_message";
            		break;
            	}

            	if($scope.widgetData.startDate == '' || typeof($scope.widgetData.startDate) == 'undefined' || !$scope.widgetData.startDate){
                    errorData.flag = true;
                    errorData.message = "Choose Date";
                    break;
            	}

            	var startTime = $scope.widgetData.startTime;
            	if(startTime == '' || typeof(startTime) == 'undefined' || !startTime){
            		startTime = new Date("January 01, 1970 00:00:00");
            	}
            	var endDate = dateTimeService.dateTimeToMsec($scope.widgetData.startDate, startTime);

        		var tempCountdownClockData = {
        				startMessage : $scope.widgetData.startMessage,
        				endMessage : $scope.widgetData.endMessage,
        				endDate : endDate
        		}

        		postdata.countdownClockData = tempCountdownClockData;
            }
          break;
        case 'BikeBooking':
            if($scope.widgetData != 'undefined'){
            	if(!$scope.logo){
            		errorData.flag = true;
            		errorData.message = "upload_image";
            		break;
            	}
  		
        		var tempBikeBookingData = {
        				id : $scope.widgetData.id,
        				imageUid : $scope.logo.uid,
        				title : $scope.widgetTitle
        		}

        		postdata.bikeBooking = tempBikeBookingData;
            }
          break;
      }
      if(!$scope.isPublishing){
        if(!errorData.flag){
          $scope.isPublishing = true;
          //post data to create widget
          apiWidget.create(postdata).then(function(data){
        	  if(typeof(data.code) != 'undefined' && data.code != null){
        		  var message= $filter('translate')(data.message);
        		  var title = $filter('translate')('Error');
        		  uiModals.alertModal(null,title, message);
        	  }else{
                  $scope.isPublishing = false;
                  $scope.closeThisDialog({flag: 'ok', data: data});
                  $state.reload();
        	  }
          }, function(err){
            $scope.isPublishing = false;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });

        }
        else{
          notifyModal.showTranslated(errorData.message, 'error', null);
        }
      }//if not publishing
    };

    $scope.quickpostCommSelecte = function(selected){
        $scope.selectedCommunities = [];
        $scope.selectedCommunities.push(selected);

    };

    $scope.displayChanged = function(selected){

    	// reset community
    	$scope.selectedCommunities = [];
		$scope.selectedCommUid = {
	            text: "Select_Community",
	            commid: null
		};

    };
    $scope.initializeData = function(){
      var deferred = $q.defer();
      var pr0 = apiWidget.types();
      var pr1 = apiCommunity.getCommunitiesData();
      $q.all([pr0, pr1]).then(function(data){
        //for data[0]
	var types= ['FCKEditor','AutomatedCalendar','ImageGallery','VideoGallery','RegularCalendar','Poll','FoodTruck','Birthday', 'RSS',
	            'NoteDeServices','CountdownClock','BikeBooking'];//,'RSS'
        angular.forEach(data[0], function(val, key){
		if(types.indexOf(val) !=-1){
			$scope.widgetTypeSelection.push({
				val: val
			});
		}
        });
        //for data[1]
        //$scope.communitySelection = angular.copy(data[1]);
        $scope.communitylist = angular.copy(data[1]);
        $scope.ddSelectOptions = [];
        $scope.communitySelected = {
            text: "Community name/Category name"
        };
        $scope.communitylist.forEach(function(entry){
          var tempObj = {};
          tempObj.text = entry.label;
          tempObj.commid = entry.uid;
		  tempObj.tabs = entry.tabs;
          $scope.ddSelectOptions.push(tempObj);

          // init in a community
          if(typeof($stateParams.commuid) != 'undefined' && entry.uid == $stateParams.commuid){
        	  //show popup with selected community
        	  $scope.selectedCommUid = {
        			  text: entry.label,
                      commid: entry.uid,
                      tabs : entry.tabs
              };
        	  $scope.selectedDisplay = {value:"Community"};
          }
        });

        //for data[2]
        angular.forEach(data[2], function(val, key){
        	$scope.linkTypeSelection.push({
	            val: val
        	});
        });
        deferred.resolve("success");
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
        deferred.resolve("error");
      });
      return deferred.promise;
    };
    $scope.showOptionsToDisplayOn = true;
    $scope.initializeData().then(function(msg){
      if(($scope.modalData.action == 'edit') && ($scope.modalData.data.uid)){
        apiWidget.getByUid($scope.modalData.data.uid).then(function(data){
        	if(data.user){
        		 $scope.showOptionsToDisplayOn = false;
        	}
            $scope.widgetTitle = data.title;
            $scope.sequenceNumber = data.sequenceNumber;
            //if(data.type == 'FCKEditor'){}
            var allWgtLen = $scope.widgetTypeSelection.length;
            for(var i=0; i<allWgtLen; i++){
              if($scope.widgetTypeSelection[i].val == data.type){
                $scope.selectedWidgetType = $scope.widgetTypeSelection[i];
                $scope.widgetTypeChanged($scope.widgetTypeSelection[i]);
                break;
              }
            }
	    //using for multiple communities
            if(data.community){
                //show popup with preselected community
                var commlen = $scope.communitylist.length;
                $scope.selectedDisplay = {value:"Community"};
                for(var i=0; i<commlen; i++){
                  if($scope.communitylist[i].uid == data.community.uid){
                    $scope.selectedCommUid = {
                      text: $scope.communitylist[i].label,
                      commid: $scope.communitylist[i].uid,
                      tabs : $scope.communitylist[i].tabs
                    };

                    break;
                  }
                }
            }else{
            	$scope.selectedDisplay = {value:"Home"};
            }
            switch(data.type){
              case 'FCKEditor':
                $scope.widgetData = {type: 'richText', content: '', modifiedBlock: false};
                $scope.widgetData.content = data.content;
              break;
              case 'AutomatedCalendar':
                $scope.calendarPath = data.path;
              break;
              case 'ImageGallery':
                //add upload status '2' to all the files, this represent files are already uploaded on server
                var tempImgArr = [];
                angular.forEach(data.imageGallery, function(val, key){
                  var tobj = angular.copy(val);
                  tobj.uploadStatus = 2;
                  tempImgArr.push(tobj);
                });
                $scope.widgetData.files = tempImgArr;
              break;
              case 'VideoGallery':
                $scope.widgetData.files = data.videoGallery;
              break;
              case 'RegularCalendar':
                $scope.widgetData = [];
                if(data.events.length <= 0) {
                  $scope.addEvent();
                }
                else {
                  angular.forEach(data.events, function(val, key){
                    $scope.widgetData.push({
                      uid: val.uid,
                      eventName: val.eventName,
                      startDate: ($filter('newDate')(val.fromDate)).getTime(),
                      startTime: $filter('newDate')(val.fromDate),
                      endDate: $filter('newDate')(val.toDate),
                      endTime: $filter('newDate')(val.toDate),
                      eventLink: val.eventLink
                    });
                  });
                }
              break;
              case 'Poll':
                  $scope.widgetData = [];
                  if(data.questions.length <= 0) {
                	  $scope.addQuestion();
                  }else {
                	  for(var i=0 ; i< data.questions.length ; i++){
                		  var val = data.questions[i];
                		  var answers = [];
                		  for(var a=0 ; a< val.answers.length ; a++){
                			  answers.push({
                				  id : val.answers[a].id,
                				  active : val.answers[a].active,
                				  answer : val.answers[a].answer
                			  });
                		  }
                		  $scope.widgetData.push({
                              id: val.id,
                              question: val.question,
                              answers: answers
                          });
                	  }
                  }
                break;
              case 'RSS':
            	  var editData = data.content.split('---');
            	  $scope.rss.link = editData[0];
            	  $scope.rss.numberOfFeeds = (editData[1] == 'undefined') ? 5 : parseInt(editData[1]);
              break;
              case 'FoodTruck':
            	  var options = [];
            	  if(data.food.options && data.food.options != 'undefined' && data.food.options.length > 0){
	        		  for(var i=0 ; i< data.food.options.length ; i++){
	        			  options.push({
	        				  id : data.food.options[i].id,
	        				  name : data.food.options[i].name,
	        				  price : data.food.options[i].price
	        			  });
	        		  }
            	  }

            	  if(data.food.image){
            		  $scope.logoUrl = data.food.image.url ? data.food.image.url:undefined;
            		  $scope.logoUid = data.food.image.uid ? data.food.image.uid:undefined;
            		  $scope.logo={uid:$scope.logoUid,url:$scope.logoUrl};
            	  }

            	  $scope.widgetData = {
                      id: data.food.id,
                      description: data.food.description,
                      options: options
                  };
                break;
              case 'CountdownClock':
            	  if(data.countdownClockData){
            		  $scope.widgetData = {
            				  startMessage : data.countdownClockData.startMessage,
            				  endMessage : data.countdownClockData.endMessage,
            				  startDate: ($filter('newDate')(data.countdownClockData.endDate)).getTime(),
                              startTime: $filter('newDate')(data.countdownClockData.endDate),
            		  };

            	  }
                break;
              case 'BikeBooking':
            	  if(data.bikeBookingData.image){
            		  $scope.logoUrl = data.bikeBookingData.image.url ? data.bikeBookingData.image.url:undefined;
            		  $scope.logoUid = data.bikeBookingData.image.uid ? data.bikeBookingData.image.uid:undefined;
            		  $scope.logo={uid:$scope.logoUid,url:$scope.logoUrl};
            	  }

            	  $scope.widgetData = {
                      id: data.bikeBookingData.id,
                      title: data.bikeBookingData.title
                  };
                break;
            }
            $scope.isWidgetActive = data.active;
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        }//if action == edit

    }, function(errmsg){

    });

    $scope.$on("$destroy", function(){
      $scope.uploader.cancel("cancelAll");
    });

  })
  .controller('AttributeManagerCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, apiLanguage, apiCommunity, notifyModal, createAttributeModal){

    $scope.attributeList = [
      {
        display_name: 'File Name',
        name: 'Attr-FileName',
        description: 'Name of file',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Author',
        name: 'Attr-Author',
        description: 'Name of Author',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Description',
        name: 'Attr-Description',
        description: 'Description',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Source type',
        name: 'attr-Source Type',
        description: 'Description',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Source type',
        name: 'attr-Source Type',
        description: 'Internal or external source',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Source type',
        name: 'attr-Source Type',
        description: 'Internal or external source',
        visibility: true,
        type: 'G'
      },
      {
        display_name: 'Source Name',
        name: 'attr-Source Name',
        description: 'Source Name',
        visibility: true,
        type: 'G'
      }
    ];

    $scope.createAttribute = function() {
      var modal = createAttributeModal.show({action: 'create', data: null});
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.attributeList.push(angular.copy(data.value.data));
          }
        });
    };
    $scope.editAttribute = function(index) {
      var modal = createAttributeModal.show({action: 'edit', data: $scope.attributeList[index]});
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.attributeList.push(angular.copy(data.value.data));
          }
        });
    };
    $scope.deleteAttribute = function(index) {
      $scope.attributeList.splice(index, 1);
    }

  })
  .controller('CreateAttributeCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, apiLanguage, notifyModal){

    $scope.modalData = $scope.$parent.ngDialogData;



    $scope.attribute = {
      display_name: '',
      name: '',
      description: '',
      visibility: true,
    };

    if($scope.modalData.action == 'edit'){
      $scope.attribute = angular.copy($scope.modalData.data);
    }

    $scope.done = function() {
      $scope.closeThisDialog({flag: 'ok', data: $scope.attribute});
    };
  })
  .controller('CommentViewerCtrl', function ($scope, $rootScope, $q, notifyModal, apiFeedData){
    $scope.showViewInModal=true;
    $scope.popWrapperStyle = {
      "max-height" : (window.innerHeight-100)+"px",
      "min-height" : "200px",
      "overflow" : "scroll"
    }


    $scope.modalStatus = {
        isReady: false,
        message: 'please wait...'
      };
    $scope.modalData = $scope.$parent.ngDialogData;
    $scope.feed = $scope.modalData.data;
    $scope.feed.translate = true;
    var parameter = {
    		page: 1,
    		itemsPerPage: $rootScope.uiConfig.cmntsPerPage
    };

    if($scope.feed.type == 'follower quickpost'){
    	parameter.followerQuickpostUid = $scope.feed.uid;
    }else {
    	parameter.content = $scope.feed.uid;
    }
    apiFeedData.getComments(parameter).then(function(data){
      $scope.feed.comments = data;
      $scope.modalStatus.isReady = true;
    }, function(err){
      $scope.closeThisDialog({flag: 'cancel', data: null});
      notifyModal.showTranslated('something_went_wrong', 'error', null);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.closeThisDialog({flag: 'cancel', data: null});
	  $scope.showViewInModal=false;
    });
  })
  .controller('TestModalCtrl', function ($scope, $rootScope, modalData, close, $timeout, $q, sharedData, notifyModal){
    //test modalCtrl
    modalData.push({uid: 'test', text: "sample data"});
     $scope.close = function(flag) {
      if(flag == 'ok'){
        close({
          flag: 'ok',
          data: modalData
        }, 500); // close, but give 500ms for bootstrap to animate
      }
      else{
        close({
          flag: 'cancel',
          data: modalData
        }, 500); // close, but give 500ms for bootstrap to
      }
    };
  })



   .controller('bigMenuCtrl', function ($scope, $rootScope){

    $scope.annuaireclick = function(){
          $('#vivAnnuaire').on('hide.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-down"></span> Show');
        })
          $('#vivAnnuaire').on('show.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-up"></span> Hide');
        })

    };


    $scope.intranetclick = function(){
          $('#vivIntranet').on('hide.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-down"></span> Show');
        })
          $('#vivIntranet').on('show.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-up"></span> Hide');
        })

    };

    $scope.mediashakerclick = function(){
          $('#mediashaker').on('hide.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-down"></span> Show');
        })
          $('#mediashaker').on('show.bs.collapse', function () {
          //$('#tgbtn').html('<span class="glyphicon glyphicon-collapse-up"></span> Hide');
        })

    };

  })
  .controller('HeaderSliderCtrl', function ($scope, $rootScope, $timeout, $q, sharedData, notifyModal){
    //test modalCtrl
            angular.element("#image_slider_wide").ready(function () {

                    $('#image_slider_wide').carousel({
                        interval: 5000,
                        duration: 400,
                        cycle: true
                    });
                    $('#image_slider_wide').bcSwipe({
                        threshold: 50
                    });
            });
  })
  .controller('FooterCtrl', function ($scope, $rootScope, apiUsefulLinks){
    $scope.footerLinks =  [];
    apiUsefulLinks.showLinksData({footer: true}).then(function (data) {
      $scope.footerLinks = data;
    }, function (err) {
      // body...
    });
    apiUsefulLinks.versionLink({footer: true}).then(function (data) {
        $scope.versionLink = data;
      }, function (err) {
        // body...
      });
  })

  // Order widgets
   .controller('sortableCtrl', function ($scope, $window, $rootScope, $timeout, $q, sharedData, notifyModal,apiWidget){
       $scope.widgetMenuObject={
            activateWidget:'',
             widgetMenuEnable:false,
             widgetContainerHeight:{
                 height:$window.innerHeight - 160,
                 overflow:'auto'
             }
         };
               $scope.sortableOptions = {
  			    stop: function(e, ui) {
  			    	var postData = [];
  			    	if($scope.activeWidgets != undefined){
  			    		var i = 1;
  						angular.forEach($scope.activeWidgets, function(val, key)  {
  						   postData.push({"uid" : val.uid , "sequenceNumber" : i});
  						   i++;
  						});
  						apiWidget.order(postData).then(function(data){
  						}, function(err){
  						   notifyModal.showTranslated('something_went_wrong', 'error', null);
  						});
  			    	}
  			    }
  		};

            $rootScope.$on('widgetMenuToggle', function (event, flag) {
                    if (flag == true) {
                        $(".widget-nav-child").css("overflow-x","auto");
                        $(".widget-nav-child").width(window.innerWidth);
                    } else {
                        $scope.widgetMenuObject.activateWidget = '';
                        $(".widget-nav-child" ).scrollLeft( 0 );
                        $(".widget-nav-child").css("overflow-x","hidden");
                        $timeout(function () {
                            $(".widget-nav-child").width(0);
                        }, 900);
                    }
            });

            $scope.widgetMobileMenuClicked = function (wgt) {
                $scope.widgetMenuObject.widgetMenuEnable = true;
                if ($scope.widgetMenuObject.activateWidget.type == wgt.type && $scope.widgetMenuObject.activateWidget.uid == wgt.uid) {
                    $scope.widgetMenuObject.activateWidget = '';
                } else {
                    $scope.widgetMenuObject.activateWidget = {
                        type: wgt.type,
                        uid: wgt.uid
                    };
                }
            };
  })

  // change password
  .controller('ChangePasswordCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, notifyModal, apiPeoples,uiModals,$filter){
    $scope.headingList = [];
    $scope.linkList = [];
    $scope.change = function () {
	    var postdata = {
				uid : $rootScope.userData.uid,
				password : $scope.password,
				oldPassword : $scope.oldPassword,
				confirmPassword : $scope.confirmPassword
		};

	    $scope.peopleApi = new apiPeoples();
	    $scope.peopleApi.changePassword(postdata).then(function(data){
	    	if(typeof(data.code) != 'undefined' && data.code != null){
	    		var message= $filter('translate')(data.message);
          		var title = $filter('translate')('Error');
          		uiModals.alertModal(null,title, message);
	    	}else{
	    		notifyModal.showTranslated('Changed successfully', 'success');
	    		$scope.closeThisDialog({flag: 'ok', data: data});
	    	}
	    }, function(err){
	    	notifyModal.showTranslated('something_went_wrong', 'error', null);
	    });
    };
  })

  .controller('fullCalendarCtrl', function ($scope, $rootScope, $timeout, $q,$filter, $stateParams, $compile,sharedData, notifyModal,apiCalendar, uiCalendarConfig){

  $scope.events =[];
  $scope.communityId = null;
  if(typeof($stateParams.commuid)!= 'undefined' && $stateParams.commuid!=null){
    $scope.communityId = $stateParams.commuid;
  }

  $scope.userUid = null;
  if(typeof($stateParams.uid)!= 'undefined' && $stateParams.uid!=null){
	    $scope.userUid = $stateParams.uid;
  }
  var apiUrl = '' ;
  if($scope.communityId == null && $scope.userUid == null){
	  apiUrl = '/api/calendar';
  }else if ($scope.communityId != null){
	  apiUrl = '/api/calendar?comunityId='+$scope.communityId ;
  }else if ($scope.userUid != null){
	  apiUrl = '/api/calendar?userUid='+$scope.userUid ;
  }

  $scope.events = {
          url: apiUrl
  };

  $scope.eventRender = function(event, element, view ) {
      element.attr({'tooltip': event.title,
              'title': event.title,
                   'tooltip-append-to-body': true});
      $compile(element)($scope);
  };
  /* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false,
      lang: 'fr',
      firstDay: 1,
      contentHeight: 'auto',
      header:{
        left: 'prev title next',
        right: '',
        center: 'month,agendaWeek,agendaDay'
      },
      timeFormat: 'H(:mm)',
      minTime: '08:00:00',
      maxTime: '24:00:00',
      views: {
        month: { // name of view
            titleFormat: 'YYYY, MMM'
            // other view-specific options here
        }
      },
      eventRender: $scope.eventRender
    }
  };
  /* event sources array*/
  $scope.eventSources = [$scope.events];
  })
  .controller('organizationCtrl', function ($scope, $http, $rootScope, $timeout, $q, sharedData, notifyModal){
	  //test modalCtrl

	  angular.element(window).scroll(function () {
		  if ($(this).scrollTop() > 100) {
			  $('.goToTop').fadeIn();
		  } else {
			  $('.goToTop').fadeOut();
		  }
	  });

	  angular.element('.goToTop').click(function () {
		  $("html, body").animate({ scrollTop: 0 }, 1000);
		  	return false;
	  });

	  angular.element("#org").ready(function () {
		  $("#org").jOrgChart({
			  chartElement : '#chart',
			  dragAndDrop  : true
		  });

		  /* Custom jQuery for the example */
		  $("#show-list").click(function(e){
			  e.preventDefault();

			  $('#list-html').toggle('fast', function(){
				  if($(this).is(':visible')){
					  $('#show-list').text('Hide underlying list.');
					  $(".topbar").fadeTo('fast',0.9);
				  }else{
					  $('#show-list').text('Show underlying list.');
					  $(".topbar").fadeTo('fast',1);
				  }
			  });
		  });

		  $('#list-html').text($('#org').html());

		  $("#org").bind("DOMSubtreeModified", function() {
			  $('#list-html').text('');

			  $('#list-html').text($('#org').html());

			  prettyPrint();
		  });

	  });
  });
