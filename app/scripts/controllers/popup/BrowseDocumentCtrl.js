'use strict';

angular.module('inspherisProjectApp')
  .controller('BrowseDocumentCtrl', function ($scope, $rootScope, $compile, $http, Config, browseDocumentModal, apiMediaManager, apiCommunity) {
    //in parent scope declare $scope.$parent.selectedRemoteDocs array which containes the attachment documents
    $scope.selectedDocuments = [];
    if($scope.$parent.ngDialogData){
      if($scope.$parent.ngDialogData.length > 0){
        $scope.selectedDocuments = angular.copy($scope.$parent.ngDialogData);
      }
    }

    
    $scope.remoteFiles = [];
    $scope.allDocs = [];

    $scope.filterModel = 'all';
    $scope.searchfile = "";
    $scope.selectedDocFile = {text: 'All Types'};
    $scope.fileSelectOptions = [{text: 'All Types', type: 'all'}, {text: 'PDF', type: 'pdf'}, {text: 'Word', type: 'doc'}, {text: 'Excel', type: 'xls'}, {text: 'Powerpoint', type: 'ppt'}];
    $scope.filterFiles = function(selected){
      $scope.filterModel =selected.type;
    };

    $scope.toggleDocSelection = function(selObj){
      var idx = $scope.getIndexOfDoc(selObj);
      if(idx > -1){
        $scope.selectedDocuments.splice(idx, 1);
      }
      else{
        $scope.selectedDocuments.push(selObj); 
      }
    };

    $scope.showMoreDocs = function(){
      var len = $scope.allDocs.length;
      if(len > 0)
      for(var i= $scope.remoteFiles.length; i<len; i++){
        $scope.remoteFiles.push($scope.allDocs[i]);
        if((i != 0) && (i%50 == 0)){
          break;
        }
      }
    };

    apiMediaManager.getFiles("document", null).then(function(data){
      //$scope.remoteFiles = data;
      $scope.allDocs = data;
      $scope.showMoreDocs();
    }, function(err){
    });    

    $scope.getCheckedStatus = function(obj){
      var idx = $scope.getIndexOfDoc(obj);
      if(idx > -1){
        return true;
      }
      else{
        false;
      }
    };
    $scope.getIndexOfDoc =  function(obj){
      //uid should be present in both the array
      var idx = -1;
      var len = $scope.selectedDocuments.length;
      for(var i=0; i<len; i++){
        if($scope.selectedDocuments[i].uid == obj.uid){
              idx = i;
              break;
        }
      }
      return idx;
    };
    

  });