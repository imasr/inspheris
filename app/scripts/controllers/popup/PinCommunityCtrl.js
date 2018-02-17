'use strict';
angular.module('inspherisProjectApp')
.controller('PinCommunityCtrl', function ($q,$scope, $rootScope,$timeout,$filter,$stateParams,$state,notifyModal,confirmModal,uiModals,apiCommunity,apiPinCommunity){
	
	$scope.modalData = $scope.$parent.ngDialogData;
	$scope.title = "";
	//ONLY ONE community
	$scope.selectedCommUid = {
			text: "Select",
            uid: null
	};
	
	//ONLY ONE community tab
	$scope.selectedTabUid = {
			tabName: "select_community_tab",
            uid: null
	};
	
	$scope.initializeData = function(){
		var deferred = $q.defer();
		var pr0 = apiCommunity.getCommunitiesData();
		 $q.all([pr0]).then(function(data){
			 //for data[0]
			 $scope.communityList = data[0];
			 //empty the array
			 $scope.comSelectOptions = [];
			 $scope.communityList.forEach(function(entry){
				 if(entry.privated == 0){
					 var tempObj = {};
					 tempObj.text = entry.label;
					 tempObj.uid = entry.uid;
					 tempObj.tabs = entry.tabs;
					 $scope.comSelectOptions.push(tempObj);
				 }
			 });			
	         deferred.resolve("success");
		 }, function(err){
			 notifyModal.showTranslated('something_went_wrong', 'error', null);
			 deferred.resolve("error");
		 });
		 return deferred.promise;		
	};
	 
	$scope.initializeData().then(function(msg){
		if($scope.modalData.action =='edit' && $scope.modalData.data != null){
			apiPinCommunity.getById($scope.modalData.data).then(function(data){
				$scope.pinnedCommunity = data;
				$scope.title = $scope.pinnedCommunity.title;

	            apiCommunity.getCommunityByUid({uid: $scope.pinnedCommunity.community.uid, status: 'all'}).then(function(data){
	            	 $scope.selectedCommUid = {
							 text: $scope.pinnedCommunity.community.label,
							 uid: $scope.pinnedCommunity.community.uid,
							 tabs : data.tabs
	            	 };
	            	 
	            	 $scope.tabSelectOptions = [];
	         		 var communityTabs = $scope.selectedCommUid.tabs
	         		 communityTabs.forEach(function(entry){
	         			 if(!entry.privated && !entry.pinnedTab && entry.tabType.toLowerCase() != 'home'){
	         				 $scope.tabSelectOptions.push(entry);
	         			 }
	         		 });	
	            	 
				}, function(err){
				});
	            
	            $scope.selectedTabUid = {
	        			tabName: $scope.pinnedCommunity.communityTab.tabName,
	                    uid: $scope.pinnedCommunity.communityTab.uid
	        	};
	        }, function(err){
	        });
			
		}
	}, function(errmsg){

	});
	
	//select community
	$scope.commSelect = function(selected){
		$scope.selectedTabUid = {
				tabName: "select_community_tab",
	            uid: null
		};
		
		$scope.tabSelectOptions = [];
		var communityTabs = selected.tabs
		communityTabs.forEach(function(entry){
			if(!entry.privated && !entry.pinnedTab && entry.tabType.toLowerCase() != 'home'){
				$scope.tabSelectOptions.push(entry);
			 }
		});	
	};
	
	$scope.pinCommunity = function(){
		var errorData = {
				false: false,
		        message: ''
		};
		
		if($scope.title == ""){
			errorData.flag = true;
	        errorData.message = 'Enter_Title';
		}
		
		if($scope.selectedCommUid != null && $scope.selectedCommUid.uid == null){
			errorData.flag = true;
	        errorData.message = 'Select_Community';
		}
		
		if($scope.selectedTabUid != null && $scope.selectedTabUid.uid == null){
			errorData.flag = true;
			errorData.message = "select_community_tab";
		}

		var postdata = {
				title : $scope.title,
				communityTabUid : $scope.selectedTabUid.uid
		}
		
		if($scope.modalData.action =='edit'){
			if($scope.modalData.data != null){
				postdata.id = $scope.modalData.data;
			}else{
				errorData.flag = true;
				errorData.message = "missing id";
			}
		}
		
        if(!errorData.flag){
        	var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Pin Community Confirm"});
            modal.closePromise.then(function (data) {
                if(data.value == 'ok'){
                	apiPinCommunity.create(postdata).then(function(data){
                		if(typeof(data.code) != 'undefined' && data.code != null){
                    		var message= $filter('translate')(data.message);
                    		var title = $filter('translate')('Error');
                    		uiModals.alertModal(null,title, message);
                    	}else{
	                		$scope.closeThisDialog({flag: 'ok', data: data});
	                		notifyModal.showTranslated('Community pinned success', 'success', null);
	                		$state.reload();
                    	}
                	}, function(err){
                		notifyModal.showTranslated('something_went_wrong', 'error', null);
		  	      	});
                }
            });        
        }else{
        	notifyModal.showTranslated(errorData.message, 'error', null);
        }
	}
})
.controller('SimplePinCommunityCtrl', function ($scope, pinCommunityModal){
	$scope.pinCommunity = function () {
		var modal = pinCommunityModal.show(null, {action: 'create', type: 'pincommunity', data: null});
	}
	
	$scope.editThePinnedCommunity = function (id) {
		var modal = pinCommunityModal.show(null, {action: 'edit', type: 'pincommunity', data: id});
	}
});