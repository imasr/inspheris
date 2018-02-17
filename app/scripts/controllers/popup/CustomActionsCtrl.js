'use strict';
angular.module('inspherisProjectApp')
  .controller('CustomActionsCtrl', function ($scope, $rootScope, selectLocationModal, notifyModal, apiPosition, apiPeoples, $q, apiOrganization, apiCompetency, $timeout) {//uiGmapGoogleMapApi,
    //required plugin angular-google-maps
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor,
      userData: null,
      popupTitle: '',
      data: $scope.$parent.ngDialogData,
      okBtn: false
    };
    $scope.positionSelected = {   
       uid : null,   
       name: "Select Position",    
       level: 0    
    };
    $scope.divisionsSelected = {   
       uid : null,   
       name: "Select Division", 
    };
    $scope.serviceSelected = {   
       uid : null,   
       name: "Select Service", 
    };
    $scope.selectedPositions = [];
    $scope.selectedCompetencies = [];

    $scope.positions = null;
    $scope.divisions = null;
    $scope.services = [];
    $scope.competencies = null;


    $scope.selectDivision = function(d, uid){
      $scope.services = [];
      if(uid){
        apiOrganization.getByUid(uid).then(function(data){
          var tempArr = [];
          tempArr.push(data);
          angular.forEach(d, function(val, key){
            if(val.parent && (val.parent.uid == uid)){
              tempArr.push(val);
            }
          });
          $scope.services = tempArr;
          /*for(var i=0;i<$scope.divisions.length;i++){
            if(($scope.divisions[i].parent !=undefined )&& ($scope.divisions[i].parent.uid==uid)){
              $scope.services.push($scope.divisions[i]);
            }
          }*/ 
          //$scope.services = data;
        }, function(err){
          notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
      }
      if($scope.serviceSelected.uid && $scope.divisionsSelected.uid){
        $scope.md.okBtn = true;
      }
    };
    $scope.selectService = function(){
      if($scope.serviceSelected.uid && $scope.divisionsSelected.uid){
        $scope.md.okBtn = true;
      }
    };
    $scope.positionToggle = function(p){
      var idx = $scope.selectedPositions.indexOf(p);
      if (idx > -1) {
        // is currently selected
        $scope.selectedPositions.splice(idx, 1);
      }
      else {
        // is newly selected
        $scope.selectedPositions.push(p);
      }
      if($scope.selectedPositions.length>0){
        $scope.md.okBtn = true;
      }
    };
    $scope.competencyToggle = function(c){
      var idx = $scope.selectedCompetencies.indexOf(c);
      if (idx > -1) {
        // is currently selected
        $scope.selectedCompetencies.splice(idx, 1);
      }
      else {
        // is newly selected
        $scope.selectedCompetencies.push(c);
      }
      if($scope.selectedCompetencies.length>0){
        $scope.md.okBtn = true;
      }
    };

    if($scope.md.data.type == 'user'){
      switch($scope.md.data.action){

        case 'add_position':
          $scope.md.popupTitle = "Add_Positions";
          $scope.peopleApi = new apiPeoples();
          $scope.md.status = 1;
          var pr0 = apiPosition.getAll();
          var pr1 = $scope.peopleApi.getUser({uid: $scope.md.data.data.uid});
          $q.all([pr0, pr1]).then(function(data){
            //data[0];
            $scope.positions = data[0];
            //data[1];
            //$scope.selectedPositions = (data[0].positions) ? data[0].positions : [];
            if(data[1].positions){
              var userPositions = data[1].positions;
              angular.forEach(userPositions, function(val, key){
                var len = $scope.positions.length;
                for(var i=0; i<len; i++){
                  if($scope.positions[i].uid == val.uid){
                    $scope.selectedPositions.push($scope.positions[i]);
                    break;
                  }
                }
              });
            }
            if($scope.selectedPositions.length>0){
              $scope.md.okBtn = true;
            }
            $scope.md.status = 2;
          }, function(err){
            $scope.md.status = 3;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          /* 
          apiPosition.getAll().then(function(data){
            
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          */
        break;

        case 'add_organization':
          $scope.md.popupTitle = "Add organizations";
          $scope.peopleApi = new apiPeoples();
          $scope.md.status = 1;
          var pr0 = apiOrganization.getAll();
          var pr1 = $scope.peopleApi.getUser({uid: $scope.md.data.data.uid});
          $q.all([pr0, pr1]).then(function(data){
            //data[0];
            $scope.divisions = data[0];
            //data[1];
            $scope.md.userData = data[1];
            if($scope.md.userData.service!==undefined){
              //$scope.selectDivision($scope.divisions, $scope.md.userData.division);
              $scope.selectDivision($scope.divisions, null);
            }
            $scope.md.status = 2;
          }, function(err){
            $scope.md.status = 3;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          /* 
          apiPosition.getAll().then(function(data){
            
          }, function(err){
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
          */
        break;

        case 'add_competencies':
          $scope.md.popupTitle = "Add competencies";
          $scope.peopleApi = new apiPeoples();
          $scope.md.status = 1;
          var pr0 = apiCompetency.getAll();
          var pr1 = $scope.peopleApi.getUser({uid: $scope.md.data.data.uid});
          $q.all([pr0, pr1]).then(function(data){
            //data[0];
            $scope.competencies = data[0];
            //data[1];
            if(data[1].competencies){
              var userCom = data[1].competencies;
              angular.forEach(userCom, function(val, key){
                var len = $scope.competencies.length;
                for(var i=0; i<len; i++){
                  if($scope.competencies[i].uid == val.uid){
                    $scope.selectedCompetencies.push($scope.competencies[i]);
                    break;
                  }
                }
              });
            }
            if($scope.selectedCompetencies.length>0){
              $scope.md.okBtn = true;
            }
            $scope.md.status = 2;
          }, function(err){
            $scope.md.status = 3;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
        break;
      }
    }

    $scope.done = function() {
      if($scope.md.data.type == 'user'){
        switch($scope.md.data.action){
          case 'add_position':
            var postdata = {
              uid: $scope.md.data.data.uid,
              positions: []
            };
            angular.forEach($scope.selectedPositions, function(val){
              postdata.positions.push(val.uid);
            });
            if($scope.md.okBtn){
              $scope.peopleApi = new apiPeoples();
              $scope.peopleApi.addUsersData(postdata, 'position').then(function(data){
                $scope.closeThisDialog({flag: 'ok', data: data});
              }, function(err){
                notifyModal.showTranslated('something_went_wrong', 'error', null);
              });
            }
            //add_position
          break;
          case 'add_organization':
            var postdata = {
              uid: $scope.md.userData.uid,
              division: $scope.divisionsSelected.uid,
              service: $scope.serviceSelected.uid
            };

            if($scope.md.okBtn){
              $scope.peopleApi = new apiPeoples();
              $scope.peopleApi.addUsersData(postdata, 'organization').then(function(data){
                $scope.closeThisDialog({flag: 'ok', data: data});
              }, function(err){
                notifyModal.showTranslated('something_went_wrong', 'error', null);
              });
            }
            //add_position
          break;
          case 'add_competencies':
            var postdata = {
              uid: $scope.md.data.data.uid,
              competencies: []
            };
            angular.forEach($scope.selectedCompetencies, function(val){
              postdata.competencies.push(val.uid);
            });
            if($scope.md.okBtn){
              $scope.peopleApi = new apiPeoples();
              $scope.peopleApi.addUsersData(postdata, 'competency').then(function(data){
                $scope.closeThisDialog({flag: 'ok', data: data});
              }, function(err){
                notifyModal.showTranslated('something_went_wrong', 'error', null);
              });
            }
            //add_position
          break;
        }
      }
    }

  });

