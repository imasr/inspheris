'use strict';
angular.module('inspherisProjectApp')
        .controller('AllNotDeServivesCtrl', function ($scope, $rootScope, $timeout, $filter, $stateParams, notifyModal, apiNoteService, apiPeoples) {

            $scope.startDt = null;
            $scope.endDt = null;
            $scope.searchText = null;

            $scope.selectedSite = {
                name: "Site"
            };
            $scope.sites = [];

            $scope.tab = {service: true};
            //load notes
            $scope.tabSelected = function (name) {
                if (name == 'direction') {
                    $scope.tab.service = false;
                } else {
                    $scope.tab.service = true;
                }
                $scope.singleDayNoteDatas = [];
                $scope.periodicNoteDatas = [];
                $scope.permanentNoteDatas = [];
                var params = {
                    seeAll: true
                };

                if (name == 'direction') {
                    params.isDirection = true;
                    $scope.getSites = new apiPeoples();
                    $scope.getSites.getFilterList({field: 'site'}).then(function (data) {
                        var ctemp = [];
                        ctemp.push(angular.copy($scope.selectedSite));
                        angular.forEach(data, function (val) {
                            var obj = {name: val};
                            ctemp.push(obj);
                        });
                        $scope.sites = ctemp;
                    }, function (err) {

                    });
                }
                $scope.getNotes(params);
            };

            //search from tab "Mes notes de services"
            $scope.searchAllNotes = function (searchText, startDt, endDt) {
                var dateFrom = '';
                if (startDt && startDt != null && startDt != '') {
                    dateFrom = $filter('date')(startDt, 'MM/dd/yyyy');
                }

                var dateTo = '';
                if (endDt && endDt != null && endDt != '') {
                    dateTo = $filter('date')(endDt, 'MM/dd/yyyy');
                }

                $scope.singleDayNoteDatas = [];
                $scope.periodicNoteDatas = [];
                $scope.permanentNoteDatas = [];
                var params = {
                    seeAll: true,
                    q: searchText,
                    dateFrom: dateFrom,
                    dateTo: dateTo
                };
                $scope.getNotes(params);
            };

            //search from tab "Ma direction"
            $scope.searchNotesByDirection = function (searchText, startDt, endDt, site) {
                var dateFrom = '';
                if (startDt && startDt != null && startDt != '') {
                    dateFrom = $filter('date')(startDt, 'MM/dd/yyyy');
                }

                var dateTo = '';
                if (endDt && endDt != null && endDt != '') {
                    dateTo = $filter('date')(endDt, 'MM/dd/yyyy');
                }

                var siteFilter = '';
                if (site.name != "Site") {
                    siteFilter = site.name;
                }

                $scope.singleDayNoteDatas = [];
                $scope.periodicNoteDatas = [];
                $scope.permanentNoteDatas = [];
                var params = {
                    seeAll: true,
                    q: searchText,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    isDirection: true,
                    site: siteFilter
                };
                $scope.getNotes(params);
            };

            $scope.getNotes = function (params) {
                apiNoteService.getNotesForCurrentUser(params).then(function (data) {
                	//Single Day Notes
                    $scope.notes = data.singleDayNotes;
                    angular.forEach($scope.notes, function (val, key) {
                        var note = {
                            title: val.title,
                            content: val.message,
                            dateFrom: val.dateFrom,
                            dateTo: val.dateTo,
                            priority: val.priority,
                            blocks: val.attachments
                        };
                        $scope.singleDayNoteDatas.push(note);
                    });
                    
                    // Periodic Notes
	                $scope.periodicNotes = data.periodicNotes;
	                angular.forEach($scope.periodicNotes, function (val, key) {
	                    var note = {
	                        title: val.title,
	                        content: val.message,
	                        dateFrom: val.dateFrom,
	                        dateTo: val.dateTo,
	                        priority: val.priority,
	                        blocks: val.attachments
	                    };
	                    $scope.periodicNoteDatas.push(note);
	                });
	                
	                // Permanent Notes
	                $scope.permanentNotes = data.permanentNotes;
	                angular.forEach($scope.permanentNotes, function (val, key) {
	                    var note = {
	                        title: val.title,
	                        content: val.message,
	                        dateFrom: val.dateFrom,
	                        dateTo: val.dateTo,
	                        priority: val.priority,
	                        blocks: val.attachments
	                    };
	                    $scope.permanentNoteDatas.push(note);
	                });
                }, function (err) {
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            };
            $scope.moreLess=[];
            $scope.showHideMoreText = function (indx) {
                if (indx == $scope.moreLess[indx]) {
                    $scope.moreLess[indx] = null;
                } else {
                    $scope.moreLess[indx] = indx;
                }
            };
            $scope.checkHeight = function (indx) {
//                var heig = $(".popupNote" + indx).prop("scrollHeight");
//                if (heig > 60) {
//                    return '';
//                } else {
//                    return 'dispNone';
//                }
            	return '';
            };
}).controller('NoteServiceDetailsInfoController', function ($scope, $rootScope, $timeout) { 
    $scope.moreLess=[];
    $scope.showHideMoreText = function (indx) {
        if (indx == $scope.moreLess[indx]) {
            $scope.moreLess[indx] = null;
        } else {
            $scope.moreLess[indx] = indx;
        }
    };
    $scope.checkHeight = function (indx) {
//        var heig = $(".popupNote" + indx).prop("scrollHeight");
//        if (heig > 60) {
//            return '';
//        } else {
//            return 'dispNone';
//        }
    	return '';
    };
});


