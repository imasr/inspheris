'use strict';
angular.module('inspherisProjectApp')
.controller('ProfileCustomFieldCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$stateParams,notifyModal,confirmModal,uiModals,apiProfileCustomField){
	$scope.closeConfigurePopup = function(){
		$scope.closeThisDialog({flag: 'cancel', data: null});
	};

	$scope.userUid = $stateParams.uid;
	$scope.customFields = [];
	$scope.selectedValue = [];
	
	apiProfileCustomField.getActiveProfileCustomFields({userUid:$scope.userUid}).then(function(data){
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
			
			if(val.type == 'Dropdown'){
				para.value = val.updatedValue != undefined && val.updatedValue != '' ? val.updatedValue : '';				
			}if(val.type == 'Date'){
				para.value = val.updatedValue != undefined && val.updatedValue != '' ? {startDt:($filter('newDate')(val.updatedValue)).getTime()} : null;
			}else{
				para.value = val.updatedValue != undefined && val.updatedValue != '' ? val.updatedValue : val.value;
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
	
	//select status
	$scope.valueChanged = function(selected,index){
		$scope.customFields[index].value = selected.label;
	};
	
	//save
	$scope.save = function(){	   

		$scope.parameters = [];
		for(var i=0 ;i<$scope.customFields.length;i++){
			if($scope.customFields[i].value != undefined && $scope.customFields[i].value != '' && $scope.customFields[i].value != 'Select value'){
				if($scope.customFields[i].type == "Date"){
					$scope.parameters.push({
						name : $scope.customFields[i].name,
						value : $scope.customFields[i].value.startDt,
						fieldId : $scope.customFields[i].fieldId
					});      			
       		 	}else{
	       		 	$scope.parameters.push({
						name : $scope.customFields[i].name,
						value : $scope.customFields[i].value,
						fieldId : $scope.customFields[i].fieldId
					});       			 
       		 	}
			}			
		}

		apiProfileCustomField.configFieldsForUser($scope.parameters).then(function(data){
			notifyModal.showTranslated('Saved success', 'success', null);
			$scope.closeThisDialog({flag: 'ok', data: data});
			$state.reload();
		}, function(err){
			notifyModal.showTranslated('something_went_wrong', 'error', null);	  
		});  
	}; 
});