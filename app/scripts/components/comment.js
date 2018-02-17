'use strict';

angular.module('inspherisProjectApp')
.component('comment', {
  templateUrl: 'views/blocks/comment_li.tpl.html',
  controller: 'CommentCtrl',
  bindings: {
    comment: '=',
    allowComment: '=',
    feed: '=',
    feedTranslateOptn: '='
  }
}).component('imageUpload', {
  templateUrl: 'views/containers/upload_square_image.tpl.html',
  controller: 'UploadSquareCtrl',
  bindings: {
    onlyRemoteFiles: '@'
  }
}).component('documentUpload', {
  templateUrl: 'views/containers/upload_square_document.tpl.html',
  controller: 'UploadSquareCtrl',
  bindings: {
    onlyRemoteFiles: '@'
  }
}).component('videoUpload', {
  templateUrl: 'views/containers/upload_square_video.tpl.html',
  controller: 'UploadSquareCtrl',
  bindings: {
    onClick: '&',
    onUpload: '&'
  }
}).component('linkEmbedUpload', {
  templateUrl: 'views/containers/upload_square_link_embed.tpl.html',
  controller: 'UploadSquareCtrl',
  bindings: {
    onClick: '&'
  }
}).component('yammerEmbedUpload',{
	templateUrl: 'views/containers/upload_square_yammer.tpl.html',
    controller: 'UploadSquareCtrl',
    bindings: {
    onClick: '&'
  }
}).component('mediaGalleryUploadPanel', {
  templateUrl: 'views/blocks/generic_add_media_gallery.tpl.html',
  controller: 'AddImageGalleryCtrl',
  bindings: {
    onlyRemoteFiles: '@',
    attachment: '=',
    onRemove: '&',
    onAddBlock:'&',
    mediaType:'='    
  }
});