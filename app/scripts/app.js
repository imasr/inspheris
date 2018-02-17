'use strict';

/**
 * @ngdoc overview
 * @name inspheris
 * @description
 * @author: Inspheris Corporation
 * # inspherisProjectApp
 * Main module of the application.
 */
angular
.module('inspherisProjectApp', [
    'angular-loading-bar',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap',

    'ui.bootstrap.datetimepicker',
    'ui.bootstrap',
    'ngFileUpload',
    'ngDropdowns',
    'templates-main',
    'ngCkeditor',
    'ui.sortable',
    'ngDialog',
    'cgNotify',
    'ngTagsInput',
    'pascalprecht.translate',
    'colorpicker.module',
    'ngCookies',
    'ui.calendar',
    'monospaced.elastic',
    'ui.router',
    'cn.offCanvas',
    'offClick',
    'pasvaz.bindonce',
    'infinite-scroll',
    'angular.filter',
    'tmh.dynamicLocale',
    'angularModalService',
    'afkl.lazyImage',
    'base64',
    'once',
    'mentio',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    "toggle-switch",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "com.2fdevs.videogular.plugins.buffering",
    //,"ngSuperfeedr"
])
.run(function($rootScope, $templateCache, $state, $interval, $stateParams, Config, UiConfig, userRights, $http, $q, $cookieStore, sharedData,
	adminConfig, apiLanguage, $translate, authService, apiFeedData, apiCommunity, editQuickpostModal, createArticleModal, galleryModal,
	$location, documentViewerModal, createCommunityModal,CreateFileBrowseModal, requestCommunityModal, collectionArticleDetail, carouselManagerModal, userManagerModal,
	organizationManagerModal, generalSearchModal, notifyModal, usefulLinkManagerModal, widgetManagerModal, attributeManagerModal, shareFeedModal,
	tmhDynamicLocale,changePasswordModal, statisticReportModal, digestModal,createDigestModal, configureNotificationModal,apiConfig,customTemplate,
	configureProfileCustomFieldModal, foodTruckModal,alertModal,
	noteModal,filePreviewModal,apiFileExternalSource,
	createYammerModal,bikeBookingModal){//uiGmapGoogleMapApi,
  // keep user logged in after page refresh
  $rootScope.globals = $cookieStore.get('globals') || {};
  /*if ($rootScope.globals.currentUser) {
  $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata || 'Basic';
  }

  if (($location.path() !='/login') && (!$rootScope.globals.currentUser || $rootScope.globals.currentUser == undefined)) {
    // redirect to login page if not logged in
    $location.path('/login');
    }
    else if($location.path() =='/login'&& $rootScope.globals.currentUser){
    // redirect to home page if logged in
    $location.path('/');
  }

  $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
*/
  $rootScope.uiConfig = UiConfig;
//  $rootScope.adminConfig = adminConfig;
  $rootScope.isQuicpostBlockEnabled = null;
  $rootScope.isEditQuickPost = false;
  $rootScope.userData = null;
  $rootScope.displayLanguageIcon = false;
  $rootScope.siteUrl = Config.apiHome;
  $rootScope.currentLanguage = null;
  $rootScope.defaultLanguage = null;
  $rootScope.highlightText = null; //used to highlight text in feeds if searched
  $rootScope.onSearch = false; //flag check data-feed if in search response
  $rootScope.textEditorOptns = {
    language: 'en',
    uiColor: '#000000'
  };
  $rootScope.translationService = UiConfig.translationService;
  $rootScope.searchableBlocks = ['People', 'Community', 'Article', 'Quickpost', 'Event'];//, 'Image', 'Video', 'Audio', 'Document'
  $rootScope.customTemplate = customTemplate;


  $rootScope.yammerData = "";


  /*if($cookieStore.get('selectedLanguage')){
    $rootScope.currentLanguage = $cookieStore.get('selectedLanguage');
    $translate.use($rootScope.currentLanguage.code);
    tmhDynamicLocale.set($rootScope.currentLanguage.code);
    $rootScope.$broadcast('language.changed', $rootScope.currentLanguage);
  }*/
  apiLanguage.getLanguageByCode({code: "fr"}).then(function(data){
	  $rootScope.defaultLanguage = data;
  }, function(err){
  });
  $rootScope.chooseLanguage = function(lang){
    $rootScope.currentLanguage = lang;
    $cookieStore.put('selectedLanguage', lang);
    $translate.use($rootScope.currentLanguage.code);
    tmhDynamicLocale.set($rootScope.currentLanguage.code);
    $rootScope.localDateFormat = sharedData.getGlobalDateFormat($rootScope.currentLanguage.code);
    $rootScope.longDateFormat = sharedData.getLongDateFormat($rootScope.currentLanguage.code);
    $rootScope.fullDateFormat = sharedData.getFullDateFormat($rootScope.currentLanguage.code);
    $rootScope.birthdayDateFormat = sharedData.getBirthdayDateFormat($rootScope.currentLanguage.code);
    $rootScope.customDateFormat = sharedData.getCustomDateFormat($rootScope.currentLanguage.code);
    $rootScope.dateFormat = sharedData.getDateFormat($rootScope.currentLanguage.code);
    $rootScope.dateTimeConfig = sharedData.dateTimeConfig($rootScope.currentLanguage.code);
    $rootScope.simpleDateFormat = sharedData.getSimpleDateFormat($rootScope.currentLanguage.code);
    $rootScope.$broadcast('language.changed', $rootScope.currentLanguage);
    $rootScope.$broadcast('change.month.language',lang.code);
  };
  $rootScope.getLanguageObjByCode = function(code){
    var len = $rootScope.languages.length;
    var obj = null;
    for(var i=0; i<len; i++){
      var tobj = $rootScope.languages[i];
      if(code == tobj.code){
        obj = tobj;
        break
      }
    }

    // set default language if current user's language is not exist or not active
    if(obj == null){
    	obj = $rootScope.defaultLanguage;
    }

    return obj;
  };
  /*
  //clear all http cache manually
  var cache = $cacheFactory.get('$http');
  cache.removeAll();
  */

  $rootScope.initializeApp = function(){
	  var deferred = $q.defer();
    	  var pr = [
    	            authService.getCurrentUser(),
    	            apiLanguage.getLanguageList(),
    	            adminConfig,
    	            apiFileExternalSource.getExternalSourceByName({name: 'GOOGLE_DRIVE'}),
    	            apiFileExternalSource.getExternalSourceByName({name: 'EMBED_URL'})
    	            //apiFeedData.statusList(),
    	            //apiCommunity.getCommunitiesData()
    	            ];

    	  $q.all(pr).then(function(data){
              $rootScope.adminConfig = data[2];
	          //for data[0]
	          if(!data[0].uid){
	            //redirect to login page
	            deferred.reject("logout");
	            window.location.href="/logout";
	          }

	          $rootScope.userData = data[0];
	          $cookieStore.put('lastUserUid', $rootScope.userData.uid)

	          //for data[1]
            $rootScope.languages = data[1];
            for (var i=0; i<$rootScope.languages.length; i++) {
              try{
                if($rootScope.languages[i].isShowOnHeader)
                {
                  $rootScope.displayLanguageIcon = true;
                  break;
                }
              }catch(er){}
            }


	          if($cookieStore.get('selectedLanguage') && $cookieStore.get('lastUserUid') && ($cookieStore.get('lastUserUid') == $rootScope.userData.uid)){
	              $rootScope.chooseLanguage($cookieStore.get('selectedLanguage'));
	          }
	          else if($rootScope.userData.language){
	              $rootScope.chooseLanguage($rootScope.getLanguageObjByCode($rootScope.userData.language));
	          }

	          //header admin menu
	          $rootScope.isUserHasRightAdmin = $rootScope.userData.role == 'GlobalCommunityManager' || $rootScope.userData.userType == 'GlobalCommunityManager' ? true : false;

	          $rootScope.showQuickpost = false;
	          var config = sharedData.findConfig("CREATION_QUICKPOST");
	      	  if(typeof(config.name) != 'undefined'){
	      		  $rootScope.showQuickpost = config.value ? true : false;
	      	  }

	          if($rootScope.showQuickpost){
	            //if showing quickpost block is allowed then check whether user has right to create content or not
	            $rootScope.isQuicpostBlockEnabled = userRights.userCanCreateContent($rootScope.userData);
	          }

	          $rootScope.followUserFeature= false;
	          var config = sharedData.findConfig("FOLLOWING_USER");
	          if(typeof(config.name) != 'undefined'){
	        	  $rootScope.followUserFeature = config.value ? true : false;
	          }

	          $rootScope.writePrivateMessageFeature= false;
	          var config = sharedData.findConfig("PRIVATE_MESSAGE");
	          if(typeof(config.name) != 'undefined'){
	        	  $rootScope.writePrivateMessageFeature = config.value ? true : false;
	          }

	          $rootScope.customProfileFieldFeature = false;
	          var customProfileFieldConfig = sharedData.findConfig("CUSTOM_PROFILE_FIELD");
	          if(typeof(customProfileFieldConfig.name) != 'undefined'){
	        	  $rootScope.customProfileFieldFeature = customProfileFieldConfig.value ? true : false;
	          }

	          $rootScope.alertFeature = false;
	          var alertConfig = sharedData.findConfig("ALERT_MODULE");
	          if(typeof(alertConfig.name) != 'undefined'){
	        	  $rootScope.alertFeature = alertConfig.value ? true : false;
	          }

	          $rootScope.digestFeature = false;
	          var digestConfig = sharedData.findConfig("DIGEST_MODULE");
	          if(typeof(digestConfig.name) != 'undefined'){
	        	  $rootScope.digestFeature = digestConfig.value ? true : false;
	          }

	          // for enable organizational chart
	          $rootScope.enableOrgChart = false;
	          var config = sharedData.findConfig("ORGANIZATIONAL_CHART");
	          if(typeof(config.name) != 'undefined'){
	        	  $rootScope.enableOrgChart = config.value ? true : false;
	          }

	          // for note the service feature
	          $rootScope.noteTheServiceFeature = false;
	          var noteTheServiceConfig = sharedData.findConfig("NOTE_THE_SERVICE");
	          if(typeof(noteTheServiceConfig.name) != 'undefined'){
	        	  $rootScope.noteTheServiceFeature = noteTheServiceConfig.value ? true : false;
	          }

	          $rootScope.enableSidebarMenu = false;
	          var sidebarMenuConfig = sharedData.findConfig("SIDEBAR_MENU");
	          if(typeof(sidebarMenuConfig.name) != 'undefined'){
	        	  $rootScope.enableSidebarMenu = sidebarMenuConfig.value ? true : false;
	          }

	          // for show or hide full calendar
	          $rootScope.isShowFullCalendar = false;
	          var configFullCalendar = sharedData.findConfig("FULL_CALENDAR");
	          if(typeof(configFullCalendar.name) != 'undefined'){
	        	  $rootScope.isShowFullCalendar = configFullCalendar.value ? true : false;
	          }

	          // for show or hide pin article on homepage
	          $rootScope.enablePinArticleFeature = false;
	          var pinArticleConfig = sharedData.findConfig("PIN_ARTICLE");
	          if(typeof(pinArticleConfig.name) != 'undefined'){
	        	  $rootScope.enablePinArticleFeature = pinArticleConfig.value ? true : false;
	          }

	          // for show or hide pin community post on homepage
	          $rootScope.enablePinCommunityFeature = false;
	          var pinCommunityConfig = sharedData.findConfig("PIN_COMMUNITY_POST");
	          if(typeof(pinArticleConfig.name) != 'undefined'){
	        	  $rootScope.enablePinCommunityFeature = pinCommunityConfig.value ? true : false;
	          }

	          // for show /hide popup terms and condition when using for the first time.
	          $rootScope.isShowTermsOfUse = false;
	          var configTermsOfUse = sharedData.findConfig("TERMS_OF_USE");
	          if(typeof(configTermsOfUse.name) != 'undefined'){
	        	  $rootScope.isShowTermsOfUse = configTermsOfUse.value ? true : false;
	          }

	          // get level for the moderation workflow
	          $rootScope.workflowLevel = 0;
	          var configWorkflowLevel = sharedData.findConfig("MODERATION_WORKFLOW_LEVEL");
	          if(typeof(configWorkflowLevel.name) != 'undefined'){
	        	  $rootScope.workflowLevel = configWorkflowLevel.value;
	          }

	          // for show /hide user's badge
	          $rootScope.isShowUserBadge = false;
	          var configUserBadge = sharedData.findConfig("PROFILE_BADGE");
	          if(typeof(configUserBadge.name) != 'undefined'){
	        	  $rootScope.isShowUserBadge = configUserBadge.value ? true : false;
	          }

	          // for show /hide user's pinned post
	          $rootScope.isShowUserPinnedPost = false;
	          var configUserPinnedPost = sharedData.findConfig("PINNED_POST_OF_USER");
	          if(typeof(configUserPinnedPost.name) != 'undefined'){
	        	  $rootScope.isShowUserPinnedPost = configUserPinnedPost.value ? true : false;
	          }
	          
	          // for show /hide user's project
	          $rootScope.isShowUserProject = false;
	          var configUserProject= sharedData.findConfig("PROFILE_PROJECT");
	          if(typeof(configUserProject.name) != 'undefined'){
	        	  $rootScope.isShowUserProject = configUserProject.value ? true : false;
	          }
	          
	          // for show /hide user's experience
	          $rootScope.isShowUserExperience = false;
	          var configUserExperience = sharedData.findConfig("PROFILE_EXPERIENCE");
	          if(typeof(configUserExperience.name) != 'undefined'){
	        	  $rootScope.isShowUserExperience = configUserExperience.value ? true : false;
	          }
	          
	          $rootScope.writeContentForOtherUserFeature= false;
	          var configWriteContentForOtherUser = sharedData.findConfig("WRITE_CONTENT_FOR_OTHER_AUTHOR");
	          if(typeof(configWriteContentForOtherUser.name) != 'undefined'){
	        	  $rootScope.writeContentForOtherUserFeature = configWriteContentForOtherUser.value ? true : false;
	          }
	          
	          // for show /hide "Project Management" Tab Type On Community
	          $rootScope.isTeamworkCommunityTab = false;
	          var configTeamworkCommunityTab= sharedData.findConfig("TEAMWORK_COMMUNITY_TAB");
	          if(typeof(configTeamworkCommunityTab.name) != 'undefined'){
	        	  $rootScope.isTeamworkCommunityTab = configTeamworkCommunityTab.value ? true : false;
	          }
	          
	          // for show /hide secondary slider on homepage
	          $rootScope.isShowSecondarySlider = false;
	          var configShowSecondarySlider = sharedData.findConfig("SECONDARY_SLIDER");
	          if(typeof(configShowSecondarySlider.name) != 'undefined'){
	        	  $rootScope.isShowSecondarySlider = configShowSecondarySlider.value ? true : false;
	          }
	          
	          // for show /hide the button request a community on community listing page
	          $rootScope.isShowTheRequestOfCommunityBtn = false;
	          var configTheRequestOfCommunity = sharedData.findConfig("REQUEST_OF_COMMUNITY");
	          if(typeof(configTheRequestOfCommunity.name) != 'undefined'){
	        	  $rootScope.isShowTheRequestOfCommunityBtn = configTheRequestOfCommunity.value ? true : false;
	          }
	          
	          if(UiConfig.showVivHeader){
	            $rootScope.isVivHeaderEnabled = true;
	          }



	          //for data[2]
	          $rootScope.adminConfig = data[2];

	          //for data[3] -- get config of google drive files
	          $rootScope.configGoogleDriveFile = data[3];
	          
	          //for data[4] -- get embed API key
	          $rootScope.embedApiKey = data[4] ?  data[4].key : "c8e0fed5fd4d4ea5a3f8820853c1980c";

	          deferred.resolve("success");
	    }, function(err){
          authService.pingServer().then(function(data){
            console.log('ping server:' + data.status);
            if(data.status == 'expired' || data.status == 'notlogin'){
              location.reload();
            }else{
              deferred.reject(err);
              notifyModal.show(err, 'error');
              ///notifyModal.show("App couldn't initialze properly. Reload the page.", 'error');
            }
          });


	    });//q.all
      return deferred.promise;
  };//initializeApp




  $rootScope.getUserProfilePic = function(data){
    var pUrl = 'images/no_image_user.png';
    if(data){
      if(data.headerLogoUrl){
        pUrl = data.headerLogoUrl;
      }
    }
    return pUrl;
  };

  /*
  $rootScope.$watch('currentLanguage', function() {
    //update locally stored language value whenever currentLangulage changes
    if($rootScope.currentLanguage){
    $cookieStore.put('selectedLanguage', $rootScope.currentLanguage);
    $translate.use($rootScope.currentLanguage.code);
    }
  });
  */

  $rootScope.loadTags = function(query){
        var searchTag = query.replace("#","");
        var defer = $q.defer();
        var hashtagUrl = '/api/content/hashtags';
        $http({method: 'GET', url: hashtagUrl, params: {query: searchTag}}).
        then(function onSuccess(response) {
          var data = response.data;
          var l = data.length;
          var tags = [];
          for (var j = 0; j < l; j++){
            tags.push({'text' : data[j].tagName, count: data[j].count});
          }
          defer.resolve(tags);
        }, function onError(response) {
          var data = response.data;
          defer.reject(data);
        });
        return defer.promise;
  };



  //global functions
  $rootScope.checkUidInArray = function (uid, arr) {
    //this function is used in second menu on community home page to show active class
    var len = arr.length;
    var flag = false;
    for(var i=0; i<len; i++){
      if(uid == arr[i].uid){
        flag = true;
        break;
      }
    }
    return flag;
  };
  // $rootScope.openFileBrowsePopup = function(){
  //   CreateFileBrowseModal.show({action: 'create', type: 'community', mode: 'info', data: null});
  // };
  $rootScope.openCreateArticlePopup = function(){
    var cstate = $state.current.name;
    var modaldata = null;
    if((cstate == 'app.communityHome') || (cstate == 'app.communityHomeWithTab') || (cstate == 'app.communityHomeWithArticle')){
      modaldata = {communityUid: $stateParams.commuid};
    }
    createArticleModal.show(null, {action: 'create', type: 'article', data: modaldata});
  };
  $rootScope.openCreateQuickpostPopup = function(){
    var modal = editQuickpostModal.show({action: 'create', type: 'quickpost', data: null});
  };
  $rootScope.openCreateCommPopup = function(){
    createCommunityModal.show({action: 'create', type: 'community', mode: 'info', data: null});
  };
  $rootScope.openCreateTemplatePopup = function(){
    createArticleModal.show(null, {action: 'create', type: 'template', data: null});
  };
  $rootScope.openEditTemplatePopup = function(){
    createArticleModal.show(null, {action: 'edit', type: 'template', data: null});
  };
  $rootScope.openCreateFeedPopup = function(obj){
    var cstate = $state.current.name;
    var modaldata = null;
    if((cstate == 'app.communityHome') || (cstate == 'app.communityHomeWithTab') || (cstate == 'app.communityHomeWithArticle')){
      modaldata = {communityUid: $stateParams.commuid};
    }

    if(obj.type == 'event'){
      createArticleModal.show(null, {action: 'create', type: 'event', data: modaldata});
    }
    else if(obj.type == 'doc'){
      createArticleModal.show(null, {action: 'create', type: 'documentGallery', data: modaldata});
    }
    else if(obj.type == 'imageGallery'){
      createArticleModal.show(null, {action: 'create', type: 'imageGallery', data: modaldata});
    }
    else if(obj.type == 'content'){
      createArticleModal.show(null, {action: 'create', type: 'content', data: modaldata});
    }
	else if(obj.type == 'yammer'){
     createYammerModal.show(null, {action: 'create', type: 'yammer' , data:obj.yammardata , attachment:obj.attachment});
    }
  };
  $rootScope.openRequestCommunityPopup = function(){
    var modal = requestCommunityModal.show();
  };
  $rootScope.openUsefulLinkManagerPopup = function(optn){
    var modal = usefulLinkManagerModal.show({type: optn});
  };

  /***nethys widget***/

  $rootScope.openfoodTruckPopup = function(data){
    var modal = foodTruckModal.show(null, {data: data});
  };

  $rootScope.openBookingPopup = function(data){
	    var modal = bikeBookingModal.show(null, {data: data});
  };
	  

  $rootScope.openChangePasswordPopup = function(){
    var modal = changePasswordModal.show();
  };

  $rootScope.openWidgetManagerPopup = function(){
    var modal = widgetManagerModal.show();
  };
  $rootScope.openAttributeManagerPopup = function(){
    var modal = attributeManagerModal.show();
  };
  $rootScope.shareFeedPopup = function(feed){
    shareFeedModal.show(feed);
  };

  $rootScope.openStatisticReportPopup = function(){
	    var modal = statisticReportModal.show();
  };

  $rootScope.openDigestPopup = function(){
	  var modal = digestModal.show();
  }

  $rootScope.openCreateDigestPopup = function(){
	  var modal = createDigestModal.show(null, {action: 'create', type: 'digest', data: null});
  }

  $rootScope.openConfigureManagerPopup = function(){
	    var modal = configureNotificationModal.show();
  };

  $rootScope.openProfileCustomFieldPopup = function(){
	  var modal = configureProfileCustomFieldModal.show();
  }
  /*-------------------------*/
  $rootScope.openCollectionArticlePopup = function(feeds){
    collectionArticleDetail.show(feeds);
  };
  $rootScope.openCarouselManagerPopup = function(){
    carouselManagerModal.show();
  };
  $rootScope.openUserManagerPopup = function(){
    var cstate = $state.current.name;
    var modaldata = null;
    if((cstate == 'app.communityHome') || (cstate == 'app.communityHomeWithTab') || (cstate == 'app.communityHomeWithArticle')){
      modaldata = {communityUid: $stateParams.commuid};
    }
    userManagerModal.show(modaldata);
  };
  $rootScope.openOrganizationMgmtPopup = function(){
    organizationManagerModal.show();
  };
  $rootScope.openGeneralSearchPopup = function(data){

    $state.go("app.search", {type: "general", filter: 'all'});
  };
  $rootScope.openDirectorySearchPopup = function(){
    var modal = generalSearchModal.show({action: 'search', type: 'directory',});
    modal.then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          if(result.flag == 'ok'){

          }
        });
      });
  };

  $rootScope.openAlertPopup = function(){
	  var modal = alertModal.show();
  };

  $rootScope.openNotePopup = function(){
	  var modal = noteModal.show();
  };

  $rootScope.previewFile = function(file){
	  filePreviewModal.show({file : file});
  };

  $rootScope.editArticle = function(feed){
    var uid = feed.uid;
    switch(feed.type){
    case 'quickpost':
      //editQuickpostModal.show(null, feed);
      $rootScope.isEditQuickPost = true;
      apiFeedData.getArticleById(uid).then(function(data){
          var editArticleData = data;
          var modal = editQuickpostModal.show({action: 'edit', type: 'quickpost', data: editArticleData});
        }, function(err){
        });
      break;
    case 'article':
    case 'event':
    case 'grandArticle':
      createArticleModal.show(null, {action: 'edit', type: feed.type, data: feed});
      break;
    case 'document':
      createArticleModal.show(null, {action: 'edit', type: 'documentGallery', data: feed});
      break;
    case 'imageGallery':
      createArticleModal.show(null, {action: 'edit', type: 'imageGallery', data: feed});
      break;
    }
  };
  $rootScope.showGalleryPopup = function(filesArray, gallerytype, other){
    galleryModal.show({type: gallerytype, data: filesArray, other: other});
  };
  $rootScope.openDocInGoogleViewer = function(url){
  };
  $rootScope.openYammerViewer = function()
  {

  }
  $rootScope.openEditTemplatePopup = function(tdata){
    createArticleModal.show(null, {action: 'edit', type: 'template', data: tdata});
  };
  $rootScope.generateLink = function(type, data){
    var link = 'javascript: void(0)';
    if(data){
      switch(type){
        case 'userProfilePage':
          link = $state.href("app.myprofile", {uid: data.uid, activetab: "About"});
        break;
        case 'communityHomePage':
          link = $state.href("app.communityHome", {name: data.label, commuid: data.uid});
        break;
        case 'userActivitiesProfilePage':
            link = $state.href("app.myprofile", {uid: data.uid, activetab: "Activities"});
         break;
        case 'userPinnedPost':
            link = $state.href("app.userPinnedPost", {uid: data.userUid, activetab: "myBoard",postId: data.id});
         break;
//        case 'digest':
//            link = $state.href("app.digest", {id: data.id});
//        break;
      }
    }
    return link;
  };

  /*
   override the template of select dropdonws
   here we have used traslate directive to show traslated labels
  */
  $templateCache.put('ngDropdowns/templates/dropdownSelect.html', [
    '<div ng-class="{\'disabled\': dropdownDisabled}" class="wrap-dd-select">',
      '<div class="fadetxt mxln1" title="{{dropdownModel[labelField] | translate}}">',
      '<span class="selected" translate>{{dropdownModel[labelField]}}</span>',
      '</div>',
      '<ul class="dropdown">',
        '<li ng-repeat="item in dropdownSelect"',
        ' class="dropdown-item"',
        ' dropdown-select-item="item"',
        ' dropdown-item-label="labelField">',
        '</li>',
      '</ul>',
    '</div>'
  ].join(''));
  $templateCache.put('ngDropdowns/templates/dropdownSelectItem.html', [
    '<li ng-class="{divider: (dropdownSelectItem.divider && !dropdownSelectItem[dropdownItemLabel]), \'divider-label\': (dropdownSelectItem.divider && dropdownSelectItem[dropdownItemLabel])}">',
      '<a href="" class="dropdown-item"',
      ' ng-if="!dropdownSelectItem.divider"',
      ' ng-href="{{dropdownSelectItem.href ? dropdownSelectItem.href : \'javascript:void(0);\'}}"',
      ' ng-click="selectItem()" translate="{{dropdownSelectItem[dropdownItemLabel]}}">',
      //'{{dropdownSelectItem[dropdownItemLabel]}}',
      '</a>',
      '<span ng-if="dropdownSelectItem.divider">',
        '{{dropdownSelectItem[dropdownItemLabel]}}',
      '</span>',
    '</li>'
  ].join(''));


  //ping server after every minute to check sesssion
  $interval(function(){
    //ping server each minute to check session
    authService.pingServer().then(function(data){
      if(data.status == 'expired'){
        location.reload();
      }
    }, function(err){
    });
  }, 60000);

  })
