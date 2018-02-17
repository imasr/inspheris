'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('CommentTranslateCtrl', function ($scope, $timeout, $rootScope, apiFeedData) {
      $scope.feeddata = JSON.parse($scope.content);
      $scope.feedLangCode = $scope.feeddata.language;
      $scope.translatedComment = '';
      $scope.translationStatus = 0;//0 = processing, 1= success, 2= error
      $scope.fromLangOptions = [];
      $scope.toLangOptions = [];
      $scope.toLangSelected = {};
      var currentLang = $rootScope.currentLanguage;     
      var defaultLang = $rootScope.defaultLanguage;

      var activeLangs = $rootScope.languages; 
      var langLen = activeLangs.length;

      angular.forEach(activeLangs, function(val, key){
        if($scope.feedLangCode == val.code){
          $scope.fromLangSelected = {name: val.name};
        }
      });

      $scope.toLangChanged = function(lang){
    	  $scope.translationStatus = 0;
    	  $scope.translatedComment = '';
    	  apiFeedData.tranlateComment({commentUid: $scope.feeddata.uid, language: lang.code}).then(function(data){
    		  if(data != undefined){
    			  if(data.code != undefined){
    				  $scope.translationStatus = 2;
    			  }else if(typeof(data.error) != 'undefined' && data.error != null && data.errors != ''){
    				  $scope.translationStatus = 2;
    				  $scope.message = data.error;
    			  }else {
    				  $scope.translationStatus = 1;
            		  $scope.translatedComment = data;
    			  } 			  
    		  }   		  
    	  }, function(err){
    		  $scope.translationStatus = 2;
    	  });
      };

      $scope.fromLangChanged = function(lang){
    	  $scope.translationStatus = 0;
    	  $scope.translatedComment = '';
    	  apiFeedData.tranlateComment({commentUid: $scope.feeddata.uid, language: lang.code}).then(function(data){
    		  if(data != undefined){
    			  if(data.code != undefined){
    				  $scope.translationStatus = 2;
    			  }else{
    				  $scope.translationStatus = 1;
            		  $scope.translatedComment = data;
    			  } 			  
    		  }   		  
    	  }, function(err){
    		  $scope.translationStatus = 2;
    	  });
      };
      
      var toLangArr = [];
      var fromLangArr = [];     
      toLangArr.push(currentLang);
      fromLangArr.push(defaultLang);
      angular.forEach(activeLangs, function(val, key){
    	  var tempObj = {
    			  code: val.code,
    			  name: val.name,
    			  active: val.active,
    			  translationService: val.translationService
            };
    	  
    	  if(defaultLang.code != val.code){
    		  fromLangArr.push(tempObj);
    	  }
    	  
    	  if(currentLang.code != val.code){
    		  toLangArr.push(tempObj);
    	  }
//    	  if($scope.feedLangCode != val.code){
//    		  toLangArr.push(tempObj);
//    	  }
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
    		  $scope.fromLangOptions = fromLangArr;
    	  }
      });
       
      $rootScope.$watch('languages', function(){
      });
});
