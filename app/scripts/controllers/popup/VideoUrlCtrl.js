'use strict';

angular.module('inspherisProjectApp')

  .controller('CanalUrlCtrl', function ( $scope, $rootScope, $timeout, youtubeVideo, videoUrlModal, embededCodeFromUrl, notifyModal) {  // Defination of Ctrl


      $scope.canalUrl = "";
      $scope.videoPreview = 'invalid';
      $scope.videoData = '';
      $scope.isValidVideo = false;
      $scope.embededCodeFromUrl = null;
      $scope.videoTitle = "";
      //$scope.canalEmbedCode = "<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen width='480' height='270' frameborder='0' scrolling='no' src='http://player.canalplus.fr/embed/?param=cplus&vid=1306659'></iframe>";
      //$scope.canalEmbedCode = "<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen width='480' height='270' frameborder='0' scrolling='no' ng-src='{{canalUrl}}'> </iframe>";
       $scope.canalEmbedCode = "<canal:player videoid='canalUrl'></canal:player>";


      // $scope.bindCanalvdo = function(){            
    	 //    $scope.videoPreview = $scope.canalEmbedCode.replace("canalUrl", $scope.canalUrl); //CVDOID
      //       $scope.videoData = {
      //               embedVideo: $scope.videoPreview,
      //               embedVideoTitle: $scope.videoTitle,
      //               thumbUrl: "images/canal/canal_movie.png"
      //             };
      //             $scope.isValidVideo = true;
      //             window.CANAL.initPlayers();
      // };

      var SomeController = function () {
          this.customHtml = '<ul><li>render me please</li></ul>';
      }
      

      var tempSeartText = '', filterTextTimeout = null;
      
  
      $scope.handleClickEvent =  function(event){
        event.stopPropagation();
      };

      $scope.done = function(){
        if($scope.isValidVideo){
          if($scope.videoData != ''){
            $scope.closeThisDialog({flag: 'ok', data: $scope.videoData});
          }
          else{
            $scope.closeThisDialog({flag: 'cancel', data: null});
          }
        }//isValidVideo
      };

      $scope.$on("$destroy", function(){
        if($scope.embededCodeFromUrl){
          $scope.embededCodeFromUrl.cancel();
        }
       // watchCanalUrl();
      });


    }) // End Ctrl

  .controller('VideoUrlCtrl', function ( $scope, $rootScope, $timeout, youtubeVideo, videoUrlModal, embededCodeFromUrl, notifyModal) {
      

      $scope.youtubeUrl = "";
      $scope.videoPreview = 'invalid';
      $scope.videoData = '';
      $scope.isValidVideo = false;
      $scope.embededCodeFromUrl = null;
      
      var tempSeartText = '', filterTextTimeout = null;
      var watchYoutubeUrl = $scope.$watch('youtubeUrl', function (val) {
        if (filterTextTimeout || (val.length == 0)){
          //cancel search if text length is zero or search text has changed
          $timeout.cancel(filterTextTimeout);
        }
        tempSeartText = val;

        filterTextTimeout = $timeout(function() {
            $scope.feeds = [];
            if(tempSeartText != ''){  
              if($scope.embededCodeFromUrl){
                //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
                $scope.embededCodeFromUrl.cancel('cancelled');
              }
              $scope.embededCodeFromUrl = new embededCodeFromUrl();
              $scope.embededCodeFromUrl.getEmbedded(tempSeartText).then(function(data){
                if(data.html && data.thumbnail_url){
                  $scope.videoPreview = data.html;
                  //$scope.videoData = data;
                  $scope.videoData = {
                    embedVideo: data.html,
                    embedVideoTitle: data.title,
                    thumbUrl: data.thumbnail_url
                  };
                  $scope.isValidVideo = true;
                }
                else{
                  notifyModal.showTranslated("Invalid video", 'error', null);
                }
              }, function(err){
                //error
                $scope.videoPreview = 'invalid';
                //notifyModal.showTranslated("something_went_wrong", 'error', null);
                notifyModal.showTranslated("invalid_url_or_enable_cross_origin_acess", 'error', null);
                //{"error_code":404,"error_message":"HTTP 404: Not Found","type":"error"}
              });
            }else{
              //cancel if search text length is less than zero
              if($scope.embededCodeFromUrl){
                $scope.embededCodeFromUrl.cancel();
              }
            }
        }, 500); // delay 250 ms
      });
  
      $scope.handleClickEvent =  function(event){
        event.stopPropagation();
      };

      $scope.done = function(){
        if($scope.isValidVideo){
          if($scope.videoData != ''){
            $scope.closeThisDialog({flag: 'ok', data: $scope.videoData});
          }
          else{
            $scope.closeThisDialog({flag: 'cancel', data: null});
          }
        }//isValidVideo
      };

      $scope.$on("$destroy", function(){
        if($scope.embededCodeFromUrl){
          $scope.embededCodeFromUrl.cancel();
        }
        watchYoutubeUrl();
      });
  });