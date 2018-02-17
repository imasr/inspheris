'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('FeedTranslateCtrl', function ($scope, $timeout, $rootScope, apiFeedData, notifyModal, $filter, $compile, $http, Config, videoUrlModal, ngDialog, apiCommunity, $q, $window) {
      $scope.feeddata = JSON.parse($scope.content);
      $scope.feedSourceId = $scope.feeddata.sourceId;
      $scope.feedLangCode = $scope.feeddata.language;
      $scope.translatedFeed = '';
      $scope.translationStatus = 0;//0 = processing, 1= success, 2= error
      //foramt of feed data to be passed
      //{
      //  uid:"ca460499-6932-455e-8ccb-b1b46870aa0a",
      //  language:"en",
      //  sourceId:"219d26bc-600f-43a2-b043-6fd37b8e854d"
      //}

      
      $scope.fromLangOptions = [];
      $scope.toLangOptions = [];
      $scope.toLangSelected = {};

      var activeLangs = $rootScope.languages; 
      var langLen = activeLangs.length;

      angular.forEach(activeLangs, function(val, key){
        if($scope.feedLangCode == val.code){
          $scope.fromLangSelected = {name: val.name};
        }
      });

    $scope.toLangChanged = function(lang){
        $scope.translationStatus = 0;
        $scope.translatedFeed = '';
        apiFeedData.getFetchFeed({uid: $scope.feeddata.uid, language: lang.code}).then(function(data){
          $scope.translationStatus = 1;
          $scope.translatedFeed = data;
        }, function(err){
          $scope.translationStatus = 2;
        });
    };

      var toLangArr = []
      angular.forEach(activeLangs, function(val, key){
        var tempObj = {
              code: val.code,
              name: val.name,
              active: val.active,
              translationService: val.translationService
            };
        if($scope.feedLangCode != val.code){
          toLangArr.push(tempObj);
        }
        if(key == (activeLangs.length-1) && toLangArr.length>0){
          var selobj = {
              code: toLangArr[0].code,
              name: toLangArr[0].name,
              active: toLangArr[0].active,
              translationService: toLangArr[0].translationService
            };
          $scope.toLangSelected = selobj;
          $scope.toLangOptions = toLangArr;
           $scope.toLangChanged(selobj);
        }
      });
       
      $rootScope.$watch('languages', function(){
      });
});