.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider',  '$httpProvider', function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider,  $httpProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  $httpProvider.interceptors.push('httpResponseInterceptor');


  $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('app', {
          abstract: true,
          views: {
              'menu': {
                templateUrl: '../app/views/containers/top_menu.tpl.html'
              },
              'footer': {
                templateUrl: '../app/views/containers/footer.tpl.html'
              }
          },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
      })
      .state('login', {
            url: "/login",
            views: {
                content: {
                    templateUrl: '../app/views/login.html'
                    //controller: function($scope) {}
                }
            }
        })
      .state('app.home', {
            url: "/",
            views: {
                'content@': {
                  templateUrl: '../app/views/main.html',
                  controller: 'MainCtrl'
                }
            }
       })
      .state('app.communities', {
            url: "/communities",
            views: {
                'content@': {
                  templateUrl: '../app/views/communities.html',
                  controller: 'CommunitiesCtrl'
                }
            }
       })
      .state('app.myprofile', {
            url: "/myprofile/:uid/:activetab",
            views: {
                'content@': {
                  templateUrl: '../app/views/myprofile.html',
                  controller: 'MyProfileCtrl'
                }
            }
       })
      .state('app.myprofileWithTab', {
            url: "/myprofile/:activetab",
            views: {
                'content@': {
                  templateUrl: '../app/views/myprofile.html',
                  controller: 'MyProfileCtrl'
                }
            }
       })
      .state('app.communityHome', {
            url: "/community/:name/:commuid",
            views: {
                'content@': {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                }
            }
       })
      .state('app.staticArticle', {
            url: "/staticArticle",
            views: {
                'content@': {
                  template: '<grand-article></grand-article>'
                }
            }
       }).state('app.newStaticArticle', {
            url: "/newStaticArticle",
            views: {
                'content@': {
                  template: '<new-example-article></new-example-article>'
                }
            }
       })
       .state('app.grandArticleTemplate1', {
    	   	url: "/community/:name/:commuid/:activetab/:articleid/:track/:referer/1",
            views: {
                'content@': {
                  template: '<grand-article-template-1 feed="feed"></grand-article-template-1>',
                  controller: 'GrandArticleTemplateCtrl'

                }
            }
       })
       .state('app.grandArticleTemplate2', {
    	   	url: "/community/:name/:commuid/:activetab/:articleid/:track/:referer/2",
            views: {
                'content@': {
                  template: '<grand-article-template-2 feed="feed"></grand-article-template-2>',
                  controller: 'GrandArticleTemplateCtrl'

                }
            }
       })
      .state('app.communityHomeWithTab', {
            url: "/community/:name/:commuid/:activetab/:track/:referer",
            views: {
                'content@': {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                }
            }
       })
      .state('app.communityHomeWithArticle', {
            url: "/community/:name/:commuid/:activetab/:articleid/:track/:referer",
            views: {
                'content@': {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                }
            }
       })
      .state('app.article', {
            url: "/article/:id",
            views: {
                'content@': {
                  templateUrl: '../app/views/article_detail.html',
                  controller: 'ArticleDetailPageCtrl'
                }
            }
       })
      .state('app.collection', {
            url: "/collection",
            views: {
                'content@': {
                  templateUrl: '../app/views/collection.html',
                  controller: 'CollectionCtrl'
                }
            }
       })
      .state('app.search', {
            url: "/search/:type/:filter",
            views: {
              'content@': {
                templateUrl: '../app/views/search_result.html',
                controller: 'NewSearchResultCtrl'
              }
            }
       })
      .state('app.search.criteria', {
          url: '/:text/:page',
          views: {
            'result@app.search' : {
              templateUrl: '../app/views/containers/search_page_result.tpl.html',
              controller: 'GetSearchResultCtrl'
            }
          }
       })
      .state('app.search.category', {
          url: '/:category/:text/:internalSearch/:externalSearch/:externalTypes/:page',
          views: {
            'result@app.search' : {
              templateUrl: '../app/views/containers/search_page_result.tpl.html',
              controller: 'GetSearchResultCtrl'
            }
          }
        })
      .state('app.search.random', {
          url: '/random',
          views: {
            'result@app.search' : {
              templateUrl: '../app/views/containers/search_page_result.tpl.html',
              controller: 'GetSearchResultCtrl'
            }
          }
        })
      .state('app.directory', {
              url: "/directory",
              views: {
                  'content@': {
                    templateUrl: '../app/views/directory.html',
                    controller: 'DirectoryCtrl'
                  }
              }
        })

      .state('app.organizational', {
              url: "/organizational",
              views: {
                  'content@': {
                    templateUrl: '../app/views/organizational.html',
                    controller: 'OrganizationalCtrl'
                  }
              }
        })

      .state('app.notifications', {
            url: "/notifications/",
            views: {
                'content@': {
                  templateUrl: '../app/views/notifications.html',
                  controller: 'AllNofificationsCtrl'
                }
            }
       })
       .state('app.widgetNoteDeServices', {
            url: "/allNoteDeServices/",
            views: {
                'content@': {
                  templateUrl: '../app/views/widget_note_services_view.html',
                  controller: 'AllNotDeServivesCtrl'
                }
            }
       })
	   .state('app.yammer',{
		   url:"/yammer/",
		   views : {
			   'content@':
			   {
				   templateUrl:'../app/views/yammer.html'
			   }
		   }
	   })
	   .state('app.userPinnedPost', {
            url: "/myprofile/:uid/:activetab/:postId",
            views: {
                'content@': {
                  templateUrl: '../app/views/myprofile.html',
                  controller: 'MyProfileCtrl'
                }
            }
       })
