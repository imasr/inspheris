'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:SelectPeopleCtrl
 * @description this controller is used to selecte the members to invite in a event
 * # SelectPeopleCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('SelectPeopleCtrl', function ($scope, $rootScope, $filter, $timeout, apiPeoples, notifyModal) {
    
    $scope.modalStatus = {
        isReady: 0,
        message: 'please wait...'
      };

    $scope.peopleApi = new apiPeoples();
    $scope.searchText = '';
    $scope.peopleList = [];
    $scope.visiblePeople = [];
    $scope.selectedPeoples = [];

    if($scope.$parent.ngDialogData){
      $scope.selectedPeoples = angular.copy($scope.$parent.ngDialogData);
    }
    
    $scope.showMore = function(){
      if($scope.peopleList.length > 0)
      for(var i= $scope.visiblePeople.length; i<($scope.peopleList.length); i++){
        $scope.visiblePeople.push($scope.peopleList[i]);
        if((i != 0) && (i%50 == 0)){
          break;
        }
      }
    };
    $scope.pepleToggle = function(userData){
      var idx = $scope.selectedPeoples.indexOf(userData);
      if(idx <= -1){
        $scope.selectedPeoples.push(userData);
      }
      else{
        $scope.selectedPeoples.splice(idx, 1);
      }
    };

    $scope.doSearch = function(tempSeartText){
      $scope.visiblePeople = [];
      $scope.peopleList = [];

      if($scope.peopleApi){
          //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
          $scope.peopleApi.cancel('cancelled');
        }
      $scope.peopleApi = new apiPeoples();

      var param = {
          format: 'full',
        };
      if(!$filter('isBlankString')(tempSeartText)){
        param.searchText = tempSeartText;
      }
      $scope.modalStatus.isReady = 0;
      $scope.peopleApi.getPeoples(param).then(function(data){
        if(data){
          $rootScope.highlightText = param.searchText;
          $scope.peopleList = data;
          $scope.showMore();
          $scope.modalStatus.isReady = 1;
        }
      }, function(err){
        notifyModal.showTranslated("something_went_wrong", 'error', null);
        $scope.modalStatus.isReady = 2;
      });
    };

    $scope.doSearch($scope.searchText);
    var tempSeartText='', filterTextTimeout;
    var watchSearchText = $scope.$watch('searchText', function (val) {
      tempSeartText = $scope.searchText;
      if (filterTextTimeout){
        //cancel search if text length is zero or search text has changed
        $timeout.cancel(filterTextTimeout);
      }
      filterTextTimeout = $timeout(function() {
        $scope.doSearch(tempSeartText);
      }, 1200); // delay 250 ms
    });

    $scope.$on("$destroy", function(){
      $rootScope.highlightText = '';
      watchSearchText();
      $scope.peopleApi.cancel(null);
    });

  });