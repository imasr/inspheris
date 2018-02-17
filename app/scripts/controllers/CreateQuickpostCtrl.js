'use strict';

angular.module('inspherisProjectApp')
  .controller('CreateQuickpostCtrl', function ($scope, $state, $stateParams, $filter, $window, $rootScope, $compile, $http, Config, sharedData, youtubeVideo, apiCommunity, apiFeedData, editQuickpostModal, ngDialog, notifyModal, confirmModal,uiModals,selectCommunityModal, apiPeoples, embededCodeFromUrl) {

    $scope.communitylist = [];
    $scope.inputTags=[];
    $scope.textDetail=[];

    $scope.disableTextArea = true;
    $scope.selectedCommUid = {
              text: "Select_Community",
              commid: null
            };
    $scope.addDocFilesCnt = 0; //0th element is alreadt in DOM
    $scope.$window = $window;
    $scope.showOptionsFlag = $scope.$parent.ngDialogData ? true : false;
    $scope.showAttachmentOptns = false;
    $scope.showCommSelect = true;
    $scope.selectedCommLabel = 'Community name/Category name';
    $scope.selectedCommunities = [];
    $scope.communityForTabsSelection = [];

    $scope.modifiedTextBlock = false;
    $scope.modifiedVideoBlock = false;
    $scope.modifiedDocumentBlock = false;
    $scope.modifiedImageBlock = false;
    //holds the form models
    $scope.quickpostData = {quickpostDesc: ''};
    $scope.editQuickpostData = '';
    $scope.caHashTag = '';

    $scope.attachedFiles = [];
    $scope.tabSelected = [];

    $scope.flagQuickpostType = ''; //will be used check whether to post quickpost with embeded vdo or with array of files value=(files/video)
    
    //Embed link automaticly from google search
    $scope.embedLink = function(url){
    	$scope.embededCodeFromUrl = new embededCodeFromUrl();
        $scope.embededCodeFromUrl.getEmbedded(url).then(function(data){
	        if(data.type == 'link'){
	        	 var image = new Image();
	        	 image.src = data.provider_url + "/favicon.ico";
	        	 var faviconUrl = '';
	        	 if(image.width > 0 && image.height > 0){
	        		 faviconUrl = data.provider_url + "/favicon.ico";
	        	 }

	        	 $scope.isValidLink = true;
	        	 $scope.linkPreview = 'valid';
	        	 $scope.linkData = {
	        			 location : data.provider_url,
	        			 description : data.description,
	        			 title : data.title,
	        			 thumbnail_width : data.thumbnail_width,
	        			 path : data.url,
	        			 thumbnail_url : data.thumbnail_url,
	        			 version : data.version,
	        			 subTitle : data.provider_name,
	        			 type : data.type,
	        			 thumbnail_height : data.thumbnail_height,
	        			 favicon :  faviconUrl
	        	 }

	        	 var linkObj = {
	        			 links: [$scope.linkData],
	        			 type : 'linkEmbed',
	        			 modifiedBlock: false
	        	 }
	        	 $scope.attachedFiles.push(linkObj);

	        }else{
            notifyModal.showTranslated("Invalid link", 'error', null);
          }
        }, function(err){
          //error
          $scope.linkPreview = 'invalid';
          notifyModal.showTranslated("invalid_url_or_enable_cross_origin_acess", 'error', null);
        });
    }


    $scope.enableMetions = false; // for enable send notification visit
    var config = sharedData.findConfig("QUICKPOST_METION");
    if(typeof(config.name) != 'undefined'){
    	$scope.enableMetions = config.value ? true : false;
    }

    /*
    if($scope.quicpostSelectedComm){
      //hide the dropdown to select community if it is on community page, and set selectedCommUid recrived from parent scope
      $scope.showCommSelect = false;
      $scope.showAttachmentOptns = true;
      $scope.selectedCommUid = {
              text: $scope.quicpostSelectedComm.name,
              commid: $scope.quicpostSelectedComm.uid
            };
    }
    */

    $scope.$watch('quickpostData', function(newValue, oldValue) {
      if(newValue !== oldValue){
        $scope.modifiedTextBlock = true;
      }
    }, true);
    $scope.$watch('attachedFiles',function(newValue, oldValue) {
      if(newValue.length == oldValue.length){
        angular.forEach(newValue, function(val, key) {
          if(!angular.equals(newValue[key], oldValue[key])){
            $scope.attachedFiles[key].modifiedBlock = true;
          }
        });
      }
    }, true);

    var message= $filter('translate')("change_attachedfiles_image_confirm");
	var title = $filter('translate')('Warning');
    $scope.addVideoGallery = function(){
        	if(!angular.isUndefined($scope.attachedFiles[0])){
        		if($scope.attachedFiles[0].type != 'videoGallery'){
        			if($scope.attachedFiles[0].files.length > 0 || (typeof($scope.attachedFiles[0].links) !='undefined' && $scope.attachedFiles[0].links.length > 0)){
            			var modal = confirmModal.showTranslated($scope, {title: title, message: message});
            			modal.closePromise.then(function (data) {
           	  			if(data.value == 'ok'){
        	   	  			$scope.attachedFiles = [];
        	   	  			$scope.attachedFiles.push(angular.copy(sharedData.vdoGalleryObj));
        	   	  			$scope.blockActive = $scope.attachedFiles[0].type;
           	  			}else
           	  			{
           	  				modal.close();
           	  			}

           	  		 });
              		}else{
              			$scope.attachedFiles = [];
                        $scope.attachedFiles.push(angular.copy(sharedData.vdoGalleryObj));
              		}
        		}
          	}else{
          		$scope.attachedFiles = [];
                $scope.attachedFiles.push(angular.copy(sharedData.vdoGalleryObj));
          	}
        $scope.blockActive = $scope.attachedFiles[0].type;
    };
    $scope.addDocGallery = function(){
    	   if(!angular.isUndefined($scope.attachedFiles[0])){
    		    if($scope.attachedFiles[0].type != 'documentGallery'){
    		    	if($scope.attachedFiles[0].files.length > 0 || (typeof($scope.attachedFiles[0].links) !='undefined' && $scope.attachedFiles[0].links.length > 0)){
             			var modal = confirmModal.showTranslated($scope, {title: title, message: message});
           			modal.closePromise.then(function (data) {
          	  			if(data.value == 'ok'){
          	  			$scope.attachedFiles = [];
       	   	             $scope.attachedFiles.push(angular.copy(sharedData.docGalleryObj));
       	   	             $scope.blockActive = $scope.attachedFiles[0].type;
          	  			}else
          	  			{
          	  				modal.close();
          	  			}

          	  		 });
             		}else{
             			$scope.attachedFiles = [];
                        $scope.attachedFiles.push(angular.copy(sharedData.docGalleryObj));
             		}
    		    }
         	}else{
         		$scope.attachedFiles = [];
                $scope.attachedFiles.push(angular.copy(sharedData.docGalleryObj));
         	}
    	   $scope.blockActive = $scope.attachedFiles[0].type;
    };

    $scope.addImageGallery = function() {
    	  if(!angular.isUndefined($scope.attachedFiles[0])){
    		  if($scope.attachedFiles[0].type != 'imageGallery'){
    			  if($scope.attachedFiles[0].files.length > 0 || (typeof($scope.attachedFiles[0].links) !='undefined' && $scope.attachedFiles[0].links.length > 0)){
      				var modal = confirmModal.showTranslated($scope, {title: title, message: message});
          			modal.closePromise.then(function (data) {
         	  			if(data.value == 'ok'){
      	   	  			$scope.attachedFiles = [];
      	   	  			$scope.attachedFiles.push(angular.copy(sharedData.imgGalleryObj));
      	   	  			$scope.blockActive = $scope.attachedFiles[0].type;
         	  			}else
         	  			{
         	  				modal.close();
         	  			}

         	  		 });
          		}else{
          			  $scope.attachedFiles = [];
                      $scope.attachedFiles.push(angular.copy(sharedData.imgGalleryObj));
          		}
    		  }
    	  }else{

    		  $scope.attachedFiles = [];
              $scope.attachedFiles.push(angular.copy(sharedData.imgGalleryObj));
    	  }
    	  $scope.blockActive = $scope.attachedFiles[0].type;
    };

	// Yammer Embed block

	$scope.addYammerEmbed = function()
	{
			if(!angular.isUndefined($scope.attachedFiles[0])){

    		if($scope.attachedFiles[0].type != 'yammerEmbed'){

    			if(typeof($scope.attachedFiles[0].files != 'undefined') && $scope.attachedFiles[0].files.length > 0){
        			var modal = confirmModal.showTranslated($scope, {title: title, message: message});
        			modal.closePromise.then(function (data) {

       	  			if(data.value == 'ok'){

    	   	  			$scope.attachedFiles = [];
    	   	  			$scope.attachedFiles.push(angular.copy(sharedData.yammerEmbedObj));
    	   	  			$scope.blockActive = $scope.attachedFiles[0].type;
    	   	  			$scope.attachedFiles[0].files = [];
       	  			}else
       	  			{
       	  				modal.close();
       	  			}

       	  		 });
          		}else{
					debugger ;
          			$scope.attachedFiles = [];
                    $scope.attachedFiles.push(angular.copy(sharedData.yammerEmbedObj));
                    $scope.attachedFiles[0].files = [];
          		}
    		}
      	}else{

      		$scope.attachedFiles = [];
            $scope.attachedFiles.push(angular.copy(sharedData.yammerEmbedObj));
            $scope.attachedFiles[0].files = [];
	    }

	    $scope.blockActive = $scope.attachedFiles[0].type;
	}

    //Link Embed block
    $scope.addLinkEmbed = function(){
    	if(!angular.isUndefined($scope.attachedFiles[0])){

    		if($scope.attachedFiles[0].type != 'linkEmbed'){

    			if(typeof($scope.attachedFiles[0].files != 'undefined') && $scope.attachedFiles[0].files.length > 0){
        			var modal = confirmModal.showTranslated($scope, {title: title, message: message});
        			modal.closePromise.then(function (data) {
       	  			if(data.value == 'ok'){
    	   	  			$scope.attachedFiles = [];
    	   	  			$scope.attachedFiles.push(angular.copy(sharedData.linkEmbedObj));
    	   	  			$scope.blockActive = $scope.attachedFiles[0].type;
    	   	  			$scope.attachedFiles[0].files = [];
       	  			}else
       	  			{
       	  				modal.close();
       	  			}

       	  		 });
          		}else{
					debugger;
          			$scope.attachedFiles = [];
                    $scope.attachedFiles.push(angular.copy(sharedData.linkEmbedObj));
                    $scope.attachedFiles[0].files = [];
          		}
    		}
      	}else{

      		$scope.attachedFiles = [];
            $scope.attachedFiles.push(angular.copy(sharedData.linkEmbedObj));
            $scope.attachedFiles[0].files = [];
	    }
	    $scope.blockActive = $scope.attachedFiles[0].type;

	};
    $scope.showPublishOptions = function(){

      if($scope.showOptionsFlag == false){
        $scope.showOptionsFlag = true;
        $scope.$window.onclick = function (event) {
          var clickedElement = event.target;
          if (!$(event.target).closest(".qpst-wrapper").length) {
            //$scope.showOptionsFlag = false;
            //callbackOnClose();
            $scope.$apply(function() {
              $scope.showOptionsFlag = false;
              $scope.$window.onclick = null;
            });
          }
        };
      }
    };
    //for editing quickpost
    if($scope.$parent.editData){
    //if(typeof($scope.$parent.ngDialogData) != 'undefined'){
      //$scope.editQuickpostData = $scope.$parent.ngDialogData;
        var editQuickpostDataTemp = $scope.$parent.editData;
        if (editQuickpostDataTemp.textDetail.length > 0) {
//          editQuickpostDataTemp.title = editQuickpostDataTemp.title.replace(editQuickpostDataTemp.textDetail[0].v, "");
        }
        var stringArray = editQuickpostDataTemp.title.split(" ");
        for (var i = 0; i < stringArray.length; i++) {
          stringArray.splice(stringArray.indexOf(""), 1);
          if (stringArray.indexOf("") == -1) {
            break;
          }
        }
        for (var i = 0; i < stringArray.length; i++) {
          if (stringArray[i].charAt(0) == "#") {
            $scope.inputTags.push({ hastag: stringArray[i] });
            editQuickpostDataTemp.title = editQuickpostDataTemp.title.replace(stringArray[i], "");
            editQuickpostDataTemp.title = editQuickpostDataTemp.title.trim();
          }
          if (stringArray[i].charAt(0) == "@") {
            $scope.inputTags.push({
              name: "@" + editQuickpostDataTemp.textDetail[0].v
            });
            $scope.textDetail.push({
              k: editQuickpostDataTemp.textDetail[0].k,
              v: editQuickpostDataTemp.textDetail[0].v
            });
//            editQuickpostDataTemp.title = editQuickpostDataTemp.title.replace(stringArray[i], "");
          }
          if (stringArray[i].charAt(0) != "@" && stringArray[i].charAt(0) != "#") {
            $scope.inputTags.push({ text: stringArray[i] });
//            editQuickpostDataTemp.title = editQuickpostDataTemp.title.replace(stringArray[i], "");
          }
        }
        $scope.editQuickpostData = editQuickpostDataTemp;
      $scope.showPublishOptions();
      $scope.disableTextArea = false;
      $scope.caHashTag = $scope.editQuickpostData.hashtags;
      if(typeof($scope.editQuickpostData.importFromSearch) != 'undefined' && $scope.editQuickpostData.importFromSearch == true){
    	  $scope.disableTextArea = true;
    	  if($scope.editQuickpostData.url != ''){
    		  $scope.embedLink($scope.editQuickpostData.url);
    	  }
    	  $scope.showAttachmentOptns = true;
      }else if($scope.editQuickpostData.blocks.length > 0){
        angular.forEach($scope.editQuickpostData.blocks, function(val, key){
          var blockType= val.type.toLowerCase();
          switch(blockType){
            case 'text':
                $scope.quickpostData.quickpostDesc = $scope.editQuickpostData.title;
              break;
            case 'documentgallery':
                //$scope.addDocGallery();
                var docObj = angular.copy(sharedData.docGalleryObj);
                //$scope.attachedFiles.push({type: 'documents', attachedFiles: []});
                angular.forEach(val.documents, function(filedata, i){
                  var docUrl = '';
                  if(typeof(filedata.url) != 'undefined'){
                    docUrl = filedata.url;
                  }
                  else if(typeof(filedata.path) != 'undefined'){
                    docUrl = filedata.path;
                  }
                  docObj.files.push({
                      uploadStatus: '2',
                      uid: filedata.uid,
                      fileType: filedata.fileType,
                      fileName: filedata.fileName,
                      description: filedata.description,
                      url: docUrl,
                      uploadedDate: filedata.uploadedDate,
                      modifiedDate: filedata.modifiedDate,
                      isInternal : filedata.isInternal,
                      path: docUrl
                  });
                });
                $scope.attachedFiles.push(docObj);
              break;
            case 'imagegallery':
              //$scope.addImageGallery();
              var imgObj = angular.copy(sharedData.imgGalleryObj);
              angular.forEach(val.images, function(filedata, i){
                  var imageUrl = '';
                  if(typeof(filedata.url) != 'undefined'){
                    imageUrl = filedata.url;
                  }
                  else if(typeof(filedata.path) != 'undefined'){
                    imageUrl = filedata.path;
                  }
                  imgObj.files.push({
                      uploadStatus: '2',
                      uid: filedata.uid,
                      fileType: filedata.fileType,
                      fileName: filedata.fileName,
                      description: filedata.description,
                      url: imageUrl,
                      thumbUrl: filedata.thumbUrl,
                      mediumUrl: filedata.mediumUrl,
                      largeUrl: filedata.largeUrl,
                      thumbGalleryUrl: filedata.thumbGalleryUrl,
                      uploadedDate: filedata.uploadedDate,
                      modifiedDate: filedata.modifiedDate,
                      isInternal : filedata.isInternal,
                      path: imageUrl
                  });
                });
              $scope.attachedFiles.push(imgObj);
              break;
            case 'videogallery':
              //$scope.addVideoGallery();
              var vdoObj = angular.copy(sharedData.vdoGalleryObj);
              angular.forEach(val.videos, function(filedata, i){
                  vdoObj.files.push({
                      embedVideo: filedata.embedVideo,
                      embedVideoTitle: filedata.embedVideoTitle,
                      thumbUrl: filedata.thumbUrl
                  });
                });
              $scope.attachedFiles.push(vdoObj);
              break;
            case 'linkembed':
                var linkObj = angular.copy(sharedData.linkEmbedObj);
                linkObj.links = val.links;
                $scope.attachedFiles.push(linkObj);
                break;
			case 'yammerEmbed':
			    var linkObj = angular.copy(sharedData.yammerEmbedObj);
                linkObj.links = val.links;
                $scope.attachedFiles.push(linkObj);
			   break;
          }
        });
      }
    }

    $scope.removeBlock = function(blockIndex, event) {
      $scope.attachedFiles = [];
      event.stopPropagation();
    };

    $scope.stopPropagation = function(event){
      event.stopPropagation();
    };

    $scope.selectedCom = true;
    $scope.selectCommunity = function(){
  	var selectedCommunities = [];
  	var array = [];
  	for(var i = 0 ; i < $scope.selectedCommunities.length ; i++){
  		if(array.indexOf($scope.selectedCommunities[i].label) === -1){
  			array.push($scope.selectedCommunities[i].label);
    			selectedCommunities.push($scope.selectedCommunities[i]);
  		}
  	}
        var modal = selectCommunityModal.show(selectedCommunities);
        modal.closePromise.then(function (data){
        	if(data.value.flag == 'ok'){
        		$scope.selectedCommunities = data.value.data;
        		$scope.selectedCommLabel = sharedData.joinCommunityLabels($scope.selectedCommunities);
        		
        		$scope.selectedTabs = [];
                if($scope.communityForTabsSelection.length > 0){
                	angular.forEach($scope.communityForTabsSelection, function(val, key){
                		angular.forEach(val.tabs, function(tb, i){
                			if(tb.selected || tb.defaultSelected){
                				$scope.selectedTabs.push({
                					uid : tb.uid,
                					defaultSelected : tb.defaultSelected,
                					selected : tb.selected
                				});
                			}
                		});
                	});
                }
        		$scope.communityForTabsSelection = sharedData.communityTabSelectionData($scope.selectedCommunities, 'quickpost',$rootScope.enablePinCommunityFeature,$scope.selectedTabs);
        		if($scope.selectedCommLabel != 'Community name/Category name'){
        			$scope.showAttachmentOptns = true;
        		}
        		$scope.checkEnableText();
            }
        });
    };

    $scope.quickpostCommSelecte = function(selected){
        $scope.communityForTabsSelection = [selected];
    	$scope.tabsSelection = {};
    	$scope.tabsSelection.text = selected.text;
    	$scope.tabsSelection.tabs = [];
      if(!$scope.selectedCommUid.commid){
        $scope.selectedCommUid = {
          text: selected.text,
          commid: selected.commid
        };
      }
      if($scope.selectedCommUid.commid){
        $scope.showAttachmentOptns = true;
      	if(selected.tabs != undefined && selected.tabs.length > 0){
      		for(var i = 0 ; i < selected.tabs.length; i++){
      			if((selected.tabs[i].tabType == 'quickpost') || (selected.tabs[i].tabType == 'collection')){
      				$scope.tabsSelection.tabs.push(selected.tabs[i]);
      			}
      		}
      	}
      }
      else{
        $scope.showAttachmentOptns = false;
      }
    };

  	$scope.tabSelection=[];
        $scope.commTab='';
  	$scope.chooseTab = function($event,tab){
            if(tab.selected){
                if($scope.commTab===''){
                    $scope.commTab=tab.tabName;
                }else{
                    $scope.commTab=$scope.commTab+','+tab.tabName;
                }
            }else{
                $scope.commTab=$scope.commTab.replace(tab.tabName, "");
                $scope.commTab=$scope.commTab.replace(",,", ",");
                var lastChar = $scope.commTab.slice(-1);
                if (lastChar === ',') {
                    $scope.commTab = $scope.commTab.slice(0, -1);
                }
                if ($scope.commTab.startsWith(",")){
                     $scope.commTab=$scope.commTab.slice(1);
                }
            }
//            console.log(angular.copy(tab));
//  		if(($state.current.name == 'app.communityHome') || ($state.current.name == 'app.communityHomeWithTab') || ($state.current.name == 'app.communityHomeWithArticle')){
//  			if(!tab.selected){
//  	  			tab.selected = true;
//  	  		}else{
//  	  			tab.selected = false;
//  	  		}
//  		}
  		if(tab.selected){
  			$scope.tabSelected.push(tab.uid);
  		}else{
			for(var i = 0; i< $scope.tabSelected.length; i++ ){
				if($scope.tabSelected[i] == tab.uid){
  					$scope.tabSelected.splice(i, 1);
				}
			}
  		}
  		$scope.checkEnableText();
  	};

  	$scope.checkEnableText = function(){
  		var cstate = $state.current.name;
  		if($scope.selectedCommunities.length > 0){
  			if($scope.communityForTabsSelection.length > 0){
  				if((cstate == 'app.communityHome') || (cstate == 'app.communityHomeWithTab') || (cstate == 'app.communityHomeWithArticle')){
  					if($scope.tabSelected.length > 0){
  						$scope.disableTextArea = false;
  					}else{
  						$scope.disableTextArea = true;
  					}
  				}else{
  					if($scope.tabSelected.length > 0){
  						$scope.disableTextArea = false;
  					}else{
  						$scope.disableTextArea = true;
  					}
  				}
  			}else{
  				$scope.disableTextArea = true;
  			}
  		}else{
  			$scope.disableTextArea = true;
  		}
  	}
  	/*
    if($scope.selectedCommUid.commid!=''){
  		apiCommunity.getCommunityByUid ($scope.selectedCommUid.commid).then(function(data){
  			 var  community = {};
  			community.text = data.label;
  			community.commid = data.uid;
  			community.tabs = data.tabs;
  			$scope.quickpostCommSelecte(community);
  		});
  	}
    */

    $scope.clearData = function() {
      $scope.attachedFiles = [];
      $scope.quickpostData.quickpostDesc = '';
      $scope.caHashTag = '';
      $scope.selectedCommUid = {
              text: "Select_Community",
              commid: null
            };
      $rootScope.isEditQuickPost = false;
    };
    $scope.closeEditQuickpost = function(){
      editQuickpostModal.hide();
    };

  //For mentio data
  $scope.hashtag=function(data) {
      $rootScope.loadTags(data).then(function(data){
        $scope.members=data;
      });
  };
    $scope.hostclick = function() {
      $("#quickpostTitle").focus();
    };
//    console.log($scope.quickpostData);
    var text='';
    angular.forEach($scope.inputTags, function(val, key){
        if(val.text){
            text=text+' '+val.text;
            val.text='';
        }
        if(val.name){
            text=text+' '+val.name;
            val.name='';
        }
//        $scope.quickpostData.quickpostDesc=text;
    });
    
    $scope.edithash=function(key,hashtag){
        $scope.quickpostData.quickpostDesc.trim();
        $scope.quickpostData.quickpostDesc= $scope.quickpostData.quickpostDesc+' '+hashtag;
        $scope.deleteTag(key);
    };
    
     var flag=0;

    $scope.newTag = function() {
      if ($scope.quickpostData.quickpostDesc.charAt(0) != "#" && $scope.quickpostData.quickpostDesc.charAt(0) != "@") {
//        $scope.inputTags.push({ text: $scope.quickpostData.quickpostDesc });
        $scope.quickpostData.quickpostDescTextTemp = $scope.quickpostData.quickpostDesc;
//        $scope.quickpostData.quickpostDesc = "";
      }
      if ($scope.quickpostData.quickpostDesc.length > 0 && $scope.quickpostData.quickpostDesc.charAt(0) == "#") {
//        $scope.inputTags.push({
//          hastag: $scope.quickpostData.quickpostDesc
//        });
//        $scope.quickpostData.quickpostDesc = "";
        if($scope.inputTags.length===0){
            $scope.inputTags.push({ hastag: $scope.quickpostData.quickpostDesc });
        }else{
            for(var i=0;i<$scope.inputTags.length;i++){
//                console.log($scope.inputTags)
                if($scope.inputTags[i].hastag===$scope.quickpostData.quickpostDesc){
                    flag=1;
                    break;
                }else{
                    flag=0;
                }
        }
        if(flag===0){
            $scope.inputTags.push({ hastag: $scope.quickpostData.quickpostDesc });
        }
    }$scope.quickpostData.quickpostDesc = "";
      }
      if ($scope.quickpostData.quickpostDesc.length > 0) {
        var index = $scope.quickpostData.quickpostDesc.indexOf("#");
        var length = $scope.quickpostData.quickpostDesc.length;
        var temp = "";

        for (var i = index; i < length; i++) {
          temp = temp + $scope.quickpostData.quickpostDesc.charAt(i);
        }
//        console.log(index, length, temp);
        if (temp.charAt(0) == "#") {
          $scope.inputTags.push({ hastag: temp });
          $scope.quickpostData.quickpostDesc = $scope.quickpostData.quickpostDesc.replace(temp, "");
//          console.log($scope.quickpostData.quickpostDesc);
        }
      }
    };
    $scope.removeTagOnBackspace = function(event) {
      if (event.keyCode === 8 && $scope.quickpostData.quickpostDesc.length == 0) {
        if ($scope.inputTags.length > 0 && $scope.inputTags[$scope.inputTags.length - 1].text) {
          $scope.quickpostData.quickpostDesc = $scope.inputTags[$scope.inputTags.length - 1].text;
        }
        $scope.inputTags.pop();
//        console.log("back");
      }
    };
    $scope.getProductTextRaw = function(item) {
      // $scope.hashArr.push(item);
    if($scope.inputTags.length===0){
        $scope.inputTags.push({ hastag: item.label });
    }else{
        for(var i=0;i<$scope.inputTags.length;i++){
//            console.log($scope.inputTags)
            if($scope.inputTags[i].hastag===item.label){
                flag=1;
                break;
            }else{
                flag=0;
            }
        }
        if(flag===0){
            $scope.inputTags.push({ hastag: item.label });
        }
    }
    $scope.quickpostData.quickpostDesc=$scope.quickpostData.quickpostDesc.replace(/\w+[.!?]?$/, '');
//       return  item.label;

      return '';
    };

    $scope.deleteTag = function(key) {
      $scope.inputTags.splice(key, 1);
    };

    $scope.keyWordApi = new apiPeoples();
    $scope.members = [];

    $scope.getKeywords = function(viewValue) {
        if($scope.keyWordApi){
          $scope.keyWordApi.cancel();
        }
      $scope.selectedCommunityIds = [];
      if($scope.selectedCommunities.length > 0){
    	  for(var i = 0 ; i< $scope.selectedCommunities.length; i++){
    		  $scope.selectedCommunityIds.push($scope.selectedCommunities[i].id);
    	  }
      }else{
    	  $scope.selectedCommunityIds.spilce($scope.selectedCommunity.length,0);
      }
      $scope.keyWordApi = new apiPeoples();
        return $scope.keyWordApi.suggestUser({q: viewValue,communityIds:$scope.selectedCommunityIds}).then(function(data) {
          var temp = [];
          angular.forEach(data, function(val){
            temp.push({label: val.firstName + " " + val.lastName,uid:val.uid});
          });
          $scope.members = temp;
          return $scope.members;
        });
    };

    $scope.keyWordSelected = function(item){
      var detail = { k: item.uid, v: item.label };
      $scope.textDetail.push(detail);
//      $scope.inputTags.push({ name: "@" + item.label });
       return '@' + item.label;
//      $scope.quickpostData.quickpostDesc='';
//      return '';
    };

    $scope.getHashtagString = function(){
        var hashtagList = '';
        angular.forEach($scope.caHashTag, function(val, key){
          hashtagList += val.text;
          if(key !== ($scope.caHashTag.length - 1))
            hashtagList += ', ';
        });
        return hashtagList;
    };

    $scope.isDataValidateToPost = function(){
      //if retruns true: all data is valid to post else invalid
      var postData = {};
      var errorData = {
        flag: false,
        message: ''
      };
      var len=500;
      if($scope.quickpostData.quickpostDesc===''){
          errorData.message = "Enter_text_content";
           errorData.flag = true;
           return { error: errorData, data: postData };
      }
       if($scope.quickpostData.quickpostDesc.length>=501){
          errorData.message = "text limit exceed ";
           errorData.flag = true;
           return { error: errorData, data: postData };
      }
      if($scope.editQuickpostData !== ''){
        postData.uid = $scope.editQuickpostData.uid;
        postData.modifiedTextBlock = $scope.modifiedTextBlock;
      }
      
      if(!$filter('isBlankString')($scope.quickpostData.quickpostDesc)){
        postData.quickpostDescription = $scope.quickpostData.quickpostDesc;
      }
      else{
       if (!$filter('isBlankString')($scope.quickpostData.quickpostDescTextTemp)){
           postData.quickpostDescription ='';
        }else {
           errorData.message = "Enter_text_content";
           errorData.flag = true;
           return { error: errorData, data: postData };
        }
      }

      if($scope.selectedCommunities.length > 0){
        postData.community = $scope.selectedCommUid.commid;
      }
      else{
        errorData.flag = true;
        errorData.message = "Select_Community";
        return {error: errorData, data: postData};
      }

      if($scope.editQuickpostData != '' && typeof($scope.editQuickpostData.importFromSearch) == 'undefined'){

	      if($scope.tabsSelection.tabs.length > 0){
	    	  for(var i = 0 ; i< $scope.tabsSelection.tabs.length ; i++){
	    		  if($scope.tabsSelection.tabs[i].selected){
	    			  $scope.tabSelection.push($scope.tabsSelection.tabs[i].uid);
	    		  }
	      		}
	      }

	      if($scope.tabSelection.length<=0){
	    	        errorData.flag = true;
	    	        errorData.message = "select_community_tab";
	    	        return {error: errorData, data: postData};
	    	   }else{
	    		   postData.communityTabUids = $scope.tabSelection;
	    	   }
      }else{
    	  if($scope.selectedCommunities.length <= 0){
        	  errorData.flag = true;
              errorData.message = "Select_Community";
          }

    	  var ctyTabUids = sharedData.getSelectedTabUids($scope.communityForTabsSelection);
    	  if(ctyTabUids.length <= 0){
    	        errorData.flag = true;
    	        errorData.message = "select_community_tab";
    	  }
    	  postData.communityTabUids = ctyTabUids;
      }


      if($rootScope.isEditQuickPost == true){
  		if(($scope.textDetail != undefined && $scope.textDetail.length == 0)){
  			if($scope.editQuickpostData.textDetail.length > 0){
  				for(var i = 0; i<$scope.editQuickpostData.textDetail.length; i++){
  					if(postData.quickpostDescription.contains($scope.editQuickpostData.textDetail[i].v) == true){
  						$scope.textDetail.push($scope.editQuickpostData.textDetail[i]);
  					}
  				}
  			}

  		}else{

  			if($scope.editQuickpostData.textDetail.length > 0){
  				for(var i = 0; i<$scope.editQuickpostData.textDetail.length; i++){
  					if(postData.quickpostDescription.contains($scope.editQuickpostData.textDetail[i].v) == true){
  						$scope.textDetail.push($scope.editQuickpostData.textDetail[i]);
  					}
  				}
  			}
  		}
      }

      if($scope.textDetail.length>0){
  	    var details= JSON.stringify($scope.textDetail).replace('[','').replace(']','').replace(/{/g,'@[').replace(/}/g,']').replace(/"/g,'').replace(/:/g,'=');
  	    postData.textDetail= details;
  	    $scope.textDetail.splice(0,$scope.textDetail.length);
  	  }

      var hashtagList = $scope.getHashtagString();
      if(hashtagList != ''){
    	  postData.hashtag = hashtagList;
      }

      angular.forEach($scope.attachedFiles, function(val, key) {
        switch(val.type){
          case 'videoGallery':
            var tempdata = sharedData.getMediaGalleryDataToPost(val.files, 'embeddedVideo');

            postData.type = 'video';
            errorData = tempdata.error;
            postData.videos = tempdata.data;

            if($scope.editQuickpostData != ''){
              postData.modifiedVideoBlock = $scope.attachedFiles[key].modifiedBlock;
            }
            break;
          case 'imageGallery':
            var tempdata = sharedData.getMediaGalleryDataToPost(val.files, 'image');
            postData.type = 'file';
            errorData = tempdata.error;
            postData.images = tempdata.data;

            if($scope.editQuickpostData != ''){
              postData.modifiedImageBlock = $scope.attachedFiles[key].modifiedBlock;
            }
          break;
          case 'documentGallery':
            var tempdata = sharedData.getMediaGalleryDataToPost(val.files, 'document');
            postData.type = 'file';
            errorData = tempdata.error;
            postData.documents = tempdata.data;

            if($scope.editQuickpostData != ''){
              postData.modifiedDocumentBlock = $scope.attachedFiles[key].modifiedBlock;
            }
          break;
          case 'linkEmbed':
              var tempdata = sharedData.getMediaGalleryDataToPost(val, 'linkEmbed');
              errorData = tempdata.error;
              postData.links = tempdata.data;
              if($scope.editQuickpostData != ''){
                postData.modifiedVideoBlock = $scope.attachedFiles[key].modifiedBlock;
              }
              break;
		case 'yammerEmbed':
              var tempdata = sharedData.getMediaGalleryDataToPost(val, 'yammerEmbed');
              errorData = tempdata.error;
              postData.links = tempdata.data;
              if($scope.editQuickpostData != ''){
                postData.modifiedVideoBlock = $scope.attachedFiles[key].modifiedBlock;
              }
              break;
        };
      });
      return {error: errorData, data: postData};
    };
    $scope.disabledPublishedQuickPost = false;
    $scope.publishShortArt = function(caHashTag){
        $scope.caHashTag=caHashTag;
//        console.log($scope.quickpostData.quickpostDesc)
        if($scope.quickpostData.quickpostDesc===' '){
            
        }
        var validData = $scope.isDataValidateToPost();
        var textDAtaTemp='';
        angular.forEach($scope.inputTags, function(val, key) {
//          console.log(val)
          if (val.name) {
            textDAtaTemp = textDAtaTemp + " " + val.name;
          }
          if (val.hastag) {
            textDAtaTemp = textDAtaTemp + " " + val.hastag;
          }
          if (val.text) {
            textDAtaTemp = textDAtaTemp + " " + val.text;
          }
      });
//      console.log(validData.data.quickpostDescription)
      validData.data.quickpostDescription = validData.data.quickpostDescription+ " " + textDAtaTemp ;
//      console.log(validData.data.quickpostDescription)
      if(!validData.error.flag){
          $scope.disabledPublishedQuickPost = true;
        apiFeedData.postQuickPost(validData.data).then(function(data){
            $scope.clearData();
            $scope.disabledPublishedQuickPost = false;
            if($scope.editQuickpostData != ''){
              //if was in edit mode then close edit popup
              $scope.closeEditQuickpost();
            }
            notifyModal.showTranslated('quickpost_create_success', 'success', null);
            if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
          	  var message= $filter('translate')('Content cannot be translated automatic.' + data.errors[0]);
          	  var title = $filter('translate')('Warning');
          	  uiModals.alertModal(null,title, message);
            }
          }, function(err) {
              $scope.disabledPublishedQuickPost = false;
            notifyModal.showTranslated('something_went_wrong', 'error', null);
          });
      }
      else{
        notifyModal.showTranslated(validData.error.message, 'error', null);
      }
    };

    apiCommunity.getCommunitiesData().then(function(data){
      //$scope.communitylist = data;
      $scope.communitylist = sharedData.getUserCommunities(data, $rootScope.userData);
      //empty the array
      $scope.ddSelectOptions = [];

      if($scope.editQuickpostData != '' && typeof($scope.editQuickpostData.importFromSearch) == 'undefined'){
        //if in edit mode, show the community of quickpost
      /*  $scope.selectedCommUid = {
          text: $scope.editQuickpostData.community.label,
          commid: $scope.editQuickpostData.community.uid,
          tabs :  $scope.editQuickpostData.community.tabs
        }; */

        var commlen = $scope.communitylist.length;
        for(var i=0; i<commlen; i++){
                if($scope.communitylist[i].uid == $scope.editQuickpostData.community.uid){
                  $scope.selectedCommunities.push($scope.communitylist[i]);
                  $scope.selectedCommUid = {
                    text: $scope.communitylist[i].label,
                    commid: $scope.communitylist[i].uid,
                    tabs : $scope.communitylist[i].tabs
                  };
                  break;
                }
        }//for

        $scope.tabsSelection = {};
        $scope.tabsSelection.tabs = [];
        $scope.editQuickpostData.communityTab.selected=true;
        $scope.tabsSelection.tabs.push($scope.editQuickpostData.communityTab);
        $scope.tabSelection.push($scope.editQuickpostData.communityTab.uid);
        $scope.tabsSelection.text=$scope.selectedCommUid.text;
        $scope.showAttachmentOptns = true;
        var selectedTabs = sharedData.communityTabSelectionData([$scope.selectedCommUid], 'quickpost',$rootScope.enablePinCommunityFeature,null);

        $scope.tabsSelection = selectedTabs[0];

              angular.forEach($scope.tabsSelection.tabs, function (tb, i) {
                 if($scope.editQuickpostData.communityTab.uid == tb.uid) {
                  tb.selected = true;
                  $scope.tabSelection.push(tb.uid);
                  $scope.communityForTabsSelection.push(tb.uid);
                }
               });

      }

      angular.forEach($scope.communitylist, function(entry, key){
        var tempObj = {};
        tempObj.text = entry.label;
        tempObj.commid = entry.uid;
        tempObj.tabs = entry.tabs;
        $scope.ddSelectOptions.push(tempObj);
      });
      /*
      $scope.communitylist.forEach(function(entry){
        var tempObj = {};
        tempObj.text = entry.label;
        tempObj.commid = entry.uid;
        tempObj.tabs = entry.tabs;
        $scope.ddSelectOptions.push(tempObj);
      });
      */
      var cstate = $state.current.name;
      if((cstate == 'app.communityHome') || (cstate == 'app.communityHomeWithTab') || (cstate == 'app.communityHomeWithArticle')){
        //if we are on above state then set pre selected community
        //modaldata = {communityUid: $stateParams.commuid};
        var commlen = $scope.ddSelectOptions.length;
        for(var i=0; i<commlen; i++){
          var tcom = $scope.ddSelectOptions[i];
          if(tcom.commid == $stateParams.commuid){
            $scope.selectedCommunities.push($scope.communitylist[i]);
            $scope.selectedCommUid = {
              text: $scope.communitylist[i].label,
              commid: $scope.communitylist[i].uid,
              tabs : $scope.communitylist[i].tabs
            };
            var communityArray = [];
            communityArray.push($scope.communitylist[i]);
            $scope.communityForTabsSelection = sharedData.communityTabSelectionData(communityArray, 'quickpost',$rootScope.enablePinCommunityFeature,null);
            $scope.selectedCommLabel = sharedData.joinCommunityLabels(communityArray);
            if($scope.selectedCommLabel != 'Community name/Category name'){
    	    	$scope.showAttachmentOptns = true;
    	    }
            break;
          }//if
        }//for
      }//if
    }, function(err){
      notifyModal.show('Unable to load community list.', 'error');
    });


  });
