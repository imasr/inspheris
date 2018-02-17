'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
  .controller('AddImageGalleryCtrl', function ($scope, $rootScope, $http, Config, sharedData, CreateFileBrowseModal,
												apiMediaUpload, apiGoogleDrive, videoUrlModal,
											    canalUrlModal, LinkEmbedModal,
												browseImageModal, browseVideoModal,
												browseDocumentModal,
												fileDetailEditorModal,
				
				confirmModal,uiModals,$filter,createYammerModal) {
					
	 $scope.attachment = [] ;
    this.$onInit = function(){
      $scope.attachment = this.attachment;
	  
      if(this.mediaType == 'videoGallery' || this.mediaType =='VideoGallery' ){
        $scope.type ='videos';
      }else if(this.mediaType == 'documentGallery'){
        $scope.type ='documents';
      }else if(this.mediaType == 'imageGallery'||this.mediaType =='ImageGallery'){
        $scope.type ='images';
      }else{
        $scope.type = this.mediaType;
      }
      $scope.uploader = new apiMediaUpload();
      $scope.acceptableFiles = sharedData.supportedDocs;
      $scope.sortableAttachedImges = {
        update: function(e, ui) {
          //do nothing
        },
        stop: function(e, ui) {
        },
        cancel: ".unsortable",
        "ui-floating": "auto"
      };
      if($scope.type == "linkEmbed" && typeof($scope.attachment.links) == 'undefined'){
    	  $scope.attachment.links = [];
      }
	  else if ($scope.type == "yammerEmbed" && typeof($scope.attachment.yammerdata) == 'undefined') 
	  {
		  
		  $scope.attachment.yammerdata = [] ;
		  
	  }
	  else if($scope.type == "documents"){
    	  if(typeof($scope.attachment.files) == 'undefined' && $scope.attachment.documents != undefined && $scope.attachment.documents.length > 0){
    		  $scope.attachment.files = [];
    		  $scope.attachment.documents.forEach(function(val, key){
    			  val.path = val.webViewLink;
    			  val.uploadStatus = 2;
    			  $scope.attachment.files.push(val);
    		  });
    	  }
      }else if($scope.type == "images"){
    	  if(typeof($scope.attachment.files) == 'undefined' && $scope.attachment.images != undefined && $scope.attachment.images.length > 0){
    		  $scope.attachment.files = [];
    		  $scope.attachment.images.forEach(function(val, key){
    			  val.path = val.webViewLink;
    			  val.uploadStatus = 2;
    			  $scope.attachment.files.push(val);
    		  });
    	  }
      }else if($scope.type == "videos"){
    	  if(typeof($scope.attachment.files) == 'undefined' && $scope.attachment.videos != undefined && $scope.attachment.videos.length > 0){
    		  $scope.attachment.files = [];
    		  $scope.attachment.videos.forEach(function(val, key){
    			  $scope.attachment.files.push(val);
    		  });
    		  console.log(JSON.stringify($scope.attachment.videos));
    	  }
      }

    }

    /*--------------for image gallery----------------------*/
    $scope.imgBlockAddImgs = function($files, $event){

      if($files.length > 0)
      {
          var beginUploadIndex = $scope.attachment.files.length;

          $files.forEach(function(val, key){
			
            $scope.attachment.files.push({
              fileName: val.name,
              uploadStatus: '0',
              file: val,
              cancel: null
            });
            //status codes
            //0: ready to upload
            //1: uploading
            //2: uploaded
            //3: eroor in uploading
            if(key == ($files.length-1)){
              var attachedImgsLen = $scope.attachment.files.length;
              if(attachedImgsLen > 0){
                //files exist in gallery already
                for(var i = 0; i<attachedImgsLen; i++){
                  var uploadStatus = $scope.attachment.files[i].uploadStatus;
                  if(uploadStatus == '1'){
                    //do nothing already upload process is going on
                      break;
                  }//if
                  else{
                    if(i == (attachedImgsLen-1)){
                      $scope.uploadImageOneByOne(beginUploadIndex);
                      break;
                    }
                  }
                }//for
              }
            }
          });

      }//if len>0
      //clear the input type file
      /*
      angular.forEach(
      angular.element("input[type='file']"),
      function(inputElem) {
        angular.element(inputElem).val(null);
      });
      */
      sharedData.clearSelectInput();//clears the slect input to reselect the files
    };
	
	
    $scope.cancelImageBlock = function(request){
      request.cancel();
    };
    $scope.uploadImageOneByOne = function(imgIndex){
      $scope.attachment.files[imgIndex].uploadStatus = '1';
      $scope.attachment.files[imgIndex].fileName = "uploading...";
      var uploadFile = [$scope.attachment.files[imgIndex].file];
      $scope.uploader = new apiMediaUpload();
      $scope.uploader.uploadImages(uploadFile, null).then(function(data){
            if(data.status == 'success'){
              var len = $scope.attachment.files.length;
              for (var i = 0; i < len; i++) {
                angular.forEach(data.data, function(val, key){
                  if($scope.attachment.files[i].uploadStatus == "1"){
                    //$scope.attachment.files.push(val);
                    /*
                    $scope.attachment.files[i]= {
                      uploadStatus: '2',
                      uid: val.uid,
                      fileType: val.fileType,
                      fileName: val.fileName,
                      description: val.description,
                      url: val.url,
                      thumbUrl: val.thumbUrl,
                      mediumUrl: val.mediumUrl,
                      largeUrl: val.largeUrl,
                      thumbGalleryUrl: val.thumbGalleryUrl,
                      uploadedDate: val.uploadedDate
                    };
                    */
                    if(typeof(val.message) != 'undefined' && val.message != null){
                    	var message= $filter('translate')(val.message) + val.fileName;
                		var title = $filter('translate')('Message');
                		uiModals.alertModal(null,title, message);
                    }console.log("IMAGE : " + JSON.stringify(val));
                    $scope.attachment.files[i] = angular.copy(val);
                    $scope.attachment.files[i].isInternal = true;
                    $scope.attachment.files[i].uploadStatus = '2';
                  }//if found uploading file
                });//for each
              }//for
              for (var i = 0; i < len; i++) {
                var uploadStatus = $scope.attachment.files[i].uploadStatus;
                if (uploadStatus == '0') {
                  $scope.uploadImageOneByOne(i);
                  break;
                }
              }//for
            }// if successfully uploaded
            else if(data.status == 'cancelled'){
              if(data.option == 'cancelAll'){
                $scope.attachment.files = [];
              }
              else{
                //follow normal process
                var len = $scope.attachment.files.length;
                for (var i = 0; i < len; i++) {
                  var uploadStatus = $scope.attachment.files[i].uploadStatus;
                  if(uploadStatus == '1'){
                    //cancel current uploading file and remove it
                    $scope.attachment.files[i].fileName = "Attachment cancelled";
                    $scope.attachment.files[i].uploadStatus= '3';
                    $scope.attachment.files.splice(i, 1);
                    break;
                  }
                }
                //again calculate the length of array
                //because we have removed an element from it above
                len = $scope.attachment.files.length;
                for (var i = 0; i < len; i++) {
                  if ($scope.attachment.files[i].uploadStatus == '0') {
                    $scope.uploadImageOneByOne(i);
                    break;
                  }
                }//for
              }
            }//if cancelled by user
          }, function(err){
            var len = $scope.attachment.files.length;
            for (var i = 0; i < len; i++) {
              var uploadStatus = $scope.attachment.files[i].uploadStatus;
              if(uploadStatus == '1' && err.status == "error"){
                $scope.attachment.files[i].fileName = "Attachment failed";
                $scope.attachment.files[i].uploadStatus= '3';
              }
            }
            //queue up next file to upload
            var len = $scope.attachment.files.length;
            for (var i = 0; i < len; i++) {
              var uploadStatus = $scope.attachment.files[i].uploadStatus;
              if (uploadStatus == '0') {
                $scope.uploadImageOneByOne(i);
                break;
              }
            }
          }, function(data){
          });
        /*setTimeout(function(){
          //uploader.cancel();
          var tempUploader = $scope.attachment.files[imgIndex].cancel;
          tempUploader.cancel();
        }, 2000);*/
    };
    $scope.imgBlockRemoveImgs = function(imgIndex, event){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            if($scope.attachment.files[imgIndex].uploadStatus == '1'){
              //if uploading then first cancel upload then remove the element from array
              //the cancelled element is removed in error handler of upload function
              //uploader.cancel({blockindex: imgBlockIndex, fileindex: imgIndex});
              $scope.uploader.cancel({fileindex: imgIndex});
            }
            else{
              //file is not uploading or it's already uploaded
              $scope.attachment.files.splice(imgIndex, 1);
            }
          } //ok
      });//confirm modal then

      event.stopPropagation();
    };


    $scope.showBrowseImagePopup = function(blockIndex){
      //$scope.selectedBlockIndex = blockIndex;
      //$scope.selectedRemoteImgs = $scope.attachment.files;
      //browseImageModal.show($scope, $scope.attachment.files);

      var modal = browseImageModal.show($scope, $scope.attachment.files);

      modal.closePromise.then(function (data) {
        if(data.value.flag == 'ok'){
          var tempFilesUids = [];
          angular.forEach($scope.attachment.files, function(val, key){
            if(val.uid){
              tempFilesUids.push(val.uid);
            }
          });
          angular.forEach(data.value.data, function(val, key){
            if(val.uid){
              if(tempFilesUids.indexOf(val.uid) <= -1){
                var obj = angular.copy(val);
                obj.uploadStatus = 2;
                $scope.attachment.files.push(obj);
              }
            }
          });
        }
      });
    };

