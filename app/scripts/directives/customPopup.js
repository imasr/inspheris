'use strict';
/*angular.module('inspherisProjectApp').directive('ellipsis', ['$timeout',function($timeout, $window) {
	return {
        required: 'ngBindHtml',
        restrict: 'A',
        priority: 100,
        link: function ($scope, element, attrs, ctrl) {
        	alert("Inside Directive");
            $timeout(function(){
            $scope.hasEllipsis = false;
            $scope.$watch(element.html(), function(value) {
               if (!$scope.hasEllipsis) {
                   // apply ellipsis only one
                   $scope.hasEllipsis = true;
                   element.ellipsis();
               }
            });
        },0);
        }
                /*$timeout(function() {
                    angular.element(element).ellipsis();
                }, 5000);*/

/*            }
    };

}]);*/

angular.module('inspherisProjectApp').directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'hover',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});