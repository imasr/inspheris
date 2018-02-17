'use strict';

angular.module('inspherisProjectApp')
        .controller('FileBrowseController', function ($timeout, $scope, $rootScope,$q, notifyModal, $filter,apiCommunity) {
        	$scope.popupData = $scope.$parent.ngDialogData;
        	$scope.type = $scope.popupData.type;
                $scope.fileselected=false;
                 $scope.loadervalue=true;
        	$scope.file = {
        			openChild: null,
                    communityList: '',
                    sortOption:'fileName',
        	};

        	$scope.sortField = "fileName";
        	$scope.sortKey = "asc";
        	$scope.isSearch = false;
          $scope.toggleTrue=false;
          $scope.uploadFileToggleTrue=true;

        	$scope.fileTypes = [];
        	$scope.authors = [];
        	$scope.page = 1;
        	$scope.communities = [];

        	$scope.initializeData = function(){
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
           		 	$scope.modalStatus = false;
           		 	deferred.resolve("success");
        		}, function(err){
        			notifyModal.showTranslated('something_went_wrong', 'error', null);
           		 	deferred.resolve("error");
        		});
        		return deferred.promise;
        	};

        	$scope.initializeData().then(function(msg){
        		$scope.files = [];
        		$scope.getFiles();
        	});

          $scope.hiddenDiv = false;
        	$scope.toggleFolderFiles = function (indx) {
        		if (indx == $scope.file.openChild) {
        			$scope.file.openChild = null;
        		} else {
        			$scope.file.openChild = indx;
        		}
        	};


          $scope.selectchild=function(data,index){
                if(data.fileType=='folder'){
                $scope.files[index].selected = !$scope.files[index].selected;
               angular.forEach($scope.files[index].files, function(child) {
                child.selected = $scope.files[index].selected;
                });
             }

          }

          $scope.togglePopup=function() {
            if ($scope.toggleTrue==true) {
              $scope.toggleTrue=false;
            }
            else {
              $scope.toggleTrue=true;
            }
          }
          $scope.fileToggle=function() {
            if ($scope.uploadFileToggleTrue==true) {
              $scope.uploadFileToggleTrue=false;
            }
            else {
              $scope.uploadFileToggleTrue=true;
            }
          }

          $scope.select = false;
          $scope.selectAll = function ($event) {
            $scope.loadervalue=true;
    		  $scope.files = [];
        	  if ($scope.select == false) {
        		  $scope.select = true;
        		  $scope.isSearch = true;
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
        	  $scope.getFiles();
          };




        	$scope.stopPropagation = function (event) {
        		event.stopPropagation();
        	};

        	//load more
            $scope.viewMore = function (){
                $scope.page++;
                $scope.getFiles();
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

        		// search + sort
        		$scope.page = 1;
        		$scope.files = [];
    			$scope.getFiles();

        	};

        	 //filter community filter
            $scope.selectedCommunityUids = [];
            $scope.filterCommunities = function ($event, communityUid) {
                $scope.loadervalue=true;
                $scope.parentSelected = false;
                 $scope.fileselected=false;
                if ($event.target.checked) {
                     $scope.parentSelected = false;
                    $scope.selectedCommunityUids.push(communityUid);
                } else {
                    var index = $scope.selectedCommunityUids.indexOf(communityUid);
                    if (index !== -1) {
                        $scope.selectedCommunityUids.splice(index, 1);
                    }
                }

                $scope.page = 1;
        		$scope.files = [];
        		$scope.isSearch = true;
        		$scope.getFiles();
            };

        	//filter file's types
        	$scope.selectedTypes = [];
        	$scope.filterTypes = function ($event, fileType) {
                     $scope.loadervalue=true;
                     $scope.parentSelected = false;
                    $scope.fileselected=false;
        		if ($event.target.checked) {
        			$scope.selectedTypes.push(fileType);
        		} else {
        			var index = $scope.selectedTypes.indexOf(fileType);
        			if (index !== -1) {
        				$scope.selectedTypes.splice(index, 1);
        			}
        		}
        		$scope.page = 1;
        		$scope.files = [];
        		$scope.isSearch = true;
        		$scope.getFiles();
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
              $scope.page = 1;
          		$scope.files = [];
          		$scope.isSearch = true;
          		$scope.getFiles();
          };

        	//filter file's types
        	$scope.selectedAuthorUids = [];
        	$scope.filterAuthors = function ($event, authorUid) {
                     $scope.loadervalue=true;
                     $scope.parentSelected = false;
                    $scope.fileselected=false;
        		if ($event.target.checked) {
        			$scope.selectedAuthorUids.push(authorUid);
        		} else {
        			var index = $scope.selectedAuthorUids.indexOf(authorUid);
        			if (index !== -1) {
        				$scope.selectedAuthorUids.splice(index, 1);
        			}
        		}
        		$scope.page = 1;
        		$scope.files = [];
        		$scope.isSearch = true;
        		$scope.getFiles();
        	};

        	//search by keyword
        	$scope.q = '';
        	$scope.searchByKeyWord = function (keyword) {
                     $scope.parentSelected = false;
                      $scope.fileselected=false;

           $scope.loadervalue=true;
           $scope.parentSelected = false;
            $scope.fileselected=false;
        		$scope.q = keyword;
        		$scope.files = [];
        		$scope.isSearch = true;
        		$scope.page = 1;
        		$scope.getFiles();
        	};

        	//filter by dates
        	$scope.filterDate = function (){

            $scope.parentSelected = false;
            $scope.fileselected=false;
            $scope.loadervalue=true;
        		$scope.files = [];
        		$scope.isSearch = true;
        		$scope.page = 1;
        		$scope.getFiles();
        	};

        	//get files
        	$scope.getFiles = function(){
        		$scope.showViewMoreBtn = false;
        		$scope.modalStatus= true;
        		var params = {
        				sortKey : $scope.sortKey,
        				sortField : $scope.sortField,
        				type: $scope.type,
        				page : $scope.page,
        				itemsPerPage : 10
        		};

        		if(($scope.selectedTypes == null || $scope.selectedTypes.length == 0) &&
        				($scope.selectedAuthorUids == null || $scope.selectedAuthorUids.length == 0) &&
        				($scope.selectedCommunityUids == null || $scope.selectedCommunityUids.length == 0) &&
        				($scope.q == null || $scope.q == '') &&
        				($scope.dateFrom == null || $scope.dateFrom == '') &&
        				($scope.dateTo == null || $scope.dateTo == '')){
        			$scope.isSearch = false;
        		}

        		params.isSearch = $scope.isSearch;

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

        		if($scope.selectedCommunityUids != null && $scope.selectedCommunityUids.length > 0){
            		params.communityFilter = $scope.selectedCommunityUids;
            	}

        		apiCommunity.getFilesOnCommunities(params).then(function(data){
                           $scope.loadervalue=false;
        			$scope.files = $scope.files.concat(data);


        			$scope.showViewMoreBtn = !$scope.isSearch || (data && data.length < 10) ? false : true;
        		}, function(err){
        			notifyModal.showTranslated('something_went_wrong', 'error', null);
        		});
            $timeout(function () {
                $scope.dataNotFound = $scope.files;
            }, 4000);
        	};

                $scope.selectedFiles=[];
        	$scope.selectedImages = [];
                $scope.previewdata=[];
                $scope.parentdata=[];
//        	$scope.fileInfo=function(data,$event,filedata){
//        		console.log("data : " + JSON.stringify(data));
//        		var len = $scope.selectedImages.length;
//        		$scope.fileselected=true;
//        		if($event.target.checked){
//        			$scope.fileNameinfo=data.fileName;
//              $scope.gDrive= data.isGdrive;
//        			$scope.url=data.url;
//        			$scope.typeinfo=data.fileType;
//        			$scope.by=data.author.firstName + ' ' + data.author.lastName;
//        			var d1 = new Date(data.fileUploadedDate);
//        			$scope.creatadate=d1.toDateString();
//
//        			$scope.selectedImages.push(data);
//        		}else{
//        			$scope.fileselected=false;
//
//        			if(len > 0){
//	        	        for(var i=0; i<len; i++){
//	        	            if(data.uid == $scope.selectedImages[i].uid){
//	        	              $scope.selectedImages.splice(i, 1);
//	        	              return true;
//	        	            }
//	        	        }
//        			}
//        		}
//
//                        var len = $scope.selectedFiles.length;
//                        if (len == 0)
//                        {
//                        $scope.selectedFiles.push(filedata);
//                        }
//                        else {
//                                $scope.selectedFiles.push(filedata);
//    //                              for(var i=0; i<len; i++){
//    //                              if(filedata.uid == $scope.selectedFiles[i].uid){
//    //                               $scope.selectedFiles.splice(i, 1);
//    //                              return true;
//    //                              }
//    //                               else if(i == (len-1)){
//    //                                   $scope.selectedFiles.push(filedata);
//    //                              return false;
//    //                               }
//    //                               }//for
//                            }
//
//        	}
                        $scope.$watch('files', function(main){
                            var total_selected = 0;
                            angular.forEach(main, function(parent){
                            parent.child_selected = 0;
                            angular.forEach(parent.files, function(child){
                            parent.child_selected += child.selected ? 1 : 0
                            if ( parent.child_selected == parent.files.length)
                            {
                                parent.selected = true;
                            }
                            else
                            {
                                parent.selected = false;
                             }
                         });

    });

    $scope.select_all = function(continent){
      continent.selected = true;
    }

    $scope.total_selected = total_selected;

  }, true);

    $scope.fileInfoParent = function (data, $event,filedata) {

      if(data.fileType=='folder'){
        if (!$event.target.checked) {
            $scope.parentSelected = true;
            $scope.fileselected=false;
            $scope.parentdata.push(data);
            if ($scope.parentdata.length>0) {
                $scope.parentfileName = $scope.parentdata[$scope.parentdata.length - 1].fileName;
                $scope.childs = $scope.parentdata[$scope.parentdata.length - 1].files.length;
            } else {
                $scope.parentSelected = false;
            }
        }

        else {
            $scope.parentSelected=false;
            angular.forEach($scope.parentdata, function (val, key) {
                if (data.fileUid == val.fileUid) {
                    $scope.parentdata.splice($scope.parentdata.indexOf(val), 1);
                    if ($scope.parentdata.length > 0) {
                            $scope.parentfileName = $scope.parentdata[$scope.parentdata.length - 1].fileName;
                            $scope.childs = $scope.parentdata[$scope.parentdata.length - 1].files.length;
                    } else {
                            $scope.parentSelected = false;
                    }
                }
            })
        }

        $scope.pushAndPopArray();

      }else{
        $scope.parentSelected = false;
       $scope.fileselected=false;
     $scope.fileInfoChild(data, $event,filedata);
      }
    };

            $scope.pushAndPopArray=function(){
                setTimeout(function(){
                    $scope.newArray=[];
                    angular.forEach($scope.files, function (value, key){
                       if(value.selected) {
                           if (value.files) {
                             angular.forEach(value.files, function (value1, key1){
                                 $scope.newArray.push(value1);
                             })
                           }else{
                             $scope.newArray.push(value);
                           }

                       } else {
                           angular.forEach(value.files, function (valuenew, valKey){
                               if(valuenew.selected) {
                                   $scope.newArray.push(valuenew);
                               }
                           })
                       }
                     })
                },100)

            };

                $scope.fileInfoChild=function(data,$event,filedata){
               $scope.fileselected=true;
               $scope.parentSelected=false;
               console.log($event.target.checked)
               if($event.target.checked){
                    $scope.previewdata.push(data);
               }else{
                    angular.forEach($scope.previewdata,function(val,key){
                        if(data.fileUid==val.fileUid){
                            $scope.previewdata.splice($scope.previewdata.indexOf(val),1);
                        }
                    })
                }

                if($scope.previewdata.length){
                   $scope.gDrive= $scope.previewdata[$scope.previewdata.length-1].isGdrive;
                   $scope.fileNameinfo=$scope.previewdata[$scope.previewdata.length-1].fileName;
                   $scope.url=$scope.previewdata[$scope.previewdata.length-1].url;
                   $scope.typeinfo=$scope.previewdata[$scope.previewdata.length-1].fileType;
                   var d1 = new Date($scope.previewdata[$scope.previewdata.length-1].fileUploadedDate);
                   $scope.creatadate=d1.toDateString();
                   if($scope.previewdata[$scope.previewdata.length-1].author){
                	   $scope.by=$scope.previewdata[$scope.previewdata.length-1].author.firstName + ' ' + $scope.previewdata[$scope.previewdata.length-1].author.lastName;
                   }
                }
                else{
                    $scope.fileselected=false;
                }
                    $scope.pushAndPopArray();
          };

        });
