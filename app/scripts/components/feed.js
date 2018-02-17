'use strict';

angular.module('inspherisProjectApp')
.component('feedUserInfo', {
  templateUrl: 'views/blocks/feed_lv_userartinfo.tpl.html',
  bindings: {
    showFeedStatus: '@',
    actionSentence: '=',
    feedStausLoader: '<',
    enableTootip: '@',
    selectedFeedStatus: '=',
    feedStatusSelection: '=',
    onChange: '&',
    uidUserTooltip: '=',
    index: '=',
    typeView:'@'
  }
}).component('feedThumb', {
  templateUrl: 'views/blocks/feed_thumb.tpl.html',
  bindings: {
    imgsrc:'=',
    smallImage: '=',
    backgroundColor: '=',
    posX: '=',
    posY: '='
  }
}).component('feedEventThumb', {
  templateUrl: 'views/blocks/feed_event_thumb.tpl.html',
  bindings: {
    event:'='
  }
}).component('feedMediaThumb', {
  templateUrl: 'views/blocks/feed_media_thumb.tpl.html',
  bindings: {
    thumbmedia: '='
  }     
}).component('feedControls', {
  templateUrl: 'views/blocks/feed_controls.tpl.html',
  controller: 'CommentWrapperCtrl',
  bindings: {
    listView: '@',
    feedIndex: '=',
    showCommentLabel: '@',
    keepOpen: '@',
    refererCommunity: '=',
    showFullComments: '=',
    feed: '=',
    onClickDeleteFeed: '&',
    showViewLabel: '=',
    viewInFile:'@'
  }
}).component('feedGridviewDocUpload', {
  templateUrl: 'views/containers/feed_gv_doc_upload.tpl.html',
  controller: 'CallDocumentUploadCtrl'
}).component('feedContentListView', {
  templateUrl: 'views/blocks/lv_feed_content.tpl.html',
  controller: 'FeedCtrl',
  bindings:{
    feed: '=',
    index: '=',
    showControls: '@',
    showArticleInfoBar:'@',
    showFullComments:'@',
    showFeedStatus:'=',
    userDetail:'=',
    showViewLabelInModal:'='
  }
}).component('feedListView', {
  templateUrl: 'views/containers/feed_lv.tpl.html',
  controller: 'FeedCtrl',
  bindings:{
    feed: '=',
    showFeedStatus:'=',
    index:'=',
    isPinnedTab: '='
  }
}).component('feedGridView', {
  templateUrl: 'views/containers/feed_gv.tpl.html',
  controller: 'FeedCtrl',
  bindings:{
    feed: '=',
    openInNewTab:'@',
    index:'=',
    isPinnedTab: '='
  }  
}).component('pinContent', {
  templateUrl: 'views/pin_article.html',
  bindings:{
	  pinnedContent: '=',
	  showLastActivityDate: '=',
	  showTumbType: '=',
	  showLastActivityUser: '=',
	  enableTootip: '='
  }  
}).component('pinnedCommunities', {
	templateUrl: 'views/containers/pin_community_details.tpl.html',
	controller: 'SimplePinCommunityCtrl',
	bindings:{
		pinnedCommunities: '=',
		userCanPinCommunity: '='
	}  
}).component('communityFile', {
	templateUrl: 'views/containers/feed_gv_community_file.tpl.html',
	controller: 'CommunityFileCtrl',
	bindings:{
		file: '=',
		openInNewTab: '='
	}  
}).component('grandArticleDetails', {
	  templateUrl: 'views/blocks/grand_article_details.tpl.html',
	  bindings: {
	    blocks:'='
	  }
});