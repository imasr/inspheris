'use strict';

angular.module('inspherisProjectApp')
  .controller('UsefulLinkManagerCtrl', function ($scope, $rootScope, $http, $timeout, $q, sharedData, notifyModal, apiUsefulLinks, createLinkOrHeadingModal){
    $scope.headingList = [];
    $scope.linkList = [];
    $scope.md = {
      data: $scope.$parent.ngDialogData,
      footerHeadings: [],
      footerLinks: [],
      footer: ($scope.$parent.ngDialogData.type == "footer") ? true : false,
      title: ($scope.$parent.ngDialogData.type == "footer") ? "Footer Menu Manager" : "Header Menu Manager"
    };

    $scope.fetchHeading = function(){
      $scope.headingList = [];
      apiUsefulLinks.headingList({footer: $scope.md.footer}).then(function(data){
        $scope.headingList = data.data;
      }, function(err){
      });
    };
    $scope.fetchHeading();

    $scope.fetchLinks = function(){
      $scope.linkList = [];
      apiUsefulLinks.linkList({footer: $scope.md.footer}).then(function(data){
        $scope.linkList = data.data;
      }, function(err){
      });
    };
    $scope.fetchLinks();

    $scope.createHeading = function(hdata){
      var modal = createLinkOrHeadingModal.show({
        action: (hdata && hdata.uid) ? "edit" : "create",
        type: 'heading',
        footer: $scope.md.footer,
        data: hdata
      });
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.fetchHeading();
          }
      });
    };

    $scope.createLink = function(sendData){
      var modal = createLinkOrHeadingModal.show({
        action: (sendData && sendData.uid) ? "edit" : "create",
        type: 'link',
        data: sendData});
      modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.fetchLinks();
          }
      });
    };
    $scope.deleteHeading = function(hdata){
      apiUsefulLinks.deleteHeading({uid: hdata.uid}).then(function(data){
          angular.forEach($scope.headingList, function(val, key){
            if(hdata.uid == val.uid){
              $scope.headingList.splice(key, 1);
            }
          });
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };
    $scope.deleteLink = function(ldata){
      apiUsefulLinks.deleteLink({uid: ldata.uid}).then(function(data){
        if(ldata.footer){
          angular.forEach($scope.md.footerLinks, function(val, key){
            if(ldata.uid == val.uid){
              $scope.md.footerLinks.splice(key, 1);
            }
          });
        }
        else{
          angular.forEach($scope.linkList, function(val, key){
            if(ldata.uid == val.uid){
              $scope.linkList.splice(key, 1);
            }
          });
        }
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    };
  })
.controller('sortableLinkCtrl', function ($scope, notifyModal,apiUsefulLinks){
	$scope.sortableOptions = {
			stop: function(e, ui) {
				var postData = [];
  			   	if($scope.linkList != undefined){
  			   		var i = 1;
  			   		angular.forEach($scope.linkList, function(val, key)  {
  			   			postData.push({"uid" : val.uid , "sequenceNumber" : i});
  			   			i++;
  			   		});
  						
  			   		apiUsefulLinks.orderLinks(postData).then(function(data){
  					}, function(err){
  						notifyModal.showTranslated('something_went_wrong', 'error', null);
  					});
  			   	}
			}
	};
})
.controller('sortableHeadingCtrl', function ($scope, notifyModal,apiUsefulLinks){
	$scope.sortableOptions = {
			stop: function(e, ui) {
				var postData = [];
  			   	if($scope.headingList != undefined){
  			   		var i = 1;
  			   		angular.forEach($scope.headingList, function(val, key)  {
  			   			postData.push({"uid" : val.uid , "sequenceNumber" : i});
  			   			i++;
  			   		});
  						
  			   		apiUsefulLinks.orderHeadings(postData).then(function(data){
  					}, function(err){
  						notifyModal.showTranslated('something_went_wrong', 'error', null);
  					});
  			   	}
			}
	};
});