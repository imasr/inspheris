'use strict';

angular.module('inspherisProjectApp')
  .controller('AllNofificationsCtrl', function ($stateParams, $state, $rootScope, $timeout, $scope, $http, sharedData, apiNotification) {


    $scope.notificationCount = 0;
    $scope.pageData = {
      isLoading: false,
      allLoaded: false,//set it to true if all the notifications are loaded
      page: 0,
      notifications: []
    };

    apiNotification.count().then(function(data){
      $scope.notificationCount = data.data;
    }, function(err){
    });

    $scope.getNotifications = function(){
      $scope.pageData.isLoading = true;
      apiNotification.list({page: $scope.pageData.page}).then(function(data){
        if(data.data.length > 0){
          angular.forEach(data.data, function(val, key){
            $scope.pageData.notifications.push(val);
          });
        }
        else{
          $scope.pageData.allLoaded = true;
        }
        $scope.pageData.isLoading = false;
      }, function(err){
      });
    };

    $scope.showMoreNotifications = function(){
      if(!$scope.pageData.isLoading && !$scope.pageData.allLoaded){
        $scope.pageData.page++;
        $scope.getNotifications();
      }
    };

    $scope.showMoreNotifications();

    $scope.$on("$destroy", function(){

    });
});