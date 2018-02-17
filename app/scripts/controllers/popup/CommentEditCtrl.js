'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('CommentEditCtrl', function ($scope, $rootScope, $compile, $http, Config, $modal,  $filter, apiFiles, apiFeedData, editCommentModal) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.editCommentData = $scope.$parent.editCommentData;
    $scope.cmntAttachment = [{images: [], documents: []}];

    if($scope.editCommentData.images && ($scope.editCommentData.images.length > 0))
    {
      angular.forEach($scope.editCommentData.images, function(val, key) {
        $scope.cmntAttachment[0].images.push(val);
      });
    }
    if($scope.editCommentData.documents && ($scope.editCommentData.documents.length > 0))
    {
      angular.forEach($scope.editCommentData.documents, function(val, key) {
        $scope.cmntAttachment[0].documents.push(val);
      });
    }

    $scope.editComment = function(cmntid, txtareaid, frm_id, feed_index){	
      var comment_text = $("#"+txtareaid).val();

	  var form_data = {
        commentUid: cmntid,
        text: comment_text,
        attachments: []
      };
	  if($scope.cmntAttachment[0].images !== undefined && $scope.cmntAttachment[0].images.length > 0){
          angular.forEach($scope.cmntAttachment[0].images, function(val, key) {
            form_data.attachments.push(val);
          });
      }
	  if($scope.cmntAttachment[0].documents !== undefined && $scope.cmntAttachment[0].documents.length > 0){
          angular.forEach($scope.cmntAttachment[0].documents, function(val, key) {
            form_data.attachments.push(val);
          });
      }
	  
	  if(comment_text.length > 0){
        var apiUrl = '/api/comment';
          $http.post(apiUrl, form_data)
          .then(function onSuccess(response) {
        	  $scope.getFeedData();
          }, function onError(response) {
          });
      }
      else{
        alert("Please enter comment text.");
      }
      
    };
    
    $scope.removeAllAttachment = function(feedindex){
      if($scope.cmntAttachment[feedindex].images)
        $scope.cmntAttachment[feedindex].images = [];
      if($scope.cmntAttachment[feedindex].documents)
        $scope.cmntAttachDocs[feedindex].documents = [];
    };

    $scope.onCmntEditFileSelect = function($files, feedindex){
      
                  
          if ($files.length > 0) {

            apiFiles.uploadFiles($files).then(function(data){
              angular.forEach(data, function(val ,key) {
                  /*format of val:
                     {
                      "id": 496,
                      "uid": "7b8aafc8-b697-41cf-804e-de11c4f19727",
                      "fileType": "application/msword",
                      "fileName": "doc1.doc",
                      "description": "doc1",
                      "url": "",
                      "thumbUrl": ""
                    }
                  */
                  if($filter('getFileType')(val.fileType) == "img"){
                    $scope.cmntAttachment[feedindex].images.push(val);
                  }
                  else{
                    $scope.cmntAttachment[feedindex].documents.push(val);
                  }
              });
            }, function(err) {
              // body...
            }, function(prgs) {
              // body...
            });
          }
    };

    $scope.deleteImgAttachFile = function(feedindex, fileindex, evt){
      $scope.cmntAttachment[feedindex].images.splice(fileindex, 1);
      evt.stopPropagation();
    };

    $scope.deleteDocAttachFile = function(feedindex, fileindex, evt){
      $scope.cmntAttachment[feedindex].documents.splice(fileindex, 1);
      evt.stopPropagation();
    };

    var loginModal = $modal({scope: $scope, template:'../app/views/popups/comment_edit.tpl.html', animation:"am-fade-and-scale", show:false});

    $scope.closeEditCommentPopup = function(){
       editCommentModal.hide();
    };

    $scope.addComment = function(feedindex, feedUid){

      if(!$scope.cmntAttachment[feedindex]){
        //create an empty object
        $scope.cmntAttachment[feedindex] = {}; 
      }
      var comment_text = '';
      if("commentText" in $scope.cmntAttachment[feedindex]){
        comment_text = $scope.cmntAttachment[feedindex].commentText;
      }
      var form_data = new FormData();
      form_data.append('content', feedUid);
      form_data.append('text', comment_text);
      if("images" in $scope.cmntAttachment[feedindex]){
        if($scope.cmntAttachment[feedindex].images.length > 0)
        {
          //form_data.append('file', $scope.uploadCommentFiles[0]);
          $scope.cmntAttachment[feedindex].images.forEach(function(entry, key){
            form_data.append('file', $scope.cmntAttachment[feedindex].images[key]);
          });
        }
      }
      if("document" in $scope.cmntAttachment[feedindex]){
        if($scope.cmntAttachment[feedindex].document.length > 0)
        {
          //form_data.append('file', $scope.uploadCommentFiles[0]);
          $scope.cmntAttachment[feedindex].document.forEach(function(entry, key){
            form_data.append('file', $scope.cmntAttachment[feedindex].document[key]);
          });
        }
      }

      
      if(comment_text.length > 0)
      {
        apiFeedData.postComment(form_data);
      }
      else{
        alert("Please enter comment text.");
      }
    };

  });