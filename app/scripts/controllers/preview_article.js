'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('PreviewArticleCtrl', function ($scope, $http, Config, previewArticleModal, apiCommunity) {


    $scope.closePreviewArticle = function(){
      previewArticleModal.hide();
    };

    $scope.feed = $scope.$parent.ngDialogData;
    $scope.headingBlock = '';
    $scope.zenModeImages = {top: '', bottom: ''};
    $scope.comm = [];
    $scope.documentArray = [];
    $scope.hashtags = [];
    $scope.headerImageFlag = ''; //used for showing header image block
    $scope.coverImageCss = {'height':'110px'};
    $scope.stickyCoverPrams = {
      top: 50,
      offset: 0
    };
  
    $scope.getArticleData = function(){
        angular.forEach($scope.feed.blocks, function(val, key) {
          if(val.type == 'heading'){
            $scope.headingBlock = val;
            if(typeof(val.imageHeader) != 'undefined'){
              $scope.headerImageFlag = 'yes';  
            }
            else
              $scope.headerImageFlag = 'no';

            if(typeof($scope.feed.hashtags) != 'undefined'){
              $scope.hashtags = $scope.feed.hashtags;
            }
          }
          else if(val.type == 'topImage'){
            $scope.zenModeImages.top = val;
          }
          else if(val.type == 'bottomImage'){
            $scope.zenModeImages.bottom = val;
          }
        });
    };
    $scope.getArticleData();

    $scope.getCommunityData = function(commuid){
      apiCommunity.getCommunitiesData().then(function(data){
        $scope.comm = apiCommunity.getCommunityByUid({uid: $stateParams.commuid});
      }, function(err){
      });
    };

    $scope.$watch('feed', function(){
      angular.forEach($scope.feed.blocks, function(val, key){
        if(val.type == 'document'){
          $scope.documentArray.push(val);
        }
      });
    });

    $scope.showGalleryPopup = function(imageArray, gallerytype){
      galleryModal.show({type: gallerytype, data: imageArray});
    };

    $scope.$watch('comm', function(){
      if(typeof($scope.comm.tabs)  != 'undefined'){
        $scope.menuTabs = $scope.comm.tabs;
        var tempArray = [];
        var len = $scope.menuTabs.length;
        angular.forEach($scope.menuTabs, function(val, key){
        
            tempArray.push({
              tabName: val.tabName,
              tabType: val.tabType,
              tabOrder: val.tabOrder,
              active: false
            }); 
          
        });
        $scope.menuTabs = tempArray;
        
        if(len > 4){
          /*var first = $scope.comm.tabs.slice(0, 3);
          var second = $scope.comm.tabs.slice(5);*/
          $scope.tabsFirstArray =  $scope.menuTabs.slice(0, 4);
          $scope.tabsSecondArray = $scope.menuTabs.slice(4);
          
        }
        else{
          $scope.tabsFirstArray =  $scope.menuTabs;
        }
      }
    });

  });