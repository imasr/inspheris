'use strict';

angular.module('inspherisProjectApp')
  .controller('CommunityMemberManagerCtrl', function ($scope, $rootScope, $compile, $http, Config, browseImageModal, apiFiles, apiCommunity, apiMediaManager, notifyModal, apiPeoples, $q) {
    $scope.searchText = '';
    $scope.searhApi = new apiPeoples();
    $scope.searchRes = null
    $scope.md = {
      status: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor,
      data: $scope.$parent.ngDialogData,
      isSearching: 0,  //0: ideal, 1: fetching, 2: fetched, 3: eroor,
    };
    $scope.membersStatus = [];
    $scope.divisions = [];
    $scope.services = [];
    $scope.sites = [];

    $scope.selectedStatusOfAllMem = {label :"Select Status", selected :false};

    $scope.selectedDivision = {
      name: "Division"
    };
    $scope.selectedService = {
      name : "Service",
      uid : null ,
    };
    $scope.selectServiceDisabled = true;
    
    $scope.selectedCompany = {
      name: "Company",
      val: null
    };
    $scope.selectedSite = {
      name: "Site",
      val: null
    };

    $scope.departments = [];
    $scope.selectDepartmentDisabled = false;
    $scope.selectedDepartment = {
        name: "Department"
    };

    $scope.selectDivisionDisabled = true;
    $scope.selectedDivision = {
        name: "Division"
    };

    $scope.selectServiceDisabled = true;
    $scope.selectedService = {
      name : "Service"
    };

    $scope.selectAll = {
      val: false
    };

    $scope.peopleApi = new apiPeoples();
    $scope.getServices = new apiPeoples();
    $scope.getSites = new apiPeoples();
    var pr = [
      apiCommunity.getMemberStatus(),
      $scope.peopleApi.getFilterList({field : 'department'}),
      $scope.getServices.getFilterList({field : 'service'}),
      $scope.getSites.getFilterList({field : 'site'})
    ];

    $q.all(pr).then(function(data){
      //data[0]
      var temp = [];
      angular.forEach(data[0], function(val){
        var obj = {
          label: val,
          selected: false
        };
        temp.push(obj);
      });
      $scope.membersStatus = temp;

      //----
      //data[1] -- pole (department)
      var dtemp = [];
      dtemp.push(angular.copy($scope.selectedDepartment));
      angular.forEach(data[1], function(val){
        var obj = {name: val};
        dtemp.push(obj);
      });
      $scope.departments = dtemp;

      //data 2 -- service
      var ctemp = [];
      ctemp.push(angular.copy($scope.selectedService));
      angular.forEach(data[2], function(val){
        var obj = {name: val};
        ctemp.push(obj);
      });
      $scope.services = ctemp;
  
      //data 3 -- site
      var stemp = [];
      stemp.push(angular.copy($scope.selectedSite));
      angular.forEach(data[3], function(val){
        var obj = {name: val};
        stemp.push(obj);
      });
      $scope.sites = stemp;
    }, function(err){
      notifyModal.showTranslated('something_went_wrong', 'error', null);
    });

    $scope.departmentSelected = function(selected){

      $scope.divisions = [];
      $scope.selectedDepartment = selected;
      $scope.selectDivisionDisabled = $scope.selectedDepartment.name != 'Department' ? false : true;
      if($scope.selectedDepartment.name == 'Department'){
        $scope.selectedDivision = {name : 'Division'};
        $scope.selectedService = {name : 'Service'};
        $scope.selectServiceDisabled = $scope.selectedDivision.name != 'Division' ? false : true;
      }
      $scope.selectedDivision = {
        name : "Division"
      };

      // direction list
      $scope.getDirections = new apiPeoples();
      $scope.getDirections.getFilterList({field: 'direction',department : selected.name}).then(function(data){
        var stemp = [];
        stemp.push(angular.copy($scope.selectedDivision));
        angular.forEach(data, function(val){
          var obj = { name : val };
          stemp.push(obj);
        });
        $scope.divisions = stemp;
      }, function(err){

      });
    };

    $scope.doSearch = function(){
      var filters = [];
      angular.forEach($scope.membersStatus, function(val){
        if(val.selected){
          filters.push(val.label);
        }
      });
      var pram = {
          uid: $scope.$parent.ngDialogData.community.uid, 
          filter : filters.join(),
          q : $scope.searchText,
          //companyFilter : $scope.selectedCompany.val,
        };
      
      if($scope.selectedDepartment.name != "Department"){
         pram.departmentFilter = $scope.selectedDepartment.name; 
      }
      if($scope.selectedSite.name != "Site"){
         pram.siteFilter = $scope.selectedSite.name;
      }
      if($scope.selectedDivision.name != "Division"){
         pram.divisionFilter = $scope.selectedDivision.name;
      }
      if($scope.selectedService.name != "Service"){
         pram.serviceFilter = $scope.selectedService.name;
      }

      $scope.md.isSearching = 1;
      $scope.searchRes = null;
      if($scope.searhApi){
        $scope.searhApi.cancel();
      }
      $scope.searhApi = new apiPeoples();
      $scope.searhApi.getComMemb(pram).then(function(data){
        $scope.md.isSearching = 2;
        if(data && data.members.length > 0){
          angular.forEach(data.members, function(val, key){
            data.members[key].statusSelection = {label: data.members[key].status, selected: false};
          });
        }
        $scope.searchRes = data;
      }, function(err){
        $scope.md.isSearching = 3;
        //http://v4dev.inspheris.net/api/community/members?companyFilter=&divisionFilter=DEC&filter=Follower&filter=Contributor&filter=Pending&filter=CommunityManager&filter=Subscriber&serviceFilter=DEC+2&siteFilter=abc&uid=122d4992-42a5-4016-8dfe-2d8a5b1ec807
      });
    };
    $scope.divisionSelected = function(selected){
      $scope.selectedDivision = selected;
      $scope.selectServiceDisabled = $scope.selectedDivision.name != 'Division' ? false : true;
      if($scope.selectedDivision.name == 'Division'){
        $scope.selectedService = {name : 'Service'};
      }
    };
    $scope.siteSelected = function(selected){
      $scope.selectedSite = selected;
    };
    $scope.serviceSelected = function(selected){
      $scope.doSearch();
    };
    $scope.companySelected = function(selected){
      $scope.doSearch();
    };
    $scope.changeMemberStatus = function(selected, member){
    };
    $scope.changeAllMemberStatus = function(selected){
      if($scope.selectedStatusOfAllMem.label != "Select Staus" && $scope.searchRes){
        $scope.selectAll.val = true;
        angular.forEach($scope.searchRes.members, function(val, key){
          val.statusSelection.selected = $scope.selectAll.val;
          val.statusSelection.label = $scope.selectedStatusOfAllMem.label;
        });
      }
    };

    $scope.selectAllMemb = function(){
      if($scope.searchRes && $scope.searchRes.members){
        angular.forEach($scope.searchRes.members, function(val, key){
          val.statusSelection.selected = $scope.selectAll.val;
          //data.members[key].statusSelection = {label: data.members[key].status, selected: false};
        });
      }
    };
    $scope.save = function(){
      var listMembers = [];
      if($scope.searchRes){
        angular.forEach($scope.searchRes.members, function(val, key){
          if(val.statusSelection.selected){
            listMembers.push({
                          memberUid : val.member.uid,
                          status : val.statusSelection.label
                        });
          }
        });
      }

      var postdata = {
          communityUid : $scope.$parent.ngDialogData.community.uid,
          members : listMembers
      };
      
      if (listMembers.length > 0){
        apiCommunity.changeStatus(postdata).then(function(data){
          $scope.searchRes = null;
          $scope.selectAll = {
            val: false
          };
        }, function(err){
          notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
      }
    };
    $scope.generalSearch = function(event){
      var txt = '';
      if(event.keyCode == 13 || event.keyCode == 1){
        $scope.doSearch();
      }
    };
  });