'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('CollectionCtrl', function ($scope, $http, Config) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.feeds = [];
    $scope.artPopupData = [];

    //prevent dropdown hiding if clicked on input type inside it
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });

    //$scope.preventClose = function(event) { event.stopPropagation(); };

    $scope.showCommentBox = function(feedId){
      $("#"+feedId).toggleClass("comment_box_hide");
    };

    var artPopupModal = $modal({scope: $scope, template:'views/popup_art_with_image.html', animation:"am-fade-and-scale", show:false});

    $scope.showArtPopup = function(feedindex){
      //feeds data from paraent scope
      var feeduid = $scope.feeds[feedindex].uid;

      var getArtDataUrl = "/api/content/"+feeduid;
      $http({method: 'GET', url: getArtDataUrl}).
      then(function onSuccess(response) {
          var data = response.data;
        // this callback will be called asynchronously
        // when the response is available
        $scope.artPopupData = data;
      }, function onError(response) {
        var data = response.data;
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      artPopupModal.$promise.then(function(){
        artPopupModal.show();
      });
    };
    $scope.closeArtPopup = function(){
      artPopupModal.$promise.then(artPopupModal.hide);
    };

    var getFeedUrl = "/api/content/list";
    $http({method: 'GET', url: getFeedUrl}).
    then(function onSuccess(response) {
        var data = response.data;
      // this callback will be called asynchronously
      // when the response is available
      $scope.feeds = data.contents;
      
      $scope.gridFeed1 = data.contents[0];
      $scope.gridFeed2 = data.contents[1];
      data.contents.splice(0,2);
      $scope.gridFeedn = data.contents;
    }, function onError(response) {
      var data = response.data;
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  });