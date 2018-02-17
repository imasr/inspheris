'use strict';
angular.module('inspherisProjectApp')
.controller('AlertCtrl', function ($scope, $rootScope,$timeout,$filter,$stateParams,notifyModal,confirmModal,uiModals,createAlertModal,apiAlert){

	$scope.page = 1;
	$scope.itemsPerPage = 20;
	$scope.sortKey = "";
	$scope.sortField = "";
	
	$scope.gridAlerts ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('Title'), field: 'title', width: "35%", headerTooltip: $filter('translate')('Title'),enableColumnMenu: false },	       	         
	       	          { name:$filter('translate')('Status'), field: 'status', cellTemplate: '<p>&nbsp; {{grid.appScope.showStatus(row.entity.status)}}</p>',headerTooltip: $filter('translate')('Status'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Publication_Start'), field: 'publicationStartDate', cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.publicationStartDate)}}</p>', headerTooltip: $filter('translate')('Publication_Start'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Publication_End'), field: 'publicationEndDate', cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.publicationEndDate)}}</p>',  headerTooltip: $filter('translate')('Publication_End'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Active/Deactive'), field: 'active', type: 'boolean',cellTemplate:"<input type='checkbox' ng-model='row.entity.active' ng-click='grid.appScope.activeAlert(row.entity.id,$event)'>" },
	       	          { name:$filter('translate')('Edit'),enableColumnMenu: false,imageClass: "k-icon k-i-pencil",cellTemplate:'<a  class="btn btn-default btn-xs" title="{{grid.appScope.tranlateWord(\'' + 'Edit' + '\')}}" ng-click="grid.appScope.editAlert(row.entity.id)"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp; '
		       	        	+'<a class="btn btn-default btn-xs" title="{{grid.appScope.tranlateWord(\'' + 'Delete' + '\')}}" ng-click="grid.appScope.deleteAlert(row.entity.id)"><span class="glyphicon glyphicon-trash"></span></a>',
	  	        	  		enableSorting: false
	       	          }
	       	          ],
	       	onRegisterApi: function(gridApi) {
	       		$scope.gridApi = gridApi;
	       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	       			if (sortColumns.length != 0) {
	       				$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	       			}
	       			
	       			$scope.getData();
	       		});
	       		
	 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	        	$scope.page = newPage;
	 	            $scope.itemsPerPage = pageSize;
	 	            $scope.getData();
	 	        });
	       	}
	};
	
	$scope.getData = function(){
		apiAlert.allAlerts({page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField}).then(function(data){
    		$scope.gridAlerts.data = data.rows;
    		$scope.gridAlerts.totalItems = data.total;
    	});
	};
	
	//translation for statuses on grid
	$scope.showStatus = function(status){
		var statusTranslation = '';
		if(status == 'Published'){
			statusTranslation =  $filter('translate')('publish');
		}else if(status == 'Draft'){
			statusTranslation =  $filter('translate')('Draft');
		}else if(status == 'Scheduled'){
			statusTranslation =  $filter('translate')('Publication scheduled');
		}
		return statusTranslation;
	};
	
	// show date by format
	$scope.showDate = function(publicationDate){
		return $filter('date')(publicationDate,$rootScope.fullDateFormat);
	};
	
	//load all alerts
	$scope.getData();
	
	// create alert
	$scope.createAlert = function(){
		var modal = createAlertModal.show(null, {action: 'create', type: 'alert', data: null});
		modal.closePromise.then(function (data){
	          if(data.value.flag == 'ok'){
	        	  $scope.getData();
	          }
		});	
	};
	
	//edit alert
	$scope.editAlert = function (alertId) {
		var modal = createAlertModal.show(null, {action: 'edit', type: 'alert', data: alertId});
		modal.closePromise.then(function (data){
	          if(data.value.flag == 'ok'){
	        	  $scope.getData();
	          }
		});	
	};

	// delete alert
	$scope.deleteAlert = function (alertId) {
		var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_alert_confirm"});
	    modal.closePromise.then(function (data) {
	    	if(data.value == 'ok'){
	    		apiAlert.deleteAlert({id: alertId}).then(function(data){
	    			if(typeof(data.code) != 'undefined' && data.code != null){
	    				var message= $filter('translate')(data.message);
	            		var title = $filter('translate')('Error');
	            		uiModals.alertModal(null,title, message);
	            	}else{
	            		notifyModal.showTranslated('Deleted alert success', 'success', null);
	            		$scope.getData();
	            	}     
	    		}, function(err){
	    			notifyModal.showTranslated("something_went_wrong", 'error', null);
	    		});
	    	}
	    });
	};

	//active/deactive alert
	$scope.activeAlert = function (alertId, $event) {
		var modal = confirmModal.showTranslated($scope, {title: "Activate", message: "activate_alert_confirm"});
        modal.closePromise.then(function (data) {
        	if(data.value == 'ok'){
        		var active = 'N';
                if ($event.target.checked) {
                	active = 'Y';
                }
                
                apiAlert.activate(alertId,active).then(function(data){
                	if(typeof(data.code) != 'undefined' && data.code != null){
                		var message= $filter('translate')(data.message);
                		var title = $filter('translate')('Error');
                		uiModals.alertModal(null,title, message);
                	}else{
                		notifyModal.showTranslated('Activated successfully', 'success', null);
                		$scope.getData();
                	}    
            	}, function(err){
            		 notifyModal.showTranslated('something_went_wrong', 'error', null);
            	});          
            }else{
            	$scope.getData();
            }
        });
	};
 })
 .controller('CreateAlertCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$q,$stateParams,notifyModal, uiModals, confirmModal, sharedData,dateTimeService,apiAlert){
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
	 $scope.title = '';
	 $scope.description = '';
	 $scope.isActive = true;
	 $scope.modalData = $scope.$parent.ngDialogData;

	 //get publish start date && publish end date
	 $scope.getPublishStartEndDate = function(stDt, stTime, endDt, endTime){
		 var errorData = {
				 flag: false,
				 message: ''
		 };
	  
		 var publishStartDateTime = null;
		 if(stDt && stTime){
			 publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
		 }
		 
		 var publishEndDateTime = null;
		 if(endDt && endTime){
			 publishEndDateTime = dateTimeService.dateTimeToMsec(endDt, endTime);
		 }
		 
		 //for error hadling
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
	      
		 if(endDt){
			 if(!endTime){
				 errorData.flag = true;
				 errorData.message = 'select_publish_end_time';
			 }
		 }else if(endTime){
			 if(!endDt){
				 errorData.flag = true;
				 errorData.message = 'select_publish_end_date';
			 }
		 }
	      
		 if(stDt && stTime){
			 var currentDateTime = Date.parse(new Date());
			 if((publishStartDateTime <= currentDateTime) && ($scope.modalData.action == 'create')){
				 //if we are creating article then only we will show this message
				 errorData.flag = true;
				 errorData.message = 'publish_start_date_should_greater_than_current_date';
			 }else if(endDt && endTime){
				 if(publishEndDateTime <= publishStartDateTime){
					 errorData.flag = true;
					 errorData.message = 'publish_end_date_should_greater_than_start_date';
				 }
			 }
		 }else if(endDt && endTime){
			 if(publishEndDateTime <= publishStartDateTime){
				 errorData.flag = true;
				 errorData.message = 'publish_end_date_should_greater_than_start_date';
			 }
		 }
		 return ({startDtTime: publishStartDateTime, endDtTime: publishEndDateTime, error: errorData});
	 };
	 
	 $scope.initializeData = function(){
		 var deferred = $q.defer();
		 $q.all().then(function(data){
	          deferred.resolve("success");
		 }, function(err){
			 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 deferred.resolve("error");
		 });
		 return deferred.promise;
	 };
	 
	 $scope.initializeData().then(function(msg){
		 if(($scope.modalData.action == 'edit') && ($scope.modalData.data)){
			 apiAlert.getById($scope.modalData.data).then(function(data){
				 $scope.title = data.title;
				 $scope.description = data.description;
				 $scope.isActive = data.active;
				 
				 //load publicationStartDate
				 if(data.publicationStartDate){
					 $scope.publishDates.startDt = ($filter('newDate')(data.publicationStartDate)).getTime();
					 $scope.publishDates.startTime = $filter('newDate')(data.publicationStartDate);
				 }  
				 
				 //load publicationEndDate
				 if(data.publicationEndDate){
					 $scope.publishDates.endDt = ($filter('newDate')(data.publicationEndDate)).getTime();
					 $scope.publishDates.endTime = $filter('newDate')(data.publicationEndDate);
				 }   
			 }, function(err){
				 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 });
		 }//if action == edit

	 }, function(errmsg){

	 });
	 
	 // save alert
	 $scope.publishAlert = function(status){
		 var errorData = {
				false: false,
		        message: ''
		 };
		 
		 var postdata = {
				 title: $scope.title,
				 description: $scope.description,
				 active: $scope.isActive,
				 status: status
		 };
			
		 if(postdata.title == ""){
			 errorData.flag = true;
			 errorData.message = 'Enter_Title';
		 }
			
		 if($scope.modalData.data){
			 postdata.id = $scope.modalData.data;
		 }

		 if($scope.isSchedule == true){				
			 if(!$scope.publishDates.startDt && !$scope.publishDates.startTime){
				 errorData.flag = true;
				 errorData.message = "select_publish_start_date";
			 }
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
		 
		 if(!errorData.flag){
			 var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "publish_alert_confirm"});
			 modal.closePromise.then(function (data) {
				 if(data.value == 'ok'){
					 apiAlert.create(postdata).then(function(data){
						 $scope.closeThisDialog({flag: 'ok', data: data});
						 var msg = '';
						 if(postdata.status == 'Published'){
							 if(data.status == 'Published'){
								 msg = 'Alert published success';
							 }else if(data.status == 'Scheduled'){
								 msg = 'Alert scheduled success';
							 }
						 }else if(postdata.status == 'Draft'){
							 msg = 'Alert saved success';
						 }
						 notifyModal.showTranslated(msg, 'success', null);
						 $state.reload();
					 }, function(err){
			  	       	notifyModal.showTranslated('something_went_wrong', 'error', null);
			  	   	});
				 }
			 });   
		 }else{
			 notifyModal.showTranslated(errorData.message, 'error', null);
		 }			
	 };
})
.controller('AlertWidgetController', function ($scope,notifyModal,apiAlert){
	$scope.isWidgetOpen = true;
    	$scope.widgetToggle = function(){
      		$scope.isWidgetOpen = !$scope.isWidgetOpen;
    	};

    	apiAlert.filteredAlerts().then(function(data){
		$scope.alerts = data;
	}, function(err){
		notifyModal.showTranslated('something_went_wrong', 'error', null);
	});
});