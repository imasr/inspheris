'use strict';

/**
 * @ngdoc function
 * @name inspherisProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inspherisProjectApp
 */

angular.module('inspherisProjectApp')
        .controller('SimpleWidgetController', function ($scope, $rootScope, $http, Config, sharedData, addWidgetModal, apiAgenda, confirmModal, $state) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.editWidget = function (wgt) {
                var modal = addWidgetModal.show({action: 'edit', type: 'widget', data: wgt});
            };

            $scope.deleteEvent = function (eventUid) {
                var modal = confirmModal.showTranslated($scope, {title: "Delete", message: "delete_confirm"});
                modal.closePromise.then(function (data) {
                    if (data.value == 'ok') {
                        apiAgenda.delete(eventUid).then(function (data) {
                            $state.reload();
                        }, function (err) {
                        });

                    }
                });
            };
        })
        .controller('WidgetNoteServiceController', function ($scope, $window, $timeout, $http, apiNoteService, notifyModal, allNotesModal) {
            $scope.isWidgetOpen = true;
            var totalHeight;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.moreLess= [];
            $scope.singleDayNoteDatas = [];
            $scope.periodicNoteDatas = [];
            $scope.permanentNoteDatas = [];
            apiNoteService.getNotesForCurrentUser().then(function (data) {
            	if(data != null){
            		//Single Day Notes
	                $scope.singleDayNotes = data.singleDayNotes;
	                angular.forEach($scope.singleDayNotes, function (val, key) {
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
	                setNoteWidgetHeight();
            	}
            }, function (err) {
                notifyModal.showTranslated('something_went_wrong', 'error', null);
            });
            
            $scope.showHideMoreText = function (indx) {
                if (indx == $scope.moreLess[indx]) {
                    $scope.moreLess[indx] = null;
                } else {
                    $scope.moreLess[indx] = indx;
                }
                
            };
            var setNoteWidgetHeight = function () {
//                var pinContentHeight = 300;
                
                if(window.innerWidth>991){
                    var pinContentHeight=$('.pin-cntnt').css('height');
//                    var pinContentHeight = 300;
                    if(pinContentHeight!==undefined){
                    var numb = pinContentHeight.match(/\d/g);
                    numb = numb.join("");
                    var pinContentHeight=numb;
                    }
                } else{
                     var pinContentHeight = 300;
                }
                $('.note-col').css({'height': pinContentHeight});
//                $('.note-content').css({'height': (pinContentHeight - 35 - 67)});
                $('.note-content').css({'height': (pinContentHeight - 35 - 60 - 13)});
            };
            angular.element($window).bind('resize', function () {
                setNoteWidgetHeight();
            })
            $timeout(function () {
                setNoteWidgetHeight();
            }, 1000)
            $scope.checkHeight = function (indx) {
//                var heig = $(".right-border" + indx).prop("scrollHeight");
//                if (heig > 60) {
//                    return '';
//                } else {
//                    return 'dispNone';
//                }
            	return '';
            };
            $scope.scrollDown = function () {
//                $('.note-content').animate({
//                    scrollTop: $('.note-content').offset().top
//                }, 500);
                var currentScroll = $('.note-content').scrollTop();
                $('.note-content').animate({
                    scrollTop: currentScroll + 200
                }, 300);
            };
            $scope.scrollUp = function () {
//                $('.note-content').animate({
//                    scrollTop: 0
//                }, 300);
                var currentScroll = $('.note-content').scrollTop();
                $('.note-content').animate({
                    scrollTop: currentScroll - 200
                }, 300);
            };

            $scope.openShowAllNotesPopup = function () {
                var modal = allNotesModal.show();
            };
        })
        .controller('WidgetNoteServiceInfoController', function ($scope, $window, $timeout, $http) {
            var totalHeight;  
            $scope.moreLess= [];
            
            $scope.showHideMoreText = function (indx) {
                if (indx == $scope.moreLess[indx]) {
                    $scope.moreLess[indx] = null;
                } else {
                    $scope.moreLess[indx] = indx;
                }
                
            };
            var setNoteWidgetHeight = function () {
                var pinContentHeight = 300;
                $('.note-col').css({'height': pinContentHeight});
                $('.note-content').css({'height': (pinContentHeight - 35 - 60)});
            };
            
            angular.element($window).bind('resize', function () {
                setNoteWidgetHeight();
            })
            $timeout(function () {
                setNoteWidgetHeight();
            }, 1000)
            $scope.checkHeight = function (indx) {
//                var heig = $(".right-border" + indx).prop("scrollHeight");
//                if (heig > 60) {
//                    return '';
//                } else {
//                    return 'dispNone';
//                }
            	return '';
            };
            $scope.scrollDown = function () {
                var currentScroll = $('.note-content').scrollTop();
                $('.note-content').animate({
                    scrollTop: currentScroll + 200
                }, 300);
            };
            $scope.scrollUp = function () {
                var currentScroll = $('.note-content').scrollTop();
                $('.note-content').animate({
                    scrollTop: currentScroll - 200
                }, 300);
            };
        })
        .controller('WidgetAutomatedCalendarCtrl', function ($scope, $rootScope, $http, Config, sharedData) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
        })
        .controller('SearchContentFilterCtrl', function ($scope, $rootScope, $timeout, $window, apiSearch) {


            $scope.searchTypes = [];
            /*
             $scope.selectedType = {
             title: 'All',
             val: 'all',
             count: $scope.countData.total
             };
             */
            //$scope.searchTypes.push( angular.copy($scope.selectedType));
            $scope.searchTypes.push({
                title: 'All',
                val: 'all',
                count: $scope.countData.total
            });
            $scope.setSearchType = function (obj) {
                $scope.selectedType = angular.copy(obj);
            };
            if ($scope.selectedBtn == 'all') {
                $scope.setSearchType({title: 'All', val: 'all', count: $scope.countData.total});
            }
            angular.forEach($rootScope.searchableBlocks, function (val, key) {
                //generate searchable types array
                var tempCount = 0;
                switch (val.toLowerCase())
                {
                    case 'article':
                        tempCount = $scope.countData.article;
                        break;
                    case 'document':
                        tempCount = $scope.countData.document;
                        break;
                    case 'quickpost':
                        tempCount = $scope.countData.quickpost;
                        break;
                    case 'wiki':
                        tempCount = $scope.countData.wiki;
                        break;
                    case 'event':
                        tempCount = $scope.countData.event;
                        break;
                    case 'community':
                        tempCount = $scope.countData.community;
                        break;
                    case 'people':
                        tempCount = $scope.countData.people;
                        break;
                }
                var obj = {
                    title: val,
                    val: val.toLowerCase(),
                    count: tempCount
                };
                $scope.searchTypes.push(obj);
                if ($scope.selectedBtn == obj.val) {
                    $scope.setSearchType(obj);
                }
            });
            $scope.$watch('selectedType', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $rootScope.$broadcast('search.type.selected', $scope.selectedType);
                }
            });
            /*total: 33,
             totalArticles: 26,
             totalDocuments: 0,
             totalQuickposts: 6,
             totalWikis: 1,
             totalEvents: 0,
             totalCommunities: 0,
             totalMembers: 0,
             */
        })
        .controller('WidgetZenmodeCtrl', function ($scope, $rootScope, $compile, $http, Config, apiFeedData, apiGoogleDrive, selectImageModal, apiMediaUpload, sharedData) {

            $scope.topImgUploader = new apiMediaUpload();
            $scope.btmImgUploader = new apiMediaUpload();

            $scope.getZenImgHeight = function () {
                var h = sharedData.getHeightOfAspectRatio(1600, 600);
                return h;
            };

            $scope.onTopImgSelect = function ($files) {
                //image object to get the width and height of selected image
                var image = new Image();
                $files.forEach(function (entry, key) {
                    var f = entry;
                    var FR = new FileReader();
                    FR.onload = function (e) {
                        //filepath = e.target.result
                        image.src = e.target.result;
                        image.onload = function () {
                            var img_width = this.width;
                            var img_height = this.height;
                            if (img_width < 1600 || img_height < 600)
                            {
                                alert("Plese select image of minimum 1600 X 600 dimension");
                            }
                            else
                            {
                                //var uploader = new apiMediaUpload();
                                $scope.topImgUploader.uploadImages($files, null).then(function (data) {
                                    if (data.status == 'success') {
                                        /*$scope.zenImages.top = {
                                         path: data.data[0].url,
                                         fileName: data.data[0].fileName,
                                         caption: '',
                                         thumbUrl: data.data[0].thumbUrl,
                                         mediumUrl: data.data[0].mediumUrl,
                                         largeUrl: data.data[0].largeUrl,
                                         thumbGalleryUrl: data.data[0].thumbGalleryUrl
                                         };*/
                                        $scope.zenImages.top.data = data.data[0];
                                    }// if successfully uploaded
                                    else if (data.status == 'cancelled') {
                                    }//if cancelled by user
                                }, function (err) {
                                }, function (data) {
                                });


                            }//else
                        };
                    };
                    FR.readAsDataURL(f);
                });//for each
            };
            $scope.onBottomImgSelect = function ($files) {
                //image object to get the width and height of selected image
                var image = new Image();
                $files.forEach(function (entry, key) {
                    var f = entry;
                    var FR = new FileReader();
                    FR.onload = function (e) {
                        //filepath = e.target.result
                        image.src = e.target.result;
                        image.onload = function () {
                            var img_width = this.width;
                            var img_height = this.height;
                            if (img_width < 1600 || img_height < 600)
                            {
                                alert("Plese select image of minimum 1600 X 600 dimension");
                            }
                            else
                            {
                                //var uploader = new apiMediaUpload();
                                $scope.btmImgUploader.uploadImages($files, null).then(function (data) {
                                    if (data.status == 'success') {
                                        /*$scope.zenImages.bottom = {
                                         path: data.data[0].url,
                                         fileName: data.data[0].fileName,
                                         caption: '',
                                         thumbUrl: data.data[0].thumbUrl,
                                         mediumUrl: data.data[0].mediumUrl,
                                         largeUrl: data.data[0].largeUrl,
                                         thumbGalleryUrl: data.data[0].thumbGalleryUrl
                                         };*/
                                        $scope.zenImages.bottom.data = data.data[0];
                                    }// if successfully uploaded
                                    else if (data.status == 'cancelled') {
                                    }//if cancelled by user
                                }, function (err) {
                                }, function (data) {
                                });
                            }//else
                        };
                    };
                    FR.readAsDataURL(f);
                });//for each
            };

            $scope.$on("$destroy", function () {
                $scope.topImgUploader.cancel();
                $scope.btmImgUploader.cancel();
            });
        })
        .controller('WidgetMyFollowers', function ($scope, $rootScope, $http, Config, sharedData, followerModal) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.$on("$destroy", function () {

            });

            $scope.showFollower = function (data) {
                var modal = followerModal.show(null, {data: data});
            }

        })
        .controller('WidgetUserInfo', function ($scope, $rootScope, $http, Config, sharedData) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.$on("$destroy", function () {

            });
        })
        .controller('WidgetPollCtrl', function ($scope, $rootScope, $http, Config, sharedData, addWidgetModal, apiWidget, $state, notifyModal, $window, uiModals) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };

            $scope.viewResult = false;

            $scope.editWidget = function (wgt) {
                var modal = addWidgetModal.show({action: 'edit', type: 'widget', data: wgt});
            };

            $scope.isSelected = function (answerId) {
                $scope.option = answerId;
            };

            $scope.viewQuestion = function () {
                $scope.viewResult = false;
            };

            $scope.viewResults = function () {
                $scope.viewResult = true;
            };

            $scope.vote = function (questionId) {
                var postData = {
                    questionId: questionId,
                    answerId: $scope.option
                };
                apiWidget.voteQuestion(postData).then(function (data) {
                    if (typeof (data.code) != 'undefined' && data.code != null) {
                        var message = $filter('translate')(data.message);
                        var title = $filter('translate')('Error');
                        uiModals.alertModal(null, title, message);
                    } else {
                        $state.reload();
                        notifyModal.showTranslated('voted_question_sucess', 'success', null);
                    }
                }, function (err) {
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            };

            $scope.download = function (widgetUid) {
                apiWidget.extractVotedQuestion(widgetUid).then(function (data) {
                    if (typeof (data.code) != 'undefined' && data.code != null) {
                        var message = $filter('translate')(data.message);
                        var title = $filter('translate')('Error');
                        uiModals.alertModal(null, title, message);
                    } else {
                        $window.location.href = data;
                    }
                }, function (err) {
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            };
        })
        .controller('BirthdayWidgetCtrl', function ($scope, $rootScope, $http, Config, sharedData, birthdayModal, addWidgetModal) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.$on("$destroy", function () {

            });

            $scope.showFullBirthdays = function (data) {
                var modal = birthdayModal.show(null, {data: data});
            }

            $scope.enableTootip = false; // for enable toottip   
            $scope.getConfig = function () {
                var config = sharedData.findConfig("PROFILE_TOOTIP");
                if (typeof (config.name) != 'undefined') {
                    $scope.enableTootip = config.value ? true : false;
                }
            }
            $scope.getConfig();

            //edit widget
            $scope.editWidget = function (wgt) {
                var modal = addWidgetModal.show({action: 'edit', type: 'widget', data: wgt});
            };

        })
        .controller('FoodTruckCtrl', function ($scope, apiWidget) {
            $scope.data = $scope.$parent.ngDialogData.data;
            if (typeof ($scope.data) != 'undefined' && $scope.data != null) {
                apiWidget.getByUid($scope.data).then(function (data) {
                    $scope.widget = data;
                }, function (err) {
                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                });
            }
        })
        .controller('WidgetCountdownClockController', function ($scope,$filter,addWidgetModal) {
            $scope.isWidgetOpen = true;
            $scope.widgetToggle = function () {
                $scope.isWidgetOpen = !$scope.isWidgetOpen;
            };
            $scope.editWidget = function (wgt) {
                var modal = addWidgetModal.show({action: 'edit', type: 'widget', data: wgt});
            };
            
            $scope.endCountdown = false;
            this.$onInit = function() {
                $scope.widget = this.widget;
                $scope.endCountdown = false;
                function getTimeRemaining(endtime) {
	              	var t = Date.parse(endtime) - Date.parse(new Date());
	              	var seconds = Math.floor((t / 1000) % 60);
	              	var minutes = Math.floor((t / 1000 / 60) % 60);
	              	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	              	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	              	return {
	              		'total': t,
	              	    'days': days,
	              	    'hours': hours,
	              	    'minutes': minutes,
	              	    'seconds': seconds
	              	};
                }

                function initializeClock(id, endtime) {
                	var clock = document.getElementById(id);
	              	var daysSpan = clock.querySelector('.days');
	              	var hoursSpan = clock.querySelector('.hours');
	              	var minutesSpan = clock.querySelector('.minutes');
	              	var secondsSpan = clock.querySelector('.seconds');
	
	              	function updateClock() {
	              		var t = getTimeRemaining(endtime);
	
	              	    daysSpan.innerHTML = t.days;
	              	    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
	              	    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
	              	    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
	
	              	    if (t.total <= 0) {
	              	    	$scope.endCountdown = true;
	              	    	clearInterval(timeinterval);
	              	    }
	              	}
	
	              	updateClock();
	              	var timeinterval = setInterval(updateClock, 1000);
                }
                
                var deadline =  $filter('newDate')($scope.widget.countdownClockData.endDate);
                initializeClock('clockdiv', deadline);
            };
        })
        .controller('BikeBookingWidgetCtrl', function ($scope,$filter,$state,dateTimeService,notifyModal,confirmModal,uiModals,apiWidget) {
            $scope.widgetUid = $scope.$parent.ngDialogData.data;
            
            $scope.publishDates = {
                    startDt: null,
                    startTime: null,
                    endDt: null,
                    endTime: null
            };

            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
            
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
                    if (publishStartDateTime <= currentDateTime) {
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
            
            // save
            $scope.createBooking = function () {
                var errorData = {
                    false: false,
                    message: ''
                };

                var postdata = {
                		widgetUid : $scope.widgetUid
                };
                if(!$filter('isValidName')($scope.firstName)){
                    errorData.flag = true;
                    errorData.message = "Enter first name.";
                }else{
                    postdata.firstName = $scope.firstName;
                }
                
                if(!$filter('isValidName')($scope.lastName)){
                    errorData.flag = true;
                    errorData.message = "Enter last name.";
                }else{
                    postdata.lastName = $scope.lastName;
                }

                if(!$filter('isValidEmail')($scope.email)){
                	errorData.flag = true;
                	errorData.message = "enter_valid_email";
                }else{
                	postdata.email = $scope.email;
                }
                
                var publishTiming = $scope.getPublishStartEndDate($scope.publishDates.startDt, $scope.publishDates.startTime, $scope.publishDates.endDt, $scope.publishDates.endTime);
                if (publishTiming.error.flag) {
                    errorData.flag = true;
                    errorData.message = publishTiming.error.message;
                }

                if (publishTiming.startDtTime) {
                    postdata.fromDate = publishTiming.startDtTime;
                }

                if (publishTiming.endDtTime) {
                    postdata.toDate = publishTiming.endDtTime;
                }

                if (!errorData.flag) {
                    var modal = confirmModal.showTranslated($scope, {title: "Confirm", message: "Book a bike confirm"});
                    modal.closePromise.then(function (data) {
                        if (data.value == 'ok') {
                        	apiWidget.addBikeBooking(postdata).then(function (data) {
                        		if (typeof (data.code) != 'undefined' && data.code != null) {
                        			 var message = $filter('translate')(data.message);
                                     var title = $filter('translate')('Error');
                                     uiModals.alertModal(null, title, message);
                        		}else{
	                                $scope.closeThisDialog({flag: 'ok', data: data});
	                                notifyModal.showTranslated('Booked a bike success', 'success', null);
	                                $state.reload();
                        		}
                            }, function (err) {
                                notifyModal.showTranslated('something_went_wrong', 'error', null);
                            });
                        }
                    });
                } else {
                    notifyModal.showTranslated(errorData.message, 'error', null);
                }
            };
        });

