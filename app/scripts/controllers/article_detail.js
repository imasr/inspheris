'use strict';

angular.module('inspherisProjectApp')
  .controller('ArticleDetailPageCtrl', function ($stateParams, $rootScope, $scope, $http, Config, apiCommunity, apiArticle, editQuickpostModal, createArticleModal, galleryModal, $timeout) {
    $scope.feed = [];
    $scope.comm = [];
    $scope.documentArray = [];
    $scope.hashtags = [];
    $scope.currentTab = '';//set selected tab in second menu
    $scope.headerImageFlag = false; //used for showing header image block
    $scope.smallImage = false; // use for swicth view if small image
    $scope.coverImageCss = {'height':'70px'};
    $scope.stickyCoverPrams = {
      top: 50,
      offset: 0
    };

    $scope.coverData = {
      type: 'community',
      label: '',
      subtitle: '',
      followerCount: 0,
      contributorCount: 0,
      bannerUrl: null,
      logoUrl: null,
      isReady: false
    };

    $scope.title = null;
    $scope.subTitle = null;
    $scope.templateClass = 'standardMode';

    $scope.resetArtData = function(){
      $scope.feed = null;
      $scope.hashtags = [];
      $scope.templateClass = 'standardMode';
      $scope.title = null;
      $scope.subTitle = null;
      $scope.headerImageFlag = false;
      $scope.smallImage = false;
    };
  
    $scope.getArticleData = function(){
      $scope.templateClass = 'standardMode';
      apiArticle.getArticle({uid:$stateParams.id}).then(function(data){
        $scope.feed = data.data;
        if(typeof($scope.feed.hashtags) != 'undefined'){
          $scope.hashtags = $scope.feed.hashtags;
        }
        angular.forEach($scope.feed.blocks, function(val, key) {
          if(val.type == 'heading'){
            if(val.title){
              $scope.title = val.title;
            }
            if(val.subTitle){
              $scope.subTitle = val.subTitle;
            }
            if(typeof(val.imageHeader) != 'undefined'){
              $scope.headerImageFlag = true;  
            }
            $scope.smallImage = val.smallImage
          }
        });
        $scope.currentTab = $scope.feed.type;
        $scope.getCommunityData($scope.feed.community.uid);
      }, function(err){
      });
    };
    $scope.getArticleData();

    $scope.getCommunityData = function(commuid){
      apiCommunity.getCommunityByUid({'uid':commuid}).then(function(data){
        $scope.comm = data;
        /*
        if(!$scope.comm.bannerUrl){
          $scope.stickyCoverPrams.top = 50;
          $scope.stickyCoverPrams.offset = 0;
          $scope.coverImageCss = {'height':'70px'};
        }
        */
        if($scope.comm.bannerUid){
          $scope.stickyCoverPrams.top = -100;
          $scope.stickyCoverPrams.offset = 150;
          $scope.coverImageCss = {'height':'260px'};
        }

        $scope.coverData.label = $scope.comm.label;
        $scope.coverData.followerCount = $scope.comm.followerCount;
        $scope.coverData.contributorCount = $scope.comm.contributorCount;
        $scope.coverData.bannerUrl = $scope.comm.headerBannerUrl;
        $scope.coverData.logoUrl = $scope.comm.headerLogoUrl;
        
        $timeout(function(){
          $scope.$apply();
          $scope.coverData.isReady = true;
        });
      }, function(err){
      });
    };

    $scope.$watch('feed', function(){
      if($scope.feed && $scope.feed.blocks){
        angular.forEach($scope.feed.blocks, function(val, key){
          if(val.type == 'documentGallery'){
            angular.forEach(val.documents, function(doc, i){
              $scope.documentArray.push(doc);
            });
          }
        });
      }
    });

    $scope.setCommentFocus = function  () {
      $scope.$broadcast('setFocusToCommentBox', null);
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
              href: "#/community/"+$scope.comm.label+"/"+$scope.comm.uid+"/"+val.tabType,
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
    

    //events
    var articleUpdateEvent = $scope.$on('article.update', function(event, data) {
      $scope.feed = data;
      $scope.resetArtData();
      $scope.getCommunityData($scope.feed.community.uid);
    });
    var articleEdittedEvent = $rootScope.$on('articleEditted', function(event, data){
      $scope.resetArtData();
      $scope.getArticleData();
    });
    var feedDeletedEvent = $scope.$on('feed.deleted', function(event, data) {
      var delFeedUid = data;
    });

    $scope.$on("$destroy", function(){
      //clear all listeners
      articleUpdateEvent();
      articleEdittedEvent();
      feedDeletedEvent();
    });


  });