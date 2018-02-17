'use strict';

angular.module('inspherisProjectApp')
  .controller('GrandArticleTemplateCtrl', function (isAppInitialized, $stateParams,$rootScope, $timeout, $scope, Config, sharedData, UiConfig, apiArticle, confirmModal,notifyModal,uiModals,$filter,$http) {

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
	  $scope.gotFirstTextBlock = false;
	  $scope.headerImageColor = '';

	  $scope.getArticleData = function(){
        apiArticle.getArticle({uid: $stateParams.articleid,track: $stateParams.track,referer: $stateParams.referer}).then(function(data){
      	  if(typeof(data.data.code) != 'undefined' && data.data.code != null){
      		  var message= $filter('translate')(data.data.message);
      		  var title = $filter('translate')('Error');
      		  uiModals.alertModal(null,title, message);
      	  }else{   
      		  $scope.feed = data.data;

      		  //get summary of grand article from pages
      		  $scope.feed.summaryPages = []; 
      		  if($scope.feed.grandArticlePages != undefined && $scope.feed.grandArticlePages.length > 0){
      			angular.forEach($scope.feed.grandArticlePages, function(val, key) {
      				$scope.feed.summaryPages.push(val.title);
      			});
      		  }
      		  
      		  //get title,content , image of grand article
      		  if($scope.feed.blocks){
      			  if($scope.feed.blocks.length > 0){
      				  angular.forEach($scope.feed.blocks, function(val, key) {
      					  switch(val.type) {
      					  	case 'heading':
      					  		if(typeof(val.imageHeader) != 'undefined'){
      					  			$scope.feed.isHeaderImage = true;
      					  			$scope.feed.headerImg = {
			      	                    imageHeader: val.imageHeader,
			      	                    imageHeaderColor: val.headerImageColor,
			      	                    imageHeaderPosX: val.imageHeaderPosX,
			      	                    imageHeaderPosY: val.imageHeaderPosY,
			      	                    smallImage : val.smallImage
      					  			}
      					  			$scope.feed.headerImageColor = {'background-color': val.headerImageColor};
      					  		}
      					  		
      					  		if(typeof(val.title) != 'undefined'){
      					  			$scope.feed.artTitle = val.title;
      					  		}
      					  		
      					  		if(typeof(val.subTitle) != 'undefined'){
      					  			$scope.feed.artSubTitle = val.subTitle;
      					  		}
      					  		break;
      					  	case 'richText':
      					  		if(!$scope.gotFirstTextBlock){
      					  			$scope.feed.artText = val.content;
      					  			$scope.gotFirstTextBlock = true;
      					  		}
      					  		break;
      					  	case 'text':
      					  		if(!$scope.gotFirstTextBlock){      	                  
      					  			$scope.feed.artText = val.title;
      					  			$scope.gotFirstTextBlock = true;
      					  		}
      					  		break;
      					  }
      				  });
      			  }
      		  }
      	  }
        }, function(err){
        });
    };

    if(isAppInitialized == 'success'){
    	if($stateParams.articleid){
            $scope.getArticleData();
    	}
    }
    
    $scope.showTumbType = 'user';
    $scope.showLastActivityDate = true;
    $scope.showLastActivityUser = true;
    $scope.referer = 'CTYHP';
    if($stateParams.activetab !== undefined){
		if($stateParams.referer !== 'home'){
			$scope.showTumbType = 'author';
			$scope.showLastActivityDate = false;
			$scope.showLastActivityUser = false;
			$scope.referer = 'TABList';
		}
	}
    
    $scope.enableTootip = false; // for enable toottip   
    $scope.getConfig = function(){
    	var config = sharedData.findConfig("PROFILE_TOOTIP");
    	if(typeof(config.name) != 'undefined'){
    		 $scope.enableTootip = config.value ? true : false;
    	}
    }    
    $scope.getConfig();
});