//       .state('app.digest', {
//            url: "/digest/:id",
//            views: {
//                'content@': {
//                  templateUrl: '../app/views/digest_view.html',
//                  controller: 'AllDigestCtrl'
//                }
//            }
//       })
      /*
      .state('home', {
            url: "/",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                    //controller: function($scope) {}
                },
                content: {
                  templateUrl: '../app/views/main.html',
                  controller: 'MainCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })

      .state('communities', {
            url: "/communities",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                  //controller: function($scope) {}
                },
                content: {
                  templateUrl: '../app/views/communities.html',
                  controller: 'CommunitiesCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
       .state('myprofile', {
            url: "/myprofile/:uid/:activetab",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/myprofile.html',
                  controller: 'MyProfileCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
       .state('myprofileWithTab', {
            url: "/myprofile/:activetab",
            views: {
                menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/myprofile.html',
                  controller: 'MyProfileCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('communityHome', {
            url: "/community/:name/:commuid",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('communityHomeWithTab', {
            url: "/community/:name/:commuid/:activetab",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('communityHomeWithArticle', {
            url: "/community/:name/:commuid/:activetab:/:articleid",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/community_home.html',
                  controller: 'CommunityHomeCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('article', {
            url: "/article/:id",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/article_detail.html',
                  controller: 'ArticleDetailPageCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            }
       })
      .state('collection', {
            url: "/collection",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/collection.html',
                  controller: 'CollectionCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            }
       })
      */
      /*
      .state('search', {
            url: "/search/:text/:type/:page",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/search_result.html',
                  controller: 'SearchResultCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      */
      /*
      .state('search', {
            url: "/search",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
              },
              content: {
                templateUrl: '../app/views/search_result.html',
                controller: 'NewSearchResultCtrl' //SearchResultCtrl
              },
              footer: {
                templateUrl: '../app/views/containers/footer.tpl.html'
              }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('search.criteria', {
        url: '/values/:text/:type/:page',
        views: {
          'result' : {
            templateUrl: '../app/views/containers/search_page_result.tpl.html',
            controller: 'GetSearchResultCtrl'
          }
        }
       })
      .state('directory', {
              url: "/directory",
              views: {
                menu: {
                    templateUrl: '../app/views/containers/top_menu.tpl.html'
                      //controller: function($scope) {}
                  },
                  content: {
                    templateUrl: '../app/views/directory.html',
                    controller: 'DirectoryCtrl'
                  },
                  footer: {
                    templateUrl: '../app/views/containers/footer.tpl.html'
                  }
              }
        })
      .state('notifications', {
            url: "/notifications/",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
                content: {
                  templateUrl: '../app/views/notifications.html',
                  controller: 'AllNofificationsCtrl'
                },
                footer: {
                  templateUrl: '../app/views/containers/footer.tpl.html'
                }
            },
            resolve: {
              isAppInitialized: ['$rootScope', function($rootScope){
                return $rootScope.initializeApp();
              }]
            }
       })
      .state('about', {
            url: "/about",
            views: {
              menu: {
                  templateUrl: '../app/views/containers/top_menu.tpl.html'
                },
              content: {
                  templateUrl: '../app/views/about.html',
                  controller: 'AboutCtrl'
                },
              footer: {
                templateUrl: '../app/views/containers/footer.tpl.html'
              }
            }
       })
        */
}])
.config(['$provide', function($provide){
	 $provide.decorator('mentioMenuDirective', mentionMenuDecorator);

	 mentionMenuDecorator.$inject = ['$delegate'];

	 function mentionMenuDecorator($delegate) {
	     var directive = $delegate[0];
	     var link = directive.link;
	     directive.compile = function() {
	         return function($scope, $element) {
	             var modal = $element.closest('.ngdialog');
	             link.apply(this, arguments);

	             if (modal.length) {
	                 modal.append($element);
	             }
	         };
	     };
	     return $delegate;
	 }
}])
.config(['ngDialogProvider', '$httpProvider', '$compileProvider', '$translateProvider', 'tmhDynamicLocaleProvider', function (ngDialogProvider, $httpProvider, $compileProvider, $translateProvider, tmhDynamicLocaleProvider) {
    ngDialogProvider.setDefaults({
        className: 'inspopup-theme-level0',
        plain: false,
        showClose: false,
        closeByDocument: true,
        closeByEscape: false
    });

    //-----disable http caching START-----
    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // Enables Request.IsAjaxRequest() in ASP.NET MVC
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    // Disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    //-----disable http caching END-----

    //to whilte list the javascript: void(0) function on ng-href
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

    //enable post compiling for anglar trasnlate
    $translateProvider.usePostCompiling(true);

    $translateProvider.useSanitizeValueStrategy(null);

    //localefiles: used for translating numbers, date, currency etc.
    //tmhDynamicLocaleProvider.localeLocationPattern('http://code.angularjs.org./1.1.5/i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.localeLocationPattern('locale/angular-locale_{{locale}}.js');
}]);
/*
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
}])
*/
angular.element(document).ready(function(){
  angular.bootstrap(document,['inspherisProjectApp']);
});
