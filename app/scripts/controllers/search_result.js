'use strict';
/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */
angular.module('inspherisProjectApp')
.controller('SearchResultCtrl', function ($scope, $rootScope, $stateParams, $timeout, $window, $location, apiSearch,$filter) {
    $scope.activeView = 'list';

    $scope.searchData = null;
    $scope.allFeedCount = null;
    $scope.searchApi = null;
    $scope.showLoadMore = false;

    $scope.searchText = $stateParams.text;
    $scope.selectedType = $stateParams.type;
    $scope.searchFor = $stateParams.type;
    $scope.pageNumber = $stateParams.page;

    $rootScope.highlightText = $scope.searchText;

    $scope.getSearchData = function(){
      //call this function when rootscope language changes for first time to populate search result
      var param = {
            language: $rootScope.currentLanguage.code,
            searchText: $scope.searchText
          };
      if($scope.selectedType != 'all'){
        param.type = $scope.selectedType;
      }
      if($scope.pageNumber > 1){
        param.page = $scope.pageNumber;
      }
      //$scope.searchData = null;
      //$scope.allFeedCount = null;

      $scope.searchApi = new apiSearch();
      $scope.searchApi.search(param).then(function(data){
        //success
        $timeout(function(){
          $scope.$apply(function(){
            if(!$scope.searchData){
              $scope.searchData = data;
            }
            else{
              angular.forEach(data.articles, function(val, key){
                $scope.searchData.articles.push(val);
              });
              angular.forEach(data.documents, function(val, key){
                $scope.searchData.documents.push(val);
              });
              angular.forEach(data.quickposts, function(val, key){
                $scope.searchData.quickposts.push(val);
              });
              angular.forEach(data.wikis, function(val, key){
                $scope.searchData.wikis.push(val);
              });
              angular.forEach(data.events, function(val, key){
                $scope.searchData.events.push(val);
              });
              angular.forEach(data.communities, function(val, key){
                $scope.searchData.communities.push(val);
              });
              angular.forEach(data.members, function(val, key){
                $scope.searchData.members.push(val);
              });
            }
            $scope.allFeedCount = {
              total: data.total,
              article: data.totalArticles,
              document: data.totalDocuments,
              quickpost: data.totalQuickposts,
              wiki: data.totalWikis,
              event: data.totalEvents,
              community: data.totalCommunities,
              people: data.totalMembers
            };
            $scope.showPageNavigationOptns();
          });
        });
        /*$scope.articles = data.articles;
        $scope.documents = data.documents;
        $scope.quickposts = data.quickposts;
        $scope.wikis = data.wikis;
        $scope.event = data.events;
        $scope.communities = data.communities;
        $scope.members = data.members;*/
      }, function(){
        //error
      });
    };

    $scope.searchNow = function(event){
      if(event.which == 13 || event.keyCode == 1){
        $location.path('/search/'+$scope.searchText+'/'+$scope.selectedType+'/1');
      }
    };

    $scope.toggleView = function(viewtype){
      $scope.activeView = viewtype;
      $timeout(function(){
        $(window).trigger('resize');
      }, 100);
    }

    $scope.viewMoreFeed = function(){
      $scope.pageNumber++;
      $scope.getSearchData();
      /*if(optn == 'next'){
        $location.path('/search/'+$scope.searchText+'/'+$scope.selectedType +'/'+($scope.pageNumber++));
      }
      else{
       $location.path('/search/'+$scope.searchText+'/'+$scope.selectedType +'/'+($scope.pageNumber--));
      }*/
    };
    $scope.showPageNavigationOptns = function(){
      var resCount = 10;
      var maxResCnt = 10*$scope.pageNumber;

      if(($scope.allFeedCount.article > maxResCnt) || ($scope.allFeedCount.document > maxResCnt) || ($scope.allFeedCount.quickpost > maxResCnt) || ($scope.allFeedCount.wiki > maxResCnt) || ($scope.allFeedCount.event > maxResCnt) || ($scope.allFeedCount.community > maxResCnt) || ($scope.allFeedCount.people > maxResCnt)){
          $scope.showLoadMore = true;
        }
        else{
          $scope.showLoadMore = false;
        }
    };

    $rootScope.$on('search.type.selected', function(event, data){
      $scope.selectedType = data.val;
      /*if($scope.searchText.length > 0){
        $location.path('/search/'+$scope.searchText+'/'+data.val+'/1');
      }*/
      //$location.path('/search/'+$scope.searchText+'/'+data.val+'/1');
    });

    $rootScope.$watch('currentLanguage', function(){
      if($rootScope.currentLanguage){
        //trigger search again if language changes
        //clear search data first
        $scope.searchData = null;
        $scope.getSearchData();
      }
    });

    $scope.$on('$destroy', function(){
      $rootScope.highlightText = null;
    });
  })
