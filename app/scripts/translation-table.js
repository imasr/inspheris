'use strict';
angular.module('inspherisProjectApp').config(['$translateProvider', function ($translateProvider) {
  	$translateProvider.useStaticFilesLoader({
    	prefix: 'languages/language_',
        suffix: '.json'
  	});
  	$translateProvider.preferredLanguage('fr');
}]);