'use strict';
angular.module('inspherisProjectApp')
.controller('DigestCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,createDigestModal,notifyModal,confirmModal,uiModals,apiDigest,digestPreview){

	$scope.digests = [];
	$scope.page = 1;
    $scope.itemsPerPage = 20;
    $scope.sortKey = "";
    $scope.sortField = "";
	
    $scope.gridDigests = {
    		paginationPageSizes: [20, 30, 50, 70, 100],
            paginationPageSize: 20,
            minRowsToShow: 20,
            showGridFooter: true,
            useExternalPagination: true,
            useExternalSorting: true,
            enableSorting: true,
            columnDefs: [
                {name: $filter('translate')('#'),width: 40, headerTooltip: $filter('translate')('#'), cellTemplate:'<span>&nbsp; {{rowRenderIndex+1}}</span>', enableColumnMenu: false,enableSorting: false},
                {name: $filter('translate')('Past Digest'),width: '35%', field: 'title', headerTooltip: $filter('translate')('Past Digest'), cellTemplate: "<a ng-click='grid.appScope.editDigest(row.entity)'>&nbsp; {{row.entity.title}}</a>", enableColumnMenu: false},
                {name: $filter('translate')('Communities'),width: '30%', field: 'communities', headerTooltip: $filter('translate')('Communities'), cellTemplate:'<p>&nbsp; {{grid.appScope.showCommunityLabels(row.entity.communities)}}</p>', enableColumnMenu: false,enableSorting: false},
                {name: $filter('translate')('Status'),width: 75, field: 'status', headerTooltip: $filter('translate')('Status'), cellTemplate:'<a ng-click="grid.appScope.viewPreview(row.entity.id)">&nbsp; {{row.entity.status | translate}}</a>', enableColumnMenu: false},
                {name: $filter('translate')('Published Date'),width: 150, field: 'publishedDate', headerTooltip: $filter('translate')('Published Date'), cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.publishedDate,"full")}}</p>', enableColumnMenu: false},  
                {name: $filter('translate')('Type'),width: 75, field: 'digestType', headerTooltip: $filter('translate')('Type'), enableColumnMenu: false},
                {name: $filter('translate')('Repeat'),width: 98, field: 'details.repeatDigest', headerTooltip: $filter('translate')('Repeat'), cellTemplate:'<p>&nbsp; {{row.entity.details.repeatDigest | translate}}</p>', enableColumnMenu: false,enableSorting: false},
                {name: $filter('translate')('Day'),width: 75, field: 'details.days', headerTooltip: $filter('translate')('Day'), cellTemplate:'<p ng-if="row.entity.digestType == \'Automatic\'">&nbsp; {{grid.appScope.showDayByRepeat(row.entity.details.repeatDigest,row.entity.details.days)}}</p>', enableColumnMenu: false,enableSorting: false},
                {name: $filter('translate')('Content Type'),width: 150, field: 'details.digestContentType', headerTooltip: $filter('translate')('Content Type'), cellTemplate:'<p>&nbsp; {{row.entity.details.digestContentType | translate}}</p>', enableColumnMenu: false,enableSorting: false},
                {name: $filter('translate')('Start Date'),width: 100, field: 'details.startDate', headerTooltip: $filter('translate')('Start Date'), cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.details.startDate,"simple")}}</p>', enableColumnMenu: false,enableSorting: false},  
                {name: $filter('translate')('End Date'),width: 100, field: 'details.endDate', headerTooltip: $filter('translate')('End Date'), cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.details.endDate,"simple")}}</p>', enableColumnMenu: false,enableSorting: false},  
                {name: $filter('translate')('Active/Deactive'),width: 98, field: 'active', headerTooltip: $filter('translate')('Active/Deactive'), cellTemplate:'<p ng-if="row.entity.active">&nbsp; {{\'Active\' | translate}}</p><p ng-if="!row.entity.active">&nbsp; {{\'Deactive\' | translate}}</p>', enableColumnMenu: false},
                {name: $filter('translate')('Edit'),width: 60, enableColumnMenu: false, cellTemplate: '<div ng-if="row.entity.status != \'Publish\'" class="btn_edit" title="{{grid.appScope.tranlateWord(\'' + 'edit' + '\')}}"  ng-click="grid.appScope.editDigest(row.entity)"><div class="btn_icon"><i class="fa fa-pencil-square-o"></i></div></div>&nbsp; '
                            + '<div class="btn_delete" style="float: right;" title="{{grid.appScope.tranlateWord(\'' + 'delete' + '\')}}" ng-click="grid.appScope.deleteDigest(row.entity.id)"><div class="btn_icon"><i class="fa fa-trash-o"></i></div></div>',
                    enableSorting: false
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length != 0) {
                        $scope.sortKey = sortColumns[0].sort.direction;
                        $scope.sortField = sortColumns[0].field;
                    }

                    $scope.loadDigests();
                });

                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    $scope.page = newPage;
                    $scope.itemsPerPage = pageSize;
                    $scope.loadDigests();
                });
            }
    };
    
	//load all digest
	$scope.loadDigests = function(){
		apiDigest.allDigests({format : 'list',communityUid : $stateParams.commuid,page: $scope.page, size: $scope.itemsPerPage, sortKey: $scope.sortKey, sortField: $scope.sortField}).then(function(data){
            $scope.gridDigests.data = data.rows;
            $scope.gridDigests.totalItems = data.total;
		}, function(err){
			 notifyModal.showTranslated('something_went_wrong', 'error', null);
		});
	}
	
	$scope.loadDigests();
	
	// create digest
	$scope.createDigest = function(){
		var modal = createDigestModal.show(null, {action: 'create', type: 'digest', data: null});
		modal.closePromise.then(function (data){
	          if(data.value.flag == 'ok'){
	        	  //reset Page
	        	  $scope.loadDigests();
	          }
		});	
	};

	//edit digest
	$scope.editDigest = function(digest){
		createDigestModal.show(null, {action: 'edit', type: 'digest', data: digest});
	};

	// Activate digest
	$scope.activeDigest = function (digestId, $event) {
		var modal = confirmModal.showTranslated($scope, {title: "Activate", message: "activate_digest_confirm"});
        modal.closePromise.then(function (data) {
        	if(data.value == 'ok'){
        		var active = 'N';
                if ($event.target.checked) {
                	active = 'Y';
                }
                
                apiDigest.activate(digestId,active).then(function(data){
                	if(typeof(data.code) != 'undefined' && data.code != null){
                		var message= $filter('translate')(data.message);
                		var title = $filter('translate')('Error');
                		uiModals.alertModal(null,title, message);
                	}else{
                		notifyModal.showTranslated('Activated successfully', 'success', null);
                	}    
            	}, function(err){
            		 notifyModal.showTranslated('something_went_wrong', 'error', null);
            	});          
            }
        });
		
    };
    
	//delete digest
    $scope.deleteDigest = function(digestId){
    	var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_digest_confirm"});
        modal.closePromise.then(function (data) {
        	if(data.value == 'ok'){
        		apiDigest.delete({id: digestId}).then(function(data){
                    if(typeof(data.code) != 'undefined' && data.code != null){
                		var message= $filter('translate')(data.message);
                		var title = $filter('translate')('Error');
                		uiModals.alertModal(null,title, message);
                	}else{
//                		var len = $scope.digests.length;
//                        for(var i= 0; i<len; i++){
//                          if($scope.digests[i].id == digestId){
//                            $scope.digests.splice(i,1);
//                            break;
//                          }
//                        }
                		 //reset Page
      	        	  	$scope.loadDigests();
                        notifyModal.showTranslated('Deleted_successfully', 'success', null);
                	}    
                    
                }, function(err){
                	notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            }
        });
    };
      
    $scope.viewPreview = function(digestId){
    	var modal = digestPreview.show(null, {action: 'view', type: 'digest', data: digestId});
    };
    
	$scope.showCommunityLabels = function(communities){
		var labels = '';
		if(communities && communities.length > 0){
			angular.forEach(communities, function (val, key) {
				labels += val.label;
				if(key < communities.length -1){
					labels += " , ";
				}
            });
		}
		return labels;
	};
	
	// show date by format
	$scope.showDate = function(date,format){
		return $filter('date')(date,format === "full" ? $rootScope.fullDateFormat : $rootScope.customDateFormat);
	};
	
	// show day
	$scope.showDayByRepeat = function(repeat,days){
		var res = '';
		if(repeat == 'DayOfWeek'){
			if(days[0] == '"1"'){
				res = $filter('translate')('Sunday');
			}else if(days[0] == '"2"'){
				res = $filter('translate')('Monday');
			}else if(days[0] == '"3"'){
				res = $filter('translate')('Tuesday');
			}else if(days[0] == '"4"'){
				res = $filter('translate')('Wednesday');
			}else if(days[0] == '"5"'){
				res = $filter('translate')('Thursday');
			}else if(days[0] == '"6"'){
				res = $filter('translate')('Friday');
			}else if(days[0] == '"7"'){
				res = $filter('translate')('Saturday');
			}
		}else if(repeat == 'DayOfMonth'){
			res = days[0].replace("\"","").replace("\"","");
		}
		return res;
	};
 })
 .controller('CreateDigestCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$q,$stateParams,notifyModal, uiModals, selectCommunityModal, confirmModal, cropImagesModal, sharedData, digestChooseContent,dateTimeService,apiDigest,apiCommunity,apiFeedData){
	 
	 $scope.selectedDisplay = {value:"Template1"};
	 $scope.displaySelection = [];
	 $scope.viewType = {value:"Template1"};
	 
	 $scope.feeds = [];
	 $scope.reviewPanel = true;
	 $scope.publishDates = {
			 startDt: null,
			 startTime: null
	 };
	 $scope.publishStartDt = '';
	 $scope.publishStartTime = '';
	 $scope.digestTitle = '';
	 $scope.emailSubject = '';
	 $scope.isDigestActive = true;
	 $scope.modalData = $scope.$parent.ngDialogData;
	 
	 $scope.selectedCommunityUids = [];
	 $scope.ctyTabUids = [];
	 
	 $scope.communities = [];
	 $scope.communityTabs = [];
	 $scope.headerImg = null;
	 
	 $scope.digest = {} // For live-preview
	 $scope.digest.sendDate = new Date(); 
	 $scope.digest.communities = [];
	 $scope.digest.title = "";
	 $scope.digest.emailSubject = "";
	 $scope.isSchedule = false;
	 
	 $scope.selectedDisplay = {value:"Template1"};
	 $scope.displaySelection = [];
	 $scope.viewType = {value:"Template1"};
	 
	 $scope.selectedType= {value:"Custom"};
	 $scope.typeSelection = [];
	 
	 $scope.selectedRepeat= {value:"Daily"};
	 $scope.repeatSelection = [];
	 
	 $scope.selectedDigestContentType= {value:"AllNewPosts"};
	 $scope.digestContentTypeSelection = [];
	 
	 // For multiple communities
	 $scope.selectedCommunities = [];
	 $scope.selectedCommLabel = 'Community name/Category name';	
	 $scope.selectedTabsLabel = $filter('translate')("select_community_tab");
	 
	 $scope.repeatDaySelection = [];
	 $scope.selectedRepeatDay = null;
	 $scope.daysOfWeek = [{name : "Sunday" , value : "\"1\""},{name : "Monday" , value : "\"2\""},
	                      {name : "Tuesday" , value : "\"3\""},{name : "Wednesday" , value : "\"4\""},
	                      {name : "Thursday" , value : "\"5\""},{name : "Friday" , value : "\"6\""},
	                      {name : "Saturday" , value : "\"7\""}];
	 
	 $scope.latestDateOfCurrentMonth = (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).getDate();
	 $scope.daysOfMonth = [];
	 for(var i=0 ; i< $scope.latestDateOfCurrentMonth; i++){
		 $scope.daysOfMonth.push({name:(i+1) , value: "\""+ (i+1) + "\""});
	 };
	 
	 $scope.postDates = {
	    		startDt: null,
	    		endDt: null
	 };
	 $scope.getPostStartEndDate = function(stDt, endDt){
		 var errorData = {
				 flag: false,
				 message: ''
		 };
		  
		 var publishStartDateTime = null;
		 if(stDt){
			 var stTime = new Date("January 01, 1970 00:00:00");
			 publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
		 }else{
			 errorData.flag = true;
			 errorData.message = 'select_publish_start_date';
		 }
			 
		 var publishEndDateTime = null;
		 if(endDt){
			 var endTime = new Date("January 01, 1970 00:00:00");
			 publishEndDateTime = dateTimeService.dateTimeToMsec(endDt, endTime);
		 }
		      
		 if(endDt){
			 if(publishEndDateTime <= publishStartDateTime){
				 errorData.flag = true;
				 errorData.message = 'publish_end_date_should_greater_than_start_date';
			 }
		 }
		 return ({startDtTime: publishStartDateTime, endDtTime: publishEndDateTime, error: errorData});	
	 };
	 
	 //Automatic digest : get contents by content type
	 $scope.getFeedsByContentType = function(page){			
		 var params = {
				 page : page,
				 communityUids : $scope.selectedCommunityUids,
				 tabUids : $scope.ctyTabUids,
				 type : $scope.selectedDigestContentType.value
		 };
		 
		 if(params.communityUids.length > 0){
			 apiFeedData.getContentsByDigestContentType(params).then(function(data){
				 if(data){
					 $scope.feeds = data;
				 }
			 }, function(err){
			 });
		 }	
	 };
	 
	 $scope.logoImageSelect = function($files, $event){
		 if($files.length > 0){
			 if($files[0].size > 5242880){ 
				 var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
				 modal.closePromise.then(function (data) {
					 if(data.value == 'ok'){
						 $scope.uploadLogoImageSelect($files);
					 }
				 });
			 }else{
				 $scope.uploadLogoImageSelect($files);
			 }
		 }
	 }
	 
	 $scope.uploadLogoImageSelect = function($files){
		 var tempdata = {};
		 if($files){
			 tempdata = {
					 action: 'crop',
					 files: $files,
					 cdimentions: [{w: 600, h: 182}],
					 resize: true
			 }
		 }
		 var modal = cropImagesModal.show(tempdata);
		 modal.closePromise.then(function (data){
			 if(data.value.flag == 'ok'){
				 $scope.headerImg = null;
				 $timeout(function(){
					 $scope.headerImg = data.value.cropdata.data;
					 $scope.digest.headerImageUrl = $scope.headerImg.urls[1];
				 });
	         	}
	      	});
	 }
	    
	 $scope.initializeData = function(){
		 var deferred = $q.defer();
		 var pr0 = apiDigest.getTemplates();
		 var pr1 = apiDigest.types();
		 var pr2 = apiDigest.getRepeatTypes();
		 var pr3 = apiDigest.getContentTypesOfDigest();
		 $q.all([pr0,pr1,pr2,pr3]).then(function(data){
	          //for data[0] -- template
			 angular.forEach(data[0], function(val, key){
				 $scope.displaySelection.push({
					 value: val
				 });
	          });
			 
			 //for data[1] -- digest type
			 angular.forEach(data[1], function(val, key){
				 $scope.typeSelection.push({
					 value: val
				 });
	          });
			 
			 //for data[2] -- repeat
			 angular.forEach(data[2], function(val, key){
				 $scope.repeatSelection.push({
					 value: val
				 });
	          });
			 
			 //for data[3] -- content type
			 angular.forEach(data[3], function(val, key){
				 $scope.digestContentTypeSelection.push({
					 value: val
				 });
	          });
			 		
	          deferred.resolve("success");
		 }, function(err){
			 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 deferred.resolve("error");
		 });
		 return deferred.promise;
	 };
	 
	 $scope.initializeData().then(function(msg){
		 if(($scope.modalData.action == 'edit') && ($scope.modalData.data.id)){
			 apiDigest.getById($scope.modalData.data.id).then(function(data){
				 $scope.digestTitle = data.title;
				 $scope.digest.title = data.title;
				 $scope.emailSubject = data.emailSubject;
				 $scope.digest.emailSubject = data.emailSubject;
				 $scope.isDigestActive = data.active;
				 $scope.isSchedule = data.isSchedule;
				 //show popup with preselected display
				 var allDigestLen = $scope.displaySelection.length;
				 for(var i=0; i<allDigestLen; i++){
					 if($scope.displaySelection[i].value == data.digestDesign){
						 $scope.selectedDisplay = $scope.displaySelection[i];
						 $scope.viewType = $scope.displaySelection[i].value;
						 break;
					 }
	             }
				 
				 //show popup with preselected type
				 var allDigestTypeLen = $scope.typeSelection.length;
				 for(var i=0; i<allDigestTypeLen; i++){
					 if($scope.typeSelection[i].value == data.digestType){
						 $scope.selectedType = $scope.typeSelection[i];
						 break;
					 }
	             }
				 
				 if(data.digestType == 'Automatic' && data.details){
					 //show popup with preselected repeat
					 var allDigestRepeatLen = $scope.repeatSelection.length;
					 for(var i=0; i<allDigestRepeatLen; i++){
						 if($scope.repeatSelection[i].value == data.details.repeatDigest){
							 $scope.selectedRepeat = $scope.repeatSelection[i];
							 break;
						 }
		             }
					 
					 //show popup with preselected day
					 if(data.details.repeatDigest == 'DayOfWeek' || data.details.repeatDigest == 'DayOfMonth'){
						 $scope.repeatDaySelection = data.details.repeatDigest == 'DayOfWeek' ? $scope.daysOfWeek : $scope.daysOfMonth;
						 var allDigestRepeatDayLen = $scope.repeatDaySelection.length;
						 for(var i=0; i<allDigestRepeatDayLen; i++){
							 if($scope.repeatDaySelection[i].value == data.details.days[0]){
								 $scope.selectedRepeatDay = $scope.repeatDaySelection[i];
								 break;
							 }
			             }
					 }
					 
					 //show popup with preselected content type
					 var allDigestContentTypeLen = $scope.digestContentTypeSelection.length;
					 for(var i=0; i<allDigestContentTypeLen; i++){
						 if($scope.digestContentTypeSelection[i].value == data.details.digestContentType){
							 $scope.selectedDigestContentType = $scope.digestContentTypeSelection[i];		
							 break;
						 }
		             }
					 
					 //load start date
					 if(data.details.startDate){
						 $scope.postDates.startDt = ($filter('newDate')(data.details.startDate)).getTime();
					 }
					 
					 //load end date
					 if(data.details.endDate){
						 $scope.postDates.endDt = ($filter('newDate')(data.details.endDate)).getTime();
					 }
				 }
	
				 //using for multiple communities
				 if(data.communities){
					 //show popup with preselected community
					 $scope.communities = data.communities;
					 $scope.digest.communities = data.communities;
					 for(var i=0 ; i < data.communities.length ; i++){
						 $scope.selectedCommunityUids.push(data.communities[i].uid);
					 }	
					 
					 if(data.digestType == 'Automatic'){
						 //show popup with preselected community
						 $scope.selectedCommunities = data.communities;
						 $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
					 }
				 }
				 
				 //using for multiple community tabs 
				 var communityTabUids = [];
				 if(data.communityTabs && data.communityTabs.length > 0){
					 for(var i=0 ; i < data.communityTabs.length ; i++){
						 communityTabUids.push(data.communityTabs[i].uid);
					 }
					 $scope.communityTabs = communityTabUids;
					 
					 if(data.digestType == 'Automatic'){
						 $scope.communityForTabsSelection = sharedData.communityTabPublicSelectionData($scope.selectedCommunities);
						 angular.forEach($scope.communityForTabsSelection, function (val, key) {
							 angular.forEach(val.tabs, function (tb, i) {
								 tb.selected = false;
								 if(communityTabUids.indexOf(tb.uid) > -1) {
									 tb.selected = true;
								 }
							 });
						 });
						 
						 if(communityTabUids.length > 0){
							 $scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
							 $scope.selectedTabsLabel +=  " (" + communityTabUids.length + ")";
						 }
						 $scope.ctyTabUids = communityTabUids;
						 
						 //load feeds
						 $scope.getFeedsByContentType(1);
					 }
				 }
				 
				 if(data.digestType == 'Custom'){
					 //load send date
					 if(data.sendDate){
						 $scope.publishDates.startDt = ($filter('newDate')(data.sendDate)).getTime();
						 $scope.publishDates.startTime = $filter('newDate')(data.sendDate);
						 
						 $scope.digest.sendDate =  ($filter('newDate')(data.sendDate)).getTime();
					 }
					 
					 $scope.feeds = data.contents;
				 }
				 
				 //load header image
				 if(data.headerImageUid && data.originalHeaderImageUrl){
					 $scope.headerImg = {
							 uid: data.headerImageUid,
							 urls: [
							        data.originalHeaderImageUrl,
							        data.headerImageUrl,
							        data.thumbHeaderImageUrl
							        ]
					 };
					 $scope.digest.headerImageUrl =  data.headerImageUrl;
				 }
	              
			 }, function(err){
				 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 });
		 }//if action == edit

	 	}, function(errmsg){

	 	});
	 
	 
	    
	    //Choose content for digest	    
	    $scope.chooseContent = function(){
	    	
	    	var actionModal = $scope.modalData.action;
	    	var filters = {};
	    	
	        filters.contents = $scope.feeds;
	    	
	    	var modalContent = digestChooseContent.show(null, {action: actionModal, type: 'chooseContent', data: filters, communities : $scope.communities, communityTabs:  $scope.communityTabs});
	    	modalContent.closePromise.then(function (data){
		          if(data.value.flag == 'ok'){
		        	  $scope.feeds = data.value.data;
		        	  $scope.selectedCommunityUids = data.value.comUIds;
		        	  $scope.ctyTabUids = data.value.tabUids;
		        	  
		        	  //for prepare popup-Choose content
		        	  $scope.communities = data.value.communities;
		        	  $scope.communityTabs = data.value.tabUids;
		        	  $scope.digest.communities = data.value.communities;
		        	  $scope.viewType = $scope.selectedDisplay.value;
		          }
	    	});
		};
		
		//Select multiple communities
		$scope.selectCommunity = function(){
			$scope.selectedCommunityUids = [];
			$scope.ctyTabUids = [];
			var selectedCommunities = [];
			var array = [];
			for(var i = 0 ; i < $scope.selectedCommunities.length ; i++){
				if(array.indexOf($scope.selectedCommunities[i].label) === -1){
					array.push($scope.selectedCommunities[i].label);
					selectedCommunities.push($scope.selectedCommunities[i]);
				}
			}
			var modal = selectCommunityModal.show({data: selectedCommunities, comType: 'private'});
			modal.closePromise.then(function (data){
				if(data.value.flag == 'ok'){
					$scope.selectedCommunities = data.value.data;
					angular.forEach($scope.selectedCommunities, function (cty, i) {
						$scope.selectedCommunityUids.push(cty.uid);
	   			 	});
					
		            $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
		            $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, 'all');
		            angular.forEach($scope.communityForTabsSelection, function (val, key) {
		            	angular.forEach(val.tabs, function (tb, i) {
		   					 tb.selected = true;
		   					 $scope.ctyTabUids.push(tb.uid);
		   			 	});
		   		 	});
		            
		            if($scope.ctyTabUids.length > 0){
				    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
				        $scope.selectedTabsLabel +=  " (" + $scope.ctyTabUids.length + ")";
		            }	
		            
		            //load feeds
		            $scope.feeds = [];
		            $scope.getFeedsByContentType(1);
				}
			});		        
		};
		  	
		//Event for Stoppaging click
		$scope.stopPropagation = function(event){
			$scope.ctyTabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
			if($scope.ctyTabUids.length > 0){
				$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
				$scope.selectedTabsLabel +=  " (" + $scope.ctyTabUids.length + ")";
			}else{
				$scope.selectedTabsLabel = $filter('translate')("select_community_tab");
			};
			if(event.timeStamp == 0){
				//load feeds
				$scope.getFeedsByContentType(1);
			}			    
			event.stopPropagation();
		
		};
		
		$scope.selectDigestRepeat = function(selected){
			$scope.selectedRepeat = selected;
			if(selected.value == "DayOfWeek" || selected.value == "DayOfMonth"){
				if(selected.value == "DayOfWeek"){
					$scope.repeatDaySelection = $scope.daysOfWeek;
				}else if(selected.value == "DayOfMonth"){
					$scope.repeatDaySelection = $scope.daysOfMonth;
				}
				$scope.selectedRepeatDay = $scope.repeatDaySelection[0];
			}
		};
		
		$scope.selectDigestContentType = function(selected){
			$scope.selectedDigestContentType = selected;
			if($scope.ctyTabUids.length > 0){
				//load feeds
				$scope.getFeedsByContentType(1);
			}
		};
		
		$scope.selectDigestType = function(selected){
			var oldSelectedType = $scope.selectedType;
			$scope.selectedType = selected;
			if(selected.value == 'Automatic'){
				$scope.viewType = $scope.selectedDisplay.value;
			}
			
			if($scope.modalData.action == 'edit'){
				var modal = confirmModal.showTranslated($scope, {title: "Warning", message: "change_digest_type_confirm"});
		        modal.closePromise.then(function (data) {
		        	if(data.value == 'ok'){
		    			if(selected.value == 'Automatic'){
		    				$scope.feeds = [];		    				
		    			}
		            }else{
		            	$scope.selectedType = oldSelectedType;
		            }
		        });
			}
		};
		
		$scope.selectDigestRepeatDay = function(selected){
			$scope.selectedRepeatDay = selected;
		};
		
		//get publish date
	    $scope.getPublishStart = function(stDt, stTime){
	    	var errorData = {
	    			flag: false,
	    			message: ''
	    	};
	    	var publishStartDateTime = null;
	    	if(stDt && stTime){
	          publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
	        }
	    	
	        //for error handling
	    	if(stDt){
	        	if(!stTime){
	        		errorData.flag = true;
	        		errorData.message = 'select_publish_start_time';
	        	}
	        }else if(stTime){
	        	if(!stDt){
	        		errorData.flag = true;
	        		errorData.message = 'select_publish_start_date';
	        	}
	        }
	        
	        if(stDt){
	        	var currentDateTime = Date.parse(new Date());
	        	if((publishStartDateTime <= currentDateTime) && ($scope.modalData.action == 'create')){
	        		errorData.flag = true;
	        		errorData.message = 'publish_start_date_should_greater_than_current_date';
	        	}
	        }
	        return ({startDtTime: publishStartDateTime, error: errorData});
	    };
	    
	    
		// save digest
		$scope.doneCreateDigest = function(status){
			var errorData = {
					false: false,
			        message: ''
			};
			
			var postdata = {
					title: $scope.digestTitle,
					active: $scope.isDigestActive,
					emailSubject: $scope.emailSubject,
					digestType: $scope.selectedType.value
			};
			
			if($scope.modalData.data && $scope.modalData.data.id){
				postdata.id = $scope.modalData.data.id;
			}
			
			postdata.status = status;

			
			if($scope.selectedDisplay.value == 'Choose Template Design'){
				errorData.flag = true;
		        errorData.message = 'Choose Template Design';
				
			}else{
		        postdata.digestDesign = $scope.selectedDisplay.value;
			}

			if($scope.selectedCommunityUids.length <= 0){
	      	  	errorData.flag = true;
	            errorData.message = "Select_Community";
	        }else{
	        	postdata.communityUids = $scope.selectedCommunityUids;
	        }
			
			if(postdata.title == ""){
				errorData.flag = true;
		        errorData.message = 'Enter_Title';
			}

			postdata.tabUids = $scope.ctyTabUids;
			
			if($scope.selectedType.value == 'Custom'){
				if($scope.feeds.length <= 0){
		      	  	errorData.flag = true;
		            errorData.message = "Select_Content";
		        }else{
		        	var selectedContentUids = [];
		        	for(var i=0 ; i < $scope.feeds.length ; i++){
		        		selectedContentUids.push($scope.feeds[i].uid);
		        	}
		        	postdata.contentUids = selectedContentUids;
		        }			
			
				postdata.isSchedule = $scope.isSchedule;
				if($scope.isSchedule == true){				
					if(!$scope.publishDates.startDt && !$scope.publishDates.startTime){
						errorData.flag = true;
			            errorData.message = "select_publish_start_date";
					}
					var publishTiming = $scope.getPublishStart($scope.publishDates.startDt, $scope.publishDates.startTime);
					if(publishTiming.error.flag){
				        errorData.flag = true;
				        errorData.message = publishTiming.error.message;
					}
					
					if(publishTiming.startDtTime){
						postdata.sendDate = publishTiming.startDtTime;
				    }
				}
			}else if($scope.selectedType.value == 'Automatic'){
				var details = {
						repeatDigest: $scope.selectedRepeat.value,
						digestContentType: $scope.selectedDigestContentType.value
				};
				
				if($scope.selectedRepeat.value == 'DayOfWeek' || $scope.selectedRepeat.value == 'DayOfMonth'){
					var days = [];
					days.push($scope.selectedRepeatDay.value);
					details.days = days;
				}
				
				var postTiming = $scope.getPostStartEndDate($scope.postDates.startDt, $scope.postDates.endDt);
				if(postTiming.error.flag){
					errorData.flag = true;
					errorData.message = postTiming.error.message;
				}
				
				if(postTiming.startDtTime){
					details.startDate = postTiming.startDtTime;
				}
					
				if(postTiming.endDtTime){
					details.endDate = postTiming.endDtTime;
				}
				
				postdata.automatedDigestDetails = details;
			}
			/*if($scope.headerImg){
				if($scope.headerImg.uid){
					postdata.headerImageUid = $scope.headerImg.uid;
				}
			}else{
				errorData.flag = true;
	            errorData.message = "Select_Images";
			}*/

	        if(!errorData.flag){
	            if(postdata.status == 'Publish'){
	            	
	            	var message = "send_immediate _digest_confirm";
	            	if(typeof(postdata.sendDate) != 'undefined'){
	            		message = "send_immediate _digest_confirm_time";
	            	}
	            	var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: message});
		            modal.closePromise.then(function (data) {
		                if(data.value == 'ok'){
		                	apiDigest.create(postdata).then(function(data){
				  	              $scope.closeThisDialog({flag: 'ok', data: data});
				  	              notifyModal.showTranslated('Digest created success', 'success', null);
				  	              $state.reload();
				  	            }, function(err){
				  	              notifyModal.showTranslated('something_went_wrong', 'error', null);
				  	            });
		                }
		            });
	            }else{
		            	apiDigest.create(postdata).then(function(data){
		  	              $scope.closeThisDialog({flag: 'ok', data: data});
		  	              var msg = '';
		  	              if(postdata.status == 'Scheduled'){
		  	            	msg = 'Digest scheduled success';
		  	              }else if(postdata.status == 'Preview' || postdata.status == 'Draft'){
		  	            	  msg = 'Digest saved success';
		  	              }
		  	              notifyModal.showTranslated(msg, 'success', null);
		  	              $state.reload();		  	            
		  	            }, function(err){
		  	              notifyModal.showTranslated('something_went_wrong', 'error', null);
		  	            });
	            }
	             
	            
	        }else{
	        	notifyModal.showTranslated(errorData.message, 'error', null);
	        }			
		};
		
		//Set Digest  Display Type
		$scope.selectDigestDisplay = function(selected){
			$scope.viewType = selected.value;
		};
		
		$scope.getTitle = function(title){
			 $scope.digest.title = $scope.digestTitle;
		}
		
		$scope.getEmailSubject = function(emailSubject){
			 $scope.digest.emailSubject = $scope.emailSubject;
		}


})
.controller('DigestChooseContentCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,$q, selectCommunityModal, sharedData, apiFeedData, apiDigest,apiCommunity){
	$scope.selectedContentType = {value:"All Types"};
	$scope.contentCollections = [{value:"All Types"},{value:"article"},{value:"document"},{value:"quickpost"},{value:"event"},{value:"imageGallery"}];
	$scope.feeds = [];
	$scope.reviewPanel = false;
	$scope.page = 1;
	$scope.itemsPerPage = 10;
	$scope.showViewMoreBtn = false;
	$scope.searchText = '';
	$scope.dateFrom =  null;
	$scope.dateTo = null;
	
	// For multiple communities
	$scope.selectedCommLabel = 'Community name/Category name';
	$scope.selectedCommunities = [];
	$scope.selectedCommunityUids = [];
	$scope.selectedTabsLabel = $filter('translate')("select_community_tab");
	$scope.tabUids = [];
	
	// For ONLY ONE community
	$scope.selectedCommUid = {
			text: "Select",
            uid: null
	};
	
	//get Data from pre modal
	$scope.modalData = $scope.$parent.ngDialogData;
	
	//Init Period
	$scope.period = "thisweek";
	$scope.selected = 2;
	$scope.preiodText = [
							{name : "today", value : "today"},
							{name : "yesterday" , value: "yesterday"},
							{name : "thisweek", value: "thisweek"},
							{name : "thismonth", value: "thismonth"},
							{name : "All", value: "sincebegining"}
	                     ];
	//for see all content last choose
	if($scope.modalData.communities && $scope.modalData.communities.length > 0){
		$scope.selected=4;
		$scope.period = $scope.preiodText[4].value;
	}
	
	$scope.select = function(index,period){
		$scope.selected=index;
		$scope.period = period.value;
		$scope.dateFrom = null;
		$scope.dateTo = null;
		$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
	};
	
	$scope.initializeData = function(){
		var deferred = $q.defer();
		var pr0 = apiCommunity.getCommunitiesData();
		 $q.all([pr0]).then(function(data){
			 // init in a community
			 if(typeof($stateParams.commuid) != 'undefined'){
				 apiCommunity.getCommunityByUid({uid: $stateParams.commuid}).then(function(data){
					 $scope.selectedCommunities.push(data);
					 $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
					 $scope.selectedCommUid = {
							 text: $scope.selectedCommunities[0].label,
			                 uid: $scope.selectedCommunities[0].uid,
			                 tabs : $scope.selectedCommunities[0].tabs
			         };
					 $scope.communityForTabsSelection = sharedData.communityTabPublicSelectionData($scope.selectedCommunities);
				 }, function(err){
				 });
			 }else{
				 //for data[0]
				 $scope.communityList = data[0];
				 //empty the array
				 $scope.ddSelectOptions = [];
				 $scope.communityList.forEach(function(entry){
					 if(entry.privated == 0){
						 var tempObj = {};
						 tempObj.text = entry.label;
						 tempObj.uid = entry.uid;
						 tempObj.tabs = entry.tabs;
						 $scope.ddSelectOptions.push(tempObj);
					 }
				 });
			 }			
	         deferred.resolve("success");
		 }, function(err){
			 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 deferred.resolve("error");
		 });
		 return deferred.promise;		
	 };
	 
	 $scope.initializeData().then(function(msg){
		 if($scope.modalData.communities){
			 $scope.selectedCommunities = $scope.modalData.communities;
			 //using for multiple communities
			 if($scope.modalData.action =='create' && $scope.modalData.communities.length <= 0){
					$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
			 }
			 if($scope.selectedCommunities && $scope.selectedCommunities.length > 0){
				 
				 //show popup with preselected community
				 $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
				 var comText = "";
				 if(typeof($scope.selectedCommunities[0].text) != 'undefined'){
					 comText = $scope.selectedCommunities[0].text;
				 }else{
					 comText = $scope.selectedCommunities[0].label;
				 }
				 $scope.selectedCommUid = {
						 text: comText,
		                 uid: $scope.selectedCommunities[0].uid,
		                 tabs : $scope.selectedCommunities[0].tabs
		         };
				 $scope.selectedCommunityUids = $scope.selectedCommunities[0].uid;
				 $scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
			 }
			 
			 //using for multiple community tabs 
			 var communityTabUids = $scope.modalData.communityTabs;

			 $scope.communityForTabsSelection = sharedData.communityTabPublicSelectionData($scope.selectedCommunities);
			 angular.forEach($scope.communityForTabsSelection, function (val, key) {
				 angular.forEach(val.tabs, function (tb, i) {
					 tb.selected = false;
					 if(communityTabUids.indexOf(tb.uid) > -1) {
						 tb.selected = true;
					 }
				 });
			 });
			 
			 if(communityTabUids.length > 0){
			    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
			        $scope.selectedTabsLabel +=  " (" + communityTabUids.length + ")";
			  }
		
		 }

	 	}, function(errmsg){

	 	});
	
	
	
	$scope.selectContentByType = function(selected){
		$scope.getFeedData($scope.period,selected,$scope.searchText,1);
	};
	
	$scope.searchByKeyWord = function(searchText){
		$scope.getFeedData($scope.period,$scope.selectedContentType,searchText,1);
	}
	
	//Try load Feed data
	$scope.getFeedData = function(period,type,searchText,page){
		
		$scope.selectedCommunityUids = [];
    	for(var i=0 ; i < $scope.selectedCommunities.length ; i++){
    		$scope.selectedCommunityUids.push($scope.selectedCommunities[i].uid);
    	}
		var params = {
				language : $rootScope.currentLanguage.code,
				page : page,
				communityUids : $scope.selectedCommunityUids,
				period : period,
				startDate : $scope.dateFrom,
				endDate:$scope.dateTo	
		};
		
		$scope.tabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
	    if($scope.tabUids != null && $scope.tabUids.length > 0){
	    	params.tabUids = $scope.tabUids;
	    }
	    
	    if(type.value != 'All Types'){
	    	params.type = type.value;
	    }
	    
	    if(searchText != ''){
	    	params.searchText = searchText;
	    }
	    

	    if(params.communityUids.length > 0){
	    	apiFeedData.getContentsByFilters(params).then(function(data){
				if(data){
					$scope.showViewMoreBtn = data.length < $scope.itemsPerPage ? false : true;
					if(page == 1){
						$scope.feeds = data;
					}else{
						$scope.feeds = $scope.feeds.concat(data);
					}
				}
			}, function(err){
			});
	    }
	    
		
	};
	
	
	
	//load more
	$scope.loadMoreFeed = function(){
		$scope.page++;
		$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,$scope.page);
	};
	$scope.contentSelection = [];
	
	//load contents for edit
	if($scope.modalData.data.contents != null){
		$scope.contentSelection = $scope.modalData.data.contents;
	}
	
	
	$scope.toggleContentSelection = function(content,event){
	      var len = $scope.contentSelection.length;
	      var flag = false;
	      if(len > 0){
	        for(var i=0; i< len; i++){
	          if(content.uid == $scope.contentSelection[i].uid){
	            $scope.contentSelection.splice(i, 1);
	            break;
	          }
	          else if(i == (len-1)){
	            $scope.contentSelection.push(content);
	          }
	        }
	      }
	      else{
	        $scope.contentSelection.push(content);
	      }
	      $scope.getCheckedStatus(content.uid);
	      event.stopPropagation();
	};
	
	$scope.getCheckedStatus = function(uid){
	      var len = $scope.contentSelection.length;
	      var flag = false;
	      for(var i=0; i< len; i++){
	        if(uid == $scope.contentSelection[i].uid){
	          flag = true;
	          break;
	        }
	      }
	      return flag;
	};
	
	//select ONLY ONE community
	$scope.commSelect = function(selected){
		var selectedCommunities = [];
		$scope.selectedCommunities = [];
		$scope.contentSelection = []; // reset content if re-choose com
		//clear tabs
		$scope.tabUids = [];
		$scope.selectedTabsLabel = $filter('translate')("select_community_tab");
		
		
		
		var array = [];
		for(var i = 0 ; i < $scope.selectedCommunities.length ; i++){
			if(array.indexOf($scope.selectedCommunities[i].label) === -1){
				array.push($scope.selectedCommunities[i].label);
				selectedCommunities.push($scope.selectedCommunities[i]);
			}
		}
		
		$scope.selectedCommunities.push(selected);
    	$scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
    	$scope.communityForTabsSelection = sharedData.communityTabPublicSelectionData($scope.selectedCommunities);
    	
    	
    	
    	//Make all tab default selected
		$scope.communityForTabsSelection = sharedData.communityTabPublicSelectionData($scope.selectedCommunities);
		 angular.forEach($scope.communityForTabsSelection, function (val, key) {
			 angular.forEach(val.tabs, function (tb, i) {
					 tb.selected = true;
					 $scope.tabUids.push(tb.uid);
			 });
		 });
		 if($scope.tabUids.length > 0){
		    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
		        $scope.selectedTabsLabel +=  " (" + $scope.tabUids.length + ")";
		  }	
		 
    	$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
        	
        	
    	
    	};
    
	//Select multiple communities
	 $scope.selectCommunity = function(){
	  	  var selectedCommunities = [];
	  	  var array = [];
	  	  for(var i = 0 ; i < $scope.selectedCommunities.length ; i++){
	  		  if(array.indexOf($scope.selectedCommunities[i].label) === -1){
	  			  array.push($scope.selectedCommunities[i].label);
	  			  selectedCommunities.push($scope.selectedCommunities[i]);
	  		  }
	  	  }
	      var modal = selectCommunityModal.show({data: selectedCommunities, comType: 'private'});
	        modal.closePromise.then(function (data){
	          if(data.value.flag == 'ok'){
	            $scope.selectedCommunities = data.value.data;
	            $scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
	            $scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, 'all');
	            angular.forEach($scope.communityForTabsSelection, function (val, key) {
	            	angular.forEach(val.tabs, function (tb, i) {
	   					 tb.selected = true;
	   					 $scope.tabUids.push(tb.uid);
	   			 	});
	   		 	});
	            
	            if($scope.tabUids.length > 0){
			    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
			        $scope.selectedTabsLabel +=  " (" + $scope.tabUids.length + ")";
	            }	
	            $scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
	          }
	        });
	        
	  	};
	  	
	  //Event for Stoppaging click
	  	$scope.stopPropagation = function(event){
	    	var tabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
		    if(tabUids.length > 0){
		    	$scope.selectedTabsLabel = $filter('translate')("The number of selected tags");
		        $scope.selectedTabsLabel +=  " (" + tabUids.length + ")";
		    }else{
		    	$scope.selectedTabsLabel = $filter('translate')("select_community_tab");
		    };
		    if(event.timeStamp == 0){
		    	$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
		    }
		    
	      event.stopPropagation();
	
	    };
	    
	    /*Select custom period*/
		$scope.selectPeriod = function(dateFrom, dateTo){
			$scope.selected=-1;
			$scope.dateFrom = dateFrom == null ? null : $filter('date')(dateFrom,'MM/dd/yyyy');
			$scope.dateTo = dateTo == null ? null : $filter('date')(dateTo,'MM/dd/yyyy');
			$scope.getFeedData($scope.period,$scope.selectedContentType,$scope.searchText,1);
		};
	    
	
})
.controller('DigestFeedCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,$translate){
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

	 $scope.artTitle = '';
	 $scope.artSubTitle = '';
	 $scope.artText = '';		    
	 $scope.mediaGalleryType = '';
	 $scope.mediaGalleryFiles = [];
	 $scope.actSentence = null;
	 $scope.headerImageColor = '';
	 $scope.gotFirstTextBlock = false;
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

	 $scope.generateActSentence = function(argument) {
		 if($scope.feed.community){
			 var lastAction =  "create";
			 var userdetail = $scope.feed.author;
    
			 $scope.activityGenerator.username = userdetail.firstName+" "+userdetail.lastName;

			 $scope.activityGenerator.community = $scope.feed.community.label;

			 switch(lastAction){
			 	case 'create':
			 		$translate('user_published_type_in_community', $scope.activityGenerator).then(function (translation) {
			 			$scope.actSentence = translation;                
			 		});
			 		break;		           
			 	}
		 	}	
	 };
		 
	 $scope.generateActSentence();

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
				 			$scope.artTitle = $filter('highlight')(val.title, $rootScope.highlightText);
				 		}
			                
				 		if(typeof(val.subTitle) != 'undefined'){
				 			$scope.artSubTitle = $filter('highlight')(val.subTitle, $rootScope.highlightText);
				 		}
				 		break;
				 	case 'richText':
				 		if(!$scope.gotFirstTextBlock){
				 			$scope.artText = $filter('highlight')(val.content, $rootScope.highlightText);
				 			$scope.gotFirstTextBlock = true;
				 		}
				 		break;
				 	case 'text':
				 		if(!$scope.gotFirstTextBlock){
				 			$scope.artText = $filter('highlight')(val.title, $rootScope.highlightText);
				 			$scope.gotFirstTextBlock = true;
				 		}
				 		break;
				 	case 'ImageGallery':
				 	case 'imageGallery':
				 		if(($scope.feed.type == 'quickpost') || ($scope.feed.type == 'imageGallery')){
				 			$scope.mediaGalleryType = 'imageGallery';
				 			$scope.mediaGalleryFiles = val.images;            
				 		}
				 		break;
				 	case 'documentGallery':
				 		if($scope.feed.type == 'document' || $scope.feed.type == 'quickpost'){
				 			$scope.mediaGalleryType = 'documentGallery';
				 			$scope.mediaGalleryFiles = val.documents;
				 		}
				 		break;
				 	case 'videoGallery':
				 		if($scope.feed.type == 'quickpost'){
				 			$scope.mediaGalleryType = 'videoGallery';
				 			$scope.mediaGalleryFiles = val.videos;
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
 	})
 .controller('AllDigestCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,$state,$location,apiDigest,uiModals){
	$scope.feeds = [];
	$scope.viewType = '';
	$scope.digest = null;
	
	//Try load Feed data
	$scope.getContentsOfDigest = function(digestId){
		     if(digestId == ''){
		    	 $scope.viewType = "allDigest";
		    	 apiDigest.filteredDigestd({userUid : $rootScope.userData.uid}).then(function(data){
		         	$scope.digests = data;
		         }, function(err){
		         });
		     }else{
		    	 apiDigest.getById(digestId).then(function(data){
		    		 if(typeof(data.code) != 'undefined' && data.code != null){
		    			 var message= $filter('translate')(data.message);
		    			 var title = $filter('translate')('Error');
		    			 uiModals.alertModal(null,title, message);
		    		 }else{
		    			 $scope.digest = data;
			             if($scope.digest.contents){
			            	 $scope.feeds = $scope.feeds.concat($scope.digest.contents);
			            	 $scope.viewType = $scope.digest.digestDesign;
			             }
		    		 }     			        	
		    	 }, function(err){
		    	 });
		     } 
	};
	$scope.getContentsOfDigest($stateParams.id);
	
	$scope.seeFull = function(){
		$state.go('app.digest', {id: ''});
	}
	
	$scope.showDigest = function(digestId){
		$state.go('app.digest', {id: digestId});
	}
	
 })
  .controller('DigestPreviewCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,$state,$location,apiDigest,notifyModal){
	  
	  $scope.digest = null // For live-preview
	  $scope.feeds = [];
	  $scope.viewType = "";
	  $scope.modalData = $scope.$parent.ngDialogData;
	  
	  $scope.initializeData = function(){
			 if(($scope.modalData.data)){
				 apiDigest.getById($scope.modalData.data).then(function(data){
					 //$scope.digest.title = data.title;
					  $scope.digest = data;
					  $scope.feeds = data.contents;
					  $scope.viewType = data.digestDesign;
		              
				 }, function(err){
					 notifyModal.showTranslated('something_went_wrong', 'error', null);
				 });
			 }
		 };
		 
 $scope.initializeData();

 });