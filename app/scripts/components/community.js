'use strict';

angular.module('inspherisProjectApp')
.component('communityTitle', {
  templateUrl: 'views/blocks/community_thumb_title_desc.tpl.html',
  bindings: {
   community: '='
  }
}).component('communityGridFeed', {
  templateUrl: 'views/containers/comm_feed_gv.tpl.html',
  controller: 'CommunityFeedCtrl',
  bindings: {
   community: '='
  }
}).component('communityListFeed', {
	templateUrl: 'views/containers/comm_feed_lv.tpl.html',
	controller: 'CommunityFeedCtrl',
	bindings: {
		community: '='
	}
}).component('fileSearchBox', {
    templateUrl: 'views/containers/file_SearchBox.tpl.html',
    controller: 'FileSearchResultCtrl',
    bindings: {
        searchText: '<',
        searchExternal: '<',
        externalTypes: '<'
    }
}).component('fileSearchTable', {
    templateUrl: 'views/containers/file_table.tpl.html',
    controller: 'FileSearchResultDetailsCtrl',
    bindings: {
        files: '<',
        showViewMoreBtn: '<',
        searchText: '<',
        communityFilters: '=',
        typeFilters: '=',
        authorFilters: '=',
        dateFromFilter: '=',
        dateToFilter: '=',
        dataNotFound:'=',
        loader:'=',
        total: '<',
        filteredResult: '<',
        searchExternal: '<',
        externalTypes: '<'
    }
}).component('communityFileSearch', {
    templateUrl: 'views/containers/community_file_search.tpl.html',
    controller: 'CommunityFileSearchResultCtrl',
    bindings: {
        searchdata: '@',
        files: '<'
    }
});
