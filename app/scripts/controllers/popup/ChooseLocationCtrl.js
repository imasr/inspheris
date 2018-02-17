'use strict';
angular.module('inspherisProjectApp')
  .controller('ChooseLocationCtrl', function ($scope, $rootScope, $compile, $http, Config, selectLocationModal, $log, $timeout) {
    //required plugin angular-google-maps

    $scope.selectedlocation = '';
    $scope.autoCompleteOptions = {watchEnter: true};
    $scope.details = '';

    $scope.map = {
      center: {latitude: 40.1451, longitude: -99.6680 },
      zoom: 6
    };
    $scope.options = {scrollwheel: true};
    $scope.coordsUpdates = 0;
    $scope.marker = {
      id: 'ngMarker',
      coords: {
        latitude: 40.1451,
        longitude: -99.6680
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          /*$log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          $log.log(lat);
          $log.log(lon);

          $scope.marker.options = {
            draggable: true,
            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };*/
          $log.debug('marker dragend');
          $log.debug('marker dragged',marker.getPosition().lat());
          $log.debug('marker dragged',marker.getPosition().lng());
        }
      }
    };
    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
      /*if (_.isEqual(newVal, oldVal))
        return;
      $scope.coordsUpdates++;*/
    });

    $scope.closeChooseLocationPopup = function() {
      selectLocationModal.hide();
    };

    $scope.doneLocationSelection = function(){
      $rootScope.$broadcast('event.location.selected', {address: $scope.selectedlocation, coords: $scope.marker.coords});
       $scope.closeChooseLocationPopup();
    };

    $scope.$watch('details', function(){
      if($scope.details != ''){
        $timeout(function(){
          $scope.$apply(function(){
            $scope.map.center = {
              latitude: $scope.details.geometry.location.lat(),
              longitude: $scope.details.geometry.location.lng()
            };

            $scope.marker.coords = {
              latitude: $scope.details.geometry.location.lat(),
              longitude: $scope.details.geometry.location.lng()
            };
          });
        });
      }
    });
  });
