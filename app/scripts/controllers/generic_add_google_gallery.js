angular.module('inspherisProjectApp')
  .controller('AddImageGalleryCtrl1', function ($scope, $rootScope, $http, Config, sharedData, apiMediaUpload, apiGoogleDrive, videoUrlModal, canalUrlModal, LinkEmbedModal, browseImageModal, browseVideoModal, browseDocumentModal, fileDetailEditorModal, confirmModal,uiModals,$filter) {
	
	this.$onInit = function(){
      $scope.attachment =this.attachment;
	  
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
	  if($scope.type == "yammerEmbed" && typeof($scope.attachment.links) == 'undefined'){
    	  
		  $scope.attachment.links = [];
      }
	  console.log($scope.attachment);
	  
    }
	
   
    $scope.developerKey = 'AIzaSyCdWlPi5ITMSGWGMaERUqBLJ3qUKSjJsyM' ;
	$scope.clientId = "161775536316-euj3guqnsu8nd52n10dhq3ts7nvejurj.apps.googleusercontent.com";
    $scope.scope = [];
    $scope.pickerApiLoaded = false;
    $scope.oauthToken;
	$scope.docType ;
	$scope.scopedrive = ['https://www.googleapis.com/auth/drive','profile'];
  
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
                createPicker();
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
				 picker.setVisible(true);  
				
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
		
		function checkFile(uid,callback)
		{
			if ($scope.attachment.files.length > 0)
			{
				var filtered = $scope.attachment.files.filter(function (file) {
						return file.uid === uid ;
				});
				if (filtered != null)
					callback(true);
				else
					callback(false);
			}
			else
				callback(false);
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
							var thumbgalleryUrl;
							if ($scope.docType === 'photo') thumbgalleryUrl = resp.thumbnailLink;
							else thumbgalleryUrl = doc.url;
							var obj = {
								'uid': doc.id ,
								'uploadStatus' : 2 ,
								'fileName' : doc.name,
								'fileType' : doc.mimeType,
								'url' : doc.url,
								'thumbUrl' : thumbgalleryUrl,
								'thumbGalleryUrl':thumbgalleryUrl
							}
							
							checkFile(obj.uid,function(result){
								if (!result)
									$scope.attachment.files.push(obj);
							})
					
					    }  
				});			 
            }
            
        }
		
    $scope.showGoogleDrive = function(fileType,attachment)
	{
		alert(fileType + " " + attachment);
		$scope.attachment = attachment;
		console.log($scope.attachment);
		$scope.docType = fileType;
		$scope.scope = [] ;
		$scope.scope.push('https://www.googleapis.com/auth/drive.readonly');
		gapi.load('auth', { 'callback': onAuthApiLoad });
		gapi.load('picker', { 'callback': onPickerApiLoad });
	}
  
  });