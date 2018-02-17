'use strict';
angular.module('inspherisProjectApp')
        .controller('videogularController',
                ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {
                        $scope.videoData = {
                            source:'http://static.videogular.com/assets/videos/videogular.mp4',
                            poster:'http://www.videogular.com/assets/images/videogular.png'
                        }
                    }]);