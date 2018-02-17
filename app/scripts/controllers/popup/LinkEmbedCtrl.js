'use strict';

angular.module('inspherisProjectApp')
.controller('LinkEmbedCtrl', function ($scope, $rootScope, $timeout, youtubeVideo, videoUrlModal, embededCodeFromUrl, notifyModal){
	
 $scope.linkPreview = 'invalid';
 $scope.linkData = {};
 $scope.isValidLink = false;
 $scope.embededCodeFromUrl = null;
 
 var tempSeartText = '', filterTextTimeout = null;
 var watchYoutubeUrl = $scope.$watch('linkEmbed', function (val) {
   if (filterTextTimeout ||  typeof(val) == 'undefined'){
     //cancel search if text length is zero or search text has changed
     $timeout.cancel(filterTextTimeout);
   }
   tempSeartText = val;
   filterTextTimeout = $timeout(function() {
       if(tempSeartText != '' && typeof(tempSeartText) != 'undefined'){  
         if($scope.embededCodeFromUrl){
           //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
           $scope.embededCodeFromUrl.cancel('cancelled');
         }
         $scope.embededCodeFromUrl = new embededCodeFromUrl();
         $scope.embededCodeFromUrl.getEmbedded(tempSeartText).then(function(data){
	        if(data.type === 'link'||data.type === 'rich'){
	        	if(data.type === 'rich'){
                            data.url=tempSeartText;
                        }
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
	        	 };
	        }else{
             notifyModal.showTranslated("Invalid link", 'error', null);
           }
         }, function(err){
           //error
           $scope.linkPreview = 'invalid';
           //notifyModal.showTranslated("something_went_wrong", 'error', null);
           notifyModal.showTranslated("invalid_url_or_enable_cross_origin_acess", 'error', null);
           //{"error_code":404,"error_message":"HTTP 404: Not Found","type":"error"}
         });
       }else{
         //cancel if search text length is less than zero
         if($scope.embededCodeFromUrl){
           $scope.embededCodeFromUrl.cancel();
         }
       }
   }, 500); // delay 250 ms
 });

	 $scope.handleClickEvent =  function(event){
	   event.stopPropagation();
	 };
	
	 $scope.done = function(){
	   if($scope.isValidLink){
	     if($scope.linkData != null){
	       $scope.closeThisDialog({flag: 'ok', data: $scope.linkData});
	     }
	     else{
	       $scope.closeThisDialog({flag: 'cancel', data: null});
	     }
	   }//isValidLink
	 };
	
	 $scope.$on("$destroy", function(){
	   if($scope.embededCodeFromUrl){
	     $scope.embededCodeFromUrl.cancel();
	   }
	   watchYoutubeUrl();
	 });
});