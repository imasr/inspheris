'use strict';
angular.module('inspherisProjectApp')
    .service('UiConfig', function($window){

        var data = {

            //showQuickpost: false, //to show(is set to 'true') create quickpost block on all pages(eg. home page, community home page, user's profile page),
            showDocumentUploadBlock: false, //to show document upload block(+ documents) in document tab of community home page
            maxTabs:6,//maxTabs on for second menu on community home page, user's profile page,
            translationService: true, //global translation service to manage overall translation, if disabled then you won't be able to use translation anywhere (disables: change language dropdown in header menu, language selection option in create article popup)
            feedTranslateOptn: true, //enable and disable Translate option on feeds, will activate if and only if translationService = true
            feedShareOptn: true, //enable and disable share option on feeds
            windriveOptn: false, //showing windrive option for document tab in create community popup
            showFeedStatusDropdown: true, //to show status dropdown on feeds for draft tab of user's profile page,
            maxTitleLen : 110, //maximum characters in title attribute
            cmntsPerPage: 50, //used for showing comments in commments viewer per page
            searchResPerPage: 18, //used on directorySearch to show limited reslut
            showVivHeader: false //to show(is set to 'true') viv header,
        };

        return data;
    })

    .service('cachedData', ['$cacheFactory', function Config($cacheFactory) {
            /*
            var data = {
                homeFeeds: [] //feeds to show on homepage
            };
            return data;
            */
            return $cacheFactory('cachedData', {
                capacity: 50 // optional - turns the cache into LRU cache
            });
        }])
     .service('adminConfig', ['$http','$q', '$rootScope', function Config($http,$q,$rootScope) {
    	     var deferred = $q.defer();
    	     var dataConfig = {};
             var apiUrl = "/api/config/list";
             $http({method: 'GET', url: apiUrl}).
             then(function onSuccess(response) {
                var data = response.data;
            	 dataConfig.data = data;
            	 deferred.resolve(dataConfig);
              }, function onError(response) {
                var data = response.data;
            	 deferred.reject(data)
             });
//             return dataConfig;
             return deferred.promise;

     }])
     .service('customTemplate', ['$http','$q', function Config($http,$q) {
    	     var deferred = $q.defer();
    	     var dataTemplate = {};
             var apiUrl = "/api/custom_template/list";
             var parameter = {
            	active : true
             }
             $http({method: 'GET', url: apiUrl, params : parameter}).
             then(function onSuccess(response) {
                var data = response.data;
            	 deferred.resolve(data);
            	 dataTemplate.logo = [];
            	 var logos = [];
            	 angular.forEach(data, function(val, key){
                     	if('logo' == val.featureType){
                     		logos.push(val);
                     	}else if('layout' == val.featureType){
                     		dataTemplate.layout = val.value;
                     	}else if('number of feeds per page' == val.featureType){
                     		dataTemplate.numberOfFeeds = Number(val.value);
                     	}
                   });
            	 if(logos.length > 1){
            		 angular.forEach(logos, function(val, key){
                      	if('optional' == val.type){
                      		 dataTemplate.logo = val;
                      	}
                    });
            	 }else{
            		 dataTemplate.logo = logos[0];
            	 }
            }, function onError(response) {
                var data = response.data;
            	 deferred.reject(data)
             });
             return dataTemplate;

     }])
    .service('sharedData', ['$rootScope', 'dateTimeService', '$filter', '$state','$stateParams', function($rootScope, dateTimeService, $filter, $state, $stateParams){
            var onceInitialized = false;
            var data = {
                slectedDocumentFiles: null, //for passing the selected doucment files from upload square button to create doucment popup
                notificationsRefreshTime: 120000, //milisec: refresh notification after regular interal
                searchResultLimit: 6,//used on serarch page to show limited search result
                docGalleryObj: {type: 'documentGallery', title: '', files: [], modifiedBlock: false, filesFrom: null},
                imgGalleryObj : {type: 'imageGallery', title: '', path:'', files: [], modifiedBlock: false, filesFrom: null},
                vdoGalleryObj : {type: 'videoGallery', embedVideoTitle: '', files: [], modifiedBlock: false, filesFrom: null},
                linkEmbedObj : {type: 'linkEmbed', title: '', links: [], modifiedBlock: false, filesFrom: null},
				yammerEmbedObj : {type: 'yammerEmbed', title: '', links: [], modifiedBlock: false, filesFrom: null},
                communityTabs: [{label:'Home', val:'home'}, {label:'Article', val:'article'}, {label: 'Quickpost', val: 'quickpost'}, {label: 'Document', val: 'document'}, {label: 'Event', val: 'event'}, {label: 'Wiki', val: 'wiki'}, {label: 'People', val: 'people'}],
                communityImageSize: {
                    logo:{min:{width: 150, height: 150}},
                    banner: {min: {width: 1200, height: 260}},
                    feedBackgrond: {min: {width: 300, height: 168}}
                },
                carousel: {
                    wide:{width: 1200, height: 315},
                    small: {width: 226, height: 132}
                },
                supportedDocs: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/pdf',
                generateHashtagString : function(arr){
                  var hashtagList = '';
                  angular.forEach(arr, function(val, key){
                    hashtagList += val.text;
                    if(key != (arr.length - 1))
                      hashtagList += ', ';
                  });
                  return hashtagList;
                },
                clearSelectInput: function(){
                    angular.forEach(
                    angular.element("input[type='file']"),
                    function(inputElem) {
                    angular.element(inputElem).val(null);
                    });
                },
                getHeightOfAspectRatio: function(w, h){
                    var r = w/h;
                    var adjusted_height = 100 * h / w;
                    return adjusted_height+'%';
                },
                boolUserRoleForCommunity: function(communityid, role, roles){
                    //returns bool(true/false) value if given communityid and role matches in roles array where roles array can be the rolse list of any user

                    //communityid: community id to match
                    //role: role which is to be checked eg. CommunityManager
                    //roles: list of roles from
                    var flag = false;
                    if(roles){
                        var len = roles.length;
                        for(var i=0; i<len; i++){
                          if((communityid == roles[i].communityUid) && (roles[i].role == role)){
                            flag = true;
                            break;
                          }
                        }
                    }
                    return flag;
                },
                getMediaGalleryDataToPost: function(filesArray, filetype){
                    //generate data to post on server
                    //check all files are uploaded in given files array or not
                    //if all files are uploaded then retunr the array of uid(s)
                    //filetype: image, document, embeddedVideo
                    var uidList = [];
                    var errorData = {
                        flag: false,
                        message: ''
                    };

                    var fileslen = filesArray.length;
                    if(fileslen > 0){
                        for(var i=0; i<fileslen; i++){
                            if(filetype != 'embeddedVideo'){
                                if(filesArray[i].uploadStatus != 2){
                                    switch(filetype){
                                        case 'image':
                                            errorData.flag = true;
                                            errorData.message = "upload_image_or_wait_uploading";
                                        break;
                                        case 'document':
                                            errorData.flag = true;
                                            errorData.message = "upload_document_or_wait_uploading";
                                        break;
                                    }//switch
                                    break;
                                }
                                else{
                                	if(filetype == 'image'){
	                                	 uidList.push({
	                            			 uid: filesArray[i].uid,
	                            			 isInternal: filesArray[i].isInternal,
	                            			 fileName: filesArray[i].fileName,
	                            			 mimeType: filesArray[i].fileType,
	                            			 thumbUrl: filesArray[i].thumbUrl,
	                            			 createdDate: filesArray[i].createdDate ? filesArray[i].createdDate : filesArray[i].uploadedDate,
	                            			 modifiedDate: filesArray[i].modifiedDate,
	                            			 webViewLink: filesArray[i].path,
	                            			 thumbGalleryUrl: filesArray[i].thumbGalleryUrl
	                                     });
                                	}else if(filetype == 'document'){
                                		uidList.push({
	                            			 uid: filesArray[i].uid,
	                            			 isInternal: filesArray[i].isInternal,
	                            			 fileName: filesArray[i].fileName,
	                            			 mimeType: filesArray[i].fileType,	   
	                            			 createdDate: filesArray[i].createdDate ? filesArray[i].createdDate : filesArray[i].uploadedDate,
	                            			 modifiedDate: filesArray[i].modifiedDate,
	                            			 webViewLink: filesArray[i].path
	                                     });
                                	}
                                }
                            }//if not embeddedVideo
                            else{
                                if((filesArray[i].internalVideo == 'undefined' || !filesArray[i].internalVideo)  && (typeof(filesArray[i].embedVideo) == 'undefined' || typeof(filesArray[i].thumbUrl) == 'undefined' || filesArray[i].embedVideo == '' || filesArray[i].thumbUrl == '')){
                                 errorData.flag = true;
                                 errorData.message = 'invalid_video_in_video_block';
                                 break;
                                }
                                else{
                                    uidList.push({
                                        embedVideo: filesArray[i].embedVideo,
                                        embedVideoTitle: filesArray[i].embedVideoTitle,
                                        thumbUrl: filesArray[i].thumbUrl,
                                        videoUrl: filesArray[i].videoUrl,
                                        internalVideo: filesArray[i].internalVideo,
                                        videoName: filesArray[i].videoName,
                                        videoFormat: filesArray[i].videoFormat,
                                        isDefaultThumb : filesArray[i].isDefaultThumb
                                    });
                                }
                            }
                        }//for
                    }
                    else{
                        switch(filetype){
                            case 'image':
                                errorData.flag = true;
                                errorData.message = 'add_aleat_one_image_in_image_block';
                            break;
                            case 'document':
                                errorData.flag = true;
                                errorData.message = 'add_aleat_one_file_in_document_block';
                            break;
                            case 'embeddedVideo':
                                errorData.flag = true;
                                errorData.message = 'add_aleat_one_video_in_video_block';
                            break;
                        }//switch
                    }
                    if(filesArray.type == "linkEmbed"){
                    	var linksLen = filesArray.links.length;
                    	 if(linksLen > 0){
                    		 uidList = filesArray.links;
                    	 }else{
                    		 errorData.flag = true;
                             errorData.message = 'add_aleat_one_url_in_url_block';
                    	 }
                    }
					if(filesArray.type == "yammerEmbed"){
                    	var linksLen = filesArray.links.length;
                    	 if(linksLen > 0){
                    		 uidList = filesArray.links;
                    	 }else{
                    		 errorData.flag = true;
                             errorData.message = 'add_aleat_one_url_in_url_block';
                    	 }
                    }
                    return {error: errorData, data : uidList};
                },
                getEventDataToPost: function(val){
                    //prepare the data to post the event block, generate the proper error message if invalid data
                    var postdata = {};
                    var errorData ={
                        message: '',
                        flag: false
                    };
                    var dtFrm = null;
                    var dtTo = null;
                    var invitedUids = [];

                    angular.forEach(val.invitedPeoples, function(val, i){
                      invitedUids.push(val.uid);
                    });

                    /*if(val.dateTo == '' || val.timeTo == '' || typeof(val.dateTo) == 'undefined' || typeof(val.timeTo) == 'undefined' || !val.dateTo || !val.timeTo){
                      errorData.flag = true;
                      errorData.message = "select_event_end_date_time";
                    }*/
                    if(val.dateTo == '' || typeof(val.dateTo) == 'undefined' || !val.dateTo){
                      /*errorData.flag = true;
                      errorData.message = "select_event_end_date_time";*/
	                    dtTo = 	dateTimeService.dateTimeToMsec('', '');
                    }
                    else{
                        var tempTimeTo = val.timeTo;
                        if(val.timeTo == '' || typeof(val.timeTo) == 'undefined' || !val.timeTo){
                            tempTimeTo = new Date("January 01, 1970 00:00:00");
                        }
                      dtTo = dateTimeService.dateTimeToMsec(val.dateTo, tempTimeTo);
                    }
                    if(val.dateFrom == '' || typeof(val.dateFrom) == 'undefined' || !val.dateFrom){
                      errorData.flag = true;
                      errorData.message = "select_event_start_date_time";
                    }
                    else{
                    	var tempTimeFrom = val.timeFrom;
                        if(val.timeFrom== '' || typeof(val.timeFrom) == 'undefined' || !val.timeFrom){
                            tempTimeFrom = new Date("January 01, 1970 00:00:00");
                        }
                      dtFrm = dateTimeService.dateTimeToMsec(val.dateFrom, tempTimeFrom);
                    }

                    if(dtFrm && dtTo){
                      if(dtFrm >= dtTo){
                        errorData.flag = true;
                        errorData.message = "event_startdate_less_than_end_date";
                      }
                    }

                    if($filter('isBlankString')(val.title)){
                      errorData.flag = true;
                      errorData.message = "Fill_all_event_info";
                    }
                    if(!$filter('isBlankString')(val.location)){
                        //location is not blank
                        postdata.location = val.location;
                    }
                    postdata.uid = val.uid ? val.uid : undefined;
                    postdata.title = val.title;
                    postdata.dateFrom = dtFrm;
                    postdata.dateTo = dtTo;
                    postdata.description = '';
                    postdata.invitedPeoples = invitedUids;
                    postdata.participateEventExtension = val.participateEventExtension;
                    postdata.limitSeatOfEvent = val.limitSeatOfEvent;
                    postdata.totalNumberOfSeat = val.totalNumberOfSeat;

                    return({data: postdata, error: errorData});
                },
                communityTabSelectionData: function(slectedComms, type, enablePinCommunityFeature,selectedTabs){
                    //generate the list for tabs slectoin dropdown if communities are selected (used in create article popup)

                    var tabSelection = [];
                    angular.forEach(slectedComms, function(val, key){
                        tabSelection.push(angular.copy(val));
                        tabSelection[key].tabs = [];

                        angular.forEach(val.tabs, function(tb, i){
                            switch(type){
                                case 'article':
                                    if(((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature) && ((tb.tabType.toLowerCase() == 'article') || (tb.tabType.toLowerCase() == 'collection'))){
                                        var obj = angular.copy(tb);
                                        obj.selected = tb.defaultSelected ? true : false;
                                        
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
                                        tabSelection[key].tabs.push(obj);
                                    }
                                break;
                                case 'document':
                                case 'documentGallery':
                                    if(((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature) && ((tb.tabType.toLowerCase() == 'document') || (tb.tabType.toLowerCase() == 'collection'))){
                                        var obj = angular.copy(tb);
                                        obj.selected = tb.defaultSelected ? true : false;
                                        
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
                                        tabSelection[key].tabs.push(obj);
                                      }
                                break;
                                case 'imageGallery':
                                    if(((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature) && ((tb.tabType.toLowerCase() == 'imagegallery') || (tb.tabType.toLowerCase() == 'collection'))){
                                        var obj = angular.copy(tb);
                                        obj.selected = tb.defaultSelected ? true : false;
                                        
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
                                        tabSelection[key].tabs.push(obj);
                                      }
                                break;
                                case 'event':
                                    if(((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature) && ((tb.tabType.toLowerCase() == 'event') || (tb.tabType.toLowerCase() == 'collection'))){
                                        var obj = angular.copy(tb);
                                        obj.selected = tb.defaultSelected ? true : false;
                                        
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
                                        tabSelection[key].tabs.push(obj);
                                      }
                                break;
                                case 'quickpost':
                                    if(((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature) && ((tb.tabType.toLowerCase() == 'quickpost') || (tb.tabType.toLowerCase() == 'collection'))){
                                        var obj = angular.copy(tb);
                                        obj.selected = tb.defaultSelected ? true : false;
                                        
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
                                        tabSelection[key].tabs.push(obj);
                                      }
                                break;
                                case 'all':
                                	if((enablePinCommunityFeature && !tb.pinnedTab) || !enablePinCommunityFeature){
	                                	var obj = angular.copy(tb);
	                                	
                                        if(selectedTabs != null && selectedTabs.length > 0){
                                        	angular.forEach(selectedTabs, function(selectTab, j){
                                        		if(tb.uid == selectTab.uid){
                                        			obj.selected = selectTab.selected;
                                        		}                                       		
                                        	});
                                        }
	                                	tabSelection[key].tabs.push(obj);
                            		}
                                	break;
                            }
                        });
                    });
                    return tabSelection;
                },
                communityTabPublicSelectionData: function(slectedComms){

                    var tabSelection = [];
                    angular.forEach(slectedComms, function(val, key){
                        tabSelection.push(angular.copy(val));
                        tabSelection[key].tabs = [];

                        angular.forEach(val.tabs, function(tb, i){
                        	if(!tb.privated && !tb.pinnedTab){
	                        	var obj = angular.copy(tb);
	                        	tabSelection[key].tabs.push(obj);
                        	}
                        });
                    });
                    return tabSelection;
                },
                getSelectedTabUids: function(tabSelectionList){
                    //generate the list for uids from given array,
                    //each iten of arr must have uid parameter and seleted parameter.
                    var ctyTabUids = [];
                    angular.forEach(tabSelectionList, function(val, key){
                        angular.forEach(val.tabs, function(tb, i){
                          if(tb.selected){
                            ctyTabUids.push(tb.uid);
                          }
                        });
                    });
                    return ctyTabUids;
                },
                getUserCommunities: function(communities, user){
                    //returns the list of cmmunities for which user has role contributor, community manger or global community manager
                    var res = [];
                    if(user.role && user.role == "GlobalCommunityManager"){
                        return communities;
                    }
                    else{
                        angular.forEach(communities, function(community, ckey){
                        	angular.forEach(user.communityRoles, function(cRole, rkey){
	                           	 if(community.uid == cRole.communityUid){
	                                 res.push(community);
	                             }

                        	});
                        });
                    }
                    return res;
                },
                getPublicCommunities: function(communities, user){
                	//returns the list of cmmunities for which user has role contributor, community manger or global community manager
                    var res = [];
                    if(user.role && user.role == "GlobalCommunityManager"){
                    	 angular.forEach(communities, function(community, ckey){
 	                           	 if(community.privated == 0){
 	                                 res.push(community);
 	                             }
                         });
                        return res;
                    }
                    else{
                        angular.forEach(communities, function(community, ckey){
                        	angular.forEach(user.communityRoles, function(cRole, rkey){
	                           	 if(community.uid == cRole.communityUid && community.privated == 0){
	                                 res.push(community);
	                             }

                        	});
                        });
                    }
                    return res;
                },
                getTitleWithArticleLink: function(feed, author, tab){
                    //getTitleWithDraftLink
                    //returns the an object wiht artcle title and it's link, used in notification to show show article link
                    //if "tab" == null return article detail page link
                    var artobj = {
                        title: null,
                        link: null
                    };
                    if(feed && feed.blocks){
                        var len = feed.blocks.length;
                        for (var i = 0; i < len; i++) {
                            var blk = feed.blocks[i];
                            if(blk.type == 'heading'){
                                artobj.title = blk.title;
                                break;
                            }
                        };
                        if(tab == "Draft"){
                            artobj.link = $state.href("app.myprofile", {uid: author.uid, activetab: "Draft"});
                        }
                        else{
                            artobj.link = $state.href("app.communityHomeWithArticle", {name: feed.community.label, commuid: feed.community.uid, activetab: feed.communityTab.uid, articleid: feed.uid});
                        }
                    }
                    return artobj;
                },
                articleHeaderImage: {
                    min: {width: 500, height: 280},
                    medium: {width: 300, height: 300},
                    small: {width: 125, height: 93}

                },
		articleSmallHeaderImage: {
                    min: {width: 575, height: 323},
                    medium: {width: 282, height: 282},
                    small: {width: 127, height: 127}

                },
                searchResLimit: 9, //to show minimum number of search results on search page, used for infinite scroll
                htmlToText: function (html) {
                    var tag = document.createElement('div');
                    tag.innerHTML = html;
                    return tag.innerText;
                },
                joinCommunityLabels: function (arr) {
                    var len = arr.length;
                    var str = '';
                    var array = [];
                    if(len > 0){
                        for (var i = 0; i < len; i++) {
                        	if(array.indexOf(arr[i].label) === -1){
                        		array.push(arr[i].label);
	                            str += arr[i].label;
	                            if((i+1) != len){
	                                str += ", ";
	                            }
                        	}
                        };
                    }
                    else{
                        str = "Community name/Category name";
                    }
                    return str;
                },
                getGlobalDateFormat: function(langCode){
                    var format = "dd MMM, HH':'mm";
                    switch(langCode){
                        case 'fr':
                           format = "dd MMM, HH'h'mm";
                        break;
                    }
                    return format;
                },
                getLongDateFormat: function (langCode) {
                    var format = "dd MMM yyyy, HH':'mm";
                    switch (langCode) {
                        case 'fr':
                            format = "' le' dd MMM yyyy, HH'h'mm";
                            break;
                    }
                    return format;
                },
                getFullDateFormat: function (langCode) {
                    var format = "dd MMM yyyy, HH':'mm";
                    switch (langCode) {
                        case 'fr':
                            format = "dd MMM yyyy, HH'h'mm";
                            break;
                    }
                    return format;
                },
                getBirthdayDateFormat: function (langCode) {
                    var format = "dd MMM";
                    switch (langCode) {
                        case 'fr':
                            format = "dd MMM";
                            break;
                    }
                    return format;
                },
                getCustomDateFormat: function (langCode) {
                    var format = "dd MMM yyyy";
                    switch (langCode) {
                        case 'fr':
                            format = "dd MMM yyyy";
                            break;
                    }
                    return format;
                },
                getDateFormat: function (langCode) {
                    var format = "MMMM dd, yyyy";
                    switch (langCode) {
                        case 'fr':
                            format = "MMMM dd, yyyy";
                            break;
                    }
                    return format;
                },
		getSimpleDateFormat: function(langCode){
                    var format = "dd MMM";
                    switch(langCode){
                        case 'fr':
                           format = "dd MMM";
                        break;
                    }
                    return format;
                },
                dateTimeConfig: function(langCode){
                    var obj = {
                        startWeek: 0, //0=Sunday, 1=Mon ... etc.
                    };
                    switch(langCode){
                        case 'fr':
                           obj.startWeek = 1;
                        break;
                    }
                    return obj;
                },
                landingPage: function(lpData){
                    if(!onceInitialized)
                    {
                        onceInitialized = true;
                        switch(lpData.page){
                          case 'CommunityListing':
                            $state.go("app.communities");
                          break;
                          case 'CommunityHome':
                            $state.go("app.communityHome", {name: lpData.communityName, commuid: lpData.communityUid});
                          default:
                            //$state.go("app.home");
                          break;
                        }//switch
                    }
                },
                reditectToArticlePage: function(data){
                    //if article is edited on article detail page and it's the same article then don't refresh the page
                    if($state.current.name == "app.communityHomeWithArticle" && $stateParams.articleid == data.uid){
                        //don't do anything
                    }
                    else{
                        $state.go("app.communityHomeWithArticle", {"name": data.community.name, "commuid": data.community.uid, "activetab": data.communityTab.uid, "articleid": data.uid});
                    }
                },
                findConfig: function(name){

                    var listConfig = $rootScope.adminConfig.data;
                    var res = {};
                    $.each(listConfig, function(key, value){
                        if(name == value.name){
                        	res.name = value.name;
                        	res.value = value.value;
                        }
                    });

                    return res;
                },
                foodWidgetImageSize: {
                    logo:{width: 300, height: 300}
                }
            };
            return data;
        }])
    .service('userRights', ['$rootScope', 'sharedData', function($rootScope, sharedData){
            var data = {
                isUserHasRightToEditAricle: function(feed, userData){
                    //returns bool(true/false) if provided userata has right to edit given feed/article
                    if(sharedData.boolUserRoleForCommunity(feed.community.uid, 'CommunityManager', userData.communityRoles)  || (userData.uid == feed.author.uid) || (userData.role == 'GlobalCommunityManager')){
                        return true;
                    }
                    return false;
                },
                isUserHasRightToEditWidget: function(loggedInUser){
                	if (loggedInUser.readOnly){
                		return false;
                	}

                    if(loggedInUser.role){
                    	if(loggedInUser.role == 'GlobalCommunityManager'){
                            return true;
                        }
                    }


                    return false;
                },
                isUserHasRightToEditCommunityWidget: function(commuid, userData){
                	if (userData.readOnly){
                		return false;
                	}

                    if((sharedData.boolUserRoleForCommunity(commuid, 'CommunityManager', userData.communityRoles)) || (userData.role == 'GlobalCommunityManager')){
                        return true;
                    }
                    return false;
                },
                isUserHasRightToEditCommunity: function(commuid, userData){
                    //returns bool(true/false) if provided userata has right to edit given uid of community
                    if((sharedData.boolUserRoleForCommunity(commuid, 'CommunityManager', userData.communityRoles)) || (userData.role == 'GlobalCommunityManager')){
                        return true;
                    }
                    return false;
                },
                isUserHasRightToEditUserProfile: function(user, loggedInUser){
                    //returns bool(true/false) if provided 'loggedInUser' has right to edit given 'user'
                    if((loggedInUser.uid == user.uid) || (loggedInUser.role == 'GlobalCommunityManager')){
                        return true;
                    }
                    return false;
                },
                userCanCreateContent: function(loggedInUser){
                    //returns if user can create content or not
                    //useed to show content creation option in top menu

                	if (loggedInUser.readOnly){
                		return false;
                	}


                    if(loggedInUser.role){
                    	//if user role is GCM
                    	// or he is a CM or Contributor of one community. the creation option is shown
                    	if(loggedInUser.role == 'GlobalCommunityManager' || loggedInUser.contentCreation ){
                            return true;
                        }
                    }


                    return false;
                },
		isUserHasRightToPinContent: function(loggedInUser){
                	if (loggedInUser.readOnly){
                		return false;
                	}

                    if(loggedInUser.role){
                    	if(loggedInUser.role == 'GlobalCommunityManager'){
                            return true;
                        }
                    }


                    return false;
                },
                isUserHasRightToCreateNoteDeService: function(userData){
                    //returns bool(true/false) if provided userata has right to edit given uid of community
                	var isCM = false;
                	var roles = userData.communityRoles;
                    if(roles){
                        var len = roles.length;
                        for(var i=0; i<len; i++){
                          if(roles[i].role == 'CommunityManager'){
    						isCM = true;
                            break;
                          }
                        }
                    }
                    if(isCM || (userData.role == 'GlobalCommunityManager')){
                        return true;
                    }
                    return false;
                }
            };
            return data;
        }])

.service('secondMenuService', ['$rootScope', 'sharedData', function ($rootScope, sharedData) {
        var tabsFirstArray;
        var tabsSecondArray;
        this.changeTab = function (menuTabs, UiConfig, cb) {
            var maxWidth = $(window).width();
            if (maxWidth > 1032) {
                tabsFirstArray = menuTabs.slice(0, UiConfig.maxTabs);
                tabsSecondArray = menuTabs.slice(UiConfig.maxTabs);
            }
            else if (maxWidth > 991 && maxWidth <= 1032) {
                tabsFirstArray = menuTabs.slice(0, 5);
                tabsSecondArray = menuTabs.slice(5);
            }
            else if (maxWidth > 767 && maxWidth <= 991) {
                tabsFirstArray = menuTabs.slice(0, 4);
                tabsSecondArray = menuTabs.slice(4);
            }
            else if (maxWidth > 730 && maxWidth <= 767) {
                tabsFirstArray = menuTabs.slice(0, 5);
                tabsSecondArray = menuTabs.slice(5);

            }
            else if (maxWidth > 631 && maxWidth <= 730) {
                tabsFirstArray = menuTabs.slice(0, 5);
                tabsSecondArray = menuTabs.slice(5);

            }
            else if (maxWidth > 435 && maxWidth <= 631) {
                tabsFirstArray = menuTabs.slice(0, 4);
                tabsSecondArray = menuTabs.slice(4);

            }
            else if (maxWidth > 380 && maxWidth <= 435) {
                tabsFirstArray = menuTabs.slice(0, 3);
                tabsSecondArray = menuTabs.slice(3);

            }
            else if (maxWidth > 265 && maxWidth <= 380) {
                tabsFirstArray = menuTabs.slice(0, 2);
                tabsSecondArray = menuTabs.slice(2);

            }
            else {
                tabsFirstArray = menuTabs.slice(0, 1);
                tabsSecondArray = menuTabs.slice(1);
            }

            if (cb) {
                cb(tabsFirstArray, tabsSecondArray)
            }
        };

    }])

    .factory("youtubeVideo", function() {
      return {
                embededCode: function(url){
                    var ID = '';
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                    var match = url.match(regExp);
                    if (match && match[2].length == 11) {
                        ID = match[2];
                    } else {
                        return("invalid");
                    }
                    var embedCode = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+ID+'" frameborder="0" allowfullscreen></iframe>';
                    return embedCode;
                }
      };
    })
    .factory("embededCodeFromUrl", ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
        function embededCode(){
            var deferred = $q.defer();
            this.getEmbedded = function(vdourl){
                //vdourl = encodeURIComponent(vdourl);
                var deferred = $q.defer();
                var apiKey = $rootScope.embedApiKey;//'c8e0fed5fd4d4ea5a3f8820853c1980c';
                var apiUrl = 'https://api.embed.ly/1/oembed';
                //'http://api.embed.ly/1/oembed?key='+apiKey+'&url=:'+url+'&maxwidth=:maxwidth&maxheight=:maxheight&format=:format&callback=:callback'
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params:{key: apiKey, url: vdourl},
                    timeout: deferred.promise
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                  deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            this.cancel = function(optn){
                deferred.resolve(null);
            };
        };
        //return apiDataService;
        return(embededCode);

    }])
    .constant('USERDATA', {
        info: null
    })
    .factory("dateTimeService", ['$filter', function($filter) {
            var serviceObj = {};
            serviceObj.dateTimeToMsec = function(startDt, startTime){
                //startDt = 1421951400000, startTime = Thu Jan 01 1970 14:07:00 GMT+0530 (IST)
                var miliseconds = null;
                if(startDt != '' && startTime != ''){
                    miliseconds = $filter('date')(startDt,'MM/dd/yyyy')+","+$filter('date')(startTime,'hh:mm a');
                    miliseconds = Date.parse(miliseconds);
                }
                return miliseconds;
            };
            serviceObj.getDateBetweenTwoDate = function(startDate, endDate){
            	var start = new Date(startDate);
            	var end = new Date(endDate);
            	var currentDate = new Date(start.getTime());
                var between = [];
                while (currentDate <= end) {
                    between.push($filter('date')(currentDate,'MMM dd'));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return between;
            };
            return serviceObj;
     }])
    .factory("httpResponseInterceptor", ['$q','$location',function($q, $location){
        function success(response) {
            return response;
        }
        function error(response) {
            var status = response.status;
            if (status == 401) {
                window.location = "/login";
                return;
            }else  if (status == 403) {
            	window.location = "/403.html";
                return;
            }
            // otherwise
            return $q.reject(response);
        }
        return function (promise) {
            return promise.then(success, error);
        }
    }])
    .factory("authService", ['$http', 'Config', '$q', 'USERDATA', '$rootScope', '$cookieStore', 'ngDialog', '$location', 'uiModals', 'cachedData', '$cookies', function($http, Config, $q, USERDATA, $rootScope, $cookieStore, ngDialog, $location, uiModals, cachedData, $cookies) {
            var apiDataService = {};
            //var userData = cachedData.get('currentUser') ? cachedData.get('currentUser') : null;
            apiDataService.resetUserData = function(){
                //userData = null;
                USERDATA.info = null;
                cachedData.remove('currentUser');
            };
            apiDataService.getCurrentUser = function(){
                var deferred = $q.defer();
                if(!cachedData.get('currentUser')){
                    var apiUrl = '/api/user/current';
                    $http({method: 'GET', url: apiUrl, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedData.put('currentUser', data)
                      //userData = data;
                      USERDATA.info = data;
                      deferred.resolve(cachedData.get('currentUser'));
                    }, function onError(response) {
                        var data = response.data;
                        var status = response.status;
                        if (status == 401) {
                            window.location = "/login";
                            return;
                        }else if(status == 403){
                            window.location ="/403.html";
                            return;
                        }
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(cachedData.get('currentUser'));
                }
                return deferred.promise;
            };
            apiDataService.login = function (user, callback) {

                var data = {
                    login: user.username,
                    password: user.password
                };

                $http.post('/api/login', data)
                .then(function onSuccess(response) {
                	var data = response.data;
                    callback(data);
                    $location.path('/');
                }, function onError(response) {
                	var data = response.data;
                	var modal = uiModals.alertModal(null, "Error", 'The user or password you entered is incorrect.');
                    modal.closePromise.then(function (data) {
                    });

                    user.password = "";
                    var elements = document.getElementsByTagName("input");
                    for (var i=0; i < elements.length; i++) {
                        elements[i].value = "";

                    }
                });
            };//login
            apiDataService.setCredentials = function (user) {
                var authdata = btoa(user.username + ':' + user.password);
                $rootScope.globals = {
                    currentUser: {
                        username: user.username,
                        authdata: authdata
                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
                $cookieStore.put('globals', $rootScope.globals);
            };
            apiDataService.clearCredentials = function () {
                cachedData.removeAll();

                var ingoneCookies = ["lastUserUid", "selectedLanguage"];
                angular.forEach($cookies, function (v, k) {
                    if(ingoneCookies.indexOf(k) == -1){
                        //if cookie is not present in given list then remove it
                        $cookieStore.remove(k);
                    }
                });

                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic ';
            };
            apiDataService.pingServer = function () {
                var deferred = $q.defer();
                var apiUrl = '/api/session/check';
                //ignoreLoadingBar: used to not showing the loader on top of the screen
                $http({method: 'GET', url: apiUrl, ignoreLoadingBar: true}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };//pingServer
          return apiDataService;
        }])
    .factory("apiGroup", ['$http', 'Config', '$q', 'USERDATA', function($http, Config, $q, USERDATA) {
            var apiDataService = {};
            var communityGroupData = [];
            apiDataService.getAll = function(parameters){
                var deferred = $q.defer();
                if(communityGroupData.length <= 0){
                    var apiUrl = '/api/communityGroup/list';
                    $http({method: 'GET', url: apiUrl,params: parameters}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        communityGroupData = data;
                      deferred.resolve(communityGroupData);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(communityGroupData);
                }

                return deferred.promise;
            };
          return apiDataService;
        }])
    .factory("apiCarousel", ['$http', 'Config', '$q', 'cachedData', function($http, Config, $q, cachedData) {
            var apiService = {};
            //var carouselData = [];

            apiService.getData = function(){
                var deferred = $q.defer();
                var crouselUrl = '/api/carousel/list';
                $http({method: 'GET', url: crouselUrl, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  //carouselData = data.sliderLevel1;
                  //cachedData.put('carouselData', data);
                  deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    //carouselData = [];
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiService.getAll = function(parameters){
                var deferred = $q.defer();
                    var crouselUrl = '/api/carousel/all';
                    $http({method: 'GET', url: crouselUrl, params: parameters, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            apiService.getByUid = function(cuid){
                var deferred = $q.defer();

                var crouselUrl = '/api/carousel';
                $http({method: 'GET', url: crouselUrl, params: {uid: cuid}, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiService.create = function(postdata){
                var apiUrl = "/api/carousel/create";
                var deferred = $q.defer();
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                          //cachedData.remove('carouselData');
                         // cachedData.remove('allCarouselData');
                          //carouselData = [];
                          //allCarouselData = [];
                    deferred.resolve("Post Success");
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiService.publish = function(postdata){
                var apiUrl = "/api/carousel/publish";
                var deferred = $q.defer();
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                          //cachedData.remove('carouselData');
                          //cachedData.remove('allCarouselData');
                    deferred.resolve("Post Success");
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiService.delete = function(postdata){
                //postdata: {uid: <xyz>}
                var apiUrl = "/api/carousel";
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
                    var data = response.data;
                        //carouselData = [];
                        //allCarouselData = [];
                        //cachedData.remove('carouselData');
                        //cachedData.remove('allCarouselData');
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
          return apiService;
        }])
    .factory("apiHashtags", ['$rootScope', '$http', 'Config', '$q', function($rootScope, $http, Config, $q){
            var apiFeedDataService = {};
            apiFeedDataService.get = function(query){
                var searchTag = query.replace("#","");
                var defer = $q.defer();
                var allTags;

                var hashtagUrl = '/api/content/hashtags';
                $http({method: 'GET', url: hashtagUrl, params: {query: searchTag}}).
                then(function onSuccess(response) {
                    var data = response.data;
                    allTags = data;
                    var tags = [];
                    if(allTags !== undefined){
                      for (var j = 0; j < allTags.length; j++){
                        tags.push({'text' : allTags[j].tagName});
                      }
                    }
                    defer.resolve(tags);
                }, function onError(response) {
                    var data = response.data;
                    defer.reject(data);
                });
                return defer.promise;
            };
            return apiFeedDataService;
        }])
    .factory("apiFeedData", ['$rootScope', '$http', 'Config', '$q', 'sharedData', '$filter', 'cachedData','notifyModal', function($rootScope, $http, Config, $q, sharedData, $filter, cachedData,notifyModal) {
            var language = '';
            var feeds = [];
            var apiDataService = {};

            var broadcastFeedAdded = function(data){
              $rootScope.$broadcast('feed.added', data);
            };
            var broadcastFeeds = function (data) {
                $rootScope.$broadcast('feeds.update', data);
            };
            var broadcastFeedDeleted = function(data) {
              $rootScope.$broadcast('feed.deleted', data);
            };
            var broadcastFeedEdited = function(data){
              $rootScope.$broadcast('feed.edited', data);
            };
            var broadcastFeedCommented = function(data){
              $rootScope.$broadcast('feed.commented', data);
            };
            var broadcastCommentDeleted = function(data){
              $rootScope.$broadcast('comment.deleted', data);
            };

            apiDataService.getFeedData = function(lang){
                var deferred = $q.defer();
                var language = lang.code;
                if(feeds.length <= 0 || language.code != lang.code){
                    var feedUrl = '/api/content/list';
                    $http({method: 'GET', url: feedUrl, params: {language: lang.code}, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      // this callback will be called asynchronously
                      // when the response is available
                      feeds = data.contents;
                      broadcastFeeds(feeds);
                      deferred.resolve(feeds);
                    }, function onError(response) {
                        var data = response.data;
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        feeds = [];
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve("Already fetched feed data");
                }
                return deferred.promise;
            };
            apiDataService.getFeedByUid = function(feedId){
                var tempFeed = [];
                var deferred = $q.defer();
                angular.forEach(feeds, function(val , key){
                        if(feedId == val.uid){
                          //sharePopup will use this feedData to show Fedd
                          tempFeed = val;
                        }
                   });

                if(tempFeed.length <= 0){
                    var feedUrl = '/api/content';
                    $http({method: 'GET', url: feedUrl, params: {uid: feedId}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(tempFeed);
                }

                return deferred.promise;
            };
            apiDataService.getFetchFeed = function(paramobj){
                var deferred = $q.defer();
                var feedUrl ='/api/content';
                $http({method: 'GET', url: feedUrl, params: paramobj}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.feeds = function(){
              return feeds;
            };
            apiDataService.filteredFeeds = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/list';
                if (postObj.status=='publish'){
                	feedUrl = '/api/content/publications';
                }else if (postObj.status=='draft'){
                	feedUrl = '/api/content/drafts';
                }
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    broadcastFeeds(data.contents);
                    deferred.resolve(data.contents);
                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getFeeds = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/feed/home';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    broadcastFeeds(data.contents);
                    deferred.resolve(data.contents);
                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getPinnedContents = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/pin';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                	var data = response.data;
                	deferred.resolve(data.contents);
                }, function onError(response) {
                	var data = response.data;
                	deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getActivitiesOfUser = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/profile';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  broadcastFeeds(data.contents);
                  deferred.resolve(data.contents);
                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getContentsByFilters = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/filter';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  broadcastFeeds(data.contents);
                  deferred.resolve(data.contents);
                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getContentsByDigestContentType = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/digest/type';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  broadcastFeeds(data.contents);
                  deferred.resolve(data.contents);
                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getContentsByCommunityTab = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/community-tab';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  broadcastFeeds(data.contents);
                  if(postObj.tabType == "gdrive"){
                  	if(typeof(data.code) != 'undefined' && data.code != null){
              		  deferred.resolve(data);
              		}else{
                	  deferred.resolve(data.rows);
                	}
                  }else if(postObj.tabType == "files"){
                	  deferred.resolve(data);
                  }else{
                	  deferred.resolve(data.contents);
                  }

                }, function onError(response) {
                    var data = response.data;
                    feeds = [];
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.getContentAuthorsByCommunityOrAuthor = function(postObj){
                var deferred = $q.defer();
                var feedUrl = '/api/content/author/list';
                $http({method: 'GET', url: feedUrl, params: postObj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.like = function(uid, optn, type){
            	var post_data = {};


                var deferred = $q.defer();

                var url = "/api/like/";

                if (type !=null && type =='comment'){
                	url = "/api/like/comment/";
                	post_data.commentUid = uid;
                }else if (type !=null && type =='content'){
                	post_data.contentUid = uid;
                }else if (type !=null && type =='follower quickpost'){
                	url = "/api/like/followerQuickpost/";
                	post_data.followerQuickpostUid = uid;
                }else if (type !=null && type =='user pinned post'){
                	url = "/api/like/user/pinned-post";
                	post_data.userPinnedPostId = uid;
                }

                var httpObj = {
                    url: url,
                    headers: { 'Content-Type': 'application/json'}
                };

                switch(optn){
                	case "POST":
                        httpObj.method = "POST";
                        httpObj.data = post_data;
                    break;
                    case "DELETE":
                    	httpObj.method = "DELETE";
                    	httpObj.params = post_data;
                    break;
                }

                //var post_data = {content: uid};
                $http(httpObj).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve({params: post_data, data: data, optn: optn});
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.delete = function(feedid){
                var deferred = $q.defer();
                    var delUrl = "/api/content";
                    var post_data = {content: feedid};
                    $http({method: 'DELETE', url: delUrl, params: {uid: feedid}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        notifyModal.showTranslated('Deleted_successfully', 'success', null);
                        cachedData.remove("homeFeeds");
                        broadcastFeedDeleted(feedid);
                        deferred.resolve(feedid);
                    }, function onError(response) {
                        var data = response.data;
                        notifyModal.showTranslated('something_went_wrong', 'error', null);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.deleteGrandArticlePage = function(pageId){
                var deferred = $q.defer();
                    var delUrl = "/api/content/grand-article/page";
                    $http({method: 'DELETE', url: delUrl, params: {id: pageId}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        notifyModal.showTranslated('Deleted_successfully', 'success', null);
                        deferred.resolve(pageId);
                    }, function onError(response) {
                        var data = response.data;
                        notifyModal.showTranslated('something_went_wrong', 'error', null);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getLikes = function(parameter){
                var deferred = $q.defer();
                var feedUrl = '/api/like';
                $http({method: 'GET', url: feedUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.postComment = function(cmntdata){
                var deferred = $q.defer();
                //var apiUrl = "/api/comment";
                var apiUrl = "/api/comment";
                $http({method: 'POST', url: apiUrl, data: cmntdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getComments = function(paramobj){
                var deferred = $q.defer();
                var feedUrl ='/api/comment/list';
                $http({method: 'GET', url: feedUrl, params: paramobj}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.deleteComment = function(feeduid, cmntuid){
                var deferred = $q.defer();
                var form_data = new FormData();
                form_data.append('Method', 'DELETE');
                form_data.append('Parameter', cmntuid);
                if(cmntuid){
                var url = '/api/comment/';
                  $http.delete(url, {params: {uid: cmntuid}})
                  .then(function onSuccess(response) {
                	  var data = response.data;
                	  broadcastCommentDeleted({feeduid: feeduid, commentuid: cmntuid});
                      deferred.resolve({feeduid: feeduid, commentuid: cmntuid});
                  }, function onError(response) {
                	  var data = response.data;
                	  deferred.reject(data);
                  });
                }
                else{
                }
                return deferred.promise;
            };
            apiDataService.tranlateComment = function(cmntdata){
                var deferred = $q.defer();
                var apiUrl = "/api/comment/translation";
                $http({method: 'POST', url: apiUrl, data: cmntdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.postQuickPost = function(postdata) {
                var deferred = $q.defer();
                var apiUrl = '/api/content/quickpost';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve({data: data, status: 'success'});
                    //apiFeedDataService.reset();
                    feeds = [];
                    if(postdata.uid){
                        broadcastFeedEdited(data)
                    }
                    else{
                        broadcastFeedAdded(data);
                    }
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject({status: "error", data: data});
                });
                return deferred.promise;
            };

            //-------------------extracted from apiCreateArticle

            apiDataService.postArticle = function(artData){
                var deferred = $q.defer();
                var apiUrl = artData.type == 'article' ? '/api/content/article' : '/api/content/grand-article';
                var postdata = {
                    blocks: artData.blocks,
                    templateUid : artData.templateUid,
                    hashtag : artData.hashtag,
                    language: artData.language,
                    translatedLanguages: artData.translatedLanguages,
                    type : artData.type,
                    publicationStartDate : artData.publicationStartDate,
                    publicationEndDate : artData.publicationEndDate,
                    newsFeed : artData.newsFeed,
                    status: artData.status,
                    allowComment: artData.allowComment,
                    displayInCommunityCalendar: artData.displayInCommunityCalendar,
                    displayEventOnCommunity : artData.displayEventOnCommunity,
                    displayEventOnHomePage : artData.displayEventOnHomePage,
                    authorizeShare : artData.authorizeShare,
                    isPin : artData.isPin,
                    isOwner : artData.isOwner,
                    writeForUserUid: artData.writeForUserUid
                };
                if (artData.community){
                    postdata.communityUids = artData.community;
                }
                else if(artData.ctyTabUids){
                    postdata.ctyTabUids = artData.ctyTabUids;
                }
                if(artData.uid){
                    postdata.uid = artData.uid;
                }

                if(artData.type == 'grandArticle'){
                	postdata.grandArticlePages = artData.grandArticlePages;
                }

                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                          cachedData.remove('homeFeeds');
                          if(postdata.uid){
                            broadcastFeedEdited(data);
                          }
                          else{
                            broadcastFeedAdded(data);
                          }

                          deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                            deferred.reject(data);
                        });

                return deferred.promise;
            };
            apiDataService.shareArticle = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/content/share';

                $http({method: 'POST', url: apiUrl, data: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedData.remove('homeFeeds');
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            apiDataService.getArticleById = function(artuid){
                var deferred = $q.defer();
                var apiUrl = '/api/content';

                $http({method: 'GET', url: apiUrl, params: {uid: artuid}, cache: false}).
                        then(function onSuccess(response) {
                            var data = response.data;
                          deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                            deferred.reject(data);
                        });
                return deferred.promise;
            };
            apiDataService.prepareEditArtData = function(artData){
                var caArrayBlocks = [];
                var attachedDocs = [];

                /*
                var pubSDt = new Date(artData.publicationStartDate).getTime();
                var pubSTM = new Date(artData.publicationStartDate);
                var pubEDt = new Date(artData.publicationEndDate).getTime();
                var pubETM = new Date(artData.publicationEndDate);
                */
                var pubSDt = null;
                var pubSTM = null;
                var pubEDt = null;
                var pubETM = null;

                if(artData.publicationStartDate){
                    pubSDt = ($filter('newDate')(artData.publicationStartDate)).getTime();
                    pubSTM = $filter('newDate')(artData.publicationStartDate);
                }
                if(artData.publicationEndDate){
                    pubEDt = ($filter('newDate')(artData.publicationEndDate)).getTime();
                    pubETM = ($filter('newDate')(artData.publicationEndDate));
                }

                if(artData.blocks && artData.blocks.length > 0){
                    angular.forEach(artData.blocks, function(val, key){
                        switch(val.type) {
                            case 'heading':
                                caArrayBlocks.push(val);
                                break;
                            case 'topImage':
                                caArrayBlocks.push(val);
                                break;
                            case 'bottomImage':
                                caArrayBlocks.push(val);
                                break;
                            case 'richText':
                                caArrayBlocks.push({
                                    type: 'richText',
                                    content: val.content,
                                    modifiedBlock: false
                                });
                                break;
                            case 'videoGallery':
                                var vdoArr = [];
                                angular.forEach(val.videos, function(filedata, i) {
                                    var tempObj = angular.copy(filedata);
                                    vdoArr.push(tempObj);
                                });

                                var vdoGalleryObj =  angular.copy(sharedData.vdoGalleryObj);
                                vdoGalleryObj.files = vdoArr;
                                caArrayBlocks.push(vdoGalleryObj);
                                break;
                            case 'documentGallery':
                                var docArr = [];
                                angular.forEach(val.documents, function(filedata, i) {
                                    var tempObj = angular.copy(filedata);
                                    tempObj.uploadStatus = '2';
                                    docArr.push(tempObj);
                                });
                                var docGalleryObj =  angular.copy(sharedData.docGalleryObj);
                                docGalleryObj.files = docArr;
                                caArrayBlocks.push(docGalleryObj);
                                break;
                            case 'imageGallery':
                            case 'ImageGallery':
                                var imgArr = [];
                                angular.forEach(val.images, function(filedata, i) {
                                    var tempObj = angular.copy(filedata);
                                    tempObj.uploadStatus = '2';
                                    imgArr.push(tempObj);
                                });
                                var imgGalleryObj =  angular.copy(sharedData.imgGalleryObj);
                                imgGalleryObj.files = imgArr;
                                caArrayBlocks.push(imgGalleryObj);
                                break;
                            case 'url':
                                caArrayBlocks.push({
                                    type: 'url',
                                    path: val.path,
                                    modifiedBlock: false
                                });
                                break;
                            case 'quote':
                                caArrayBlocks.push({
                                    type: 'quote',
                                    content: val.content,
                                    modifiedBlock: false
                                });
                                break;
                            case 'document':
                                attachedDocs.push(val);
                                break;
                            case 'event':

                            	var dtFrm = ((typeof(val.dateFrom)=='undefined' || val.dateFrom==null) ? '' : ($filter('newDate')(val.dateFrom)).getTime());
                            	var tmFrm = ((typeof(val.dateFrom)=='undefined' || val.dateFrom==null) ? '' : $filter('newDate')(val.dateFrom));
                            	var dtTo = ((typeof(val.dateTo)=='undefined' || val.dateTo==null) ? '' : ($filter('newDate')(val.dateTo)).getTime());
                            	var tmTo = ((typeof(val.dateTo)=='undefined' || val.dateTo==null) ? '' : $filter('newDate')(val.dateTo));
                                caArrayBlocks.push({
                                    uid: val.uid ? val.uid : undefined,
                                    type: 'event',
                                    title: val.title,
                                    dateFrom: dtFrm,
                                    timeFrom: tmFrm,
                                    dateTo: dtTo,
                                    timeTo: tmTo,
                                    location: val.location,
                                    description: val.description,
                                    invitedPeoples: val.invitedPeoples,
                                    modifiedBlock: false,
                                    participateEventExtension: val.participateEventExtension,
                                    limitSeatOfEvent: val.limitSeatOfEvent,
                                    totalNumberOfSeat: val.totalNumberOfSeat
                                });
                                break;
                            case 'wiki':
                                caArrayBlocks.push({
                                    type: 'wiki',
                                    title: val.title,
                                    content: val.content,
                                    modifiedBlock: false
                                });
                                break;
                            case 'linkEmbed':
                                caArrayBlocks.push({
                                    type: 'linkEmbed',
                                    links: val.links,
                                    modifiedBlock: false
                                });
                                break;
							case 'yammerEmbed':
                                caArrayBlocks.push({
                                    type: 'yammerEmbed',
                                    links: val.links,
                                    modifiedBlock: false
                                });
                                break;
                        };//switch
                    });//for each
                    if(attachedDocs.length > 0){
                        caArrayBlocks.push({
                            type: 'doc',
                            title: '',
                            attachedDocs: attachedDocs
                        });
                    }
                }
                return {
                    uid: artData.uid,
                    community: artData.community,
                    communityTab: artData.communityTab,
                    template: artData.template,
                    publishStartDt: pubSDt,
                    publishStartTime: pubSTM,
                    publishEndDt: pubEDt,
                    publishEndTime: pubETM,
                    newsFeed: artData.newsFeed,
                    status: artData.status,
                    allowComment: artData.allowComment,
                    displayInCommunityCalendar: artData.displayInCommunityCalendar,
                    blocks: caArrayBlocks,
                    hashtags : artData.hashtags,
                    displayEventOnCommunity : artData.displayEventOnCommunity,
                    displayEventOnHomePage : artData.displayEventOnHomePage,
                    authorizeShare : artData.authorizeShare,
                    isPin : artData.isPin,
                    pinnedCommunity : artData.pinnedCommunity,
                    grandArticlePages: artData.grandArticlePages,
                    isOwner : artData.isOwner,
                    writeForUserUid: artData.wroteFor != undefined ? artData.wroteFor.uid : null
                };
            };
            apiDataService.postFeed = function(postdata, type){
                var apiUrl = null;
                var deferred = $q.defer();

                if(type == 'event')
                    apiUrl = '/api/content/event';
                else if(type == 'wiki')
                    apiUrl = '/api/content/wiki';
                else if(type == 'imageGallery')
                    apiUrl = '/api/content/imageGallery';
                else if(type == "documentGallery")
                    apiUrl = '/api/content/document';

                if(apiUrl){
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedData.remove('homeFeeds');
                        if(postdata.uid){
                            broadcastFeedEdited(data);
                        }
                        else{
                            broadcastFeedAdded(data);
                        }
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                return deferred.promise;
            };

            //var statusList = [];
            apiDataService.statusList = function(){
                var deferred = $q.defer();
                if(!cachedData.get('allFeedStatusList')){
                    var apiUrl = '/api/content/status/list';
                    $http({method: 'GET', url: apiUrl, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedData.put('allFeedStatusList', data)
                        deferred.resolve(cachedData.get('allFeedStatusList'));
                    }, function onError(response) {
                        var data = response.data;
                        //statusList = [];
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(cachedData.get('allFeedStatusList'));
                }
                return deferred.promise;
            };
            apiDataService.changeStatus = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/content/updateStatus';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

          return apiDataService;
        }])
    .factory("apiNotification", ['$rootScope', '$http', 'Config', '$q', function($rootScope, $http, Config, $q) {
            var apiDataService = {};
            apiDataService.count = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/notification/count';
                $http({method: 'GET', url: apiUrl, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve({data: data});
                    }, function onError(response) {
                         var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.list = function(parameters){
                var deferred = $q.defer();
                var apiUrl = '/api/notification/list';
                $http({method: 'GET', url: apiUrl, params: parameters, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                      deferred.resolve({data: data});
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiUsefulLinks", ['$rootScope', '$http', 'Config', 'cachedData', '$q', function($rootScope, $http, Config, cachedData, $q) {
            var apiDataService = {};
            apiDataService.showLinksData = function(parameters){
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/list';
                $http({method: 'GET', url: apiUrl, params: parameters, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                  deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.linkList = function(parameters){
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/link/list';
                $http({method: 'GET', url: apiUrl, params: parameters, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve({data: data});
                }, function onError(response) {
                    var data = response.data;
                  deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.headingList = function(parameters){
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/heading/list';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                      deferred.resolve({data: data});
                }, function onError(response) {
                    var data = response.data;
                      deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.createHeading = function(postdata){
                /*
                uid : heading.uid,
                heading : heading.heading
                */
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/heading/create';

                $http({method: 'POST', url: apiUrl, data: postdata})
                .then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.createLink = function(postdata){
                /*
                uid : linkUid,
                title : link.title,
                link : link.link,
                headingUid : link.heading.uid
                */
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/create';


                $http({method: 'POST', url: apiUrl, data: postdata})
                .then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.deleteHeading = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink/heading';
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
                    var data = response.data;
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.deleteLink = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/usefulLink';
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
                    var data = response.data;
                        cachedData.remove('usefulLinks');
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

             apiDataService.versionLink = function(){
            	 var deferred = $q.defer();
            	 var apiUrl = '/api/application/version';
            	 $http({method: 'GET', url: apiUrl}).
            	 then(function onSuccess(response) {
            		 var data = response.data;
            		 deferred.resolve(data);
            	 }, function onError(response) {
            		 var data = response.data;
            		 deferred.reject(data);
            	 });
            	 return deferred.promise;
             };

             apiDataService.showSidebarLinks = function(parameters){
            	 var deferred = $q.defer();
            	 var apiUrl = '/api/usefulLink/sidebar/list';
            	 $http({method: 'GET', url: apiUrl, params: parameters, cache: false}).
            	 then(function onSuccess(response) {
            		 var data = response.data;
            		 deferred.resolve(data);
            	 }, function onError(response) {
            		 var data = response.data;
            		 deferred.reject(data);
            	 });
            	 return deferred.promise;
             };

             apiDataService.orderLinks = function(postdata){
                 var deferred = $q.defer();
                 var apiUrl = '/api/usefulLink/order';
                 $http({method: 'POST', url: apiUrl, data: postdata}).
                     then(function onSuccess(response) {
                         var data = response.data;
                         deferred.resolve(data);
                     }, function onError(response) {
                         var data = response.data;
                         deferred.reject(data);
                     });
                 return deferred.promise;
             };
             apiDataService.orderHeadings = function(postdata){
                 var deferred = $q.defer();
                 var apiUrl = '/api/usefulLink/heading/order';
                 $http({method: 'POST', url: apiUrl, data: postdata}).
                     then(function onSuccess(response) {
                         var data = response.data;
                         deferred.resolve(data);
                     }, function onError(response) {
                         var data = response.data;
                         deferred.reject(data);
                     });
                 return deferred.promise;
             };

            return apiDataService;
        }])
    .factory("apiCommunity", ['$rootScope','$http', 'Config', '$q', 'cachedData', function($rootScope, $http, Config, $q, cachedData) {
            var requestedCommunities = [];
            var apiDataService = {};
            var tabtypes = [];

            var broadcastCommAdded = function(data){
              $rootScope.$broadcast('community.added', data);
            };
            var broadcastCommEdited = function(data){
              $rootScope.$broadcast('community.edited', data);
            };
            var broadcastCommFollowed = function(data){
              $rootScope.$broadcast('community.followed.unfollowed', data);
            };

            apiDataService.getTabTypes = function(){
                var deferred = $q.defer();
                if(tabtypes.length <= 0){
                    var commUrl = '/api/tabtype/list';
                    $http({method: 'GET', url: commUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      tabtypes = data;
                      deferred.resolve(tabtypes);
                    }, function onError(response) {
                        var data = response.data;
                        tabtypes = [];
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(tabtypes);
                }
                return deferred.promise;
            };
            apiDataService.getCommunitiesData = function(parameters){
                var deferred = $q.defer();
                    var commUrl = '/api/community/list';
                    if(parameters || (!parameters && !cachedData.get('allCommunities'))){
                        $http({
                            method: 'GET',
                            url: commUrl,
                            params: parameters
                        }).
                        then(function onSuccess(response) {
                            var data = response.data;
                          if(!parameters){
                            //save all communities in cache
                            cachedData.put('allCommunities', data);
                          }
                          deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                            deferred.reject(data);
                        });
                    }//if
                    else{
                        deferred.resolve(cachedData.get('allCommunities'));
                    }
                return deferred.promise;
            };
            apiDataService.getCommunityByUid = function(parameters){
                var deferred = $q.defer();
                var commUrl = '/api/community';
                $http({method: 'GET', url: commUrl, params: parameters, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getUserCommunitise = function(parameters){
                //get communities followed by user
                //pass paremeters {userUid : <uid of user>}
                var deferred = $q.defer();
                var commUrl = '/api/community/list/user';
                $http({method: 'GET', url: commUrl, params: parameters, cache: false}).
                then(function onSuccess(response) {
                        var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.requestedCommunities = function(){
                var deferred = $q.defer();
                if(requestedCommunities.length <= 0){
                    var commUrl = '/api/requestedCommunity/list';
                    $http({method: 'GET', url: commUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      requestedCommunities = data;
                      deferred.resolve(requestedCommunities);
                }, function onError(response) {
                    var data = response.data;
                        requestedCommunities = [];
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(requestedCommunities);
                }
                return deferred.promise;
            };
            apiDataService.request = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/requestedCommunity';


                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    requestedCommunities = [];
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.declineRequestedCommunity = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/requestedCommunity';

                $http({method: 'GET', url: apiUrl, params: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                        deferred.resolve(data);
                        requestedCommunities = [];
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/community/create';

                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    cachedData.remove('allCommunities');
                    if(postdata.communityUid){
                        broadcastCommEdited(data);
                    }
                    else{
                        broadcastCommAdded(data);
                    }
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.delete = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/community';
                $http({method: 'DELETE', url: apiUrl, params: parameter}).
                then(function onSuccess(response) {
                    var data = response.data;
                        cachedData.remove('allCommunities');
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.deleteTab = function(parameter){
                var deferred = $q.defer();
                //post data {uid: <community tab uid>}
                var apiUrl = '/api/community/tab';
                $http({method: 'DELETE', url: apiUrl, params: parameter}).
                then(function onSuccess(response) {
                    var data = response.data;
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.follow = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/community/follow';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    cachedData.remove('allCommunities');
                    broadcastCommFollowed(data);
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.subscribe = function(postdata){
                //postData = {uid: communityuid, action: 'subscribe' / 'not subscribe'}
                var deferred = $q.defer();
                var apiUrl = '/api/community/follow';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    cachedData.remove('allCommunities');
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getCommunityMember = function(paramobj){
                var deferred = $q.defer();
                var commUrl = '/api/community/member/list';
                $http({method: 'GET', url: commUrl, params: paramobj, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getMemberStatus = function(paramobj){
                var deferred = $q.defer();
                var commUrl = '/api/community/memberStatus';
                $http({method: 'GET', url: commUrl, params: paramobj, cache: true}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.changeStatus = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/community/changeStatus';

                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.isTabHasContent = function(parameter){
                var deferred = $q.defer();
                //post data {uid: <community tab uid>}
                var apiUrl = '/api/community/tab/has-content';
                $http({method: 'GET', url: apiUrl, params: parameter}).
                then(function onSuccess(response) {
                    var data = response.data;
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getFileTypesOnCommunity = function(parameters){
            	var deferred = $q.defer();
                var apiUrl = '/api/community/file/type/list';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getFileAuthorsOnCommunity = function(parameters){
            	var deferred = $q.defer();
                var apiUrl = '/api/community/file/author/list';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.searchFilesOnCommunity = function(parameters){
            	var deferred = $q.defer();
                var apiUrl = '/api/community/file/search';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getAllFileTypes = function(parameters){
            	var deferred = $q.defer();
                var apiUrl = '/api/community/file/type/all';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getFilesOnCommunities = function(parameters){
            	var deferred = $q.defer();
                var apiUrl = '/api/community/file/list';
                $http({method: 'GET', url: apiUrl, params: parameters}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.changeImage = function(communityUid,postdata){
    			var deferred = $q.defer();
    			var apiUrl = '/api/community/change-image';
    			$http({method: 'PUT', url: apiUrl, params: {uid: communityUid}, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedData.remove('allCommunities');
                        broadcastCommEdited(data);
    					deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
    					deferred.reject(data);
    				});
    			return deferred.promise;
    		};
          return apiDataService;
        }])
    .factory("apiArticle", ['$rootScope', '$http', 'Config', '$q', function($rootScope, $http, Config, $q) {
            var apiDataService = {};
            var artData = '';
            var broadcastFeeds = function () {
                $rootScope.$broadcast('article.update', artData);
            };
            apiDataService.getArticle = function(paramobj){
                var deferred = $q.defer();
                var apiUrl = '/api/content';
                if(artData == ''){
                    $http({method: 'GET', url: apiUrl, params: paramobj, cache: false}).
                        then(function onSuccess(response) {
                            var data = response.data;
                          deferred.resolve({data: data});
                        }, function onError(response) {
                            var data = response.data;
                          deferred.reject(data);
                        });
                }
                else{
                    alert("Select community");
                    deferred.reject("failed");
                }
                return deferred.promise;
            };
            apiDataService.reset = function () {
                artData = '';
            };
            return apiDataService;
        }])
    .factory("apiFiles", ['$http', 'Config', '$q', 'Upload', function($http, Config, $q, Upload){
            var apiDataService = {};
            var images = [];
            var documents = [];
            apiDataService.getImages = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/attachment/list';
                if(images.length <= 0)
                {
                    $http({method: 'GET', url: apiUrl, params: {type: 'image'}}).
                        then(function onSuccess(response) {
                            var data = response.data;
                                images = data;
                                deferred.resolve(images);
                        }, function onError(response) {
                            var data = response.data;
                                deferred.reject(data);
                            });
                }
                else{
                    deferred.resolve(images);
                }
                return deferred.promise;
            };
            apiDataService.getDocuments = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/attachment/list';
                if(documents.length <= 0)
                {
                    $http({method: 'GET', url: apiUrl, params: {type: 'document'}}).
                        then(function onSuccess(response) {
                            var data = response.data;
                                documents = data;
                                deferred.resolve(documents);
                        }, function onError(response) {
                            var data = response.data;
                                deferred.reject(data);
                            });
                }
                else{
                    deferred.resolve(documents);
                }
                return deferred.promise;
            };
            apiDataService.getImageById = function(id){
                var tempFeed = '';
                if(images.length > 0){
                    angular.forEach(images, function(val , key){
                        if(feedId == val.uid){
                          //sharePopup will use this feedData to show Fedd
                          tempFeed = val;
                        }
                   });
                }
                return tempFeed;
            };
            apiDataService.getDocumentById = function(id){
                var tempFeed = '';
                if(documents.length > 0){
                    angular.forEach(documents, function(val , key){
                        if(feedId == val.uid){
                          //sharePopup will use this feedData to show Fedd
                          tempFeed = val;
                        }
                   });
                }
                return tempFeed;
            };
            apiDataService.uploadFiles = function(file){
                var deferred = $q.defer();
                var apiUrl = '/api/attachment';
                    //upload file and show percentage of uploaded file
                    var upload = Upload.upload({
                        url: apiUrl,
                        method: 'POST',
                        headers: {'Content-Type': undefined},
                        file: file, // or list of files ($files) for html5 only
                    })
                    .progress(function(evt) {
                        deferred.notify(parseInt(100.0 * evt.loaded / evt.total));
                    })
                    .then(function onSuccess(response) {
	                    var data = response.data;
	                    deferred.resolve(data);
                    }, function onError(response) {
	                    var data = response.data;
	                    deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.uploadVideoThumb = function(file,videoName,isDefaultThumb){
            	var deferred = $q.defer();
                var apiUrl = '/api/admin/mediamanager/localvideo/upload-thumb';
                var fd = new FormData();
                fd.append('file', file);
                fd.append('videoName', videoName);
                fd.append('isDefaultThumb', isDefaultThumb);

                $http.post(apiUrl, fd, {
                    withCredentials : true,
                    headers : {
                        'Content-Type' : undefined
                    },
                    timeout: deferred.promise,
                    transformRequest : angular.identity
                }).then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.checkFileExistByUrl = function(url){
                var deferred = $q.defer();
                var apiUrl = '/api/mediamanager/file/is-exist';
                $http({method: 'GET', url: apiUrl, params: {path: url}})
                .then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiTemplate", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            var blocktemplates = [];
            var layouts = [];
            apiDataService.getTemplates = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/templateType/list';
                if(layouts.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                        then(function onSuccess(response) {
                            var data = response.data;
                                layouts = data;
                                deferred.resolve(layouts);
                        }, function onError(response) {
                            var data = response.data;
                                deferred.reject(data);
                            });
                }
                else{
                    deferred.resolve(layouts);
                }
                return deferred.promise;
            };
            apiDataService.getBlockTemplates = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/template/list';
                if(blocktemplates.length <= 0)
                {
                    $http({method: 'GET', url: apiUrl}).
                        then(function onSuccess(response) {
                            var data = response.data;
                                blocktemplates = data;
                                deferred.resolve(blocktemplates);
                        }, function onError(response) {
                            var data = response.data;
                                deferred.reject(data);
                            });
                }
                else{
                    deferred.resolve(blocktemplates);
                }
                return deferred.promise;
            };
            apiDataService.getByUid = function(uid){
                var deferred = $q.defer();
                var apiUrl = '/api/template';
                $http({method: 'GET', url: apiUrl, params: {uid: uid}}).
                        then(function onSuccess(response) {
                            var data = response.data;
                        deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.createBlock = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/template';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                        then(function onSuccess(response) {
                            var data = response.data;
                        deferred.resolve(data);
                        blocktemplates = [];
                        }, function onError(response) {
                            var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiPeoples", ['$http', 'Config', '$q', 'authService','$state', function($http, Config, $q, authService,$state){
            function apiPeoplesFun(){
                var deferred = $q.defer();
                this.getPeoples = function(searchPramas){
                    var apiUrl = '/api/user/list';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: true,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                            var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.create = function(postdata){
                    var apiUrl = '/api/user';
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        authService.resetUserData();
                        deferred.resolve(data);
                        $state.reload();
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.writeQuickpost = function(postdata){
                    var apiUrl = '/api/user/quickpost/create';
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        authService.resetUserData();
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.followUser = function(postdata){
                    var apiUrl = '/api/user/follow';
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        authService.resetUserData();
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.changePhoto = function(postdata){
                    var apiUrl = '/api/user/changePhoto';
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        authService.resetUserData();
                        deferred.resolve(data);
                        $state.reload();
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.changePassword = function(postdata){
                    var apiUrl = '/api/user/changePassword';
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        authService.resetUserData();
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.getUser = function(parameter){
                    var apiUrl = '/api/user';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: parameter,
                        cache: false,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                    deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.userProfile = function(parameter){
                    var apiUrl = '/api/user/profile';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: parameter,
                        timeout: deferred.promise,
                        cache: false
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.addUsersData = function(postdata, type){
                    var apiUrl = '';
                    switch(type){
                        case 'position':
                            apiUrl = '/api/user/addposition';
                        break;
                        case 'organization':
                            apiUrl = '/api/user/addorganization';
                        break;
                        case 'competency':
                            apiUrl = '/api/user/addcompetency';
                        break;
                    }
                    $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;

                            deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                            deferred.reject(data);
                        });
                    return deferred.promise;
                };
                this.getDivisionList = function(parameter){
                    var apiUrl = '/api/user/divisionList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.getUserSevices = function(parameter){
                    var apiUrl = '/api/user/serviceList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: parameter,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.getUserCompanies = function(){
                    var apiUrl = '/api/user/companyList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.getUserSites = function(){
                    var apiUrl = '/api/user/siteList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
	    	this.getFilterList = function(parameter){
                    var apiUrl = '/api/user/filterList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: parameter,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.getComMemb = function(paramobj){
                    var apiUrl = '/api/community/members';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: paramobj,
                        cache: true,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;

                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.cancel = function(optn){
                    deferred.resolve(null);
                };

		this.suggestUser = function(searchParams){
                    var apiUrl = '/api/user/suggestion';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        cache: false,
			params: searchParams,
                        timeout: deferred.promise,
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                    deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.sendNotificationVisited = function(params){
                	 var apiUrl = '/api/user/visited';
                	 $http({
                         method: 'GET',
                         url: apiUrl,
                         cache: false,
                         params: params
                     }).
                    then(function onSuccess(response) {
                    }, function onError(response) {
                    });

                     return  deferred.promise;
                };
                this.getUserHobbies= function(searchPramas){
                    var apiUrl = '/api/user/hobby/list';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: true,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                            var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                this.getUsersHaveRoleCreationContentOnCommunity = function(params){
                    var apiUrl = '/api/user/community';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: params,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                            var data = response.data;
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };

            };
            //return apiDataService;
            return(apiPeoplesFun);
        }])
    .factory("mediaService", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.localImgSize = function(file){
                var deferred = $q.defer();
                var image  = new Image();
                var f = file;
                var FR = new FileReader();
                FR.onload = function(e) {
                  image.src = e.target.result;
                  image.onload = function(){
                    var img_width = this.width;
                    var img_height = this.height;
                     deferred.resolve({width: img_width, height: img_height});
                  };
                };

                FR.readAsDataURL(f);
                return deferred.promise;
            };
            apiDataService.remoteImgSize = function(url){
                var deferred = $q.defer();
                var img = new Image();
                img.onload = function(){
                    var w = this.width;
                    var h = this.height;
                    deferred.resolve({width: w, height: h});
                };
                img.onerror = function(evt){
                    deferred.reject("unable to load image");
                };
                img.src = url;
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiMediaUpload", ['$http', 'Config', '$q', 'notifyModal', '$window', 'Upload', function($http, Config, $q, notifyModal, $window, Upload){
            var apiDataService = {};
            //var deferred = $q.defer();
            var generateEncodedURLS = function(file){
                var deferred = $q.defer();
                var f = file;
                var FR= new FileReader();
                FR.onload = function(e) {
                    //filepath = e.target.result
                    var image  = new Image();
                    image.src = e.target.result;
                    image.onload = function(){
                        var img_width = this.width;
                        var img_height = this.height;
                        var tcanvas = document.createElement("canvas");
                        var MAX_WIDTH = image.width;
                        var MAX_HEIGHT = image.width;
                        var width = image.width;
                        var height = image.height;
                        if (width > height) {
                          if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                          }
                        } else {
                          if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                          }
                        }
                        tcanvas.width = width;
                        tcanvas.height = height;
                        var ctx = tcanvas.getContext("2d");
                        ctx.drawImage(image, 0, 0, width, height);
                        var data_url = tcanvas.toDataURL('image/jpeg', 0.7);

                        deferred.resolve(data_url);
                    };
                };//fr onload
                FR.readAsDataURL(f);

                return deferred.promise;
            };
            apiDataService.upload = function($files, optn){
                var cancel = function(){
                    deferred.resolve("canceled");
                };

                var canvas = document.createElement('canvas');
                var data_urls = [];

                return deferred.promise;
            };

            apiDataService.cancel = function(){
                deferred.resolve("canceled");
            };
            function apiMediaUpload(){
                var deferred = $q.defer();
                /*this.upload = function($files, optn){
                    timmer = setTimeout(function(){
                        var tempData =[{
                                    uid: '111111',
                                    fileType: 'image/jpeg',
                                    fileName: 'temp.jpg',
                                    description: 'desc',
                                    url: 'images/media/art_img_140x140.png',
                                    thumbUrl: 'images/media/art_img_140x140.png',
                                    mediumUrl: 'images/media/art_img_140x140.png',
                                    largeUrl: 'images/media/art_img_140x140.png',
                                    thumbGalleryUrl: 'images/media/art_img_140x140.png',
                                    uploadedDate: '12-13-2014',
                                    cancel: '',
                                }];
                       deferred.resolve({data: tempData, option: optn});
                    }, 5000);

                    return deferred.promise;
                };*/
                var getXHR = function() {
                  if (window.XMLHttpRequest) {
                    // Chrome, Firefox, IE7+, Opera, Safari
                    return new XMLHttpRequest();
                  }
                  // IE6
                  try {
                    // The latest stable version. It has the best security, performance,
                    // reliability, and W3C conformance. Ships with Vista, and available
                    // with other OS's via downloads and updates.
                    return new ActiveXObject('MSXML2.XMLHTTP.6.0');
                  } catch (e) {
                    try {
                      // The fallback.
                      return new ActiveXObject('MSXML2.XMLHTTP.3.0');
                    } catch (e) {
                      alert('This browser is not AJAX enabled.');
                      return null;
                    }
                  }
                };
                var xhr = new XMLHttpRequest();
                var generateEncodedURLS = function(file){
                    var defer = $q.defer();
                    var f = file;
                    var FR= new FileReader();
                    FR.onload = function(e) {
                        //filepath = e.target.result
                        var image  = new Image();
                        image.src = e.target.result;
                        image.onload = function(){
                            var img_width = this.width;
                            var img_height = this.height;
                            var tcanvas = document.createElement("canvas");
                            var MAX_WIDTH = image.width;
                            var MAX_HEIGHT = image.width;
                            var width = image.width;
                            var height = image.height;
                            if (width > height) {
                              if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                              }
                            } else {
                              if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                              }
                            }
                            tcanvas.width = width;
                            tcanvas.height = height;
                            var ctx = tcanvas.getContext("2d");
                            ctx.drawImage(image, 0, 0, width, height);
                            var data_url = tcanvas.toDataURL('image/jpeg', 0.6);

                            defer.resolve(data_url);
                        };
                    };//fr onload
                    FR.readAsDataURL(f);
                    return defer.promise;
                };
                this.uploadImages = function($files, optn){
                    var canvas = document.createElement('canvas');
                    var data_urls = [];
                    var data_objects = [];
                    var useCanvasToCompressImage = false;
                    if(useCanvasToCompressImage && canvas.getContext && canvas.getContext('2d')){
                        var counter = 0;
                        $files.forEach(function (val, key){
                            generateEncodedURLS(val).then(function(data){
                            data_urls.push(data);
                            data_objects.push({
                                fileName: val.name,
                                fileType: 'image',
                                data: data
                            });
                            if(counter == ($files.length-1))
                            {
                                var apiUrl = '/api/mediamanager/upload-data';
                                var uploadedData = {files: data_objects};
                                $http({method: 'POST', url: apiUrl, data: uploadedData, timeout: deferred.promise}).
                                then(function onSuccess(response) {
                                    var data = response.data;
                                    deferred.resolve({data: data, status: 'success', option: optn});
                                }, function onError(response) {
                                    var data = response.data;
                                    deferred.reject({status: "error", data: data, option: optn});
                                });

                            }//if last file encoded
                            counter++;
                            });
                        });
                    }//if
                    else{
                        var apiUrl = '/api/mediamanager/upload-file';
                        Upload.upload({
                            url: apiUrl,
                            withCredentials : true,
                            file: $files[0],
                            timeout: deferred.promise
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).then(function onSuccess(response) {
    	                    var data = response.data;
    	                    deferred.resolve({data: data, status: 'success', optn: optn});
                        }, function onError(response) {
    	                    var data = response.data;
    	                    deferred.reject({status: "error", data: data, optn: optn});
                        });
                    }
                    return deferred.promise;
                };
                this.uploadFiles = function($files, optn){

                    var apiUrl = '/api/mediamanager/upload-file';
                    Upload.upload({
                            url: apiUrl,
                            withCredentials : true,
                            file: $files[0],
                            timeout: deferred.promise
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).then(function onSuccess(response) {
    	                    var data = response.data;
    	                    deferred.resolve({data: data, optn: optn, status: 'success',});
                        }, function onError(response) {
    	                    var data = response.data;
    	                    deferred.reject({status: "error", data: data, optn: optn});
                        });

                    return deferred.promise;
                };
                this.uploadImgForCrop = function($file, optn){
                    var canvas = document.createElement('canvas');
                    var data_url = '';
                    var file_name = '';
                    var useCanvasToCompressImage = false;
                    if(useCanvasToCompressImage && canvas.getContext && canvas.getContext('2d')){

                        generateEncodedURLS($file).then(function(data){
                            data_url = data;
                            file_name = $file.name;

                            var uploadedData = {
                                encodeFile: data_url,
                                encodedFileName: file_name
                            };

                            var apiUrl = '/api/mediamanager/upload-temp';
                            var fd = new FormData();
                            fd.append('encodedFile', data_url);
                            fd.append('encodedFileName', file_name);
                            $http.post(apiUrl, fd, {
                                withCredentials : true,
                                headers : {
                                    'Content-Type' : undefined
                                },
                                timeout: deferred.promise,
                                transformRequest : angular.identity
                            }).then(function onSuccess(response) {
        	                    var data = response.data;
        	                    deferred.resolve({data: data, status: 'success', option: optn});
                            }, function onError(response) {
        	                    var data = response.data;
        	                    deferred.reject({status: "error", data: data, optn: optn});
                            });
                            });

                    }//if
                    else{
                        var apiUrl = '/api/mediamanager/upload-temp';
                        var fd = new FormData();

                        fd.append("file", $file);

                        Upload.upload({
                            url: '/api/mediamanager/upload-temp',
                            file: $file,
                            timeout: deferred.promise
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).then(function onSuccess(response) {
    	                    var data = response.data;
    	                    deferred.resolve({data: data, status: 'success', option: optn});
                        }, function onError(response) {
    	                    var data = response.data;
    	                    deferred.reject({status: "error", data: data, optn: optn});
                        });
                    }
                    return deferred.promise;
                }
                this.cropImage = function(cropData, optn){
                    /*
                    fromat of crop data should be:
                    cropData:
                    {
                        uid : data.uid,
                        path : data.path,
                        images :[
                                 {left : 6,top : 51,width: 499,height: 280}, // information crop image header
                                 {left : 94,top: 59,width: 268,height: 268}, // information crop image gridview thumbnail
                                 {left : 144,top: 82,width: 224,height: 224}  // information crop image gridview small thumbnail
                                ]
                        type:  "articleHeader/profile"
                    }
                    */
                    var apiUrl = '/api/mediamanager/cropImage';
                    $http({method: 'POST', url: apiUrl, data: cropData, timeout: deferred.promise, cache: false}).
                        then(function onSuccess(response) {
                            var data = response.data;
                            deferred.resolve({data: data, status: 'success', option: optn});
                        }, function onError(response) {
                            var data = response.data;
                            notifyModal.show("Cropping failed", 'error');
                            deferred.reject({status: "error", data: data, optn: optn});
                        });
                        return deferred.promise;
                };
                this.manageImage = function(imageData, optn){
                    var apiUrl = '/api/mediamanager/manageImage';
                    $http({method: 'POST', url: apiUrl, data: imageData, timeout: deferred.promise, cache: false}).
                        then(function onSuccess(response) {
                            var data = response.data;
                            deferred.resolve({data: data, status: 'success', option: optn});
                        }, function onError(response) {
                            var data = response.data;
                            notifyModal.show("Process failed", 'error');
                            deferred.reject({status: "error", data: data, optn: optn});
                        });
                        return deferred.promise;
                };
                this.cancel = function(optn){
                    deferred.resolve({status: "cancelled", option: optn});
                };
            };
            //return apiDataService;
            return(apiMediaUpload);
        }])
    .factory("apiMediaManager", ['$http', 'Config', '$q', '$window', function($http, Config, $q, $window){
            var apiDataService = {};
            var files = [];
            var cachedFileType = '';
            apiDataService.getFiles = function(ftype, optn){
                var deferred = $q.defer();
                var parameter = 'all';
                if(ftype == 'image'){
                    parameter = {type: 'image'};
                }
                else if('document'){
                    parameter = {type: 'document'};
                }
                else if('video'){
                    parameter = {type: 'video'};
                }
                var apiUrl ='/api/mediamanager/list';
                if(ftype != cachedFileType){
                    $http({method: 'GET', url: apiUrl, params: parameter}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        cachedFileType = ftype;
                        files = data;
                        deferred.resolve(files, optn);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                else{
                    //already fetched data
                    deferred.resolve(files, optn);
                }
                return deferred.promise;
            };
            apiDataService.getFilesByUids = function(parameter){
                var deferred = $q.defer();
                var apiUrl ='/api/mediamanager/list';
                $http({method: 'GET', url: apiUrl, params: parameter}).
                then(function onSuccess(response) {
                    var data = response.data;
                    files = data;
                    deferred.resolve(files);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.editFile = function(editData){
                //{"uid" : " 3bc97683-ad8e-4be2-95e5-ac468a04b5a5","status" : "publish"}
                var deferred = $q.defer();
                var apiUrl = "/api/mediamanager/edit";
                $http({method: 'POST', url: apiUrl, data: editData}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.deleteFile = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/mediamanager';
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        organizations = [];
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.downloadAllFilesAsAZip = function(postData){
                var deferred = $q.defer();
                var apiUrl = "/api/mediamanager/downloadAllAsZip";
                $http({method: 'POST', url: apiUrl, data: postData}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getInternalVideos = function(parameter){
                var deferred = $q.defer();
                var apiUrl ='/api/mediamanager/video/list';
                $http({method: 'GET', url: apiUrl, params: parameter}).
                then(function onSuccess(response) {
                    var data = response.data;
                    files = data;
                    deferred.resolve(files);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("clientCrop", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            var images = [];
            apiDataService.uploadEncodedImgs = function($files, optn){
                var uploadedData = { files : $files};
                var deferred = $q.defer();
                var apiUrl = '/api/attachment/add';
                $http({method: 'POST', url: apiUrl, data: uploadedData}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve({data: data, option: optn});
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject({data: data, option: optn});
                    });
                return deferred.promise;
            };
            apiDataService.cropImage = function(cropData, optn){
                /*
                    Method : POST
                    Input data : application/json
                    uid : attachment uid
                    path : image url
                    images : list crop informations ( A crop info : left , top , width , height)
                    type : article ( if crop image in article ) or profile ( if crop image in profile)
                    Output data : list urls of cropped images and thumbnails

                */
                var deferred = $q.defer();
                var apiUrl = '/api/attachment';
                $http({method: 'POST', url: apiUrl, data: dataUrlArr}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data, optn);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiLanguage", ['$http', 'Config', '$q', 'cachedData', function($http, Config, $q, cachedData) {
            var apiDataService = {};
            apiDataService.getLanguageList = function(){
                var deferred = $q.defer();
                if(!cachedData.get('allLanguages')){
                    var apiUrl = '/api/language/list';
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                      cachedData.put('allLanguages', data);
                      deferred.resolve(cachedData.get('allLanguages'));
                    }, function onError(response) {
                        var data = response.data;
                        //languages = [];
                        deferred.reject(data);
                    });
                }
                else{
                    deferred.resolve(cachedData.get('allLanguages'));
                }
                return deferred.promise;
            };

            apiDataService.getLanguageByCode = function(param){
                var deferred = $q.defer();
                var apiUrl = '/api/language';
                $http({method: 'GET', url: apiUrl,params: param}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                 }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
          return apiDataService;
        }])
    .factory("apiSearch", ['$rootScope', '$http', 'Config', '$q', function($rootScope, $http, Config, $q){
            function apiSearchFun(){
                var deferred = $q.defer();
                this.search = function(searchPramas){
                    var apiUrl = '/api/search';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: false,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.directorySearch = function(searchPramas){
                    var apiUrl = '/api/search/searchDirectory';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        //cache: searchPramas.random ? false : true,
                        cache: false,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.keywordsearch = function(searchPramas){
                    var apiUrl = '/api/search/autocompletionList';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: true,
                        ignoreLoadingBar: true,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                    deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.suggestion = function(searchPramas){
                    var apiUrl = '/api/search/suggestion';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: false,
                        ignoreLoadingBar: true,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        if (data.code != null){
                            //return json data
                            deferred.reject(data);
                        }else{
                            deferred.resolve(data);
                        }
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.getExternalSites = function(){
                    var apiUrl = '/api/search/externalSites';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        cache: false,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.cancel = function(optn){
                    deferred.resolve(null);
                };
                this.communityFileSearch = function(searchPramas){
                    var apiUrl = '/api/search/community-file';
                    $http({
                        method: 'GET',
                        url: apiUrl,
                        params: searchPramas,
                        cache: false,
                        timeout: deferred.promise
                    }).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
            };
            //return apiDataService;
            return(apiSearchFun);
        }])
    .factory("apiOrganization", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.getAll = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/organization/list';
                $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            apiDataService.delete = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/organization';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getByUid = function(ouid){
                var deferred = $q.defer();
                var apiUrl = '/api/organization';
                $http({method: 'GET', url: apiUrl, params: {uid: ouid}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/organization/create';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        organizations = [];
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.level = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/organization/level/list';
                $http({method: 'GET', url: apiUrl, cache: true}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.searchDirectory = function(postdata) {
                // body...
            };
            apiDataService.getDirectoryByOrgChart = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/organization/directory';
                $http({method: 'GET', url: apiUrl, cache: true}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiCompetency", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.getAll = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/competency/list';
                $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiWidget", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            var organizations = [];
            var widgetTypes = [];
            apiDataService.types = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/types';
                if(widgetTypes.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                else {
                    deferred.resolve(widgetTypes);
                }
                return deferred.promise;
            };
            apiDataService.allWidgets = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/all';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.filteredWidget = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.delete = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/widget';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getByUid = function(wuid){
                var deferred = $q.defer();
                var apiUrl = '/api/widget';
                $http({method: 'GET', url: apiUrl, params: {uid: wuid}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/create';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.voteQuestion = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/survey/vote';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.extractVotedQuestion = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/survey/summary';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.deleteAnswer = function(postdata){
           	 var deferred = $q.defer();
                var apiUrl = '/api/answer';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
           };
           apiDataService.deleteQuestion = function(postdata){
          	 var deferred = $q.defer();
               var apiUrl = '/api/question';
               var deferred = $q.defer();
               $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
               return deferred.promise;
          };
          apiDataService.deleteFoodOption = function(postdata){
           	 var deferred = $q.defer();
                var apiUrl = '/api/widget/food/option';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
           };
            apiDataService.order = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/order';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getAjendaEvents = function(obj){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/agenda';
                    $http({method: 'GET', url: apiUrl, params: obj}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            apiDataService.getUserWidget = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/user/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.addBikeBooking = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/widget/bike-booking';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiPosition", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            var list = [];
            apiDataService.getAll = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/position/list';
                if(list.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }
                else {
                    deferred.resolve(list);
                }
                return deferred.promise;
            };
            return apiDataService;
        }])
	.factory("apiAgenda", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};

            apiDataService.delete = function(eventUid){
                var deferred = $q.defer();
                var apiUrl = '/api/agenda';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: {uid: eventUid}, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                var data = response.data;
                    deferred.reject(data);
                });                
                return deferred.promise;
            };
            return apiDataService;
        }])
    .factory("apiCarouselTemplate", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};

	    	apiDataService.allTemplates = function(param){
			var deferred = $q.defer();
			var apiUrl = '/api/carouselTemplate/list';
			$http({method: 'GET', url: apiUrl, params: {status: param}}).
                then(function onSuccess(response) {
                    var data = response.data;
					deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
					deferred.reject(data);
				});
			return deferred.promise;
		};

		apiDataService.updateTemplate = function(postdata){
			var deferred = $q.defer();
			var apiUrl = '/api/carouselTemplate';
			$http({method: 'PUT', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
					deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
					deferred.reject(data);
				});
			return deferred.promise;
		};

            return apiDataService;
        }])
    .factory("apiGoogleDrive", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            // The Browser API key obtained from the Google Developers Console.
            var developerKey = 'AIzaSyDJwXeNjYTR5XTljXerK3aUAnFDQfbPriA';
            // The Client ID obtained from the Google Developers Console.
            var clientId = '1035414943904-b4kgov74alr9h73slq3gciulr8r90pfs.apps.googleusercontent.com';
            // Scope to use to access user's photos.
            var scope = ['https://www.googleapis.com/auth/drive'];
            var pickerApiLoaded = false;
            var oauthToken;

            // Use the API Loader script to load google.picker and gapi.auth.
            apiDataService.onApiLoad = function() {
                gapi.load('auth', {'callback': apiDataService.onAuthApiLoad});
                gapi.load('picker', {'callback': apiDataService.onPickerApiLoad});
              };

            apiDataService.onAuthApiLoad = function () {
                window.gapi.auth.authorize(
                    {
                      'client_id': clientId,
                      'scope': scope,
                      'immediate': false
                    },
                    apiDataService.handleAuthResult);
              };
            apiDataService.onPickerApiLoad = function() {
                pickerApiLoaded = true;
                apiDataService.createPicker();
              };

            apiDataService.handleAuthResult = function (authResult) {
                if (authResult && !authResult.error) {
                  oauthToken = authResult.access_token;
                  apiDataService.createPicker();
                }
              };

              // Create and render a Picker object for picking user Photos.
            apiDataService.createPicker =  function () {
                if (pickerApiLoaded && oauthToken) {
                  var picker = new google.picker.PickerBuilder().
                      addView(google.picker.ViewId.DOCS).
                      setOAuthToken(oauthToken).
                      setDeveloperKey(developerKey).
                      setCallback(apiDataService.pickerCallback).
                      build();
                  picker.setVisible(true);
                }
              };

              // A simple callback implementation.
            apiDataService.pickerCallback = function (data) {
                var url = 'nothing';
                if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                  var doc = data[google.picker.Response.DOCUMENTS][0];
                  url = doc[google.picker.Document.URL];
                }
                var message = 'You picked: ' + url;
              };

            return apiDataService;
        }])
        .factory("apiCalendar", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.calendar = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/calendar';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
                    var data = response.data;
                  deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };

            return apiDataService;
        }])
        .factory("apiStatisticReport", ['$http', 'Config', '$q' , '$interval' , 'notifyModal','uiModals','$filter', function($http, Config, $q,$interval,notifyModal,uiModals,$filter){
        	var apiDataService = {};
        	apiDataService.commentAndLikeReport = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-comment-like';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listContentViewedBySource = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-content-viewed-by-source';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.viewActivitiesOfCommunities = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/view-activity-community';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.countContentsViewedByCommunity = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/analyze-content-viewed-by-community';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                  deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.countContentsCreatedByCommunity = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/count-content-created-by-community';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.countCommunityMemberConnection = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/count-community-member-connection';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.totalGlobalConnectionsByDate = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/count-total';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.totalGlobalConnectionsByDepartment = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/count-by-department';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.totalGlobalConnectionsByStatus = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/count-by-status';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.totalGlobalConnectionsByCommunityStatus = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/count-by-community-status';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.countContentCreatedAndPublishedByDate = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/count-content-created-by-date';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getListPeriod = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-period';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getLastUpdatedDate = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/get-last-updated-date';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.exportReport = function(postdata){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/export';
                var progressModal = uiModals.progressModal(null, $filter('translate')('Processing'), $filter('translate')('Please wait several minutes'));
                $http({
                    method: 'POST',
                    url: apiUrl,
                    data: postdata
                }).
                then(function onSuccess(response) {
                    //var data = response.data;
                	var start = 1;
        			var interval = $interval(function() {
        				start++;
        				$http.get('/api/job/list')
        				.then(function onSuccess(response) {
    	                    var data = response.data;
    	                    var found = false;
        					if(data != undefined && data.length > 0){
        						for(var i = 0 ; i< data.length && !found ; i++){
        							if(data[i] == 'Exporting report'){
        								found = true;
        							}
        						}
        					}
        					if(!found && start != 1){
        						deferred.resolve(data);
        						$interval.cancel(interval);
        						if(progressModal){
        							progressModal.close();
        							notifyModal.showTranslated('Export successfully', 'success', null);
        						}
        					}
                        }, function onError(response) {
    	                    var data = response.data;
    	                    deferred.reject(data);
                        });
        			}, 1000);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.exportUserDetailsByActionReport = function(postdata){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-details-and-actions/user/view-details/export';
                var progressModal = uiModals.progressModal(null, $filter('translate')('Processing'), $filter('translate')('Please wait several minutes'));
                $http({
                    method: 'POST',
                    url: apiUrl,
                    data: postdata
                }).
                then(function onSuccess(response) {
                    //var data = response.data;
                	var start = 1;
        			var interval = $interval(function() {
        				start++;
        				$http.get('/api/job/list')
        				.then(function onSuccess(response) {
    	                    var data = response.data;
    	                    var found = false;
        					if(data != undefined && data.length > 0){
        						for(var i = 0 ; i< data.length && !found ; i++){
        							if(data[i] == 'Exporting user details by actions and uid'){
        								found = true;
        							}
        						}
        					}
        					if(!found && start != 1){
        						deferred.resolve(data);
        						$interval.cancel(interval);
        						if(progressModal){
        							progressModal.close();
        							notifyModal.showTranslated('Export successfully', 'success', null);
        						}
        					}
                        }, function onError(response) {
    	                    var data = response.data;
    	                    deferred.reject(data);
                        });
        			}, 1000);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserNeverConnect = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-never-connect';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserConnectLessOrEqual10Times = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-connect-less-equal-10-times';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserConnected = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-connect';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.exportAllReportsInSameExcel = function(postdata){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/export/all';
                var progressModal = uiModals.progressModal(null, $filter('translate')('Processing'), $filter('translate')('Please wait several minutes'));
                $http({
                    method: 'POST',
                    url: apiUrl,
                    data: postdata
                }).
                then(function onSuccess(response) {
                    //var data = response.data;
                    var start = 1;
        			var interval = $interval(function() {
        				start++;
        				$http.get('/api/job/list')
        					.then(function onSuccess(response) {
        						var data = response.data;
        						var found = false;
            					if(data != undefined && data.length > 0){
            						for(var i = 0 ; i< data.length && !found ; i++){
            							if(data[i] == 'Exporting all reports in same excel file'){
            								found = true;
            							}
            						}
            					}
            					if(!found && start != 1){
            						deferred.resolve(data);
            						$interval.cancel(interval);
            						if(progressModal){
            							progressModal.close();
            							notifyModal.showTranslated('Export successfully', 'success', null);
            						}
            					}
        					}, function onError(response) {
        						var data = response.data;
        						deferred.reject(data);
        					});
        			}, 1000);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getTotalConnectedUsersAtTheMoment = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/total-connect-at-the-moment';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserDetailsAndActionsReport = function(period){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-details-and-actions';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: period
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.getDetailsOfActionByUser = function(parameters){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-details-and-actions/user/view-details';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: parameters
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserConnectionSummaryReport = function(parameters){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/list-user-connection-summary';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: parameters
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.listUserConnectedAtTheMoment = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/list-user-connect-at-the-moment';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.totalGlobalConnectionsTableByDate = function(params){
        		var deferred = $q.defer();
                var apiUrl = '/api/stat/global-connection/table/count-total';
                $http({
                    method: 'GET',
                    url: apiUrl,
                    params: params
                }).
                then(function onSuccess(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            return apiDataService;
        }])
        .factory("apiDigest", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            var digestTypes = [];
            var digestTemplates = [];
            var contentTypes = [];
            var repeatTypes = [];
            apiDataService.types = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/types';
                if(digestTypes.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                            	digestTypes = data;
                                deferred.resolve(digestTypes);
                    }, function onError(response) {
                        var data = response.data;
                                deferred.reject(data);
                            });
                }else {
                    deferred.resolve(digestTypes);
                }
                return deferred.promise;
            };
            apiDataService.allDigests = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/all';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                            deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                            deferred.reject(data);
                        });
                return deferred.promise;
            };
            apiDataService.filteredDigestd = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                    then(function onSuccess(response) {
                        var data = response.data;
                            deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                            deferred.reject(data);
                        });
                return deferred.promise;
            };
            apiDataService.delete = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/digest';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.getById = function(digestId){
                var deferred = $q.defer();
                var apiUrl = '/api/digest';
                $http({method: 'GET', url: apiUrl, params: {id: digestId}}).
                    then(function onSuccess(response) {
                        var data = response.data;
                  deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/digest';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            apiDataService.activate = function(digestId,postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/activate';
                var deferred = $q.defer();
                $http({method: 'PUT', url: apiUrl, params: {id: digestId}, data: postdata}).
                then(function onSuccess(response) {
                    var data = response.data;
					deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
					deferred.reject(data);
				});
                return deferred.promise;
            };
            apiDataService.getTemplates = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/templates';
                if(digestTemplates.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        digestTemplates = data;
                        deferred.resolve(digestTemplates);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }else {
                    deferred.resolve(digestTemplates);
                }
                return deferred.promise;
            };
            apiDataService.getRepeatTypes = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/automated/repeat';
                if(repeatTypes.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        repeatTypes = data;
                        deferred.resolve(repeatTypes);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }else {
                    deferred.resolve(repeatTypes);
                }
                return deferred.promise;
            };
            apiDataService.getContentTypesOfDigest = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/digest/automated/content-types';
                if(contentTypes.length <= 0){
                    $http({method: 'GET', url: apiUrl}).
                    then(function onSuccess(response) {
                        var data = response.data;
                        contentTypes = data;
                        deferred.resolve(contentTypes);
                    }, function onError(response) {
                        var data = response.data;
                        deferred.reject(data);
                    });
                }else {
                    deferred.resolve(contentTypes);
                }
                return deferred.promise;
            };
            return apiDataService;
        }])
        .factory("apiInteraction", ['$http', 'Config', '$q', function($http, Config, $q){
        	 var apiDataService = {};
        	 apiDataService.create = function(data){
                 var deferred = $q.defer();
                 var apiUrl = '/api/interactive';
                 $http({method: 'POST', url: apiUrl, data: data}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             apiDataService.getVisitor = function(params){
                 var deferred = $q.defer();
                 var apiUrl = '/api/interactive/visitor';
                 $http({method: 'GET', url: apiUrl, params: params}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             apiDataService.getParticipants = function(params){
                 var deferred = $q.defer();
                 var apiUrl = '/api/interactive/participant';
                 $http({method: 'GET', url: apiUrl, params: params}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             return apiDataService;
        }])
        .factory("apiConfig", ['$http', 'Config', '$q', function($http, Config, $q){
        	 var apiDataService = {};
             apiDataService.getByName = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/config';
                 $http({method: 'GET', url: apiUrl,params: param}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             return apiDataService;
        }])
        .factory("apiProfileCustomField", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
             apiDataService.getActiveProfileCustomFields = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/customfield/list';
                 $http({method: 'GET', url: apiUrl,params: param}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             apiDataService.configFieldsForUser = function(data){
                 var deferred = $q.defer();
                 var apiUrl = '/api/customfield';
                 $http({method: 'POST', url: apiUrl, data: data}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
             return apiDataService;
        }])
        .factory("apiNoteService", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
             apiDataService.getNotesForCurrentUser = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note/list';
                 $http({method: 'GET', url: apiUrl,params: param}).
                        then(function onSuccess(response) {
                            var data = response.data;
                             deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                             deferred.reject(data);
                         });

                 return deferred.promise;
             };
	     apiDataService.deleteNote = function(postdata){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note';
                 var deferred = $q.defer();
                 $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.getById = function(noteId){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note';
                 $http({method: 'GET', url: apiUrl, params: {id: noteId}}).
                 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.create = function(postdata){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note';
                 $http({method: 'POST', url: apiUrl, data: postdata}).
                 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.edit = function(noteId,postdata){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note';
                 var deferred = $q.defer();
                 $http({method: 'PUT', url: apiUrl, params: {id: noteId}, data: postdata}).
 		 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.getGroupsByCommunity = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note/group/list';
                 $http({method: 'GET', url: apiUrl,params: param}).
                 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.getAllNotes = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note/all';
                 $http({method: 'GET', url: apiUrl,params: param}).
                 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             apiDataService.getPriorities = function(param){
                 var deferred = $q.defer();
                 var apiUrl = '/api/note/priority';
                 $http({method: 'GET', url: apiUrl,params: param}).
               	 then(function onSuccess(response) {
                  	var data = response.data;
                 	deferred.resolve(data);
                 }, function onError(response) {
             		var data = response.data;
                 	deferred.reject(data);
                 });
                 return deferred.promise;
             };
             return apiDataService;
        }])
        .factory("apiEvent", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
        	apiDataService.participateEvent = function(data){
        		var deferred = $q.defer();
        		var apiUrl = '/api/event/participate';
        		$http({method: 'POST', url: apiUrl,data: data}).
                then(function onSuccess(response) {
                    var data = response.data;
        			deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
        			deferred.reject(data);
        		});

        		return deferred.promise;
        	};
        	apiDataService.getAllParticipantsOfEvent = function(param){
                var deferred = $q.defer();
                var apiUrl = '/api/event/participants';
                $http({method: 'GET', url: apiUrl,params: param}).
                        then(function onSuccess(response) {
                            var data = response.data;
                            deferred.resolve(data);
                        }, function onError(response) {
                            var data = response.data;
                            deferred.reject(data);
                        });

                return deferred.promise;
            };
        	return apiDataService;
        }])
	.factory("apiAlert", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.allAlerts = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/alert/all';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
           	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
           	 	});
                return deferred.promise;
            };
            apiDataService.filteredAlerts = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/alert/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
           	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
           	 	});
                return deferred.promise;
            };
            apiDataService.deleteAlert = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/alert';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: postdata, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.getById = function(digestId){
                var deferred = $q.defer();
                var apiUrl = '/api/alert';
                $http({method: 'GET', url: apiUrl, params: {id: digestId}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/alert';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.activate = function(digestId,postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/alert/activate';
                var deferred = $q.defer();
                $http({method: 'PUT', url: apiUrl, params: {id: digestId}, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            return apiDataService;
        }])
	.factory("apiPinCommunity", ['$http', 'Config', '$q', function($http, Config, $q){
            var apiDataService = {};
            apiDataService.filteredContentsOnPinnedCommunity = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/pin-community/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.getById = function(id){
                var deferred = $q.defer();
                var apiUrl = '/api/pin-community';
                $http({method: 'GET', url: apiUrl, params: {id: id}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
         	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
         	 	});
                return deferred.promise;
            };
            apiDataService.create = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/pin-community';
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
         	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
         	 	});
                return deferred.promise;
            };
            apiDataService.getPinnedCommunityTabs = function(parameter){
                var deferred = $q.defer();
                var apiUrl = '/api/pin-community/tab/list';
                $http({method: 'GET', url: apiUrl, params: parameter, cache: false}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            return apiDataService;
        }])
	.factory("apiTermsOfUse", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
        	apiDataService.check = function(param){
        		var deferred = $q.defer();
        		var apiUrl = '/api/termsOfUse/check';
        		$http({method: 'GET', url: apiUrl,params: param}).
                then(function onSuccess(response) {
                    var data = response.data;
        			deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
        			deferred.reject(data);
        		});

        		return deferred.promise;
        	};
        	apiDataService.sign = function(data){
                var deferred = $q.defer();
                var apiUrl = '/api/termsOfUse/sign';
                $http({method: 'POST', url: apiUrl,data: data}).
                then(function onSuccess(response) {
                	var data = response.data;
                	deferred.resolve(data);
                }, function onError(response) {
                	var data = response.data;
                	deferred.reject(data);
                });

                return deferred.promise;
            };
        	return apiDataService;
        }])
        .factory("apiFileExternalSource", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
        	apiDataService.getExternalSourceByName = function(param){
        		var deferred = $q.defer();
        		var apiUrl = '/api/file/externalSource';
        		$http({method: 'GET', url: apiUrl,params: param}).
                then(function onSuccess(response) {
                    var data = response.data;
        			deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
        			deferred.reject(data);
        		});

        		return deferred.promise;
        	};
        	return apiDataService;
        }])
        .factory("apiPinnedPostOfUser", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
        	apiDataService.getPinnedPostsOfUser = function(param){
        		var deferred = $q.defer();
        		var apiUrl = '/api/user/pinned-post/list';
        		$http({method: 'GET', url: apiUrl,params: param}).
                then(function onSuccess(response) {
                    var data = response.data;
        			deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
        			deferred.reject(data);
        		});

        		return deferred.promise;
        	};
        	apiDataService.create = function(data){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post';
                $http({method: 'POST', url: apiUrl,data: data}).
                then(function onSuccess(response) {
                	var data = response.data;
                	deferred.resolve(data);
                }, function onError(response) {
                	var data = response.data;
                	deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.edit = function(postId,postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post';
                var deferred = $q.defer();
                $http({method: 'PUT', url: apiUrl, params: {id: postId}, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.copy = function(postId){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post/copy';
                var deferred = $q.defer();
                $http({method: 'PUT', url: apiUrl, params: {id: postId}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.getById = function(id){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post';
                $http({method: 'GET', url: apiUrl, params: {id: id}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
         	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
         	 	});
                return deferred.promise;
            };
            apiDataService.deleteById = function(id){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: {id: id}, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.getPinTypes = function(){
                var deferred = $q.defer();
                var apiUrl = '/api/user/pinned-post/type';
                $http({method: 'GET', url: apiUrl}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
         	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
         	 	});
                return deferred.promise;
            };
        	return apiDataService;
        }])
        .factory("apiUserSpeciality", ['$http', 'Config', '$q', function($http, Config, $q){
        	var apiDataService = {};
        	apiDataService.getUserSpecialities = function(param){
        		var deferred = $q.defer();
        		var apiUrl = '/api/user/speciality/list';
        		$http({method: 'GET', url: apiUrl,params: param}).
                then(function onSuccess(response) {
                    var data = response.data;
        			deferred.resolve(data);
                }, function onError(response) {
                    var data = response.data;
        			deferred.reject(data);
        		});

        		return deferred.promise;
        	};
        	apiDataService.create = function(data){
                var deferred = $q.defer();
                var apiUrl = '/api/user/speciality';
                $http({method: 'POST', url: apiUrl,data: data}).
                then(function onSuccess(response) {
                	var data = response.data;
                	deferred.resolve(data);
                }, function onError(response) {
                	var data = response.data;
                	deferred.reject(data);
                });

                return deferred.promise;
            };
            apiDataService.edit = function(postId,postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/user/speciality';
                $http({method: 'PUT', url: apiUrl, params: {id: postId}, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.order = function(postdata){
                var deferred = $q.defer();
                var apiUrl = '/api/user/speciality/order';
                var deferred = $q.defer();
                $http({method: 'POST', url: apiUrl, data: postdata}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
            apiDataService.getById = function(id){
                var deferred = $q.defer();
                var apiUrl = '/api/user/speciality';
                $http({method: 'GET', url: apiUrl, params: {id: id}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
         	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
         	 	});
                return deferred.promise;
            };
            apiDataService.deleteById = function(id){
                var deferred = $q.defer();
                var apiUrl = '/api/user/speciality';
                var deferred = $q.defer();
                $http({method: 'DELETE', url: apiUrl, params: {id: id}, headers: {'Content-Type': 'application/json'}}).
                then(function onSuccess(response) {
	           		 var data = response.data;
	           		 deferred.resolve(data);
          	 	}, function onError(response) {
	           		 var data = response.data;
	           		 deferred.reject(data);
          	 	});
                return deferred.promise;
            };
        	return apiDataService;
        }]);
