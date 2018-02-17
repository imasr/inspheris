'use strict';

angular.module('inspherisProjectApp').component('thumbnail', {
  templateUrl: 'views/blocks/thumbnail_by_filetype.tpl.html',
  controller: 'AddImageGalleryCtrl',
  bindings: {
    file: '=',
    mediaType: '='
  }
});