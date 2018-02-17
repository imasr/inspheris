'use strict';

angular.module('inspherisProjectApp')
  .controller('LanguageSelectorCtrl', function ($scope, $timeout, $rootScope, $compile, $http, Config, $window) {

    $scope.preventDefault = function(event){
       event.stopPropagation();
    }
    /*$scope.selectedLangFrom = {
      code: $rootScope.currentLanguage.code,
      name: $rootScope.currentLanguage.name,
      active: $rootScope.currentLanguage.active,
      translationService: $rootScope.translationService
    };*/
    $scope.selectedLangFromObj = $rootScope.userData.language ? $rootScope.getLanguageObjByCode($rootScope.userData.language) : $rootScope.currentLanguage;

    $scope.selectedLangFrom = $scope.selectedLangFromObj.code;    
    $scope.selectedLangFromLabel = $scope.selectedLangFromObj.name; 
    $scope.selectedLangToLabel = ['Translate_To'];
    $scope.selectedLangTo = [];
    $scope.allLanguagesTo = [];

    $scope.initallLanguagesToArr = function() {
      $scope.allLanguagesTo = [];
      angular.forEach($rootScope.languages, function(val, key) {
        if(val.code != $scope.selectedLangFrom){
          $scope.allLanguagesTo.push(val);
        }
      });
      $scope.selectedLangToLabel = ['Translate_To'];
      $scope.selectedLangTo = [];
    };
    $scope.initallLanguagesToArr();

    $scope.emitData = function () {
      $scope.$emit('widgetLanguageSelected', {from: $scope.selectedLangFrom, to: $scope.selectedLangTo});
    };

    $scope.toggleToLanSelection = function(lang){
      var idx = $scope.selectedLangTo.indexOf(lang.code);
      if(idx > -1){
        $scope.selectedLangTo.splice(idx, 1);
        $scope.selectedLangToLabel.splice(idx, 1);
        if($scope.selectedLangToLabel.length <= 0){
          $scope.selectedLangToLabel = ['Translate_To'];
        }
      }
      else{
        $scope.selectedLangTo.push(lang.code);
        var tIdx = $scope.selectedLangToLabel.indexOf('Translate_To');
        if(tIdx > -1){
          //remove the select language label if it is
          $scope.selectedLangToLabel.splice(tIdx, 1);
        }
        $scope.selectedLangToLabel.push(lang.name);
      }

      $scope.emitData();
    };

    $scope.selectAllTo = function(){
      angular.forEach($scope.allLanguagesTo, function(val, key){
        $scope.toggleToLanSelection(val);
      });
    };
    $scope.selectAllTo();

    $scope.toggleFromLanSelection = function(lang){
      $scope.selectedLangFrom = lang.code;
      $scope.selectedLangFromLabel = lang.name;
      $scope.initallLanguagesToArr();
      $scope.emitData();
    };
    $scope.emitData();    
  });