.controller('NewSearchResultCtrl', function ($stateParams, $scope, $rootScope, $timeout, $window, $location, $filter, apiSearch, $state, apiOrganization, apiPeoples, apiCommunity, $q, $base64, notifyModal,apiConfig) {
    $scope.modalData = {};
    $scope.showFeeds = [];
    $scope.resetFilter = false;
    $scope.selectedAddress = '';
    $scope.searchInternal = true;
    $scope.searchExternal = false;
    $scope.showIcon = false;
    $scope.externalSites = [];
    $scope.showExternalSites = function ($event) {
    	if($event.target.checked){
    		$scope.getExternalSiteApi = new apiSearch();
        	$scope.getExternalSiteApi.getExternalSites().then(function(data) {
        		$scope.externalSites = data;
            });
        	$('#searchDropdown').css("display","block");
        	$scope.searchExternal = true;
        	$scope.showIcon = true;
    	}else{
        	$scope.externalSites = [];
        	$scope.searchExternal = false;
    	}
	};


	$scope.activeIcon = function(showIcon){
		$scope.showIcon = !showIcon;
		if($scope.showIcon){
			$('#searchDropdown').css("display","block");
		}else{
			$('#searchDropdown').css("display","none");
		}

	}

	$scope.externalTypes = [];
	$scope.checkSites = function($event,site){
		if ($event.target.checked) {
			if ($scope.externalTypes.indexOf(site) === -1) {
				$scope.externalTypes.push(site);
			}			
		 } else {
			 var index = $scope.externalTypes.indexOf(site);
			 if (index !== -1) {
				 $scope.externalTypes.splice(index, 1);
			 }
		 }
	}

	$scope.stopPropagation = function(event){
	      event.stopPropagation();
	};

	// for enable organizational chart
	$scope.enableExternalSearch = false;
	apiConfig.getByName({name : "EXTERNAL_SEARCH"}).then(function(data){
		$scope.enableExternalSearch = data.value;
	}, function(err){
	});
    //$scope.keyWordApi = new apiSearch();
    $scope.disabledBox = {
      global: false,
      firstName: false,
      competency: false
    };
    $scope.getKeywords = function(viewValue, opn) {
//        if($scope.keyWordApi){
//          $scope.keyWordApi.cancel();
//        }
        if (viewValue != ''){

          $scope.keyWordApi = new apiSearch();
          return $scope.keyWordApi.suggestion({q: viewValue, searchType: opn, language: $rootScope.currentLanguage.code}).then(function(data) {
            return data;
          }
          ,function onError(data){
            notifyModal.showTranslated(data.message,'error',null);
            return [];
          });
        }else{
          return [];
        }
    };
    $scope.searchText = '';
    $scope.firstName = '';
    $scope.competency = '';

    $scope.selSearchType = false; //to show dropdwon
    $scope.searchTypes = [];
    $scope.searchFocus = false;
    $scope.searchStatus = 0; //0=not serarching, 1=searching, 2 = success, 3 = error
    //$scope.hashTags = [{text: '#kitdesurvie'}];
    $scope.searchMessage = ($state.current.name == 'app.search') ? true : false;

    $scope.selectedType = {
      title: 'All',
      type: 'all'
    };
    $scope.filterObj = {};

    //$scope.modalData = $scope.$parent.ngDialogData;
    $scope.modalData.type = $stateParams.type;
    $scope.hashTags = ($scope.modalData.data && $scope.modalData.data.hashtags) ? $scope.modalData.data.hashtags : null;

    $scope.searchApi = null;
    $scope.popupTitle = null;

    $scope.prepareFilter = function(data){
      var tempArr = [];
      tempArr.push($scope.selectedType);
      angular.forEach(data, function(val, key){
        //generate searchable types array
        var obj = {
          title: val,
          type: val.toLowerCase()
        };
        tempArr.push(obj);
        if($stateParams.filter && $stateParams.filter.toLowerCase() == obj.type){
          $scope.selectedType = obj;
        }
      });
      $scope.searchTypes = tempArr;
      $scope.searchTypes.push({title:'Document and Media', type:'file'});
    };

    $scope.$watch('searchText', function(newValue, oldValue) {
        if(newValue !== oldValue){
        	$(".typeahead").removeClass("ng-hide");
        }
    }, true);

    $scope.searchByKeyWord = function(searchText,searchType){
    	$('.typeahead').on('click keyup' ,function(){
    		$( this ).addClass("ng-hide");
    		$scope.doSearch($scope.searchText, searchType);
    	});
    };

    $scope.doSearch = function(tempSeartText, cate){
        //$state.go("app.search.criteria", {text: tempSeartText, page: "0"});
        var filter = null;
        if($scope.modalData.type == 'general'){
          filter = $scope.selectedType.type;
          if(tempSeartText && !$filter('isBlankString')(tempSeartText)){
        	  if(filter != 'file'){
        		  $("#search-result").show();
        		  var externalTypes = angular.toJson($scope.externalTypes);
        		  externalTypes = $base64.encode(externalTypes);;
        		  $state.go("app.search.category", {category: cate, text: tempSeartText, page: "0", filter: filter,internalSearch: $scope.searchInternal, externalSearch: $scope.searchExternal,externalTypes: externalTypes});
        	  }
        	  else{
        		  $("#fileSection").hide().fadeIn('fast');
        		  $("#search-result").hide();
        	  }
          }
        }
        else if($scope.modalData.type == 'directory'){
          filter = {
        	divisionFilter: $scope.selectedDivision.name != 'Direction' ? $scope.selectedDivision.name : '',
            siteFilter: $scope.selectedSite.name != 'Site' ? $scope.selectedSite.name : '',
            serviceFilter: $scope.selectedService.name != 'Service' ? $scope.selectedService.name : ''
          };
          filter = angular.toJson(filter);
          filter = $base64.encode(filter);
          $state.go("app.search.category", {category: cate, text: tempSeartText, page: "0", filter: filter});
        }
    };
    $scope.callDoSearch = function () {

      if($scope.selectedDivision.name == 'Direction' && $scope.selectedSite.name == 'Site' && $scope.selectedService.name == 'Service'){
          $state.go("app.search.random", {type:'directory', filter: 'all'});
        }
        else{
          $scope.resetFilter = true;
         $scope.doSearch($scope.searchText, 'global');
        }
    };

    $scope.divisionSelected = function(selected){

      $scope.services = [];
      $scope.selectedDivision = selected;
      $scope.selectServiceDisabled = $scope.selectedDivision.name != 'Direction' ? false : true;

      if($scope.selectedDivision.name == 'Direction'){
    	  $scope.selectedService = {name : 'Service'};
      }else{
    	  $scope.resetFilter = true;
      }

      $scope.selectedService = {
    		  name : "Service"
      };

      //initiate search conditionally because we are calling departmentSelected functional manually too from this controller
      if($scope.filterObj.divisionFilter != selected.name){
        $scope.callDoSearch();
      }

      $scope.getServices = new apiPeoples();
      $scope.getServices.getFilterList({field: 'service',direction : selected.name}).then(function(data){
    	  var ctemp = [];
          ctemp.push(angular.copy($scope.selectedService));
          angular.forEach(data, function(val){
        	  var obj = {name: val};
        	  ctemp.push(obj);
        	  if($scope.filterObj.serviceFilter && $scope.filterObj.serviceFilter == obj.name){
        		  $scope.serviceSelected(obj);
        	  }
          });
          $scope.services = ctemp;
      }, function(err){

      });
    };

    $scope.serviceSelected = function(selected){
      $scope.selectedService = selected;
      $scope.resetFilter = true;
      //initiate search
      $scope.callDoSearch();
      //$scope.doSearch($scope.searchText);
//      $scope.selectSiteDisabled = $scope.selectedService.uid ? false : true;
    };

    $scope.siteSelected = function(selected){
      $scope.selectedSite = selected;
      if($scope.selectedSite.name != "Site")
      {
          $scope.resetFilter = true;
      }

      //initiate search
      $scope.callDoSearch();
      //$scope.doSearch($scope.searchText);
      //$scope.selectCompanyDisabled = $scope.selectedSite.val ? false : true;
    };

    $scope.resetFilters = function(){
     // $scope.resetFilter = false;
      $state.go("app.search.random",{type:'directory', filter: 'all'});
    /*  $scope.selectedType = {
            title: 'All',
            type: 'all'
          };  */
        //filter = null;
     // $scope.doSearch('', 'global');

    };


    if($scope.modalData.type == 'directory'){
      $scope.popupTitle = "Staff directory";

      if($stateParams.filter && $stateParams.filter != 'all'){
        $scope.filterObj = angular.fromJson($base64.decode($stateParams.filter));
      }
      $scope.selectDivisionDisabled = false;
      $scope.selectedDivision = {
      	name: "Direction"
      };

      $scope.selectServiceDisabled = true;
      $scope.selectedService = {
        name : "Service"
      };

      $scope.selectSiteDisabled = false;
      $scope.selectedSite = {
        name: "Site"
      };
      $scope.peopleApi = new apiPeoples();
      //$scope.getServices = new apiPeoples();
      $scope.getSites = new apiPeoples();

      var pr = [
        $scope.peopleApi.getFilterList({field : 'direction'}),
        //$scope.getServices.getFilterList({field : 'service'}),
        $scope.getSites.getFilterList({field : 'site'})
      ];

      $q.all(pr).then(function(data){
        //data[0] -- pole (department)
        var dtemp = [];
        dtemp.push(angular.copy($scope.selectedDivision));
        angular.forEach(data[0], function(val){
          var obj = {name: val};
          dtemp.push(obj);
          if($scope.filterObj.divisionFilter && $scope.filterObj.divisionFilter == obj.name){
            $scope.divisionSelected(obj);
          }
        });
		    $scope.divisions = dtemp;

        /*
        //data 2 -- service
        var ctemp = [];
        ctemp.push(angular.copy($scope.selectedService));
        angular.forEach(data[1], function(val){
          var obj = {name: val};
          ctemp.push(obj);
          if($scope.filterObj.serviceFilter && $scope.filterObj.serviceFilter == obj.name){
            $scope.selectedService = obj;
          }
        });
        $scope.services = ctemp;
        */

        //data 3 -- site
        var stemp = [];
        // Commented below code to hide Site from Site filter dropdown.
        stemp.push(angular.copy($scope.selectedSite));
        angular.forEach(data[1], function(val){
          var obj = {name: val};
          stemp.push(obj);
          if($scope.filterObj.siteFilter && $scope.filterObj.siteFilter == obj.name){
            $scope.selectedSite = obj;
          }
        });
        $scope.sites = stemp;
      }, function(err){
        notifyModal.showTranslated('something_went_wrong', 'error', null);
      });
    }
    else if($scope.modalData.type == 'general'){
      $scope.popupTitle = "Search engine";
      $scope.prepareFilter($rootScope.searchableBlocks);
    }

    $scope.textSearch='';
    $scope.generalSearch = function(event, opn){console.log("$scope.generalSearch");
      var txt = '';
      $rootScope.onSearch = true;
      switch(opn){
        case 'global':
          $scope.firstName = '';
          $scope.competency = '';
          txt = $scope.textSearch;
        break;
        case 'name':
          $scope.competency = '';
          $scope.searchText = '';
          txt = $scope.firstName;
        break;
        case 'competency':
          $scope.firstName = '';
          $scope.searchText = '';
          txt = $scope.competency;
        break;
        default:
          txt = $scope.searchText;
      }
      if(event.keyCode == 13 || event.keyCode == 1){
    	  $(".typeahead").addClass("ng-hide");
        $scope.doSearch(txt, opn);
      }
    };

    $scope.setSearchType = function(obj){
      $scope.selectedType = obj;
      //if($scope.selectedType.type != 'file'){
    	  $scope.doSearch($scope.searchText, 'global');
      //}
    };

    var stateChange = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.searchMessage = false;
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      //if app.search again hide the div
      $scope.searchMessage = ($state.current.name == 'app.search') ? true : false;
      //$scope.searchText = "";
    });

    $scope.$on("$destroy", function(){
      stateChange();
      $rootScope.highlightText = '';
    });

    $scope.printPage = function() {
      window.print();
    };
    
    $scope.fileTypes = [];
    $scope.authors = [];
    $scope.communities = [];
    $scope.initializeData = function(){
    $scope.peopleApi = new apiPeoples();
    var deferred = $q.defer();
            var pr0 = apiCommunity.getAllFileTypes();
            var pr1 = apiCommunity.getFileAuthorsOnCommunity({isAll : true});
            var pr2 = apiCommunity.getCommunitiesData({format:'list'});
            $q.all([pr0,pr1,pr2]).then(function(data){
                    //for data[0]
                    angular.forEach(data[0], function(val, key){
                            var type = {
                                            id: key,
                                            name : val
                            };

                            if(val == 'Word'){
                                    type.label = 'Word / docs / office';
                            }else if(val == 'Excel'){
                                    type.label = 'Excel / spreadsheet';
                            }else if(val == 'Powerpoint'){
                                    type.label = 'Powerpoint / slide';
                            }else if(val == 'Other'){
                                    type.label = 'Others';
                            }else{
                                    type.label = val;
                            }
                            $scope.fileTypes.push(type);
                    });

                    //for data[1]
                    $scope.authors = data[1];

                    //for data[2]
                    $scope.communities = data[2];
                    deferred.resolve("success");
            }, function(err){
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                    deferred.resolve("error");
            });
            return deferred.promise;
    };

    $scope.initializeData().then(function(msg){
             if($scope.q != null && $scope.q != ''){
                    $scope.files = [];
                    $scope.searchFiles();

                    if($scope.searchExternal && $scope.externalTypes != null && $scope.externalTypes.length > 0){
                            $scope.filteredResult = null;
                            $scope.searchFromExternal();
                    }
             }
    });
    $scope.select = false;
    $scope.selectAll = function ($event) {
    $scope.loadervalue=true;
        if ($scope.select == false) {
                $scope.select = true;
                angular.forEach($scope.fileTypes, function (type) {
                        type.selected = true;
                        $scope.selectedTypes.push(type.name);
                });

        } else {
                $scope.select = false;
                angular.forEach($scope.fileTypes, function (type) {
                        type.selected = false;
                });
                $scope.selectedTypes = [];
        }

        //search files on community
        $scope.files = [];
//    $scope.searchFiles();
    };
    $scope.selectedTypes = [];
    $scope.filterTypes = function ($event, fileType) {
    $scope.loadervalue=true;
    if ($event.target.checked) {
        $scope.selectedTypes.push(fileType);
    } else {
        var index = $scope.selectedTypes.indexOf(fileType);
        if (index !== -1) {
            $scope.selectedTypes.splice(index, 1);
        }
    }

    //search files on community
    $scope.files = [];
//    $scope.searchFiles();
    };
    $scope.selectedAuthorUids = [];
    $scope.selectedAuthorNames = [];
    $scope.filterAuthors = function ($event, author) {
      $scope.loadervalue=true;
        if ($event.target.checked) {
            $scope.selectedAuthorUids.push(author.uid);
            $scope.selectedAuthorNames.push(author.firstName + " " + author.lastName);
        } else {
            var index = $scope.selectedAuthorUids.indexOf(author.uid);
            if (index !== -1) {
                $scope.selectedAuthorUids.splice(index, 1);
                $scope.selectedAuthorNames.splice(index, 1);
            }
        }

        //search files on community
        $scope.files = [];
//        $scope.searchFiles();
    };
    
    //filter by date from
    $scope.dateFromFilter = [];
    $scope.filterDateFrom = function (dt){
      $scope.loadervalue=true;
        $scope.dateFrom = dt;
        $scope.dateFromFilter.push($scope.dateFrom);

        //search files on community
        $scope.files = [];
//        $scope.searchFiles();
    };

    //filter by date to
    $scope.dateToFilter = [];
    $scope.filterDateTo = function (dt){
      $scope.loadervalue=true;
        $scope.dateTo = dt;
        $scope.dateToFilter.push($scope.dateTo);

        //search files on community
        $scope.files = [];
//        $scope.searchFiles();
    };

    //filter community filter
    $scope.selectedCommunityUids = [];
    $scope.selectedCommunityNames = [];
    $scope.filterCommunities = function ($event, community) {
      $scope.loadervalue=true;
        if ($event.target.checked) {
            $scope.selectedCommunityUids.push(community.uid);
            $scope.selectedCommunityNames.push(community.label);
        } else {
            var index = $scope.selectedCommunityUids.indexOf(community.uid);
            if (index !== -1) {
                $scope.selectedCommunityUids.splice(index, 1);
                $scope.selectedCommunityNames.splice(index, 1);
            }
        }

        //search files on community
        $scope.files = [];
//        $scope.searchFiles();
    };
    $scope.removesearch = function () {
        $scope.select = false;
        angular.forEach($scope.fileTypes, function (type) {
          type.selected = false;
        });
        angular.forEach($scope.authors, function (type) {
          type.selected = false;
        });
        angular.forEach($scope.communities, function (type) {
          type.selected = false;
        });
        // if ($scope.typeFilter||$scope.communityFilter||$scope.authorFilter||$scope.q) {
        $scope.array=[];

        if ($scope.selectedTypes) {
          for (var i = 0; i < $scope.selectedTypes.length; i++) {
            var index = $scope.selectedTypes.indexOf($scope.selectedTypes[i]);
            if (index !== -1) {
                $scope.selectedTypes.splice(index, 1);
            }
          }
        }
        if ($scope.selectedCommunityNames) {
          for (var j = 0; j < $scope.selectedCommunityNames.length; j++) {
            for (var i = 0; i < $scope.communities.length; i++) {
              if ($scope.selectedCommunityNames[j]===$scope.communities[i].label) {
              var index = $scope.selectedCommunityUids.indexOf($scope.communities[i].uid);
              if (index !== -1) {
                  $scope.selectedCommunityUids.splice(index, 1);
                  $scope.selectedCommunityNames.splice(index, 1);
              }
          }
        }
        }
      }
        if ($scope.selectedAuthorNames) {
          for (var j = 0; j < $scope.selectedAuthorNames.length; j++) {
          for (var i = 0; i < $scope.authors.length; i++) {
            var name=$scope.authors[i].firstName + " " + $scope.authors[i].lastName;
              if ($scope.selectedAuthorNames[j]===name) {
                var index = $scope.selectedAuthorUids.indexOf($scope.authors[i].uid);
                if (index !== -1) {
                    $scope.selectedAuthorUids.splice(index, 1);
                    $scope.selectedAuthorNames.splice(index, 1);
                }
              }
            }
          }
        }
        $scope.q = '';
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.selectedCommunityNames =[];
        $scope.selectedTypes=[];
        $scope.dateToFilter=[];
        $scope.dateFromFilter=[];
        $scope.showViewMoreBtn=false;
        $scope.selectedAuthorNames =[];
        $scope.files = [];
        console.log( $scope.q,$scope.dateFrom, $scope.dateTo, $scope.selectedCommunityNames, $scope.selectedTypes,  $scope.showViewMoreBtn,$scope.selectedAuthorNames, $scope.files)
//        $scope.searchFiles();
      };
})
.controller('GetSearchResultCtrl', function ($scope, $rootScope, $stateParams, $timeout, $window, $location, apiSearch, $state, apiOrganization, $filter, sharedData, $base64, notifyModal, editQuickpostModal,$anchorScroll) {
    $scope.modalData = {
      type: $stateParams.type,
      showGrouping: ($stateParams.category == "competency") ? true : false,
      page: 0,
      searchedParam: null,
      showViewMoreBtn: false,
      isRandom: ($state.current.name == "app.search.random") ? true : false
    };
    $scope.showResTtl = {
      flag: true,
      title: ($state.current.name == "app.search.random") ? "6 random member" : "Total result(s)"
    };

    $scope.showGoogleResultFrame = false;
    if($stateParams.externalSearch != undefined && $stateParams.externalSearch){
    	$scope.showGoogleResultFrame = true;
    }
    $scope.feeds = [];
    $scope.visibleData = [];
    $scope.resultLength = 0;

    $scope.searchText = $stateParams.text;
    if($state.current.name == 'app.search.category'){
        switch ($stateParams.category){
          case "name":
            $scope.$parent.searchText = $scope.$parent.competency = '';
            $scope.$parent.firstName = $stateParams.text;
          break;
          case "global":
            $scope.$parent.firstName = $scope.$parent.competency = '';
            $scope.$parent.searchText = $stateParams.text;
          break;
          case "competency":
            $scope.$parent.searchText = $scope.$parent.firstName = '';
            $scope.$parent.competency = $stateParams.text;
          break;
        }
      }
    else{
      $scope.$parent.searchText = $scope.searchText;
    }
    $scope.selSearchType = false; //to show dropdwon
    $scope.searchTypes = [];
    $scope.searchFocus = false;
    $scope.searchStatus = 0; //0=not serarching, 1=searching, 2 = success, 3 = error
    //$scope.hashTags = [{text: '#kitdesurvie'}];

    $scope.selectedType = {
      title: $stateParams.filter,
      type: $stateParams.filter.toLowerCase()
    };

    $scope.hashTags = ($scope.modalData.data && $scope.modalData.data.hashtags) ? $scope.modalData.data.hashtags : null;

    $scope.searchApi = null;
    $scope.popupTitle = null;

    $scope.fetchPaginatedDirectory = function(param) {
      if($scope.searchStatus != 1 && $scope.modalData.showViewMoreBtn) {
        if($scope.searchApi){
          //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
          $scope.searchApi.cancel('cancelled');
          $scope.searchStatus = 0;
        }
        $scope.searchApi = new apiSearch();

        $scope.searchStatus = 1;
        param.page = ++$scope.modalData.page;
        param.itemsPerPage = $rootScope.uiConfig.searchResPerPage;

        $scope.searchApi.directorySearch(param).then(function(data){
          $rootScope.highlightText = param.searchText;
          $scope.searchStatus = 2;
          if(data && data.members){
              $scope.resultLength = data.totalMembers;
              $scope.visibleData = $scope.visibleData.concat(data.members);
              $scope.modalData.showViewMoreBtn = (param.random || data.members.length < param.itemsPerPage) ? false : true;
          }else{
              $scope.resultLength =0 ;
              $scope.visibleData = [];
              $scope.modalData.showViewMoreBtn = false;
          }
        }, function(err){
          //error
          $scope.searchStatus = 3;
        });
      }
      else{
      }
    };
    $scope.fetchPaginatedGeneral = function(param) {
      //&& $scope.modalData.showViewMoreBtn
      if($scope.searchStatus != 1) {
        if($scope.searchApi){
          //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
          $scope.searchApi.cancel('cancelled');
          $scope.searchStatus = 0;
        }
        $scope.searchApi = new apiSearch();

        $scope.searchStatus = 1;
        param.page = ++$scope.modalData.page;
        param.itemsPerPage = $rootScope.uiConfig.searchResPerPage;
        param.isInternal = $stateParams.internalSearch;
        param.isExternal = $stateParams.externalSearch;
        if($stateParams.externalTypes != undefined && $stateParams.externalTypes != ''){
	        var externalTypes = angular.fromJson($base64.decode($stateParams.externalTypes));
	        param.externalType = externalTypes;
        }
        $scope.searchApi.search(param).then(function(data){
          $scope.searchStatus = 2;
          if(data){
            $rootScope.highlightText = param.searchText;

            $scope.resultLength = data.total;
            $scope.filteredResult = data;
            $scope.searchText = $stateParams.text;
          }
        }, function(err){
          //error
          $scope.searchStatus = 3;
        });
      }
      else{
      }
    };

    $scope.showMoreResults = function(){
      if($scope.modalData.type == 'directory'){
        $scope.fetchPaginatedDirectory($scope.modalData.searchedParam);
      }
    };

    $scope.prepareResData = function(result){
      angular.forEach(result, function(val, key){
        $scope.feeds.push.apply($scope.feeds, val.employees);
      });
      $scope.showMoreResults();
    };

    $scope.doSearch = function(tempSeartText){
      $scope.feeds = [];
      //$scope.visibleData = [];
      var hashtags = '';
      if($scope.modalData.data != undefined){
        hashtags = $scope.modalData.data.hashtags;
      }

      $scope.feeds = [];
      $scope.filteredResult = {
        contents: [],
        communities: [],
        members: []
      };

      if($scope.modalData.type == 'general' && $scope.selectedType.type != 'file'){
        $scope.visibleData = [];
        /*
        var param = {
          searchType: 'quickSearch',
          language: $rootScope.currentLanguage.code,
          searchText: tempSeartText,
           hashtags:hashtags
        };
        if($scope.selectedType.type != 'all'){
          param.type = $scope.selectedType.type;
        }
        */
        var param = {
          searchText: tempSeartText,
          language: $rootScope.currentLanguage.code
          //itemsPerPage: $rootScope.uiConfig.searchResPerPage
        };
        if($scope.selectedType.type != 'all'){
          param.type = ($scope.selectedType.type == 'people') ? 'profile' : $scope.selectedType.type;
        }
        $scope.modalData.searchedParam = param;
        $scope.fetchPaginatedGeneral(param);
      }//if general search
      else if($scope.modalData.type == 'directory'){
        $scope.modalData.showViewMoreBtn = true; //for executing $scope.fetchPaginatedDirectory first time
        var param = {};
        if($state.current.name == "app.search.random"){
          param.random = true;
        }
        else{
          param.searchText = tempSeartText;
        }
        if($stateParams.filter != 'all'){
          var filter = angular.fromJson($base64.decode($stateParams.filter));
          param.divisionFilter = filter.divisionFilter;
          param.siteFilter = filter.siteFilter;
          param.serviceFilter = filter.serviceFilter;
        }
        if($state.current.name == 'app.search.category'){
          switch ($stateParams.category){
            case "name":
            case "competency":
              param.field = $stateParams.category;
            break;
          }
        }
        $scope.modalData.searchedParam = param;
        $scope.fetchPaginatedDirectory(param);
      }//if directory search
    };

    $scope.trackPageNumber = {
      contents: 1,
      communities: 1,
      members: 1
    };
    $scope.viewMore = function(viewtype){
      var tempSeartText = $scope.modalData.searchedParam.searchText;
      var hashtags = '';
      if($scope.modalData.data != undefined){
        hashtags = $scope.modalData.data.hashtags;
      }

      if($scope.viewMoreApi){
        $scope.viewMoreApi.cancel('cancelled');
      }
      $scope.viewMoreApi = new apiSearch();

      if($scope.modalData.type == 'general'){
        var param = {
          searchText: tempSeartText,
          language: $rootScope.currentLanguage.code,
          type: viewtype,
          itemsPerPage: $rootScope.uiConfig.searchResPerPage,
          isInternal: $stateParams.internalSearch,
          isExternal: $stateParams.externalSearch
        };
        if($stateParams.externalTypes != undefined && $stateParams.externalTypes != ''){
	        var externalTypes = angular.fromJson($base64.decode($stateParams.externalTypes));
	        param.externalType = externalTypes;
        }

        switch(viewtype){
          case 'content':
            param.page = ++$scope.trackPageNumber.contents;
          break;
          case 'profile':
            param.page = ++$scope.trackPageNumber.members;
          break;
          case 'community':
            param.page = ++$scope.trackPageNumber.communities;
          break;
        }
        $scope.viewMoreApi.search(param).then(function(data){
          if(data){
            $rootScope.highlightText = param.searchText;
            switch(viewtype){
              case 'profile':
                $scope.filteredResult.members  = $scope.filteredResult.members.concat(data.members);
              break;
              case 'community':
                $scope.filteredResult.communities = $scope.filteredResult.communities.concat(data.communities);
              break;
              case 'content':
                $scope.filteredResult.contents = $scope.filteredResult.contents.concat(data.contents);
              break;
            }
          }
        }, function(err){
          //error
          switch(viewtype){
            case 'content':
              $scope.trackPageNumber.contents--;
            break;
            case 'profile':
              $scope.trackPageNumber.members--;
            break;
            case 'community':
              $scope.trackPageNumber.communities--;
            break;
          }
          notifyModal.showTranslated('something_went_wrong', 'error', null);
        });
      }//if general search

    };
    
    if($scope.selectedType.type != 'file'){
    	$scope.doSearch($scope.searchText);
    }
    $scope.generalSearch = function(event, element){
      if(event.keyCode == 13 || event.keyCode == 1){
        /*
        //navigate to search result page if 'Enter' pressed
        //$scope.searchText = '';
        if($scope.searchText.length > 0){
          $location.path('/search/'+$scope.searchText+'/'+$scope.selectedType.val+'/1');
        }
        */
    	  if($scope.selectedType.type != 'file'){
    		  $scope.doSearch($scope.searchText);
    	  }
      }
    };

    $scope.setSearchType = function(obj){
      $scope.selectedType = obj;
    };

    $scope.$on("$destroy", function(){
      $rootScope.highlightText = '';
    });

    $scope.closeGoogleResult = function(){
    	$scope.showGoogleResultFrame = false;
    };

    $scope.showGoogleResult= function(){
    	$scope.showGoogleResultFrame = true;
    };

    $scope.extractToQuickPost = function(url){
    	var data = {
    			importFromSearch: true,
    			url: url
    	}
    	$rootScope.isEditQuickPost = false;
    	var modal = editQuickpostModal.show({action: 'create', type: 'quickpost', data: data});
    }

    $scope.getImage = function(mimeType){
    	  return $filter('getTypeByFileNameGDrive')(mimeType);
    }

    $scope.goToSection = function(section){
        $location.hash(section);
        $anchorScroll();
    }
  })
  .controller('CommunityFileCtrl', function ($scope, $rootScope) {
	    $scope.previewFile = function(file){
	    	if(!file.isGdrive){
	    		$rootScope.previewFile(file);
	    	}else{
	    		$("a.preview-file").attr({"href": file.url,'target':'_blank'});
	    	}
	    }
  });
