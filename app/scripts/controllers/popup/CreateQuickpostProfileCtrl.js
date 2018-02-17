'use strict';

angular.module('inspherisProjectApp')
  .controller('CreateQuickpostProfileCtrl', function ($scope, $state, $stateParams, $filter, $window, $rootScope, sharedData, apiFeedData, editQuickpostModal, notifyModal, confirmModal,uiModals, apiPeoples) {

	    $scope.addDocFilesCnt = 0; //0th element is alreadt in DOM
	    $scope.$window = $window;
	    $scope.showAttachmentOptns = false;
	    
	    //User ID
	    $scope.targetId = $stateParams.uid;

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
	    $scope.peopleApi = new apiPeoples();
	    $scope.userData = null;
	    $scope.peopleApi.getUser({uid: $stateParams.uid}).then(function(data){
	          $scope.userData = data;
	    }, function(err){
	          notifyModal.showTranslated("something_went_wrong", 'error', null);
	    });
	    
	    $scope.enableMetions = false; // for enable send notification visit
	    $scope.createApi = new apiPeoples();
	    
	    //temporary disable
//	    var config = sharedData.findConfig("QUICKPOST_METION");
//	    if(typeof(config.name) != 'undefined'){
//	    	$scope.enableMetions = config.value ? true : false;
//	    }

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
//	    $scope.showPublishOptions = function(){
//	      
//	      if($scope.showOptionsFlag == false){
//	        $scope.showOptionsFlag = true;
//	        $scope.$window.onclick = function (event) {
//	          var clickedElement = event.target;
//	          if (!$(event.target).closest(".qpst-wrapper").length) {
//	            //$scope.showOptionsFlag = false;
//	            //callbackOnClose();
//	            $scope.$apply(function() {
//	              $scope.showOptionsFlag = false;
//	              $scope.$window.onclick = null;
//	            });
//	          }
//	        };
//	      }
//	    };

	    //for editing quickpost
	    if($scope.$parent.editData){
	      $scope.editQuickpostData = $scope.$parent.editData;
	      //$scope.showPublishOptions();
	      $scope.caHashTag = $scope.editQuickpostData.hashtags;
	      if($scope.editQuickpostData.blocks.length > 0){
	        angular.forEach($scope.editQuickpostData.blocks, function(val, key){
	          var blockType= val.type.toLowerCase();
	          switch(blockType){
	            case 'text':
	                $scope.quickpostData.quickpostDesc = val.title;
	              break;
	            case 'documentgallery':
	                var docObj = angular.copy(sharedData.docGalleryObj);
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
	                      uploadedDate: filedata.uploadedDate
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
	                      uploadedDate: filedata.uploadedDate
	                  });
	                });
	              $scope.attachedFiles.push(imgObj);
	              break;
	            case 'videogallery':
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


	    $scope.clearData = function() {
	      $scope.attachedFiles = [];
	      $scope.quickpostData.quickpostDesc = '';
	      $scope.caHashTag = '';
	    };
	    $scope.closeEditQuickpost = function(){
	      editQuickpostModal.hide();
	    };

	    //For mentio data
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
	    
	    $scope.textDetail=[];
	    $scope.keyWordSelected = function(item){
	      var detail={k:item.uid,v:item.label};
	 	  $scope.textDetail.push(detail);
	      return '@' + item.label;
	    };
	 
	    $scope.getHashtagString = function(){
	        var hashtagList = '';
	        angular.forEach($scope.caHashTag, function(val, key){
	          hashtagList += val.text;
	          if(key != ($scope.caHashTag.length - 1))
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

	      postData.followedUserUid = $stateParams.uid;
	      if($scope.editQuickpostData != ''){
	        postData.uid = $scope.editQuickpostData.uid;
	        postData.modifiedTextBlock = $scope.modifiedTextBlock;
	      }
	      if(!$filter('isBlankString')($scope.quickpostData.quickpostDesc)){
	        postData.quickpostDescription = $scope.quickpostData.quickpostDesc;
	      }
	      else{
	        errorData.message = 'Enter_text_content';
	        errorData.flag = true;
	        return {error: errorData, data: postData};
	      }
	       
	      if($rootScope.isEditQuickPost == true){
	  		if(($scope.textDetail.length == 0)){
	  			if($scope.editQuickpostData.textDetail.length > 0){
	  				for(var i = 0; i<$scope.editQuickpostData.textDetail.length; i++){
	  					if(postData.quickpostDescription.contains($scope.editQuickpostData.textDetail[i].v) == true){
	  						$scope.textDetail.push($scope.editQuickpostData.textDetail[i]);
	  					}
	  				}
	  			}
	      		
	  		}else{
	  			
	  			if(typeof($scope.editQuickpostData.textDetail) != 'undefined'  && $scope.editQuickpostData.textDetail.length > 0){
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
	        };
	      });
	      return {error: errorData, data: postData};
	    };

	    $scope.publishShortArt = function(){
	      var validData = $scope.isDataValidateToPost();
	      
	      if(!validData.error.flag){
	    	  $scope.createApi.writeQuickpost(validData.data).then(function(data){
	            $scope.clearData();
	            if($scope.editQuickpostData != ''){
	              //if was in edit mode then close edit popup
	              $scope.closeEditQuickpost();
	            }
	            if(typeof(data.errors) != 'undefined' && data.errors != null && data.errors.length > 0){
	          	  var message= $filter('translate')('Content cannot be translated automatic.' + data.errors[0]);
	          	  var title = $filter('translate')('Warning');
	          	  uiModals.alertModal(null,title, message);
	            }
	            $state.reload();
	          }, function(err) {
	            notifyModal.showTranslated('something_went_wrong', 'error', null);
	          });
	      }
	      else{
	        notifyModal.showTranslated(validData.error.message, 'error', null);
	      }
	    };

  });