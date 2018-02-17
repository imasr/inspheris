'use strict';

angular.module('inspherisProjectApp')
  .controller('CommentWrapperCtrl', function ($scope, $timeout, $rootScope, $state, UiConfig, $translate, sharedData, $filter, USERDATA, apiFiles, apiFeedData, editCommentModal, notifyModal, shareFeedModal, confirmModal, commentViewerModal, memberViewerModal, privateMessageModal, apiSearch,apiPeoples,$q,uiModals,apiMediaManager,apiArticle) {
    $scope.keyWordApi = new apiPeoples();
    //display options
    //specific for canal
    $scope.feedTranslateOptn = UiConfig.feedTranslateOptn;
    $scope.fo = {
      share: UiConfig.feedShareOptn,
      page: 1, //don't set if 0 in  CommentViewerCtrl we have already fetched for page 1 so we will increment from 1 in this page,
      commentStatus: 0
    };    
    $scope.isPublishing = false;
    $scope.selectedLanguage = {
      name: "Display in",
      code: null
    };
    $scope.languageOptions = angular.copy($rootScope.languages);

    $scope.uploadCommentFiles = [];
    $scope.editCommentData = '';
    var commentLimit =2;

    this.$onInit = function() {
      $scope.feed = this.feed;
      $scope.keepopen = (this.keepOpen =='true');
      $scope.referer = this.refererCommunity;      
      $scope.showLimit = ($scope.feed != undefined && $scope.feed.comments != undefined  && $scope.feed.comments.length > commentLimit)? $scope.feed.comments.length : commentLimit;
      if($scope.showAllComments){
        //if showAllCoomments is true(loadMoreComme)
        //the comments are alrady fetched for page 1 in CommentViewerCtrl, f
        $scope.showAllComments = ($scope.feed.comments && $scope.feed.comments.length < $rootScope.uiConfig.cmntsPerPage) ? false : true;
      }
    }   

    $scope.commentData = {
      text: '',
      attachment: []
    };

    $scope.showCommentSection = false;
    
    $scope.attachedFiles = [];
    $scope.isEditingMode = false;

    if(typeof($scope.keepopen) != 'undefined' && $scope.keepopen){
      $scope.showCommentSection = false;
    }

    $scope.compileLangMenu = false;
    $scope.showLanguageDropdown = function(){
        console.log($scope.compileLangMen);
      if(!$scope.compileLangMenu){
        $scope.compileLangMenu = true;
      }
      else{
          $scope.compileLangMenu = false;
      }
              console.log($scope.compileLangMenu);

    };

     $scope.getFeedTranslate=function(params,translateFromModal){
		var deferred = $q.defer();
		var parameter = {
			page: 0,
			itemsPerPage: $rootScope.uiConfig.cmntsPerPage
		};
		          
		if($scope.feed.type == 'follower quickpost'){
			parameter.followerQuickpostUid = $scope.feed.uid;
		}else {
		    parameter.content = $scope.feed.uid;
		}
		var pr = [
		  apiFeedData.getFetchFeed(params),
		   apiFeedData.getComments(parameter)
		];
		$q.all(pr).then(function(data){	
                    data[0].likeCount=$scope.feed.likeCount;
                    data[0].community.label=$scope.feed.community.label;
                    data[0].allowShare=$scope.feed.allowShare;
			   if(translateFromModal != undefined && translateFromModal == true){
				   if(data[0].comment!=undefined && data[0].comments.length>0){
					   data[0].comments = data[1];
				   }
				   
				   $rootScope.$broadcast('comment.translated',  data[0],data[1]);
			   }else{
				   if(typeof(data[0].errors) != 'undefined' && data[0].errors != null && data[0].errors.length > 0){
					   var message= $filter('translate')(data[0].errors[0]);
					   var title = $filter('translate')('Error');
					   uiModals.alertModal(null,title, message);
		           }
				   $rootScope.$broadcast('feed.translated', data[0]);     				   
			   }
			  deferred.resolve("success");
		}, function(err){
		  deferred.reject(err);
		});//q.all
		return deferred.promise;
	  };
    $scope.feedLanguageChanged = function(selected,translateFromModal){
      $scope.selectedLanguage = selected;
      var params = {
        language: $scope.selectedLanguage.code,
        responseType: "feed"
      };
      if($scope.feed.sourceId){
        params.uid = $scope.feed.sourceId;
      }
      else{
        params.uid = $scope.feed.uid; 
      }
      $scope.getFeedTranslate(params,translateFromModal);
   if($scope.feed.likeCount){$scope.feed.userLiked=true;}
    };
    
    $scope.downloadAll = function(){
        if($scope.feed.type == 'document' && $scope.feed.blocks){
    	   apiArticle.getArticle({uid: $scope.feed.uid,track: 'download',referer: $scope.referer}).then(function(data){
           }, function(err){
           });
        	
            if($scope.feed.blocks.length > 0){
              angular.forEach($scope.feed.blocks, function(val, key) {
            	  if(val.type == 'documentGallery'){
            		  if(val.documents && val.documents.length > 0){
            			  var link = document.createElement('a');

            			  link.setAttribute('download', null);
            			  link.style.display = 'none';

            			  document.body.appendChild(link);
						  if(val.documents.length == 1){ //If single file then-> just download that file
							  var path = "/api/mediamanager?file=attachments/" + val.documents[0].uid + "/" + val.documents[0].fileName;
							  link.setAttribute('href', path);
							  link.click();
						  }else{ //if multiple file -> compress as a zip and download.
							  var fileUids= [];
            				  var fileName = $scope.feed.title+'.zip';
            				  for (var i in val.documents) {
            					  fileUids.push(val.documents[i].uid);
	            		      }
            				  var postData = {
            						  fileUids: fileUids,
            						  fileName: fileName
            				  };

            			      apiMediaManager.downloadAllFilesAsAZip(postData).then(function(data){
            			    	  link.setAttribute('href', data); 
            			    	  link.click();
            			      }, function(err){
            			          notifyModal.showTranslated('something_went_wrong', 'error', null);
            			     });
						  }
            			  
            			  document.body.removeChild(link);
            		  }
            	  }
              });
            }
          }
    };
    
    $scope.members = [];
    $scope.getKeywords = function(viewValue) {
        if($scope.keyWordApi){
          $scope.keyWordApi.cancel();
        }
      $scope.keyWordApi = new apiPeoples();
        return $scope.keyWordApi.suggestUser({q: viewValue}).then(function(data) {
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

    $scope.$on('setFocusToCommentBox', function(event, mass) { 
      $scope.showCommentSection = true;
      $timeout(function(){
        $(".comment_box").focus();
      });
    });

    $scope.showCommentBox = function(feed,showAllComments){
      $scope.members = [];
      $scope.showCommentSection = !$scope.showCommentSection;
      $timeout(function(){
        $(window).trigger('resize');
      });

      if(showAllComments == undefined || showAllComments == false){
	      var parameter = {
	    		lastTwoComments: true
	      };
     
	      if($scope.feed.type == 'follower quickpost'){
	      	parameter.followerQuickpostUid = $scope.feed.uid;
	      }else {
	      	parameter.content = feed.uid;
	      }
	      apiFeedData.getComments(parameter).then(function(data){
	          $scope.feed.comments = data;
	      }, function(err){
	          notifyModal.showTranslated('something_went_wrong', 'error', null);
	      });
      }
    }
    
    $scope.showSharePopup = function(feeddata){
      shareFeedModal.show(feeddata);
    };

    $scope.addImageGallery = function() {
      var attachLen = $scope.attachedFiles.length;
      var imgblockExist = false;
      if(attachLen > 0){
        angular.forEach($scope.attachedFiles, function(val, key){
          if(val.type == 'imageGallery'){
              imgblockExist = true;
          }
          if(key == (attachLen-1)){
            if(!imgblockExist){
              $scope.attachedFiles.push(angular.copy(sharedData.imgGalleryObj));
            }
          }
        });
      }
      else{
        $scope.attachedFiles.push(angular.copy(sharedData.imgGalleryObj));
      }
    };
    $scope.addDocGallery = function() {
      var attachLen = $scope.attachedFiles.length;
      var docblockExist = false;
      if(attachLen > 0){
        angular.forEach($scope.attachedFiles, function(val, key){
          if(val.type == 'documentGallery'){
              docblockExist = true;
          }
          if(key == (attachLen-1)){
            if(!docblockExist){
              $scope.attachedFiles.push(angular.copy(sharedData.docGalleryObj));
            }
          }
        });
      }
      else{
        $scope.attachedFiles.push(angular.copy(sharedData.docGalleryObj));
      }
    };
    $scope.addVideoGallery = function() {
      var attachLen = $scope.attachedFiles.length;
      var vdoblockExist = false;
      if(attachLen > 0){
        angular.forEach($scope.attachedFiles, function(val, key){
          if(val.type == 'videoGallery'){
              vdoblockExist = true;
          }
          if(key == (attachLen-1)){
            if(!vdoblockExist){
              $scope.attachedFiles.push(angular.copy(sharedData.vdoGalleryObj));
            }
          }
        });
      }
      else{
        $scope.attachedFiles.push(angular.copy(sharedData.vdoGalleryObj));
      }
    };
    
    $scope.addLinkEmbed = function() {
        var attachLen = $scope.attachedFiles.length;
        var linkBlockExist = false;
        if(attachLen > 0){
          angular.forEach($scope.attachedFiles, function(val, key){
            if(val.type == 'linkEmbed'){
            	linkBlockExist = true;
            }
            if(key == (attachLen-1)){
              if(!linkBlockExist){
                $scope.attachedFiles.push(angular.copy(sharedData.linkEmbedObj));
              }
            }
          });
        }
        else{
          $scope.attachedFiles.push(angular.copy(sharedData.linkEmbedObj));
        }
      };

    if($scope.$parent.ngDialogData){
      if($scope.$parent.ngDialogData.editComment){
        //if we are editing the comment pass data in editComment parameter from parent scope
        $scope.editCommentData = $scope.$parent.ngDialogData.editComment;
        $scope.isEditingMode = true;

        $scope.commentData.text = $scope.editCommentData.text;
        if(typeof($scope.editCommentData.images) != 'undefined'){
          $scope.addImageGallery();
        }
        if(typeof($scope.editCommentData.documents) != 'undefined')
        {
          $scope.addDocGallery();
        }
        if(typeof($scope.editCommentData.videos) != 'undefined'){
          $scope.addVideoGallery();
        }
        if(typeof($scope.editCommentData.links) != 'undefined'){
          $scope.addLinkEmbed();
        }

        angular.forEach($scope.attachedFiles, function(val, key){
          switch($scope.attachedFiles[key].type){
            case 'imageGallery':
              angular.forEach($scope.editCommentData.images, function(fileval, i){
                var tempObj = angular.copy(fileval);
                tempObj.uploadStatus = "2";
                $scope.attachedFiles[key].files.push(tempObj);
              });
              break;
            case 'documentGallery':
              angular.forEach($scope.editCommentData.documents, function(fileval, i){
                var tempObj = angular.copy(fileval);
                tempObj.uploadStatus = "2";
                $scope.attachedFiles[key].files.push(tempObj);
              });
              break;
            case 'videoGallery':
              angular.forEach($scope.editCommentData.videos, function(fileval, i){
                $scope.attachedFiles[key].files.push(angular.copy(fileval));
              });
              break;
            case 'linkEmbed':
             $scope.attachedFiles[key].links =  $scope.editCommentData.links; 
             break;
          }
        });
        
      }
    }

    $scope.removeBlock = function(index, event){
      $scope.attachedFiles.splice(index, 1);
      event.stopPropagation();
    };

    $scope.getComputedId = function(){
      return(Date.now());
    };

    $scope.viewAllComments = function(cmntWraperId){
      //$("#"+cmntWraperId).toggleClass("hide_all_cmnt");
      /*
      if($("#"+cmntWraperId).hasClass("hide_all_cmnt"))
      {
        $("#"+cmntWraperId).removeClass("hide_all_cmnt");
      }
      */
      var modal = commentViewerModal.show({data : $scope.feed});
    };
    $scope.loadMoreComments = function(argument) {
      var parameter = {
        page: ++$scope.fo.page,
        itemsPerPage: $rootScope.uiConfig.cmntsPerPage
      };
      
      if($scope.feed.type == 'follower quickpost'){
    	  parameter.followerQuickpostUid = $scope.feed.uid;
      }else {
    	  parameter.content = $scope.feed.uid;
      }
      $scope.fo.commentStatus = 1;
      apiFeedData.getComments(parameter).then(function(data){
        $scope.showAllComments = (data && data.length < $rootScope.uiConfig.cmntsPerPage) ? false : true;
        $scope.feed.comments = $scope.feed.comments.concat(data);
        $scope.showLimit = $scope.feed.comments.length; //this will prevent rendering of feeds on feeds page
        $scope.fo.commentStatus = 2;
      }, function(err){
        $scope.fo.page--;
        $scope.fo.commentStatus = 3;
      });
    };

    $scope.closeAllComments = function(){
      $scope.showCommentSection = false;
    };

    $scope.showCommentOptions = function(divid){
      $("#"+divid+" .comment_options").removeClass("hide").addClass("show");
      
      //unbind click if already bind to avoid multiple binds
      $(".appbody").unbind("click");
      //bind clik to close the displayed block if clicked outside the block
      $(".appbody").on('click', function(event) {
          if (!$(event.target).closest('#'+divid).length) {
            // hide the comment options if clicked outside the comment wrapper div.
            $("#"+divid+" .comment_options").removeClass("show").addClass("hide");
            $(".appbody").unbind("click");
          }
      });
    };

    $scope.onCmntFileSelect = function($files, feedindex) {

          if(!$scope.commentData.attachment[feedindex]){
            //create an empty object
            $scope.commentData.attachment[feedindex] = {}; 
          }
          if(!("images" in $scope.commentData.attachment[feedindex])){
            //add image property
            $scope.commentData.attachment[feedindex].images = [];
            $scope.commentData.attachment[feedindex].document = [];
          }

          if ($files.length > 0) {

            apiFiles.uploadFiles($files).then(function(data){
              angular.forEach(data, function(val ,key) {
                  //format of val:
                  //   {
                  //    "id": 496,
                  //    "uid": "7b8aafc8-b697-41cf-804e-de11c4f19727",
                  //    "fileType": "application/msword",
                  //    "fileName": "doc1.doc",
                  //    "description": "doc1",
                  //    "url": "",
                  //    "thumbUrl": ""
                  //  }
                  if($filter('getFileType')(val.fileType) == "img"){
                    $scope.commentData.attachment[feedindex].images.push(val);
                  }
                  else{
                    $scope.commentData.attachment[feedindex].document.push(val);
                  }
              });
            }, function(err) {
              // body...
            }, function(prgs) {
              // body...
            });

          }//if files,length > 0
          
    };
    
    $scope.removeAllAttachment = function(event){
        $scope.attachedFiles = [];
        event.stopPropagation();
    };

    $scope.deleteImgAttachFile = function(feedindex, fileindex, evt){
      $scope.commentData.attachment[feedindex].images.splice(fileindex, 1);
      evt.stopPropagation();
    };
    $scope.deleteDocAttachFile = function(feedindex, fileindex, evt){
      $scope.commentData.attachment[feedindex].document.splice(fileindex, 1);
      evt.stopPropagation();
    };

    $scope.feedCommented = function(commented){
      var feeduid = commented.content;
      var commentuid = commented.uid;
      var editflag = false;
      if(($scope.feed.sourceId == feeduid) || ($scope.feed.uid == feeduid)){
        
        angular.forEach($scope.feed.comments, function(cmnt, key){
            if(cmnt.uid == commentuid){
              editflag = true;
              $scope.feed.comments[key] = commented;
            }
        });
        
        if(!editflag){
          $scope.feed.comments.unshift(commented);
          $scope.feed.commentCount++;
        }
      }//if*/
      //$state.reload();
    };

    $scope.closeEditCommentPopup = function(){
       editCommentModal.hide();
    };
    $scope.clearAllData = function(){
      //clear all files once comment posted successfully
      $scope.commentData.text = '';
      $scope.attachedFiles = [];
    };
	
     $scope.feedRefresh= function(contentUid){
       var postParam = {itemsPerPage: $rootScope.uiConfig.cmntsPerPage}; 
       if($scope.feed.type == 'follower quickpost'){
    	   postParam.followerQuickpostUid = contentUid;
       }else {
    	   postParam.content = contentUid;
       }
       apiFeedData.getComments(postParam).then(function(data){
	   $scope.feed.comments =data;
	   $scope.feed.commentCount =data.length;
	   }, function(err){
	 });
	 
	$rootScope.$broadcast('home.feeds.reorder', {index: $scope.feedindex,feed:$scope.feed});
    };

    $scope.addComment = function(feedindex, feedUid){
      if(!$scope.isPublishing){
        var errorData = {
          flag: false,
          message: ''
        };
        var imageUidList = [];
        var documentUidList = [];
        var videoArr = [];
        var linkArr = [];

        if(!$scope.commentData.attachment[feedindex]){
          //create an empty object
          $scope.commentData.attachment[feedindex] = {}; 
        }
        var comment_text = $scope.commentData.text;

        var form_data = {
          text: comment_text,
          language: $rootScope.currentLanguage.code
        };
        
        if($scope.feed.type == 'follower quickpost'){
        	form_data.followerQuickpostUid = feedUid;
        }else{
        	form_data.content = feedUid;
        }
        if($scope.editCommentData != ''){
          if(typeof($scope.editCommentData.uid) != 'undefined'){
            form_data = {
              commentUid: $scope.editCommentData.uid,
              text: comment_text,
              language: "fr"
            }
          }
        }
        //add attachment files
        if($scope.attachedFiles.length > 0){
          angular.forEach($scope.attachedFiles, function(val, key){
            switch(val.type) {
              case 'imageGallery':
                  var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'image');
                  imageUidList = tempObj.data;
                  errorData = tempObj.error;
                  break;
              case 'documentGallery':
                    var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'document');
                    documentUidList = tempObj.data;
                    errorData = tempObj.error;
                  break;
              case 'videoGallery':
                  var tempObj = sharedData.getMediaGalleryDataToPost(val.files, 'embeddedVideo');
                  videoArr = tempObj.data;
                  errorData = tempObj.error;
                  break;
              case 'linkEmbed':
                  var tempObj = sharedData.getMediaGalleryDataToPost(val, 'linkEmbed');
                  linkArr = tempObj.data;
                  errorData = tempObj.error;
                  break;
            }
          });
        }
        if(imageUidList.length > 0){
          form_data.images = imageUidList;
        }
        if(documentUidList.length > 0){
          form_data.documents = documentUidList;
        }
        if(videoArr.length > 0){
          form_data.videos = videoArr;
        }
        if(linkArr.length > 0){
        	form_data.links = linkArr;
        }

        if($filter('isBlankString')(comment_text)){
          errorData.flag = true;
          errorData.message = "Enter_comment_text";
        }

        if(!errorData.flag){
        	if($scope.editComment == true){
        		var preparetexts= $scope.commentData.text;
        		if(($scope.textDetail.length == 0)){
        			if($scope.cmnt.textDetail.length > 0){
        				for(var i = 0; i<$scope.cmnt.textDetail.length; i++){
        					if(preparetexts.contains($scope.cmnt.textDetail[i].v) == true){
        						$scope.textDetail.push($scope.cmnt.textDetail[i]);
        					}
        				}
        			}
            		
        		}else{
        			if($scope.cmnt.textDetail.length > 0){
        				for(var i = 0; i<$scope.cmnt.textDetail.length; i++){
        					if(preparetexts.contains($scope.cmnt.textDetail[i].v) == true){
        						$scope.textDetail.push($scope.cmnt.textDetail[i]);
        					}
        				}
        			}
        		}
      }
	  if($scope.textDetail.length>0){		 
	    var details= JSON.stringify($scope.textDetail).replace('[','').replace(']','').replace(/{/g,'@[').replace(/}/g,']').replace(/"/g,'').replace(/:/g,'=');
	    form_data.textDetail= details;
	    $scope.textDetail.splice(0,$scope.textDetail.length);

	  }

          $scope.isPublishing = true;
          apiFeedData.postComment(form_data).then(function(data){
            //suceess
            $scope.clearAllData();
            $scope.isPublishing = false;
            $scope.feedCommented(data);
            if($scope.isEditingMode){
              editCommentModal.hide();
            }
			
		$scope.feedRefresh(feedUid);
		$scope.feed.lastAction = 'comment';
		$rootScope.$broadcast('feed.changeActSentence');
          }, function(err){
            //error
            $scope.isPublishing = false;
            notifyModal.showTranslated("something_went_wrong", "error");
          });
        }
        else{
          notifyModal.showTranslated(errorData.message, 'error');
        }
      }//in !isPublishing
    };//add comment
    $scope.addLike =function(contentUid){
        var optn = null;
        if($scope.feed.userLiked){
          optn = "DELETE";
        }
        else{
          optn = "POST";
         
        }
        
        var type = null;
        if($scope.feed.type == 'follower quickpost'){
        	type = $scope.feed.type;
        }else{
        	type = "content";
        }
        
      
        apiFeedData.like(contentUid, optn,type).then(function(data){
            if(optn == "POST"){
              $scope.feed.userLiked = true;
              $scope.feed.likeCount++;
              $scope.feed.likeUid = data.data.uid;
            }
            else if(optn == "DELETE"){
              $scope.feed.userLiked = false;
              $scope.feed.likeCount--;
            }
          }, function(err){
            if(err.message == "LIKED_ALREADY"){
              notifyModal.showTranslated("Content_Liked_Already", "error", null);
            }
            else{
              notifyModal.showTranslated("something_went_wrong", "error", null);
            }
          });
    };

    $scope.showMemberViewer = function(){
    	var type = null;
    	if($scope.feed.type == 'follower quickpost'){
        	type = "followerQuickpostLikes";
        }else{
        	type = "feedLikes";
        }

    	var modal = memberViewerModal.show({"uid": $scope.feed.uid, "for": "feed", type: type});
    };

    //event listeneres
    var commentDeleted = $scope.$on('comment.deleted', function(event, data) {
//      var feeduid = data.feeduid;
//      var commentuid = data.commentuid;
//      if($scope.feed.uid == feeduid){
//        angular.forEach($scope.feed.comments, function(cmnt, key){
//          if(cmnt.uid == commentuid){
//            $scope.feed.comments.splice(key, 1);
//            $scope.feed.commentCount--;
//          }
//        });
//      }//if
      
      $rootScope.$broadcast('home.feeds.comment.deleted', {cmtuid:data.commentuid,feed:$scope.feed});
    });
    $scope.$on("$destroy", function(){
      //clear all listeners
      commentDeleted();
    });
    
    $scope.showPrivateMessagePopup = function(feeddata){
    	privateMessageModal.show(null,feeddata);
    }
    
  })
  .controller('CommentCtrl', function ($scope, $rootScope, apiFeedData, editCommentModal, notifyModal, confirmModal, memberViewerModal) {
    this.$onInit = function(){
      $scope.cmnt = this.comment;
    }
	  $scope.editComment = false;
	  $scope.likeComment = function() {        
    	 var optn = null;
         if($scope.cmnt.userLiked){
           optn = "DELETE";
         }
         else{
           optn = "POST";           
         }
                  
      apiFeedData.like($scope.cmnt.uid, optn,"comment").then(function(data){
          if(optn == "POST"){
            $scope.cmnt.userLiked = true;
            $scope.cmnt.likeCount++;
            $scope.cmnt.likeUid = data.data.uid;
          }
          else if(optn == "DELETE"){
            $scope.cmnt.userLiked = false;
            $scope.cmnt.likeCount--;
          }
        }, function(err){
          if(err.message == "LIKED_ALREADY"){
            notifyModal.showTranslated("Content_Liked_Already", "error", null);
          }
          else{
            notifyModal.showTranslated("something_went_wrong", "error", null);
          }
        });
    };

    $scope.deleteComment = function(feed, cmntuid){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm_comment"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            apiFeedData.deleteComment(feed.uid, cmntuid).then(function(data){
              //comment deleted
            	$rootScope.$broadcast('home.feeds.comment.deleted', {cmtuid:data.commentuid,feed:feed});
            }, function(err){
              notifyModal.showTranslated("something_went_wrong", "error", null);
            });
          }
      });
    };

    $scope.openEditCommentPopup = function(feed){
    	$scope.feed = feed;
    	$scope.editComment = true;
        editCommentModal.show($scope, {editComment: $scope.cmnt});
    };

    $scope.showMemberViewer = function(){
      var modal = memberViewerModal.show({"uid": $scope.cmnt.uid, "for": "feed", type: "commentLikes"});
    };
    
    $scope.canEdit = function(feed){
        
		if ($rootScope.userData.role =='GlobalCommunityManager'){
			return true;
		}
		
		if($rootScope.userData.uid == $scope.cmnt.author.uid){
			return true;
		}
	
        if(typeof($rootScope.userData.communityRoles) != 'undefined'){
            if($rootScope.userData.communityRoles.length>0){
            	for (var i =0;  i < $rootScope.userData.communityRoles.length; i++ ){
            		var community = $rootScope.userData.communityRoles[i];
            		if (feed.community.uid == community.communityUid && community.role  == 'CommunityManager'){
            			return true;
            		}
            	}            	
            }
        }
       return false;
    };
  });