'use strict';
angular.module('inspherisProjectApp')
  .controller('FileDetailEditorCtrl', function ($scope, $rootScope, $compile, $timeout, notifyModal, fileDetailEditorModal) {
   
    //get array of documents passed from parent scope
    $scope.modalData = $scope.$parent.ngDialogData;
    $scope.fileArray = $scope.modalData.data;
    $scope.type = $scope.modalData.type;
    $scope.fileindex = $scope.modalData.fileindex;

  
    $scope.navigate = function(optn) {
      if(optn == 'next'){
        $scope.fileindex++;
      }
      else if(optn == 'prev'){
        $scope.fileindex--;
      }
    };

    $scope.closeModal = function(){
      fileDetailEditorModal.hide();
    };
    $scope.removeEntry = function(){
      
    };
    $rootScope.$on('file.deleted', function(event, data){
      angular.forEach($scope.fileArray, function(val, key){
        if(val.uid){
          if(val.uid == data.uid){
            $scope.fileArray.splice(key, 1);
            if($scope.fileArray.length <= 0){
              $scope.closeModal();
            }
            else if($scope.fileArray.length < (key+1)){
              $scope.fileindex = 0; //if last element deleted go to first elem
            }
            else{
              //last element is not delted go to next elem
              $scope.fileindex = key;
            }
          }
        }
      });
    });
  });