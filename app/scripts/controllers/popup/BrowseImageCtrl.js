'use strict';

angular.module('inspherisProjectApp')
  .controller('BrowseImageCtrl', function ($scope, $rootScope, $compile, $http, Config, browseImageModal, apiFiles, apiCommunity, apiMediaManager, notifyModal) {

    //get $scope.$parent.selectedRemoteImgs from parent scope
    $scope.selectedImages = [];
    if($scope.$parent.ngDialogData){
      if($scope.$parent.ngDialogData.length > 0){
        $scope.selectedImages = angular.copy($scope.$parent.ngDialogData);
      }
    }

    $scope.remoteImages = [];
    $scope.allImages = [];

    $scope.comSelectOptions = [];
    apiCommunity.getCommunitiesData().then(function (data){
          var communitylist = data;
          //empty the array
          $scope.comSelectOptions = [];
          $scope.communitySelected = {
              text: "Select Community"
          };
          communitylist.forEach(function(entry){
            var tempObj = {};
            tempObj.text = entry.label;
            tempObj.commid = entry.uid;

            $scope.comSelectOptions.push(tempObj);
          });
    }, function(err){
        notifyModal.show('Unable to load community list.', 'error');
    });


    $scope.toggleImgSelection = function(selObj){
      var len = $scope.selectedImages.length;
      if(len == 0){
        $scope.selectedImages.push(selObj);
      }
      else{
        for(var i=0; i<len; i++){
            if(selObj.uid == $scope.selectedImages[i].uid){
              $scope.selectedImages.splice(i, 1);
              return true;
            }
            else if(i == (len-1)){
              $scope.selectedImages.push(selObj);
              return false;
            }
        }//for
      }
    };
    $scope.showMoreImages = function(){
      if($scope.allImages.length > 0)
      for(var i= $scope.remoteImages.length; i<($scope.allImages.length); i++){
        $scope.remoteImages.push($scope.allImages[i]);
        if((i != 0) && (i%50 == 0)){
          break;
        }
      }
    };

    apiMediaManager.getFiles("image", null).then(function(data){
      $scope.allImages = data;
      $scope.showMoreImages();
    }, function(err){
    });

    $scope.getIndexOfImage =  function(obj){
      //uid should be present in both the array
      var idx = -1;
      var len = $scope.selectedImages.length;
      for(var i=0; i<len; i++){
        if($scope.selectedImages[i].uid == obj.uid){
              idx = i;
              break;
        }
      }
      return idx;
    };
    $scope.getCheckedStatus = function(obj){
      var idx = $scope.getIndexOfImage(obj);
      if(idx > -1){
        return true;
      }
      else{
        false;
      }
    };
  });