//    $scope.openFileBrowsePopup = function(type){
//  	 var modal = CreateFileBrowseModal.show({action: 'create', type: type, mode: 'info', data: null});
//        modal.closePromise.then(function (data) {
//      	 console.log("DATA : " + JSON.stringify(data));
//             if(data.value.flag == 'ok'){
//              var tempFilesUids = [];
//              angular.forEach($scope.attachment.files, function(val, key){
//                if(val.uid){
//                  tempFilesUids.push(val.uid);
//                }
//              });
//              angular.forEach(data.value.data, function(val, key){
//               if(val.uid){
//                  if(tempFilesUids.indexOf(val.uid) <= -1){
//                    var obj = angular.copy(val);
//                    obj.uploadStatus = 2;
//                    $scope.attachment.files.push(obj);
//                 }
//               }
//              });
//            }
//         });
//    };
     var tempData={};
  $scope.openFileBrowsePopup = function(type){
      console.log(">>>>>>>>>>>>>>>>>>>>>>popup")
    //$scope.selectedBlockIndex = blockIndex;
    //$scope.selectedRemoteImgs = $scope.attachment.files;
    //browseImageModal.show($scope, $scope.attachment.files);
var modal = CreateFileBrowseModal.show({action: 'create', type:type, mode: 'info', data:tempData });
//      var modal = browseImageModal.show($scope, $scope.attachment.files);

    modal.closePromise.then(function (data) {
        tempData = data;
      if(data.value.flag == 'ok'){
        var tempFilesUids = [];
        angular.forEach($scope.attachment.files, function(val, key){
          if(val.fileUid){
            tempFilesUids.push(val.fileUid);
          }
        });
        angular.forEach(data.value.data, function(val, key){

           if(val.fileType=='folder' && val.selected){

               angular.forEach(val.files, function(val1, key1){
                   if(val1.fileUid){
                	   if(tempFilesUids.indexOf(val1.fileUid) <= -1){
                		   var obj1 = {
                				   uid : val1.fileUid,
                				   isInternal : !val1.isGdrive,
                				   path : val1.url,
                				   url : val1.url,
                				   fileName : val1.fileName,
                				   fileType : val1.fileType,
                				   thumbGalleryUrl : val1.thumbGalleryUrl,
                				   uploadedDate : val1.fileUploadedDate,
                				   modifiedDate : val1.fileModifiedDate
                		   };
                		   obj1.uploadStatus = 2;
                		   $scope.attachment.files.push(obj1);
                	   }
                   }
               })
           }
           else{
               if(val.fileUid){

            if(tempFilesUids.indexOf(val.fileUid) <= -1  && val.selected){
            	var obj = {
					   uid : val.fileUid,
					   isInternal : !val.isGdrive,
					   path : val.url,
					   url : val.url,
					   fileName : val.fileName,
					   fileType : val.fileType,
					   thumbGalleryUrl : val.thumbGalleryUrl,
					   uploadedDate : val.fileUploadedDate,
    				   modifiedDate : val.fileModifiedDate
			   };
              obj.uploadStatus = 2;
              $scope.attachment.files.push(obj);
            }
          }

//            	   if(tempFilesUids.indexOf(val.fileUid) <= -1){
//            		   var obj = {
//            				   uid : val.fileUid,
//            				   isInternal : !val.isGdrive,
//            				   path : val.url,
//            				   url : val.url,
//            				   fileName : val.fileName,
//            				   fileType : val.fileType,
//            				   thumbGalleryUrl : val.thumbGalleryUrl,
//            				   uploadedDate : val.fileUploadedDate
//            		   };
//            		   obj.uploadStatus = 2;
//            		   $scope.attachment.files.push(obj);
//            	   }
//               }

           }
//          for(var i=0;i<data.value.data.length;i++){
//                 if(data.value.data[i].fileType=='folder'){
//                       for(var j=0;j<data.value.data[i].files.length;j++){
//                           console.log("1");
//                       }
//
//                console.log(">>>>>>>>>>>>>>>>files are",data.value.data[i].files);
//           }
//        }

//              console.log(data.value.data, "valuesssaas")
//            if(val.fileUid){
//              if(tempFilesUids.indexOf(val.fileUid) <= -1){
//                var obj = angular.copy(val);
//                obj.uploadStatus = 2;
//                $scope.attachment.files.push(obj);
//              }
//            }
        });
        console.log($scope.attachment)

      }
    });
  };

    $scope.showBrowseVideoPopup = function(blockIndex){
      var modal = browseVideoModal.show($scope, $scope.attachment.files);
        modal.closePromise.then(function (data) {
            var videoObj = {
            	videoUrl : data.value.data.data.videoUrl,
                thumbUrl : data.value.data.data.thumbUrl,
                internalVideo : data.value.data.data.internalVideo,
                videoName : data.value.data.data.videoName,
                videoFormat : data.value.data.data.videoFormat,
                isDefaultThumb : data.value.data.data.isDefaultThumb
            };
            if(data.value.flag == 'ok'){
              if(data.value.data != ''){
                $scope.attachment.files.push(videoObj);
              }
            }
        });
    };

    $scope.showImageUrlPopup = function(blockIndex){
      apiGoogleDrive.onApiLoad();
    };
    /*-------------image gallery end------------------*/

    /*--------------for document gallery----------------------*/
    $scope.docBlockAdddocs = function($files, $event){
      if($files.length > 0){
        var docIndex = $scope.attachment.files.length;
        $files.forEach(function(val, key){
            $scope.attachment.files.push({fileName: val.name, uploadStatus: '0', file: val, cancel: null});
            //status codes
            //0: ready to upload
            //1: uploading
            //2: uploaded
            //3: eroor in uploading
            if(key == ($files.length-1)){
              var attachedLen = $scope.attachment.files.length;
              if(attachedLen > 0){
                //files exist in gallery already
                for(var i = 0; i<attachedLen; i++){
                  var uploadStatus = $scope.attachment.files[i].uploadStatus;
                  if(uploadStatus == '1'){
                    //do nothing already upload process is going on
                      break;
                  }//if
                  else{
                    if(i == (attachedLen-1)){
                      $scope.uploadDocumentsOneByOne(docIndex);
                      break;
                    }
                  }
                }//for
              }
            }
          });
      }//length > 0
      sharedData.clearSelectInput();//clears the slect input to reselect the files
    };
    $scope.uploadDocumentsOneByOne = function(imgIndex){
      $scope.attachment.files[imgIndex].uploadStatus = '1';
      $scope.attachment.files[imgIndex].fileName = "uploading...";
      var uploadFile = [$scope.attachment.files[imgIndex].file];
      //var uploader = new apiMediaUpload();
      $scope.uploader = new apiMediaUpload();
      $scope.uploader.uploadFiles(uploadFile, null).then(function(data){
            if(data.status == 'success'){
              var len = $scope.attachment.files.length;
              for (var i = 0; i < len; i++) {
                angular.forEach(data.data, function(val, key){
                  if($scope.attachment.files[i].uploadStatus == "1"){
                    //$scope.attachment.files.push(val);
                    /*
                    $scope.attachment.files[i]= {
                      uploadStatus: '2',
                      uid: val.uid,
                      fileType: val.fileType,
                      fileName: val.fileName,
                      description: val.description,
                      url: val.url,
                      uploadedDate: val.uploadedDate
                    };
                    */
                    if(typeof(val.message) != 'undefined' && val.message != null){
                	   var message= $filter('translate')(val.message) + val.fileName;
                	   var title = $filter('translate')('Message');
                	   uiModals.alertModal(null,title, message);
                    }
                    var dobj = angular.copy(val);
                    dobj.uploadStatus = '2';
                    dobj.isInternal = true;
                    $scope.attachment.files[i] = dobj;
                  }//if found uploading file
                });//for each
              }//for
              for (var i = 0; i < len; i++) {
                var uploadStatus = $scope.attachment.files[i].uploadStatus;
                if (uploadStatus == '0') {
                  $scope.uploadDocumentsOneByOne(i);
                  break;
                }
              }//for
            }//if uploade success
            else if(data.status == 'cancelled'){
              if(data.option == 'cancelAll'){
                $scope.attachment.files = [];
              }
              else{
                //follow normal proces of uploading files
                var len = $scope.attachment.files.length;
                for (var i = 0; i < len; i++) {
                  var uploadStatus = $scope.attachment.files[i].uploadStatus;
                  if(uploadStatus == '1'){
                    //cancel current uploading file and remove it
                    $scope.attachment.files[i].fileName = "Attachment cancelled";
                    $scope.attachment.files[i].uploadStatus= '3';
                    $scope.attachment.files.splice(i, 1);
                    break;
                  }
                }
                //again calculate the length of array
                //because we have removed an element from it above
                len = $scope.attachment.files.length;
                for (var i = 0; i < len; i++) {
                  if ($scope.attachment.files[i].uploadStatus == '0') {
                    $scope.uploadDocumentsOneByOne(i);
                    break;
                  }
                }//for
              }
            }//if cancelled uploading
          }, function(err){
              var len = $scope.attachment.files.length;
              for (var i = 0; i < len; i++) {
                var uploadStatus = $scope.attachment.files[i].uploadStatus;
                if(uploadStatus == '1' && err.status == "error"){
                  $scope.attachment.files[i].fileName = "Attachment failed";
                  $scope.attachment.files[i].uploadStatus= '3';
                }
              }
              //queue up next file to upload
              var len = $scope.attachment.files.length;
              for (var i = 0; i < len; i++) {
                var uploadStatus = $scope.attachment.files[i].uploadStatus;
                if (uploadStatus == '0') {
                  $scope.uploadDocumentsOneByOne(i);
                  break;
                }
              }

          }, function(data){
          });
    };
    $scope.docBlockRemoveDocs = function(docIndex, event){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
        if(data.value == 'ok'){
          //$scope.attachment.files.splice(docIndex, 1);
          if($scope.attachment.files[docIndex].uploadStatus == '1'){
            //if uploading then first cancel upload then remove the element from array
            //the cancelled element is removed in error handler of upload function
            //uploader.cancel({fileindex: docIndex});
            $scope.uploader.cancel({fileindex: docIndex});
          }
          else{
            //file is not uploading or it's already uploaded
            $scope.attachment.files.splice(docIndex, 1);
          }
        }//if ok
        event.stopPropagation();
      });//modal then


      event.stopPropagation();
    };



	$scope.developerKey = $rootScope.configGoogleDriveFile.key ;
	$scope.clientId = $rootScope.configGoogleDriveFile.clientId;
	// Scope to use to access user's photos.
    $scope.scope = [];
    $scope.pickerApiLoaded = false;
    $scope.oauthToken;
	$scope.docType ;
	$scope.scopedrive = ['https://www.googleapis.com/auth/drive','profile'];

    /* Function */
	    function onAuthApiLoad() {
            window.gapi.auth.authorize(
                {
                    'client_id': $scope.clientId,
                    'scope': $scope.scope,
                    'immediate': false
                },
                handleAuthResult);
        }


        function onPickerApiLoad() {
            $scope.pickerApiLoaded = true;
            createPicker();
        }

        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                $scope.oauthToken = authResult.access_token;
                //createPicker();
				gapi.load('picker', { 'callback': onPickerApiLoad });
            }
			else
			{
				console.log("Usernot Authicated...")
			}
        }

        // Create and render a Picker object for picking user Photos.
        function createPicker() {
            if ($scope.pickerApiLoaded && $scope.oauthToken) {
				var picker;
				if ($scope.docType === 'doc')
					{
				     picker = new google.picker.PickerBuilder().
						addView(google.picker.ViewId.DOCUMENTS).
						addView(google.picker.ViewId.PRESENTATIONS).
						addView(google.picker.ViewId.SPREADSHEETS).
						addView(google.picker.ViewId.FORMS).
						setOAuthToken($scope.oauthToken).
						setDeveloperKey($scope.developerKey).
						setCallback(pickerCallback).
						build();


					}
				else if ($scope.docType === 'photo')
				{
					 picker = new google.picker.PickerBuilder().
						addView(google.picker.ViewId.DOCS_IMAGES).
						setOAuthToken($scope.oauthToken).
						setDeveloperKey($scope.developerKey).
						setCallback(pickerCallback).
						build();
				}
				  picker.setVisible(true) ;
				   var elements= document.getElementsByClassName('picker-dialog');
					for(var i=0;i<elements.length;i++)
					{
						elements[i].style.zIndex = "10000";
					}

            }
        }


		function getFiles(fileID,callback){

			var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://www.googleapis.com/drive/v2/files/' + fileID);
				xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.oauthToken);
				xhr.onload = function() {
				  callback(xhr.responseText);
				};
				xhr.onerror = function() {
				 callback(null);
				};
				xhr.send();
		}

		function checkFile(uid,callback){
			if ($scope.attachment.files.length > 0){
				var filtered = $scope.attachment.files.filter(function (file) {
						return file.uid === uid ;
				});

				if (filtered != null && filtered != ''){
					callback(true);
				}else{
					callback(false);
				}
			}else{
				callback(false);
			}
		}

        function pickerCallback(data) {
			
            var url = 'nothing';
             if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                var doc = data[google.picker.Response.DOCUMENTS][0];
                url = doc[google.picker.Document.URL];
				getFiles(doc.id,function(resp){
					var resp = JSON.parse(resp);
					if (resp != null)
					{
						    var thumburl ;
							var filetype ;


							if ($scope.docType === 'doc') {
								var fType ;

								var mimetype = String(doc.mimeType);

								fType = mimetype.substring(mimetype.lastIndexOf(".") + 1);

								if(fType === 'document')
								{
									thumburl = '/images/media/document.png';
									filetype = 'Word';
									doc.name = doc.name + ".doc";
								}
								else if(fType === 'spreadsheet')
								{
									thumburl = '/images/media/spreadsheet.png';
									filetype = 'Excel';
									doc.name = doc.name + ".xlsx";
								}
								else
								{

									filetype = doc.mimeType ;
									if (filetype === 'text/plain')
										doc.name = doc.name + ".doc";
								}

							}
							else
							{
								thumburl = resp.thumbnailLink;
								filetype = doc.mimeType;
							}

							var obj = {
								'uid': doc.id ,
								'uploadStatus' : 0 ,
								'fileName' : doc.name,
								'fileType' : doc.mimeType,
								'path' : doc.url,
								'thumbUrl' : resp.thumbnailLink,
								'thumbGalleryUrl':thumburl,
								'createdDate' : resp.createdDate,
								'modifiedDate' : resp.modifiedDate,
								'isInternal' : false,
								'file' : {
									'name' : doc.name,
									'size':doc.sizeBytes,
									'type':filetype,
									'lastModified':doc.lastEditedUtc,
									'lastModifiedDate':''
								}
							}

							checkFile(obj.uid,function(result){
								if (!result){
									$scope.attachment.files.push(obj);
									var fileLength = $scope.attachment.files.length ;
								    $scope.attachment.files[fileLength - 1].uploadStatus = '1';
								    $scope.attachment.files[fileLength - 1].fileName = "uploading...";
									var uploadFile = [$scope.attachment.files[fileLength - 1].file];
								    $scope.uploader = new apiMediaUpload();
								    $scope.uploader.uploadFiles(uploadFile, null).then(function(data){
										if(data.status == 'success'){
											
											$scope.attachment.files[fileLength - 1].uploadStatus = '2';
											$scope.attachment.files[fileLength - 1].fileName = doc.name;

										}
					                });
									//if(obj.isInternal){
										//var docIndex = $scope.attachment.files.length;
										//$scope.uploadDocumentsOneByOne(docIndex - 1);
									//}
								}
							})

					}
				});
             }
			

        }
	
	$rootScope.$on("onAddYammerData",function(event,data){
	    
	    var thumburl = '/images/media/yammer.png';
		var filetype = 'yammer';
		var obj = {
			    'uid': data.id,
				'uploadStatus' : 0 ,
				'fileName' : data.body.parsed,
				'fileType' : filetype,
				'path' : '',
				'thumbUrl' : thumburl,
				'thumbGalleryUrl':thumburl,
				'attachmentfile' : data.attachment,
				'createdDate' : data.created_at,
				'modifiedDate' : data.created_at,
				'isInternal' : false
			}
			$scope.attachment.yammerdata.push(obj);
		    var fileLength = $scope.attachment.yammerdata.length ;
		    $scope.attachment.yammerdata[fileLength - 1].uploadStatus = '1';
			$scope.attachment.yammerdata[fileLength - 1].fileName = "uploading...";
			$scope.attachment.yammerdata[fileLength - 1].uploadStatus = '2';
			$scope.attachment.yammerdata[fileLength - 1].fileName = data.body.parsed;
		
			
	});
	
	
	$scope.openGoogleDriveBrowse = function(docType)
	{
		$scope.docType = docType;
		$scope.scope = [] ;
		$scope.scope.push('https://www.googleapis.com/auth/drive.readonly');

		gapi.load('auth', { 'callback': onAuthApiLoad });
		//gapi.load('picker', { 'callback': onPickerApiLoad });
	}


	/* Yammer */
   
	$scope.authResponse = false;
	$scope.getLogin = function()
	{
		if (!$scope.authResponse)
		{
			yam.platform.login(function (response) { //prompt user to login and authorize your app, as necessary
					if (response.authResponse) {
					   $scope.authResponse  = response.authResponse;
					}
					
		    });
		}
		else
		{
			$scope.getYammerData();
		}
	}
	$scope.getYammerData = function()
	{
						yam.platform.request({
                            url: "messages.json",     //this is one of many REST endpoints that are available
                            method: "GET",
                            data: {    //use the data object literal to specify parameters, as documented in the REST API section of this developer site

                            },
                            success: function (response) { //print message response information to the console
                                $scope.$apply(function () {
									$scope.yammerData = response.messages;
									$rootScope.openCreateFeedPopup({type: 'yammer' , yammardata:response.messages});
                                })
                            },
                            error: function (user) {
                                alert("There was an error with the request.");
                            }
                        });
	}
	$scope.showYammerLogin = function(index)
	{
		$scope.getLogin();
		//if (!$scope)
	  /* yam.getLoginStatus(
			  function(response) {
			    $scope.authResponse  = response.authResponse;
				if (response.authResponse) {
					
			     });
				}
				else {
				  yam.platform.login(function (response) { //prompt user to login and authorize your app, as necessary
					if (response.authResponse) {
					  $scope.authResponse  = response.authResponse;
					}
				  });
				}
			  }
			);
			*/
	}
	
	
	// End of Yammer 
    //$scope.selectedRemoteDocs = [];
    $scope.showBrowseDocumentPopup = function(blockIndex){
      /*angular.forEach($scope.caBlocksArray[blockIndex].attachedDocs, function(val , key){
        $scope.selectedRemoteDocs.push(val.uid);
      });*/
      $scope.selectedBlockIndex = blockIndex;
      //$scope.selectedRemoteDocs = $scope.attachment.files;
      //browseDocumentModal.show($scope, $scope.attachment.files);
      var modal = browseDocumentModal.show($scope, $scope.attachment.files);

      modal.closePromise.then(function (data) {

          if(data.value.flag == 'ok'){
            var tempFilesUids = [];
            angular.forEach($scope.attachment.files, function(val, key){
              if(val.uid){
                tempFilesUids.push(val.uid);
              }
            });
            angular.forEach(data.value.data, function(val, key){
              if(val.uid){
              if(tempFilesUids.indexOf(val.uid) <= -1){
                var dobj = angular.copy(val);
                dobj.uploadStatus = '2';
                $scope.attachment.files.push(dobj);
				//console.log($scope.attachment.files);
               }
              }
            });
        }//ok
      });
    };
    /*--------------document gallery end----------------------*/

    /*--------------for video gallery----------------------*/
    $scope.showPopupVideoUrl = function(vdoIndex){
        $scope.vdoBlockIndex = vdoIndex;
        var modal = videoUrlModal.show($scope);
        modal.closePromise.then(function (data) {
            if(data.value.flag == 'ok'){
              if(data.value.data != ''){
                $scope.attachment.files.push(data.value.data);
              }
            }
        });
    };


    /*--------------for canal video gallery----------------------*/
    $scope.showPopupCanalUrl = function(vdoIndex){
        $scope.vdoBlockIndex = vdoIndex;
        var modal = canalUrlModal.show($scope);
        modal.closePromise.then(function (data) {
            if(data.value.flag == 'ok'){
              if(data.value.data != ''){
                $scope.attachment.files.push(data.value.data);
              }
            }
        });
    };


    $scope.vdoBlockAddVdos = function($files, $event){
    };
    $scope.vdoBlockRemoveVdos = function(vdoIndex, event){
      var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
      modal.closePromise.then(function (data) {
          if(data.value == 'ok'){
            $scope.attachment.files.splice(vdoIndex, 1);
          }
      });
      event.stopPropagation();
    };
    $scope.editFileDetails = function(fileindex){
      fileDetailEditorModal.show({type: $scope.type, data: $scope.attachment.files, fileindex: fileindex, enableEditing: true});
    };

    if($scope.type == "documents"){
      if($scope.attachment.filesFrom && sharedData.slectedDocumentFiles){
        switch($scope.attachment.filesFrom){
          case 'local':
            $scope.docBlockAdddocs(sharedData.slectedDocumentFiles, 0);
            break;
          case 'server':
            $scope.attachment.files = sharedData.slectedDocumentFiles;
            break;
        }
      }
    }
    var fileEdited = $rootScope.$on('file.edited', function(event, data){
      var filedata = data.data;
      var len = $scope.attachment.files.length;
      for(var i=0; i<len; i++){
        if($scope.attachment.files[i].uid == filedata.uid){
          /*
          if(filedata.title){
            $scope.attachment.files[i].title = filedata.title;
          }
          if(filedata.description){
            $scope.attachment.files[i].description = filedata.description;
          }
          if(filedata.hashTags){
            $scope.attachment.files[i].hashTags = filedata.hashTags;
          }
          */
          $scope.attachment.files[i] = filedata;
          break;
        }
      }
    });
    /*--------------video gallery end----------------------*/

    /*--------------for link embed gallery----------------------*/

    $scope.showPopupLinkEmbed = function(linkIndex){
        $scope.linkBlockIndex = linkIndex;
        var modal = LinkEmbedModal.show($scope,  $scope.attachment.links);
        modal.closePromise.then(function (data) {
            if(data.value.flag == 'ok'){
              if(data.value.data != '' && typeof(data.value.data) != 'undefined'){
                  // if(typeof($scope.attachment.links) == 'undefined'){
                  //     $scope.attachment.links = [];
                  // }
                  $scope.attachment.links.push(data.value.data);
              }
            }
        });
    };

    $scope.linkEmbedBlockRemoveVdos = function(linkIndex, event){
        var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
        modal.closePromise.then(function (data) {
            if(data.value == 'ok'){
              $scope.attachment.links.splice(linkIndex, 1);
            }
        });
        event.stopPropagation();
      };
      /*--------------end link embed gallery----------------------*/

    $scope.$on("$destroy", function(){
      $scope.uploader.cancel("cancelAll");
      fileEdited();
      sharedData.slectedDocumentFiles = null;
    });
  });
