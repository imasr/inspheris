'use strict';

angular.module('inspherisProjectApp')
        .controller('FileSearchResultCtrl', function ($timeout,$scope,$stateParams,$q,$filter, apiCommunity,apiSearch,apiPeoples,notifyModal) {
            $scope.file = {
                openChild: null,
                communityList: '',
                sortOption:'fileName',
            };

            this.$onInit = function() {
                $scope.q = this.searchText;
                $scope.searchExternal = this.searchExternal;
                $scope.externalTypes = this.externalTypes;
            };

            this.$onChanges = function (changes) {
            	if(changes.searchExternal != undefined){
            		$scope.searchExternal = changes.searchExternal.currentValue;
            	}

            	if(changes.externalTypes != undefined){
            		$scope.externalTypes= changes.externalTypes.currentValue;
            	}
            	
            	if(changes.searchText != undefined){
            		$scope.q = changes.searchText.currentValue;
            		$scope.files = [];
            		$scope.searchFiles();          
            	}
            	
        		if($scope.searchExternal && $scope.externalTypes != null && $scope.externalTypes.length > 0){
      				$scope.filteredResult = null;
      				$scope.searchFromExternal();
      			}
            }
            
            $scope.sortField = "fileName";
            $scope.sortKey = "asc";
            $scope.fileTypes = [];
            $scope.authors = [];
            $scope.communities = [];
            $scope.showViewMoreBtn = false;
            $scope.enableExternalSearch=true;

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
              $scope.searchFiles();
           };
          //  $scope.hiddenDiv = true;
            $scope.toggleFolderFiles = function (indx) {
                if (indx == $scope.file.openChild) {
                    $scope.file.openChild = null;
                } else {
                    $scope.file.openChild = indx;
                }
            };

            $scope.stopPropagation = function (event) {
                event.stopPropagation();
            };

            //filter file's types
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
                $scope.searchFiles();
            };

            $scope.selectedTypes = [];
            $scope.filterTypesBtn = function (number, fileType) {
                if (number) {
                    $scope.selectedTypes.push(fileType);
                } else {
                  // $scope.selectedTypes=null;
                    var index = $scope.selectedTypes.indexOf(fileType);
                    if (index !== -1) {
                        $scope.selectedTypes.splice(index, 1);
                    }
                }
                $scope.files = [];

                //search files on community
                $scope.searchFiles();
            };

            //filter file's types
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
                $scope.searchFiles();
            };

            //search by keyword
            $scope.searchText = [];
            $scope.searchByKeyWord = function (keyword) {
              $scope.loadervalue=true;
            	$scope.q = keyword;
            	$scope.searchText.push($scope.q);
                //search files on community
            	$scope.files = [];
                $scope.searchFiles();
            };


            //filter by date from
            $scope.dateFromFilter = [];
            $scope.filterDateFrom = function (dt){
              $scope.loadervalue=true;
            	$scope.dateFrom = dt;
            	$scope.dateFromFilter.push($scope.dateFrom);

                //search files on community
            	$scope.files = [];
                $scope.searchFiles();
            };

            //filter by date to
            $scope.dateToFilter = [];
            $scope.filterDateTo = function (dt){
              $scope.loadervalue=true;
            	$scope.dateTo = dt;
            	$scope.dateToFilter.push($scope.dateTo);

                //search files on community
            	$scope.files = [];
                $scope.searchFiles();
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
                $scope.searchFiles();
            };

            //search files on community
            $scope.total = 0;
            $scope.searchFiles = function(){
            	$scope.showViewMoreBtn = false;
            	$scope.files = [];
            	var params = {
            			sortKey : $scope.sortKey,
            			sortField : $scope.sortField,
            			page : 1,
            			itemsPerPage : 10
            	};


            	if(($scope.selectedCommunityUids != null && $scope.selectedCommunityUids.length > 0) ||
            			($scope.selectedTypes != null && $scope.selectedTypes.length > 0) ||
            			($scope.selectedAuthorUids != null && $scope.selectedAuthorUids.length > 0) ||
            			($scope.q != null && $scope.q != '') ||
            			($scope.dateFrom != null && $scope.dateFrom != '') ||
            			($scope.dateTo != null && $scope.dateTo != '')){

	            	if($scope.selectedCommunityUids != null && $scope.selectedCommunityUids.length > 0){
	            		params.communityFilter = $scope.selectedCommunityUids;
	            	}

	            	if($scope.selectedTypes != null && $scope.selectedTypes.length > 0){
	            		params.typeFilter = $scope.selectedTypes;
	            	}

	            	if($scope.selectedAuthorUids != null && $scope.selectedAuthorUids.length > 0){
	            		params.authorFilter = $scope.selectedAuthorUids;
	            	}

	            	if($scope.q != null && $scope.q != ''){
	            		params.q = $scope.q;
	            	}

	            	if($scope.dateFrom != null && $scope.dateFrom != ''){
	            		params.dateFrom = $filter('date')($scope.dateFrom,'MM/dd/yyyy');
	            	}

	            	if($scope.dateTo != null && $scope.dateTo != ''){
	            		params.dateTo =  $filter('date')($scope.dateTo,'MM/dd/yyyy');
	            	}

	            	$scope.searchApi = new apiSearch();
	                $scope.searchApi.communityFileSearch(params).then(function(data){
	                	if(data){
		                	$scope.total = data.total;
		                	$scope.loadervalue=false;
		                	$scope.files = data.rows;
		            		$scope.showViewMoreBtn = (data && data.rows.length < 10) ? false : true;
	                	}
	                }, function(err){
	                	notifyModal.showTranslated('something_went_wrong', 'error', null);
	                });
                  $timeout(function () {
                       $scope.loadervalue=false;
                      $scope.dataNotFound = $scope.files;
                     
                  }, 3000);
                }else{
                	$scope.total = 0;
                }
            };


            $scope.searchFromExternal = function(){
            	$scope.filteredResult = null;
            	$scope.searchApi = new apiSearch();
                var param = {
                		isInternal : false,
                		isExternal : $scope.searchExternal,
                		externalType : $scope.externalTypes,
                		searchText : $scope.q
                }
                $scope.searchApi.search(param).then(function(data){
                	$scope.filteredResult = data.externalResult;
                }, function(err){
                	notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
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
              $scope.showViewMoreBtn=false;
              $scope.selectedAuthorNames =[];
              $scope.files = [];
              $scope.searchFiles();
            };
        })
        .controller('FileSearchResultDetailsCtrl', function ($timeout,$scope,$stateParams,$q,$filter, apiCommunity,apiSearch,notifyModal) {
            $scope.file = {
                openChild: null,
                communityList: '',
                sortOption:'fileName',
            };

            $scope.closeGoogleResult = function(){
            	$scope.showGoogleResultFrame = false;
            };

            $scope.showGoogleResult= function(){
            	$scope.showGoogleResultFrame = true;
            };
            
            // $scope.hiddenDiv = true;
            $scope.toggleFolderFiles = function (indx) {
                if (indx == $scope.file.openChild) {
                    $scope.file.openChild = null;
                } else {
                    $scope.file.openChild = indx;
                }
            };

            $scope.stopPropagation = function (event) {
                event.stopPropagation();
            };

            this.$onInit = function() {
               
            	$scope.files = this.files;
                $scope.searchText = this.searchText;
                $scope.communityFilters = this.communityFilters;
                $scope.typeFilters = this.typeFilters;
                $scope.authorFilters = this.authorFilters;
                $scope.dateFromFilter = this.dateFromFilter;
                $scope.dateToFilter = this.dateToFilter;
                $scope.showViewMoreBtn = this.showViewMoreBtn;
                $scope.total = this.total;  
                $scope.filteredResult = this.filteredResult;
                $scope.searchExternal = this.searchExternal;
                $scope.externalTypes = this.externalTypes;
                $scope.showGoogleResultFrame = false;
                if($scope.searchExternal){
                	$scope.showGoogleResultFrame = true;
                }
            };

            this.$onChanges = function (changes) {
            	if(changes.files != undefined){
            		$scope.files = changes.files.currentValue;
            	}

            	if(changes.showViewMoreBtn != undefined){
            		$scope.showViewMoreBtn = changes.showViewMoreBtn.currentValue;
            	}

            	if(changes.total != undefined){
            		$scope.total = changes.total.currentValue;
            	}
            	
            	
            	if(changes.filteredResult != undefined){
            		$scope.filteredResult = changes.filteredResult.currentValue;
            	}
            	
            	if(changes.searchExternal != undefined){
            		$scope.searchExternal = changes.searchExternal.currentValue;
            	}
            	
            	if(changes.externalTypes != undefined){
            		$scope.externalTypes= changes.externalTypes.currentValue;
            	}
            	
            	if(changes.searchText != undefined){
            		$scope.searchText = changes.searchText.currentValue;
            	}
            	
        		if($scope.searchExternal && $scope.externalTypes != null && $scope.externalTypes.length > 0){
      				$scope.filteredResult = null;
      				$scope.searchFromExternal();
      			}
        		
            	$scope.showGoogleResultFrame = false;
                if($scope.searchExternal){
                	$scope.showGoogleResultFrame = true;
                }else{
                	$scope.showGoogleResultFrame = false;
                }
            }
            $scope.page = 1;

            //load more
            $scope.viewMore = function (){
                $scope.page++;
                $scope.loadFiles();
            };

            //sort
            $scope.sortData = function(field){
              $scope.loadervalue=true;
            	if($scope.sortKey == "asc"){
            		$scope.sortKey = "desc";
            	}else{
            		$scope.sortKey = "asc";
            	}
            	$scope.sortField = field;

            	// search + sort
            	$scope.files = [];
            	$scope.page = 1;
            	$scope.loadFiles();

            };
            $scope.searchFromExternal = function(){
            	$scope.filteredResult = null;
            	$scope.searchExternalApi = new apiSearch();
                var param = {
                		isInternal : false,
                		isExternal : $scope.searchExternal,
                		externalType : $scope.externalTypes,
                		searchText : $scope.searchText
                }
                $scope.searchExternalApi.search(param).then(function(data){
                	$scope.filteredResult = data.externalResult;
                }, function(err){
                	notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            };

            
            $scope.loadFiles = function(){
            	var params = {
            			sortKey : $scope.sortKey,
            			sortField : $scope.sortField,
            			page : $scope.page,
            			itemsPerPage : 10
            	};

            	if(($scope.communityFilters != null && $scope.communityFilters.length > 0) ||
            			($scope.typeFilters != null && $scope.typeFilters.length > 0) ||
            			($scope.authorFilters != null && $scope.authorFilters.length > 0) ||
            			($scope.searchText != null && $scope.searchText != '' && $scope.searchText.length > 0) ||
            			($scope.dateFromFilter != null && $scope.dateFromFilter != '' && $scope.dateFromFilter.length > 0) ||
            			($scope.dateToFilter != null && $scope.dateToFilter != '' && $scope.dateToFilter.length > 0)){


	            	if($scope.communityFilters != null && $scope.communityFilters.length > 0){
	            		params.communityFilter = $scope.communityFilters;
	            	}

	            	if($scope.typeFilters != null && $scope.typeFilters.length > 0){
	            		params.typeFilter = $scope.typeFilters;
	            	}

	            	if($scope.authorFilters != null && $scope.authorFilters.length > 0){
	            		params.authorFilter = $scope.authorFilters;
	            	}

	            	if($scope.searchText != null && $scope.searchText != '' && $scope.searchText.length > 0){
	            		params.q = $scope.searchText[$scope.searchText.length-1];
	            	}

	            	if($scope.dateFromFilter != null && $scope.dateFromFilter != '' && $scope.dateFromFilter.length > 0){
	            		params.dateFrom = $filter('date')($scope.dateFromFilter[$scope.dateFromFilter.length-1],'MM/dd/yyyy');
	            	}

	            	if($scope.dateToFilter != null && $scope.dateToFilter != '' && $scope.dateToFilter.length > 0){
	            		params.dateTo =  $filter('date')($scope.dateToFilter[$scope.dateToFilter.length-1],'MM/dd/yyyy');
	            	}

	            	$scope.searchApi = new apiSearch();
	                $scope.searchApi.communityFileSearch(params).then(function(data){
	                	if(data){
		                	$scope.total = data.total;
		                	$scope.loadervalue=false;
		                	$scope.files = $scope.files.concat(data.rows);
		            		$scope.showViewMoreBtn = ($scope.files.length == ($scope.page * 10)) ? true : false;
	                	}
	                }, function(err){
	                	notifyModal.showTranslated('something_went_wrong', 'error', null);
	                });
                  $timeout(function () {
                      $scope.dataNotFound = $scope.files;
                  }, 3000);
            	}
            };
        })
        .controller('CommunityFileSearchResultCtrl', function ($timeout,$scope,$stateParams,$q,$filter, apiCommunity,apiFeedData,notifyModal) {
            $scope.file = {
                openChild: null,
                communityList: '',
                sortOption:'fileName',
            };

            $scope.sortField = "fileName";
            $scope.sortKey = "asc";
            $scope.isSearch = false;
            $scope.fileType = [];
            $scope.authors = [];
            $scope.count=0;

            this.$onInit = function() {
                $scope.files = this.files;
            };

            this.$onChanges = function (changes) {
            	if(changes.files != undefined){
            		$scope.files = changes.files.currentValue;
            	}
            }
            $scope.select = false;
            $scope.selectAll = function ($event) {
              $scope.loadervalue=true;
            	if ($scope.select == false) {
            		$scope.select = true;
            		angular.forEach($scope.fileType, function (type) {
            			type.selected = true;
            			$scope.selectedTypes.push(type.name);
            		});
					$scope.files = [];
                	$scope.searchFiles();
            	} else {
            		$scope.select = false;
            		angular.forEach($scope.fileType, function (type) {
            			type.selected = false;
            		});
            		$scope.selectedTypes = [];
            		$scope.loadData();
            	}
            };

            $scope.initializeData = function(){
            	var deferred = $q.defer();
       		 	var pr0 = apiCommunity.getAllFileTypes();
       		 	var pr1 = apiCommunity.getFileAuthorsOnCommunity({communityUid : $stateParams.commuid});
       		 	$q.all([pr0,pr1]).then(function(data){
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
       		 			$scope.fileType.push(type);
       		 		});

       		 		//for data[1]
       		 		angular.forEach(data[1], function(val, key){
       		 			$scope.authors.push({
       		 				uid: val.uid,
       		 				firstName : val.firstName,
       		 				lastName : val.lastName,
       		 				headerLogoUrl : val.headerLogoUrl
       		 			});
       		 		});

       		 		deferred.resolve("success");
       		 	}, function(err){
       		 		notifyModal.showTranslated('something_went_wrong', 'error', null);
       		 		deferred.resolve("error");
       		 	});
       		 	return deferred.promise;
       	 	};

       	 	$scope.initializeData().then(function(msg){

       	 	});

            $scope.toggleFolderFiles = function (indx) {
                if (indx == $scope.file.openChild) {
                    $scope.file.openChild = null;
                } else {
                    $scope.file.openChild = indx;
                }
            };

            $scope.stopPropagation = function (event) {
                event.stopPropagation();
            };

            //sort
            $scope.sortData = function(field){
              $scope.loadervalue=true;
            	$scope.files = [];
            	if($scope.sortKey == "asc"){
            		$scope.sortKey = "desc";
            	}else{
            		$scope.sortKey = "asc";
            	}
            	$scope.sortField = field;

            	if($scope.isSearch == false){
            		// sort when loading at the beginning
            		$scope.loadData();
            	}else{
            		// search + sort
					$scope.files = [];
            		$scope.searchFiles();
            	}

            };
            $scope.loadData = function (){
            	$scope.files = [];
            	var params = {
            			sortKey : $scope.sortKey,
            			sortField : $scope.sortField,
            			communityUid : $stateParams.commuid,
            			tabUid : $stateParams.activetab,
            			tabType : "files"
            	};
                apiFeedData.getContentsByCommunityTab(params).then(function(data){
                  $scope.loadervalue=false;
                    $scope.files = $scope.files.concat(data);
                }, function(err){
                	notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            };
            //filter file's types
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
                $scope.searchFiles();
            };

            $scope.selectedTypes = [];
            $scope.filterTypesBtn = function (number, fileType) {
                if (number) {
                    $scope.selectedTypes.push(fileType);
                } else {
                  // $scope.selectedTypes=null;
                    var index = $scope.selectedTypes.indexOf(fileType);
                    if (index !== -1) {
                        $scope.selectedTypes.splice(index, 1);
                    }
                }

                //search files on community
                $scope.files = [];
                $scope.searchFiles();
            };

            //filter file's types
            $scope.selectedAuthorUids = [];
            $scope.filterAuthors = function ($event, authorUid) {
              $scope.loadervalue=true;
                if ($event.target.checked) {
                    $scope.selectedAuthorUids.push(authorUid);
                } else {
                    var index = $scope.selectedAuthorUids.indexOf(authorUid);
                    if (index !== -1) {
                        $scope.selectedAuthorUids.splice(index, 1);
                    }
                }

                //search files on community
                $scope.files = [];
                $scope.searchFiles();
            };

            //search by keyword
            $scope.q = '';
            $scope.searchByKeyWord = function (keyword) {
              $scope.loadervalue=true;
            	$scope.q = keyword;

                //search files on community
            	$scope.files = [];
                $scope.searchFiles();
            };

            //filter by dates
            $scope.filterDate = function (){
              $scope.loadervalue=true;

                //search files on community
            	$scope.files = [];
                $scope.searchFiles();
            };

            $scope.page = 1;

            //load more
            $scope.viewMore = function (){
                $scope.page++;
                $scope.searchFiles();
            };

            //search files on community
            $scope.searchFiles = function(){
            	$scope.showViewMoreBtn = false;
            	if(($scope.selectedTypes != null && $scope.selectedTypes.length > 0) ||
            			($scope.selectedAuthorUids != null && $scope.selectedAuthorUids.length > 0) ||
            			($scope.q != null && $scope.q != '') ||
            			($scope.dateFrom != null && $scope.dateFrom != '') ||
            			($scope.dateTo != null && $scope.dateTo != '')){

					$scope.isSearch = true;
					var params = {
							sortKey : $scope.sortKey,
							sortField : $scope.sortField,
							communityUid : $stateParams.commuid,
							page : $scope.page,
							itemsPerPage : 10
					};
	            	if($scope.selectedTypes != null && $scope.selectedTypes.length > 0){
	            		params.typeFilter = $scope.selectedTypes;
	            	}

	            	if($scope.selectedAuthorUids != null && $scope.selectedAuthorUids.length > 0){
	            		params.authorFilter = $scope.selectedAuthorUids;
	            	}

	            	if($scope.q != null && $scope.q != ''){
	            		params.q = $scope.q;
	            	}

	            	if($scope.dateFrom != null && $scope.dateFrom != ''){
	            		params.dateFrom = $filter('date')($scope.dateFrom,'MM/dd/yyyy');
	            	}

	            	if($scope.dateTo != null && $scope.dateTo != ''){
	            		params.dateTo =  $filter('date')($scope.dateTo,'MM/dd/yyyy');
	            	}

	            	apiCommunity.searchFilesOnCommunity(params).then(function(data){
                  $scope.loadervalue=false;
	            		$scope.files = $scope.files.concat(data);
	            		$scope.showViewMoreBtn = (data && data.length < 10) ? false : true;
	            	}, function(err){
	            		notifyModal.showTranslated('something_went_wrong', 'error', null);
	            	});
                $timeout(function () {
                    $scope.dataNotFound = $scope.files;
                }, 3000);
				}else{
					$scope.isSearch = false;
					$scope.loadData();
				}
            };
        })
        .controller('PreviewFileCtrl', function ($scope,$filter,filePreviewModal) {
        	$scope.popupData = $scope.$parent.ngDialogData;
        	$scope.file = $scope.popupData.file;
            $scope.fileType = $scope.file.objectFileType;
            

        	$scope.closePopup = function () {
        		filePreviewModal.hide();
            };


          ResetEditPopupHeaderToDefault();
          ResetEditPopupHeader();

        })
       .controller('PreviewFileDetailsCtrl', function ($scope,$filter,filePreviewModal) {
        	$scope.closePopup = function () {
        		filePreviewModal.hide();
            };


            $scope.canPreview = function(url){
          	  return $filter('getTypeByFileName')(url);
            }

            ResetEditPopupHeaderToDefault();
            ResetEditPopupHeader();

        });
