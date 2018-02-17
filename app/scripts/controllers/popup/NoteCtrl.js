'use strict';
angular.module('inspherisProjectApp')
        .controller('NoteCtrl', function ($scope, $rootScope, $timeout, $filter, $stateParams, notifyModal, confirmModal, uiModals, createNoteModal, apiNoteService) {

            $scope.page = 1;
            $scope.itemsPerPage = 20;
            $scope.sortKey = "";
            $scope.sortField = "";

            $scope.gridNotes = {
                paginationPageSizes: [20, 30, 50, 70, 100],
                paginationPageSize: 20,
                minRowsToShow: 20,
                showGridFooter: true,
                useExternalPagination: true,
                useExternalSorting: true,
                enableSorting: true,
                columnDefs: [
                    {name: $filter('translate')('Title'), field: 'title', headerTooltip: $filter('translate')('Title'), enableColumnMenu: false},
                    {name: $filter('translate')('Message'), field: 'message', headerTooltip: $filter('translate')('Message'), enableColumnMenu: false},
                    {name: $filter('translate')('Start date'), field: 'dateFrom', headerTooltip: $filter('translate')('Start date'), cellFilter: 'date:"yyyy-MM-dd\"', enableColumnMenu: false},
                    {name: $filter('translate')('End date'), field: 'dateTo', headerTooltip: $filter('translate')('End date'), cellFilter: 'date:"yyyy-MM-dd\"', enableColumnMenu: false},
                    //{name: $filter('translate')('Priority'), field: 'priority', headerTooltip: $filter('translate')('Priority'), enableColumnMenu: false},
                    {name: $filter('translate')('Use on Profile Calendar'), field: 'includeOnProfileCalendar', headerTooltip: $filter('translate')('Use on Profile Calendar'), enableColumnMenu: false, enableSorting: false},
                    {name: $filter('translate')('Edit'), enableColumnMenu: false, imageClass: "k-icon k-i-pencil", cellTemplate: '<a  class="btn btn-default btn-xs" title="{{grid.appScope.tranlateWord(\'' + 'Edit' + '\')}}" ng-click="grid.appScope.editNote(row.entity.id)"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp; '
                                + '<a class="btn btn-default btn-xs" title="{{grid.appScope.tranlateWord(\'' + 'Delete' + '\')}}" ng-click="grid.appScope.deleteNote(row.entity.id)"><span class="glyphicon glyphicon-trash"></span></a>',
                        enableSorting: false
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length != 0) {
                            $scope.sortKey = sortColumns[0].sort.direction;
                            $scope.sortField = sortColumns[0].field;
                        }

                        $scope.getData();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.page = newPage;
                        $scope.itemsPerPage = pageSize;
                        $scope.getData();
                    });
                }
            };

            $scope.getData = function () {
                apiNoteService.getAllNotes({page: $scope.page, size: $scope.itemsPerPage, sortKey: $scope.sortKey, sortField: $scope.sortField}).then(function (data) {
                    $scope.gridNotes.data = data.rows;
                    $scope.gridNotes.totalItems = data.total;
                });
            };

            //load notes
            $scope.getData();

            // create note
            $scope.createNote = function () {
                var modal = createNoteModal.show(null, {action: 'create', type: 'note', data: null});
                modal.closePromise.then(function (data) {
                    if (data.value.flag == 'ok') {
                        $scope.getData();
                    }
                });
            };

            //edit note
            $scope.editNote = function (noteId) {
                var modal = createNoteModal.show(null, {action: 'edit', type: 'note', data: noteId});
                modal.closePromise.then(function (data) {
                    if (data.value.flag == 'ok') {
                        $scope.getData();
                    }
                });
            };

            // delete note
            $scope.deleteNote = function (noteId) {
                var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "Delete note confirm"});
                modal.closePromise.then(function (data) {
                    if (data.value == 'ok') {
                        apiNoteService.deleteNote({id: noteId}).then(function (data) {
                            if (typeof (data.code) != 'undefined' && data.code != null) {
                                var message = $filter('translate')(data.message);
                                var title = $filter('translate')('Error');
                                uiModals.alertModal(null, title, message);
                            } else {
                                notifyModal.showTranslated('Deleted note success', 'success', null);
                                $scope.getData();
                            }
                        }, function (err) {
                            notifyModal.showTranslated("something_went_wrong", 'error', null);
                        });
                    }
                });
            };
        })
        .controller('CreateNoteCtrl', function ($http, $scope, $rootScope, $timeout, $filter, $state, $q, $stateParams, notifyModal, uiModals, confirmModal, sharedData, dateTimeService,
                apiNoteService, apiCommunity, apiMediaUpload, embededCodeFromUrl) {
            $scope.publishDates = {
                startDt: null,
                startTime: null,
                endDt: null,
                endTime: null
            };
            $scope.publishStartDt = '';
            $scope.publishStartTime = '';
            $scope.publishEndDt = '';
            $scope.publishEndTime = '';

            $scope.title = '';
            $scope.message = '';
            $scope.includeOnProfileCalendar = true;
            $scope.priorityValues = [];
            $scope.prioritySelected = {value: "Select priority"};
            $scope.communities = [];
            $scope.communitySelected = {uid: "", label: "Select Community"};
            $scope.groups = [];
            $scope.selectedGroupIds = [];
            $scope.groupDisable = true;
            $scope.attachmentType = '';
            //Variable for attachments
            $scope.images = {type: "images", files: []};
            $scope.documents = {type: 'documentGallery', files: []};
            $scope.videos = {type: "videoGallery", files: []};
            $scope.links = {type: "linkEmbed", files: [], links: []};
            $scope.videoPreview = 'invalid';

            $scope.modalData = $scope.$parent.ngDialogData;

            //get publish start date && publish end date
            $scope.getPublishStartEndDate = function (stDt, stTime, endDt, endTime) {
                var errorData = {
                    flag: false,
                    message: ''
                };

                var publishStartDateTime = null;
                if (stDt && stTime) {
                    publishStartDateTime = dateTimeService.dateTimeToMsec(stDt, stTime);
                } else {
                    publishStartDateTime = stDt;
                }

                var publishEndDateTime = null;
                if (endDt && endTime) {
                    publishEndDateTime = dateTimeService.dateTimeToMsec(endDt, endTime);
                } else {
                    publishEndDateTime = endDt;
                }

                //for error hadling
                if (stTime) {
                    if (!stDt) {
                        errorData.flag = true;
                        errorData.message = 'select_publish_start_date';
                    }
                }

                if (endTime) {
                    if (!endDt) {
                        errorData.flag = true;
                        errorData.message = 'select_publish_end_date';
                    }
                }

                if (stDt && stTime) {
                    var currentDateTime = Date.parse(new Date());
                    if ((publishStartDateTime <= currentDateTime) && ($scope.modalData.action == 'create')) {
                        //if we are creating article then only we will show this message
                        errorData.flag = true;
                        errorData.message = 'publish_start_date_should_greater_than_current_date';
                    } else if (endDt && endTime) {
                        if (publishEndDateTime <= publishStartDateTime) {
                            errorData.flag = true;
                            errorData.message = 'publish_end_date_should_greater_than_start_date';
                        }
                    }
                } else if (endDt && endTime) {
                    if (publishEndDateTime <= publishStartDateTime) {
                        errorData.flag = true;
                        errorData.message = 'publish_end_date_should_greater_than_start_date';
                    }
                }
                return ({startDtTime: publishStartDateTime, endDtTime: publishEndDateTime, error: errorData});
            };

            $scope.initializeData = function () {
                var deferred = $q.defer();
                var pr0 = apiNoteService.getPriorities();
                var pr1 = apiCommunity.getCommunitiesData();
                $q.all([pr0, pr1]).then(function (data) {
                    //for data[0]
                    angular.forEach(data[0], function (val, key) {
                        $scope.priorityValues.push({
                            value: val
                        });
                    });

                    //for data[1]
                    if ($rootScope.userData.role == "GlobalCommunityManager") {
                        $scope.communities = $scope.communities.concat(data[1]);
                    } else {
                        angular.forEach(data[1], function (community, ckey) {
                            angular.forEach($rootScope.userData.communityRoles, function (cRole, rkey) {
                                if (community.uid == cRole.communityUid && cRole.role == 'CommunityManager') {
                                    $scope.communities.push(community);
                                }
                            });
                        });
                    }

                    deferred.resolve("success");
                }, function (err) {
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                    deferred.resolve("error");
                });
                return deferred.promise;
            };

            $scope.initializeData().then(function (msg) {
                if (($scope.modalData.action == 'edit') && ($scope.modalData.data)) {
                    apiNoteService.getById($scope.modalData.data).then(function (data) {
                        $scope.title = data.title;
                        $scope.message = data.message;
                        $scope.includeOnProfileCalendar = data.includeOnProfileCalendar;

                        //load dateFrom
                        if (data.dateFrom) {
                            $scope.publishDates.startDt = ($filter('newDate')(data.dateFrom)).getTime();
                            $scope.publishDates.startTime = $filter('newDate')(data.dateFrom);
                        }

                        //load dateTo
                        if (data.dateTo) {
                            $scope.publishDates.endDt = ($filter('newDate')(data.dateTo)).getTime();
                            $scope.publishDates.endTime = $filter('newDate')(data.dateTo);
                        }

                        //load priority
                        $scope.prioritySelected = {value: data.priority};

                        //load community
                        $scope.communitySelected = {uid: data.communities[0].uid, label: data.communities[0].label};

                        //load group
                        $scope.groupDisable = false;
                        $scope.groups = [];
                        var selectedGroups = data.groups;
                        apiNoteService.getGroupsByCommunity({communityUid: $scope.communitySelected.uid}).then(function (data) {
                            $scope.groups = $scope.groups.concat(data);
                            if ($scope.groups.length > 0) {
                                for (var i = 0; i < selectedGroups.length; i++) {
                                    var selectedGroupId = selectedGroups[i].id;
                                    $scope.selectedGroupIds.push(selectedGroupId);
                                    for (var j = 0; j < $scope.groups.length; j++) {
                                        if (selectedGroupId == $scope.groups[j].id) {
                                            $scope.groups[j].selected = true;
                                        }
                                    }
                                }
                            }
                        }, function (err) {
                            notifyModal.showTranslated('something_went_wrong', 'error', null);
                        });
                        //load attachments
                        if (typeof (data.attachments) != 'undefined' && data.attachments.length > 0) {
                            angular.forEach(data.attachments, function (attachValue, key) {
                                switch (attachValue.type) {
                                    case 'ImageGallery':
                                        angular.forEach(attachValue.images, function (val) {
                                            $scope.images.files.push(val);
                                        });
                                        $('#image').prop('checked', true);
                                        $scope.attachmentType = 'image';
                                        $scope.blockActive = 'image'
                                        break;
                                    case 'documentGallery':
                                        angular.forEach(attachValue.documents, function (val) {
                                            $scope.documents.files.push(val);
                                        });
                                        $('#document').prop('checked', true);
                                        $scope.attachmentType = 'document';
                                        $scope.blockActive = 'document';
                                        break;
                                    case 'linkEmbed':
                                        angular.forEach(attachValue.links, function (val) {
                                            $scope.links.links.push(val);
                                        });
                                        $('#link').prop('checked', true);
                                        $scope.attachmentType = 'link';
                                        $scope.blockActive = 'link';
                                        break;
                                    case 'videoGallery':
                                        angular.forEach(attachValue.videos, function (val) {
                                            $scope.videos.files.push(val);
                                        });
                                        $('#video').prop('checked', true);
                                        $scope.attachmentType = 'video';
                                        $scope.blockActive = 'video';
                                        $scope.videoPreview = 'Yes';
                                        break;
                                }
                            })
                        }
                    }, function (err) {
                        notifyModal.showTranslated('something_went_wrong', 'error', null);
                    });
                }//if action == edit

            }, function (errmsg) {

            });

            //select groups from community
            $scope.selectCommunity = function (selected) {
                if (selected.uid != '') {
                    $scope.groupDisable = false;

                    $scope.groups = [];
                    apiNoteService.getGroupsByCommunity({communityUid: selected.uid}).then(function (data) {
                        $scope.groups = $scope.groups.concat(data);
                    }, function (err) {
                        notifyModal.showTranslated('something_went_wrong', 'error', null);
                    });
                } else {
                    $scope.groupDisable = true;
                    $scope.groups = [];
                    $scope.selectedGroupIds = [];
                }
            };

            //choose groups
            $scope.chooseGroup = function ($event, groupId) {
                if ($event.target.checked) {
                    $scope.selectedGroupIds.push(groupId);
                } else {
                    var index = $scope.selectedGroupIds.indexOf(groupId);
                    if (index !== -1) {
                        $scope.selectedGroupIds.splice(index, 1);
                    }
                }
            };

            $scope.stopPropagation = function (event) {
                event.stopPropagation();
            };

            $scope.selectTypeAttachment = function (type, event) {
                $scope.blockActive = type;
                $scope.attachmentType = type;
//                if ($scope.attachmentType != '' && $scope.attachmentType != type) {
//                    var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Change type attachment will clear other attachments"});
//                    modal.closePromise.then(function (data) {
//                        if (data.value == 'ok') {
//                            $scope.blockActive = type;
////                            $scope.images = {files: [], type: "images"};
////                            $scope.documents = {type: 'documentGallery', files: []};
////                            $scope.videos = {type: "videoGallery", files: []};
////                            $scope.links = {type: "linkEmbed", files: [], links: []};
//                            $scope.attachmentType = type;
//                        } else {
//                            $('#' + $scope.attachmentType).prop('checked', true);
//                        }
//                    });
//                } else {
//                    $scope.blockActive = type;
//                    $scope.attachmentType = type;
//                }
            }

            //Upload file
            $scope.processForm = function (files) {
                var fd = new FormData();
                // Take the first selected file
                fd.append("file", files[0]);
                $http.post('/api/mediamanager/upload-file', fd, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
                        .then(function onSuccess(response) {
                            var data = response.data;
                            if ($scope.attachmentType == 'image') {
                                $scope.images.files.push(data[0]);
                            }
                            if ($scope.attachmentType == 'document') {
                                $scope.documents.files.push(data[0]);
                            }
                        }, function onError(response) {
                            var data = response.data;
                        });
            };

            $scope.videoData = '';
            $scope.linkData = {};
            $scope.isValidVideo = false;
            $scope.embededCodeFromUrl = null;
            $scope.link = {
                url: ""
            }

            var tempSeartText = '', filterTextTimeout = null;
            var watchYoutubeUrl = $scope.$watch('link.url', function (val) {
                if (filterTextTimeout || (val.length == 0)) {
                    //cancel search if text length is zero or search text has changed
                    $timeout.cancel(filterTextTimeout);
                }
                tempSeartText = val;
                filterTextTimeout = $timeout(function () {
                    if (tempSeartText != '') {
                        if ($scope.embededCodeFromUrl) {
                            //if already executing search request then cancel it and search for new key word, cancelling previous search will resolve the promise and return null
                            $scope.embededCodeFromUrl.cancel('cancelled');
                        }

                        $scope.embededCodeFromUrl = new embededCodeFromUrl();
                        $scope.embededCodeFromUrl.getEmbedded(tempSeartText).then(function (data) {
                            if (data.html && data.thumbnail_url && $scope.attachmentType == 'video') {
                                $scope.videoPreview = data.html;
                                $scope.videoData = {
                                    embedVideo: data.html,
                                    embedVideoTitle: data.title,
                                    thumbUrl: data.thumbnail_url
                                };
                                $scope.isValidVideo = true;
                                $scope.videos.files.push($scope.videoData);
                                $scope.link = {
                                    url: ""
                                }
                            } else if ($scope.attachmentType == 'link' && data.type == 'link') {
                                var image = new Image();
                                image.src = data.provider_url + "/favicon.ico";
                                var faviconUrl = '';
                                if (image.width > 0 && image.height > 0) {
                                    faviconUrl = data.provider_url + "/favicon.ico";
                                }

                                $scope.isValidLink = true;
                                $scope.linkPreview = 'valid';
                                $scope.linkData = {
                                    location: data.provider_url,
                                    description: data.description,
                                    title: data.title,
                                    thumbnail_width: data.thumbnail_width,
                                    path: data.url,
                                    thumbnail_url: data.thumbnail_url,
                                    version: data.version,
                                    subTitle: data.provider_name,
                                    type: data.type,
                                    thumbnail_height: data.thumbnail_height,
                                    favicon: faviconUrl
                                }
                                $scope.links.links.push($scope.linkData);
                                $scope.link = {
                                    url: ""
                                }
                            } else {
                                notifyModal.showTranslated("Invalid Link", 'error', null);
                            }
                        }, function (err) {
                            $scope.videoPreview = 'invalid';
                            notifyModal.showTranslated("invalid_url_or_enable_cross_origin_acess", 'error', null);
                        });
                    } else {
                        if ($scope.embededCodeFromUrl) {
                            $scope.embededCodeFromUrl.cancel();
                        }
                    }
                }, 500); // delay 250 ms
            });

            $scope.removeAttachment = function (type, index) {
                switch (type) {
                    case 'image':
                        $scope.images.files.splice(index, 1);
                        break;
                    case 'document':
                        $scope.documents.files.splice(index, 1);
                        break;
                    case 'link':
                        $scope.links.links.splice(index, 1);
                        break;
                    case 'video':
                        $scope.videos.files.splice(index, 1);
                        break;
                }
            }
            // save note
            $scope.createNote = function (status) {
                var errorData = {
                    false: false,
                    message: ''
                };

                var postdata = {
                    title: $scope.title,
                    message: $scope.message,
                    includeOnProfileCalendar: $scope.includeOnProfileCalendar,
                    priority: $scope.prioritySelected.value
                };

                if ($scope.modalData.data) {
                    postdata.id = $scope.modalData.data;
                }
//                 && !$scope.publishDates.startTime
//                if (!$scope.publishDates.startDt) {
//                    errorData.flag = true;
//                    errorData.message = "select_publish_start_date";
//                }
//                 && !$scope.publishDates.endTime
//                if (!$scope.publishDates.endDt) {
//                    errorData.flag = true;
//                    errorData.message = "select_publish_end_date";
//                }

                if (typeof ($scope.selectedGroupIds) == 'undefined' || $scope.selectedGroupIds.length == 0) {
                    errorData.flag = true;
                    errorData.message = "Please choose groups";
                } else {
                    postdata.groupIds = $scope.selectedGroupIds;
                }

                if (typeof ($scope.communitySelected) == 'undefined' || $scope.communitySelected.uid == '') {
                    errorData.flag = true;
                    errorData.message = "Please select the community";
                } else {
                    var communityUids = [];
                    communityUids.push($scope.communitySelected.uid);
                    postdata.communityUids = communityUids;
                }
                if (typeof (postdata.priority) == 'undefined' || postdata.priority == 'Select priority') {
//                    errorData.flag = true;
//                    errorData.message = "Please choose priority";
                    postdata.priority = 'Normal'
                }

                if (postdata.title == "") {
                    errorData.flag = true;
                    errorData.message = 'Enter_Title';
                }
                var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.startTime, $scope.publishDates.endDt, $scope.publishDates.endTime);
                if (publishTiming.error.flag) {
                    errorData.flag = true;
                    errorData.message = publishTiming.error.message;
                }

                if (publishTiming.startDtTime) {
                    postdata.dateFrom = publishTiming.startDtTime;
                }

                if (publishTiming.endDtTime) {
                    postdata.dateTo = publishTiming.endDtTime;
                }

                var attachments = [];

                if ($scope.images.files.length > 0) {
                    var imageObject = {
                        type: 'ImageGallery',
                        images: []
                    }
                    angular.forEach($scope.images.files, function (value, key) {
                        imageObject.images.push(value.uid);
                        
                    });
                    attachments.push(imageObject);
                }
//                        -------------------------------

                if ($scope.documents.files.length > 0) {
                    var documentObject = {
                        type: 'documentGallery',
                        documents: []
                    }
                    angular.forEach($scope.documents.files, function (value, key) {
                        documentObject.documents.push(value.uid);
                    });
                    attachments.push(documentObject);
                }
//                        ----------------------------------

                if ($scope.links.links.length > 0) {
                    var linkObject = {
                        type: 'linkEmbed',
                        links: []
                    }
                    angular.forEach($scope.links.links, function (value, key) {
                        linkObject.links.push(value);
                    });
                    attachments.push(linkObject);

                }
//                        --------------------------------------------
                if ($scope.videos.files.length > 0) {
                    var videoObject = {
                        type: 'videoGallery',
                        videos: []
                    }
                    angular.forEach($scope.videos.files, function (value, key) {
                        videoObject.videos.push(value);
                    });
                    attachments.push(videoObject);
                }
                postdata.attachments = attachments;

                if (!errorData.flag) {
                    var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Publish note confirm"});
                    modal.closePromise.then(function (data) {
                        if (data.value == 'ok') {
                            if ($scope.modalData.action == 'create') {
                                apiNoteService.create(postdata).then(function (data) {
                                    $scope.closeThisDialog({flag: 'ok', data: data});
                                    notifyModal.showTranslated('Note published success', 'success', null);
                                    $state.reload();
                                }, function (err) {
                                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                                });
                            } else if ($scope.modalData.action == 'edit') {
                                apiNoteService.edit($scope.modalData.data, postdata).then(function (data) {
                                    $scope.closeThisDialog({flag: 'ok', data: data});
                                    notifyModal.showTranslated('Note edited success', 'success', null);
                                    $state.reload();
                                }, function (err) {
                                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                                });
                            }
                        }
                    });
                } else {
                    notifyModal.showTranslated(errorData.message, 'error', null);
                }
            };
        });