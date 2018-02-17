'use strict';

angular.module('inspherisProjectApp')
  .controller('CreateCommunityCtrl', function ($scope, $timeout, $filter, apiGroup, apiMediaUpload, apiCommunity, $q, createCommunityModal, mediaService, sharedData, notifyModal, cropImagesModal, confirmModal, UiConfig, uiModals, $rootScope){

    $scope.folderGDrive = '';
    $scope.keyFile ='';

	$scope.setKeyFiles = function(event){
		var files = event.target.files;
		var tabIndex = event.srcElement.getAttribute("data-file-id");
	    var file = files[0];

	    if (file) {
	        var reader = new FileReader();
	        reader.onload = function(e) {
	            var binaryString = e.target.result;
	            $scope.keyFile = btoa(binaryString);
	            $scope.tabs[tabIndex].keyFile = $scope.keyFile;

	        };
	        reader.readAsBinaryString(file);

	    }
	};


    $scope.popupTitle = ""
    $scope.title = '';
    $scope.desc = '';
    $scope.modalStatus = {
        isReady: false,
        message: 'please wait...',
        windriveOptn: UiConfig.windriveOptn
      };

    $scope.commImg = null;
    $scope.bannerImg = null;

    $scope.groupSelOptions = null;
    $scope.isPrivate = false;
    $scope.requestedCommUid = null;
    $scope.editCommunityData = null;
    $scope.tabs = [];
    $scope.allAvailableTabs = [];

    $scope.selectedTabType = {
      tabName: 'Select tab',
      tabType: null,
      label : 'Select tab'
    };

    $scope.isPublishing = false;

    $scope.authorComShare =  [{value:'on'},{value:'off'},{value:'custom'}];
    $scope.selectedAuthorComShare = {value:"on"};
    $scope.authorizeTabShare = true;
    $scope.disableTabShare = true;
    $scope.authorComShareSelected = function(selected){
    	if(selected.value != 'custom'){
    		$scope.authorizeTabShare = selected.value == 'on'? true : false;
    		angular.forEach($scope.tabs, function(val, key){
    			  val.authorizeShare = $scope.authorizeTabShare ;
    	        });
    		$scope.disableTabShare = true;
    	}else{
    		$scope.disableTabShare = false;
    	}
    }

    $scope.getBannerImgHeight = function(){
      //calculates the percentage height of banner image to show thumbnail on FE properly
      var h = sharedData.getHeightOfAspectRatio(sharedData.communityImageSize.banner.min.width, sharedData.communityImageSize.banner.min.height);
      return h;
    };
    $scope.getLogoImgHeight = function(){
      //calculates the percentage height of logo image to show thumbnail on FE properly
      var h = sharedData.getHeightOfAspectRatio(sharedData.communityImageSize.logo.min.width, sharedData.communityImageSize.logo.min.height);
      return h;
    };

    $scope.getPreparedTabObj = function(val){
    	if(val.toLowerCase() != 'wiki'){
    		var tempObj = {
    				tab: {
    					tabType: val.toLowerCase(),
    				},
    				tabName: val,
    				tabType: val.toLowerCase(),
    				tabSelected: ($scope.modalData.action == 'create') ? true : false,
    				privated: false,
    				defaultSelected: false,
    				authorizeShare : $scope.authorizeTabShare,
    				folderGDrive : $scope.folderGDrive,
    				keyFile : $scope.keyFile
    		};
    		
    		if(val.toLowerCase() == 'files'){
    			tempObj.tab.label = 'documents and media library';
    			tempObj.tab.tabName = $filter('translate')('Documents And Media Library');
            }else if(val.toLowerCase() == 'imagegallery'){
            	tempObj.tab.label = 'image gallery';
            	tempObj.tab.tabName = $filter('translate')('Image Gallery');
            }else if(val.toLowerCase() == 'projectmanagement'){
            	tempObj.tab.label = 'project management';
            	tempObj.tab.tabName = $filter('translate')('Project Management');
            }else{
            	tempObj.tab.label = val.toLowerCase();
            	tempObj.tab.tabName = $filter('translate')(val);
            }

            if(val.toLowerCase() == 'document' || val.toLowerCase() == 'collection'){
              tempObj.documentOnNfs = false;
              tempObj.nfsRoot = '';
            }
            return tempObj;
    	}
    };
    $scope.addTab = function(){
      if($scope.selectedTabType.tabType){
        var tempObj = $scope.getPreparedTabObj($scope.selectedTabType.tabType);
//        tempObj.tab.tabName = $scope.selectedTabType.tabName;
        $scope.tabs.push(tempObj);
      }
    };
    $scope.removeTab = function(tab, index){
      if(tab.uid){
        var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_community_tab_confirm"});
        modal.closePromise.then(function (data) {
            if(data.value == 'ok'){
              apiCommunity.deleteTab({uid: tab.uid}).then(function(data){
            	if(typeof(data.code) != 'undefined' && data.code != null){
            		var message= $filter('translate')(data.message);
            		var title = $filter('translate')('Error');
            		uiModals.alertModal(null,title, message);
            	}else{
            		$scope.tabs.splice(index, 1);
            	}
              }, function(err){
                notifyModal.showTranslated("something_went_wrong", 'error', null);
              });
            }
        });
      }
      else{
        $scope.tabs.splice(index, 1);
      }
    };

      $scope.selectType = function(tab,index){
		var selectedTab = $scope.tabs[index];
		var currentTab = selectedTab.tab;
		if(selectedTab.uid != undefined){
			if(selectedTab.tab.tabType != tab.tabType){
		        var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Are you sure change this tab type?"});
		        modal.closePromise.then(function (data) {
		            if(data.value == 'ok'){
		            	apiCommunity.isTabHasContent({tabUid: selectedTab.uid,tabType: tab.tabType}).then(function(data){
		            		if(typeof(data.code) != 'undefined' && data.code != null){
		            			var message= $filter('translate')(data.message);
		            			var title = $filter('translate')('Error');
		            			uiModals.alertModal(null,title, message);
		            			$scope.getCurrentTabFromSelectedTab(currentTab,selectedTab,index);
		            		}else{
		            			if(data){
		            				uiModals.alertModal(null,$filter('translate')('Error'), $filter('translate')('Can not change tab type . Because this tab is having contains contents'));
		            				$scope.getCurrentTabFromSelectedTab(currentTab,selectedTab,index);
		            			}else{
		            				$scope.getCurrentTabFromSelectedTab(tab,selectedTab,index);
		            			}
		            		}
		            	}, function(err){
		            		notifyModal.showTranslated("something_went_wrong", 'error', null);
		            	});
		            }else{
		            	$scope.getCurrentTabFromSelectedTab(currentTab,selectedTab,index);
		            }
		        });

			}else if(selectedTab.tab.tabType == tab.tabType){
				$scope.getCurrentTabFromSelectedTab(currentTab,selectedTab,index);
			}
		}else{
			$scope.getCurrentTabFromSelectedTab(tab,selectedTab,index);
		}
    };

    $scope.getCurrentTabFromSelectedTab = function(currentTab,selectedTab,index){
    	var tempObj = {
					tab: {
						tabType: currentTab.tabType.toLowerCase()
					},
					uid : selectedTab.uid != undefined ? selectedTab.uid : null,
					tabName: currentTab.tabType,
					tabType: currentTab.tabType.toLowerCase(),
					tabSelected: selectedTab.tabSelected,
					privated: selectedTab.privated,
					defaultSelected : selectedTab.defaultSelected,
					authorizeShare : selectedTab.authorizeShare,
					folderGDrive : selectedTab.folderGDrive,
					keyFile : selectedTab.keyFile
			};
    	
			if(currentTab.tabType.toLowerCase() == 'files'){
				tempObj.tab.label = 'documents and media library';
			}else if(currentTab.tabType.toLowerCase() == 'imagegallery'){
				tempObj.tab.label = 'image gallery';
			}else if(currentTab.tabType.toLowerCase() == 'projectmanagement'){
				tempObj.tab.label = 'project management';
			}else{
				tempObj.tab.label = currentTab.tabType.toLowerCase();
			}
		
            if($scope.modalData.action == 'create'){
            	if(currentTab.tabType.toLowerCase() == 'files'){
            		tempObj.tab.tabName = $filter('translate')('Documents And Media Library');
                }else if(currentTab.tabType.toLowerCase() == 'imagegallery'){
                	tempObj.tab.tabName = $filter('translate')('Image Gallery');
                }else if(currentTab.tabType.toLowerCase() == 'projectmanagement'){
                	tempObj.tab.tabName = $filter('translate')('Project Management');
                }else{
                	tempObj.tab.tabName = $filter('translate')(currentTab.tabName);
                }
            }else{
            	tempObj.tab.tabName = $filter('translate')(currentTab.tabName);
            }
            
			if(currentTab.tabType.toLowerCase() == 'document' || currentTab.tabType.toLowerCase() == 'collection'){
				  tempObj.documentOnNfs = false;
				  tempObj.nfsRoot = '';
			}
			$scope.tabs[index]=tempObj;
    };
    $scope.fetchAllTabs = function(commTabs){
      apiCommunity.getTabTypes().then(function(data){
        if(data){
          angular.forEach(data, function(val, key){

            var tempObj = $scope.getPreparedTabObj(val);
            if($scope.modalData.action == 'create'){
            	if(val.toLowerCase() !== 'projectmanagement' || 
            			(val.toLowerCase() == 'projectmanagement' && $rootScope.isTeamworkCommunityTab)){
            		$scope.tabs.push(tempObj);
            	}
            }
            
            var tab = {
                    tabType: val.toLowerCase()
            }
            
            if(val.toLowerCase() == 'files'){
            	tab.label = 'documents and media library';
            }else if(val.toLowerCase() == 'imagegallery'){
            	tab.label = 'image gallery';
            }else if(val.toLowerCase() == 'projectmanagement'){
            	tab.label = 'project management';
            }else{
            	tab.label = val.toLowerCase();
            }
            
            if($scope.modalData.action == 'create'){
            	if(val.toLowerCase() == 'files'){
                	tab.tabName = $filter('translate')('Documents And Media Library');
                }else if(val.toLowerCase() == 'imagegallery'){
                	tab.tabName = $filter('translate')('Image Gallery');
                }else if(val.toLowerCase() == 'projectmanagement'){
                	tab.tabName = $filter('translate')('Project Management');
                }else{
                	tab.tabName = $filter('translate')(val);
                }
            }else{
            	tab.tabName = $filter('translate')(val);
            }
            
            if(tab.tabType !== 'projectmanagement' || 
        			(tab.tabType == 'projectmanagement' && $rootScope.isTeamworkCommunityTab)){
                $scope.allAvailableTabs.push(tab);
        	}
          });//for each
        }//if data
      }, function(err){
      });
    };
    $scope.fillEditTabs = function(commTabs){
      if(commTabs){
        angular.forEach(commTabs, function(val, key){
        	if(val.tabType.toLowerCase() != 'wiki'){
        		var tempObj = {
        			uid: val.uid,
        			tab: {
        				tabName: $filter('translate')(val.tabName),
        				tabType: val.tabType.toLowerCase()
        			},
        			tabSelected: val.tabSelected,
        			privated: val.privated,
        			defaultSelected: val.defaultSelected,
        			authorizeShare :	val.authorizeShare,
        			folderGDrive : val.folderGDrive,
        			keyFile : val.keyFile
        		};

                if(val.tabType.toLowerCase() == 'files'){
                	tempObj.tab.label = 'documents and media library';
                }else if(val.tabType.toLowerCase() == 'imagegallery'){
                	tempObj.tab.label = 'image gallery';
                }else if(val.tabType.toLowerCase() == 'projectmanagement'){
                	tempObj.tab.label = 'project management';
                }else{
                	tempObj.tab.label = val.tabType.toLowerCase();
                }
                
        		if(val.tabType.toLowerCase() == 'document' || val.tabType.toLowerCase() == 'collection'){
        			tempObj.documentOnNfs = val.documentOnNfs;
        			tempObj.nfsRoot = val.nfsRoot;
        		}
        		$scope.tabs.push(tempObj);
        	}
        });//for each
      }//if data
    };

    $scope.logoImgUploader = null;
    $scope.bannerImgUploader = null;

    $scope.modalData = $scope.$parent.ngDialogData;
    $scope.selectedGroup = {
      groupName: 'Select group'
    };
    $scope.initializeData = function(){
      var deferred = $q.defer();

      var pr0 = apiGroup.getAll();

      $q.all([pr0]).then(function(data){
            //for data[0]
            $scope.groupSelOptions = data[0];
            //empty the array
            $scope.ddSelectOptions = [];
            $scope.communitySelected = {
                text: "Community name/Category name"
            };
          deferred.resolve("success");
      }, function(err){
        deferred.reject(err);
      });//q.all
      return deferred.promise;
    };
    $scope.initializeData().then(function(){
      //$scope.modalStatus.isReady = true;
      if($scope.modalData.action == 'create' && $scope.modalData.type == 'community'){
        $scope.popupTitle = "Create_Community";
        $scope.fetchAllTabs(null);
        $scope.modalStatus.isReady = true;
      }
      else if($scope.modalData.action == 'create' && $scope.modalData.type == 'requested_community'){
        $scope.popupTitle = "Create_Community";
        $scope.requestedCommUid = $scope.modalData.data.uid;
        $scope.title = $scope.modalData.data.label;
        $scope.desc = $scope.modalData.data.description;
        $scope.fetchAllTabs(null);
        $scope.modalStatus.isReady = true;
      }
      else if($scope.modalData.action == 'edit'){
        $scope.popupTitle = "Edit community";
        if($scope.modalData.data.uid){
          apiCommunity.getCommunityByUid({uid: $scope.modalData.data.uid, status: 'all'}).then(function(data){
            $scope.modalStatus.isReady = true;
            $scope.editCommunityData = data;
            $scope.title = data.label;
            $scope.desc = data.description;
            $scope.isPrivate = (true ? (data.privated == 1) : false);
            $scope.selectedAuthorComShare = {value:data.authorizeShare};
            $scope.disableTabShare = data.authorizeShare == 'custom' ? false : true;
            if(data.group){
              $scope.selectedGroup = {
                uid: data.group.uid,
                groupName: data.group.groupName
              };
            }

            if(data.logoUid && data.logoUrl){
              $scope.commImg = {
                uid: data.logoUid,
                urls: [
                  data.logoUrl,
                  data.headerLogoUrl,
                  data.thumbLogoUrl,
                  data.gridviewThumbLogoUrl,
                  data.gridviewSmallThumbLogoUrl
                ]
              };
            }
            if(data.bannerUid && data.bannerUrl){
              $scope.bannerImg = {
                uid: data.bannerUid,
                urls: [
                  data.bannerUrl,
                  data.headerBannerUrl,
                  data.thumbBannerUrl,
                  data.gridviewThumbBannerUrl,
                  data.gridviewSmallThumbBannerUrl
                ]
              };
            }
            /*
            angular.forEach(data.tabs, function(val, key){
              $scope.tabs.push({
                tabSelected: val.tabSelected,
                tabName: val.tabName,
                tabType: val.tabType,
              });
            });
            */
            $scope.fetchAllTabs(null);
            $scope.fillEditTabs(data.tabs);
          }, function(err){
          });
        }
      }
    }, function(){
    });

    $scope.sortableTabs = {
        update: function(e, ui) {
          var logEntry = $scope.tabs.map(function(i){
            return i.value;
          }).join(', ');
        },
        stop: function(e, ui) {
          // this callback has the changed model
          var logEntry = $scope.tabs.map(function(i){
            return i.value;
          }).join(', ');
        },
        cancel: ".fixed",
        'ui-floating': false
    };

    $scope.groupSelected = function(obj){
    };
    $scope.flsel = function(fl){
    };
    $scope.uploadLogoImageSelect = function($files){
      var tempdata = {};
      if($files){
        tempdata = {
          action: 'crop',
          files: $files,
          cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
          resize: true
        }
      }
      /*
      else if($scope.commImg){
        tempdata = {
          action: 'recrop',
          image: $scope.commImg,
          cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}]
        }
      }
      */
      var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.commImg = null;
            $timeout(function(){
              $scope.commImg = data.value.cropdata.data;
            });
          }
        });
    };
    $scope.logoImageSelect = function($files, $event){
      if($files.length > 0){
        if($files[0].size > 5242880){
          var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
          modal.closePromise.then(function (data) {
              if(data.value == 'ok'){
                $scope.uploadLogoImageSelect($files);
              }
          });
        }
        else{
          $scope.uploadLogoImageSelect($files);
        }
      }
      else{
      }
    };
    $scope.logoImageRecrop = function(){
      var tempdata = {};
      tempdata = {
        action: 'recrop',
        image: {
          uid: $scope.commImg.uid,
          url: $scope.commImg.urls[0]
        },
        cdimentions: [{w: sharedData.communityImageSize.logo.min.width, h: sharedData.communityImageSize.logo.min.height}],
        resize: true
      }
      var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.commImg = null;
            $timeout(function(){
              $scope.commImg = data.value.cropdata.data;
            });
          }
        });
    };

    $scope.uploadBannerImageSelect = function($files){
      var tempdata = {};
      if($files){
        var tempdata = {
          action: 'crop',
          files: $files,
          cdimentions: [{w: sharedData.communityImageSize.banner.min.width, h: sharedData.communityImageSize.banner.min.height}, {w: sharedData.communityImageSize.feedBackgrond.min.width, h: sharedData.communityImageSize.feedBackgrond.min.height}],
          resize: true
        }
      }
      /*
      else if($scope.bannerImg){
        var tempdata = {
          action: 'recrop',
          image: $scope.bannerImg,
          cdimentions: [{w: sharedData.communityImageSize.banner.min.width, h: sharedData.communityImageSize.banner.min.height}]
        }
      }
      */
      var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.bannerImg = null;
            $timeout(function(){
              $scope.bannerImg = data.value.cropdata.data;
            });
          }
        });
    };
    $scope.bannerImageSelect = function($files, $event){
      if($files.length > 0){
        if($files[0].size > 5242880){
          var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "image_file_size_large"});
          modal.closePromise.then(function (data) {
              if(data.value == 'ok'){
                $scope.uploadBannerImageSelect($files);
              }
          });
        }
        else{
          $scope.uploadBannerImageSelect($files);
        }
      }
      else{
      }
    };
    $scope.bannerImageRecrop = function(){
      var tempdata = {
        action: 'recrop',
        image: {
          uid: $scope.bannerImg.uid,
          url: $scope.bannerImg.urls[0]
        },
        cdimentions: [{w: sharedData.communityImageSize.banner.min.width, h: sharedData.communityImageSize.banner.min.height}, {w: sharedData.communityImageSize.feedBackgrond.min.width, h: sharedData.communityImageSize.feedBackgrond.min.height}],
        resize: true
      }
      var modal = cropImagesModal.show(tempdata);
        modal.closePromise.then(function (data){
          if(data.value.flag == 'ok'){
            $scope.bannerImg = null;
            $timeout(function(){
              $scope.bannerImg = data.value.cropdata.data;
            });
          }
        });
    };

    $scope.validateData = function(){
      var postData = {};
      var errorData = {
        flag: false,
        message: ''
      };
      if($scope.editCommunityData){
          postData.communityUid = $scope.editCommunityData.uid;
      }
      if($scope.modalData.mode == 'info'){
        if($scope.requestedCommUid){
          postData.requestedUid = $scope.requestedCommUid;
        }
        postData.privated = $scope.isPrivate;

        if($filter('isBlankString')($scope.title)){
          errorData.flag = true;
          errorData.message = 'Enter valid title';
        }
        else{
          postData.label = $scope.title;
        }

        if(!$filter('isBlankString')($scope.desc)){
            postData.description = $scope.desc;
        }

        if(!$scope.selectedGroup.uid){
            errorData.flag = true;
            errorData.message = "select_group";
        }
        else{
            postData.groupUid = $scope.selectedGroup.uid;
        }

        var tempTabArr = [];
        var anyTabIsActive = false;
        angular.forEach($scope.tabs, function(val, key){
          var obj = angular.copy(val);
          obj.tabOrder = (key+1);
          if($filter('isBlankString')(obj.tab.tabName)){
            errorData.flag = true;
            errorData.message = "Enter tab name";
          }
          if(obj.tab.tabType == "gdrive"){
            if($filter('isBlankString')(obj.folderGDrive)){
	            errorData.flag = true;
	            errorData.message = "Enter folderId GDrive Tab";
            }
	        if($filter('isBlankString')(obj.keyFile)){
	            errorData.flag = true;
	            errorData.message = "Enter key file GDrive Tab";
	          }
          }

          tempTabArr.push({
            "tabName": obj.tab.tabName,
            "tabType": obj.tab.tabType,
            "tabSelected": obj.tabSelected,
            "privated": obj.privated,
            "tabOrder": obj.tabOrder,
            "documentOnNfs": obj.documentOnNfs,
            "nfsRoot": obj.nfsRoot,
            "defaultSelected" : obj.defaultSelected,
            "authorizeShare" :	obj.authorizeShare,
	    "folderGDrive" : obj.folderGDrive,
            "keyFile" : obj.keyFile,
	    "uid" : obj.uid
          });
          if(obj.tabSelected){
            anyTabIsActive = true;
          }
        });
        postData.tabs = tempTabArr;
        if(postData.tabs.length <= 0){
            errorData.flag = true;
            errorData.message = "add_tabs_in_community";
        }
        if(!anyTabIsActive){
          errorData.flag = true;
          errorData.message = "atleat_one_tab_active";
        }
      }//if edit community info

      if($scope.commImg){
        if($scope.commImg.uid){
          postData.logo = $scope.commImg.uid;
        }
      }
      if($scope.bannerImg){
        if($scope.bannerImg.uid){
          postData.banner = $scope.bannerImg.uid;
        }
      }

      //Authorize communitry
      postData.authorizeShare = $scope.selectedAuthorComShare.value;

      return {error: errorData, data: postData};
    };

    $scope.publishCommunity = function(){
      if(!$scope.isPublishing){
        var validatedData = $scope.validateData();
        var errorData = validatedData.error;
        var postData = validatedData.data;


        if(!errorData.flag){
          $scope.isPublishing = true;
          if($scope.modalData.mode == 'info'){
	          apiCommunity.create(postData).then(function(data){
	            $scope.isPublishing = false;
	            $scope.closeThisDialog({flag: 'ok', data: data});
	          }, function(err) {
	            $scope.isPublishing = false;
	            notifyModal.showTranslated("something_went_wrong", 'error', null);
	          });
          }else{
        	  apiCommunity.changeImage(postData.communityUid,postData).then(function(data){
  	            $scope.isPublishing = false;
  	            $scope.closeThisDialog({flag: 'ok', data: data});
  	          }, function(err) {
  	            $scope.isPublishing = false;
  	            notifyModal.showTranslated("something_went_wrong", 'error', null);
  	          });
          }
        }
        else{
          //notifyModal.show(errorData.message, 'error');
          $scope.isPublishing = false;
          notifyModal.showTranslated(errorData.message, 'error', null);
        }
      }//publish is not in progress
      else{
      }//publish is in progresss
    };//publishCommunity

    $scope.$on("$destroy", function(){
      if($scope.logoImgUploader){
        $scope.logoImgUploader.cancel();
      }
      if($scope.bannerImgUploader){
        $scope.bannerImgUploader.cancel();
      }
    });

  });
