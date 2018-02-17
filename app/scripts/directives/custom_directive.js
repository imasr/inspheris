'use strict';

angular.module('inspherisProjectApp')
        .directive('back', ['$window', function ($window) {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        elem.bind('click', function () {
                            $window.history.back();
                        });
                    }
                };
            }])
        .directive('targetBlank', function () {
            //apply target="_blank" attribute to html element, if given condition is true
            //usage: target-blank="{{openInNewTab}}"
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //var href = element.href;
                    var flag = attrs["targetBlank"];
                    if (flag && flag === 'true') {
                        element.attr("target", "_blank");
                    }
                    else {
                        element.attr("target", "_self");
                    }
                }
            };
        })
        .directive("tagInput", function() {
           return {
              restrict: "A",
              link: function(scope, element, attrs) {
                scope.inputWidth = 20;
                //watch for changes in text field
                scope.$watch(attrs.ngModel, function(value) {
                  if (value != undefined) {
                    var tempEl = $("<span>" + value + "</span>").appendTo("body");
                    scope.inputWidth = tempEl.width() + 5;
                    tempEl.remove();
                  }
                });
                element.bind('keydown',function(e){
                  if(e.which==9){
                    e.preventDefault();
                  }
                });
                element.bind("keyup", function(e) {
                  var key=e.which;
                  if (key== 9 || key==13 || key==32) {
                    e.preventDefault();
                    scope.$apply(attrs.newTag);
                  }
                });
              }
            };
        })
        .directive('openFileExplorer', function () {
            //this directive is used to open file in Windows File Explorer
            //usage: <a open-file-explorer="\\192.168.1.69\Users\Public"></href>
            //open-file-explorer="file:///C:/Users/Public/Pictures/Sample%20Pictures"
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //var href = element.href;
                    var url = attrs["openFileExplorer"];
                    element.attr("href", "javascript: void(0)");
                    element.bind('click', function (e) {
                        try {
                            var activexShell = new ActiveXObject("Shell.Application");
                            activexShell.ShellExecute(url, '', "", "open", "1");
                        }
                        catch (e) {
                            alert("Exception " + e.name + ': ' + e.message + "\n \n" + "Note: Make sure you are using Internet Explorer with proper security setting.");
                        }
                    });
                }
            };
        })
        .directive('rss', ['$compile', function ($compile) {
                return {
                    restrict: 'A',
                    scope: {
                        content: '@',
                        title: '@'
                    },
                    link: function (scope, element, attrs) {
                        var feedcontainer = $(element.find('#loadFeed'));
                        var loadMoreButton = $(element.find('#loadMore'));
                        var minusButton = $(element.find('#misnus'));
                        var lastLenght = 0;
                        var source = scope.content.split('---');
                        var link = source[0];
                        var numberOfFeeds = parseInt(source[1]);
                        var fixNumber = numberOfFeeds;
                        var rss2jsonURL = 'https://api.rss2json.com/v1/api.json?api_key=xyqyakb12kyn5smxeona231pc7qj8ie6gsbzlqbo';

                        function getFeed(numberOfFeed) {
                            $.get(rss2jsonURL + '&rss_url=' + link + '&count=' + numberOfFeeds, function (data) {
                                if (data.items && data.items.length > 0) {
                                    var thefeeds = data.items;
                                    var i = 0;
                                    if (numberOfFeeds != fixNumber) {
                                        i = numberOfFeeds - fixNumber;
                                    }
                                    if (numberOfFeeds == fixNumber) {
                                        minusButton.hide();
                                    }
                                    if (thefeeds.length > 0) {
                                        if (lastLenght == thefeeds.length) {
                                            loadMoreButton.hide();
                                            numberOfFeeds -= fixNumber;
                                        } else {
                                            loadMoreButton.show();
                                            for (i; i < thefeeds.length; i++) {
                                                feedcontainer.append("<li class='rss-list rss-data-" + i + "'><a target='_blank' href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</a>" +
                                                        "<p>" +
                                                        "<a class='rss-link'  style='font-size: 0.813em;color: #059bcd;' target='_blank' href='" + thefeeds[i].link + "'>Consulter l'article</a></p></li>");
                                            }
                                        }
                                        lastLenght = thefeeds.length;
                                    } else {
                                        loadMoreButton.hide();
                                    }
                                }
                            });
                        }

                        getFeed(numberOfFeeds);
                        loadMoreButton.append($compile("</br><b><a  ng-click='loadMore()' translate class='more-rss'>More</a></b>")(scope));
                        minusButton.append($compile("</br><b><a  ng-click='reduceFeed()' translate class='more-rss'>Reduce</a></b>")(scope));
                        scope.loadMore = function () {
                            numberOfFeeds += fixNumber;
                            getFeed(numberOfFeeds);
                            minusButton.show();
                        };
                        scope.reduceFeed = function () {
                            loadMoreButton.show();
                            lastLenght = 0;
                            var i = numberOfFeeds;
                            var limit = numberOfFeeds - fixNumber;
                            if (numberOfFeeds > fixNumber) {
                                for (i; i >= limit; i--) {
                                    var removeEle = $(element.find('.rss-data-' + i));
                                    removeEle.remove();
                                }
                                numberOfFeeds -= fixNumber;
                            }
                            if (numberOfFeeds == fixNumber) {
                                minusButton.hide();
                            }

                        };
                    }
                };
            }])
        .directive('locationReload', ['$state', function ($state) {
                //apply target="_blank" attribute to html element, if given condition is true
                //usage: target-blank="{{openInNewTab}}"
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        element.bind('click', function (e) {
                            location.reload();
                        });
                    }
                };
            }])
        .directive('blockRightClick', function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.bind('contextmenu', function (e) {
                        return false;
                    });
                    elem.bind('mousedown', function (e) {
                        return false;
                    });
                }
            };
        })
        .directive('preventDefault', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('mouseenter', function (e) {
                        element.attr('title', "");
                        e.preventDefault();
                    });
                }
            };
        })
        .directive('noCacheSrc', function () {
            return {
                priority: 99,
                link: function (scope, element, attrs) {
                    attrs.$observe('noCacheSrc', function (noCacheSrc) {
                    	if(noCacheSrc.indexOf("data:image") === -1){
                    		noCacheSrc += '?t=' + (new Date()).getTime();
                    	}
                        attrs.$set('src', noCacheSrc);
                    });
                }
            }
        })
         .directive('noCacheBackgroundImage', function () {
            return {
            	priority: 100,
                link: function (scope, element, attrs) {
                    attrs.$observe('noCacheBackgroundImage', function (url) {
                    	url += '?t=' + (new Date()).getTime();
                    	element.css('background-image', 'url(' + url +')');
                    });
                }
            }
        })
        .directive("imgGallery", ['$window', function ($window) {
                return {
                    restrict: 'EA',
                    transclude: false,
                    scope: {
                        feedthumb: '@',
                        datalist: '=',
                        showthumbcnt: '@',
                        gallerytype: '@gallerytype',
                        other: '='
                    },
                    replace: true,
                    templateUrl: '../app/views/blocks/generic_gallery.tpl.html',
                    controller: ["$scope", function ($scope) {
                            $scope.moreTextCss = {};
                            $scope.thumbCss = 'feedthumb_90';
                            $scope.cushtml = '';
                            if ($scope.datalist != null) {
                                if ($scope.datalist.length > parseInt($scope.showthumbcnt)) {
                                    $scope.count = new Array(parseInt($scope.showthumbcnt));
                                }
                                else {
                                    $scope.count = new Array($scope.datalist.length);
                                }
                            }

                            $scope.feedthumb = 'feedthumb_90';
                        }],
                    link: function (scope, element, attrs) {
                        scope.getThumbSize = function () {
                            var elementWidth = parseInt(element.width());
                            var thumbsize = 50;
                            if (elementWidth <= 200) {
                                thumbsize = 70;
                            }
                            else {
                                thumbsize = parseInt(parseInt(element.width()) / parseInt(scope.showthumbcnt));
                                if (thumbsize > 150) {
                                    thumbsize = 150;
                                }
                            }
                            return thumbsize;
                        };
                        scope.getSquareSize = function () {
                            thumbsize = 100 / scope.showthumbcnt;
                            return thumbsize;
                        };
                        var thumbsize = scope.getThumbSize();
                        scope.thumbCss = {width: thumbsize + 'px', height: thumbsize + 'px'};

                        var squareSize = scope.getSquareSize();
                        scope.squareCss = {'width': squareSize + "%", 'padding-bottom': squareSize + "%"};

                        angular.element($window).bind('resize', function () {
                            var thumbsize = scope.getThumbSize();
                            //$scope.thumbCss = {width: thumbsize+'px', height: thumbsize+'px'};
                            scope.thumbCss = {width: '100%', height: '100%', float: 'left'};
                            scope.moreTextCss = {'line-height': thumbsize + 'px'};
                        });
                    }
                };
            }])
        .directive('slider', ['$timeout', '$rootScope', '$filter', 'apiMediaManager', function ( timer, $rootScope, $filter, apiMediaManager) {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        fileslist: '=',
                        gallerytype: '=',
                        selectedindex: '=',
                        update:'&',
                        other: '=',
                        click: "&",
                        close:"&"
                    },
                    templateUrl: '../app/views/blocks/gallery_slider.tpl.html',
                    link: function (scope, element, attrs) {
//                        if(scope.fileslist[0].videoUrl){
//                            scope.fileslist.unshift({
//                                videoUrl:'https://www.w3schools.com/html/mov_bbb.mp4',
//                                thumbUrl:'https://tpc.googlesyndication.com/simgad/17800189131433684035'
//                            })
//                        }
                        scope.closePopup=function(){
                            scope.close();
                        }
                        scope.showgallery=true;
                        scope.showgal=function(index){
                            if(scope.showgallery){
                                scope.showgallery=false;
                                $(".bx-controls-direction").find("a").css({"display": "none"});
                            }else{
                                scope.showgallery=true;
                                $(".bx-controls-direction").find("a").css({"display": "block"});
                            }
                            //console.log(index)
                        }
                        scope.videoTypeFlag = function (url) {
                            if (url.substring(0, 4) == 'http') {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        //element.css("background-color", "red");
                        var windowWidth = window.innerWidth;
                        var windowHeight = window.innerHeight;
                        var elementWidth = element.width();
                        var thumbsize = 100;
                        scope.currentIndex = 0;
                        if (scope.gallerytype == 'documents') {
                            var thumbsize = 72;
                        }
                        var sliderWidth = 0;
                        if (windowWidth > windowHeight) {
                            sliderWidth = windowHeight
                        }
                        else {
                            sliderWidth = windowWidth;
                        }


                        if (windowWidth <= 500) {
                            thumbsize = 50;
                        }
                        var carousel = null;
                        var slider = null;
                        scope.filterPopupData = [];
                        scope.filterPopupData.fileName = '';
                        scope.filterPopupData.videoName = '';
                        scope.filterPopupData.title = '';

                        scope.filterVideos = function(p){      
                            if (scope.filterPopupData.videoName) {
                                try{
                                    if(p.videoName)
                                    return p.videoName.indexOf(scope.filterPopupData.videoName) !== -1;
                                }
                                catch(er){}
                                return false;
                                
                            }
                            else {
                                return true;
                            }
                        };
                        
                        scope.downloadAllImages = function(){

                            try{
                                if(scope.fileslist && scope.fileslist.length > 0){
                                    var link = document.createElement('a');
        
                                    link.setAttribute('download', null);
                                    link.style.display = 'none';
        
                                    document.body.appendChild(link);
                                    if(scope.fileslist.length == 1){ //If single file then-> just download that file
                                        var path = "/api/mediamanager?file=attachments/" + scope.fileslist[0].uid + "/" + $scope.allFilesList[0].fileName;
                                        link.setAttribute('href', path);
                                        link.click();
                                    }else{ //if multiple file -> compress as a zip and download.
                                        var fileUids= [];
                                            var fileName = 'Images.zip';
                                            for (var i in scope.fileslist) {
                                                fileUids.push(scope.fileslist[i].uid);
                                                }
                                            var postData = {
                                                fileUids: fileUids,
                                                fileName: fileName
                                            };
        
                                                apiMediaManager.downloadAllFilesAsAZip(postData).then(function(data){
                                                link.setAttribute('href', data); 
                                                link.click();
                                                }, function(err){
                                                    notifyModal.showTranslated('something_went_wrong', 'error', null);
                                            });
                                    }
                                    
                                    document.body.removeChild(link);
                                    }       
                            }
                            catch(er){alert(er);}     
                        };

                        
                        scope.downloadAllVideos = function(){
                            try{
                                if(scope.fileslist && scope.fileslist.length > 0){
                                var link = document.createElement('a');
    
                                link.setAttribute('download', null);
                                link.style.display = 'none';
    
                                document.body.appendChild(link);
                                if(scope.fileslist.length == 1){ //If single file then-> just download that file
                                    var path = "/api/mediamanager?file=attachments/" + scope.fileslist[0].uid + "/" + $scope.allFilesList[0].videoName;
                                    link.setAttribute('href', path);
                                    link.click();
                                }else{ //if multiple file -> compress as a zip and download.
                                    var fileUids= [];
                                        var fileName = 'Videos.zip';
                                        for (var i in scope.fileslist) {
                                            fileUids.push(scope.fileslist[i].uid);
                                            }
                                        var postData = {
                                            fileUids: fileUids,
                                            fileName: fileName
                                        };

                                        //console.log('postData: ',postData);
    
                                            apiMediaManager.downloadAllFilesAsAZip(postData).then(function(data){
                                            link.setAttribute('href', data); 
                                            link.click();
                                            }, function(err){
                                                notifyModal.showTranslated('something_went_wrong', 'error', null);
                                        });
                                }
                                
                                document.body.removeChild(link);
                                }      }
                            catch(er){}      
                        };

                        var applySlider = function () {
                            slider = jQuery('#bx-slider').bxSlider({
                                mode: 'fade',
                                slideWidth: windowHeight,
                                pager: false,
                                adaptiveHeight: true,
                                onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                                    if (scope.fileslist.length > 1 && 'documents' == scope.gallerytype) {
                                        pdfViewerLoader(scope.fileslist[newIndex].pdfUrl, newIndex);
                                    }
                                },
                                onSliderLoad: function () {
                                    if (scope.fileslist.length == 1 && 'documents' == scope.gallerytype && scope.fileslist[0].isInternal) {
                                        scope.currentIndex = 0;
                                        if('pdf' == $filter('getTypeByFileName')(scope.fileslist[0].url)
                                        		|| 'ppt' == $filter('getTypeByFileName')(scope.fileslist[0].url)
                                        		|| 'doc' == $filter('getTypeByFileName')(scope.fileslist[0].url)
                                        		|| 'xls' == $filter('getTypeByFileName')(scope.fileslist[0].url)){
                                        	pdfViewerLoader(scope.fileslist[0].pdfUrl, 0);
                                        }
                                    }
                                    if (scope.fileslist.length > 1 && 'documents' == scope.gallerytype && scope.fileslist[scope.selectedindex].isInternal) {
                                    	if(scope.selectedindex > 0 || ('pdf' == $filter('getTypeByFileName')(scope.fileslist[scope.selectedindex].url)
                                    			|| 'ppt' == $filter('getTypeByFileName')(scope.fileslist[scope.selectedindex].url)
                                    			|| 'doc' == $filter('getTypeByFileName')(scope.fileslist[scope.selectedindex].url)
                                    			|| 'xls' == $filter('getTypeByFileName')(scope.fileslist[scope.selectedindex].url))){
                                    		pdfViewerLoader(scope.fileslist[scope.selectedindex].pdfUrl, scope.selectedindex);
                                    	}
                                    }
                                },
                                onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                                    scope.currentIndex = newIndex;
                                }
                            });
                            var bxSliderOpns = {
                                minSlides: 1,
                                maxSlides: 4,
                                slideWidth: thumbsize,
                                slideMargin: 10,
                                infiniteLoop: false,
                                pager: false
                            };
                            if (scope.gallerytype == "videos") {
                                bxSliderOpns.video = true;
                                bxSliderOpns.useCSS = false;
                            }
                            carousel = jQuery('#bxthumb-slider').bxSlider(bxSliderOpns);
                        };

                        //Set hidden element if gallery type is 'document'
                        if ('documents' == scope.gallerytype) {
                            jQuery(element).hide();
                        }
                        setTimeout(function () {
                            applySlider();
                            if ('documents' == scope.gallerytype) {
                                jQuery(element).show();
                            }
                            if (scope.selectedindex != 0) {
                                slider.goToSlide(scope.selectedindex);
                            } else if ('documents' == scope.gallerytype) {
                                slider.redrawSlider();
                            }
                        }, 200);


                        $rootScope.$on('redrawSlider', function (evt, data) {
                            timer(function () {
                                if (slider && carousel) {
                                    slider.redrawSlider();
                                    carousel.redrawSlider();
                                }
                            });
                        });
                        $rootScope.$on('reloadSlider', function (evt, data) {
                            timer(function () {
                                if (slider && carousel) {
                                    slider.reloadSlider();
                                    carousel.reloadSlider();
                                }
                            });
                        });

                        $rootScope.$on('file.edited', function (evt, data) {
                            var len = scope.fileslist.length;
                            for (var i = 0; i < len; i++) {
                                if (data.data.uid == scope.fileslist[i].uid) {
                                    scope.fileslist[i] = angular.copy(data.data);
                                    timer(function () {
                                        if (slider && carousel) {
                                            slider.reloadSlider();
                                            carousel.reloadSlider();
                                        }
                                    });
                                    break;
                                }
                            }//for
                        });
                        scope.clicked = function (position) {
                            scope.showgallery = true;
                            slider.goToSlide(position);
                            scope.currentIndex = position;

                            scope.selectedIndex=position;

                            scope.update({arg:position});
                            
                            timer(function () {
                                scope.scrollToPosition(position);
                            }, 1000);   
                                                 
                        }; 
                        
                        scope.scrollToPosition = function (position) {
                            try
                            {
                                var len = scope.fileslist.length;
                                var scrollto = 0;
                                var itemSize = 196;
                                var totalWidth = 1326;
                                
                                try{
                                    
                                    if($('ul.uploaded-list').length == 1){totalWidth = parseInt( $('ul.uploaded-list').css('width').replace('px'),10);}
                                    else{
                                        totalWidth = parseInt( $('ul.uploaded-list').eq(scope.currentIndex).css('width').replace('px',''),10);
                                    }
                                }
                                catch(er1){
                                    totalWidth = 1326;
                                    //console.log('er1: ',er1);
                                }
                                try{
                                    itemSize =parseInt($('ul.uploaded-list > li').first().css('width').replace('px',''), 10);
                                }
                                catch(er){itemSize = 190;}
                                
                                //if(totalItemsDisplayed < len && position > firstCenter){
                                    var extraspace = 0 ; //(20 * totalItemsDisplayed)/position;
                                    var movePosition = 0;

                                    if($('ul.uploaded-list').length == 1){
                                        movePosition = $('ul.uploaded-list').find('li').eq(position).offset().left;
                                        movePosition = (movePosition - (totalWidth / 2)) + (itemSize / 2);
                                        movePosition = $('ul.uploaded-list').scrollLeft() + movePosition;
                                        $('ul.uploaded-list').animate({scrollLeft:movePosition}, 100);
                                    }
                                    else{
                                        movePosition = $('ul.uploaded-list').eq(scope.currentIndex).find('li').eq(position).offset().left;
                                        movePosition = (movePosition - (totalWidth / 2)) + (itemSize / 2) - 20;
                                        movePosition = $('ul.uploaded-list').eq(scope.currentIndex).scrollLeft() + movePosition;
                                        $('ul.uploaded-list').eq(scope.currentIndex).animate({scrollLeft:movePosition}, 100);
                                    }
                                //}
                            }
                            catch(er){alert(er);}
                        };

                        

                        scope.$on('$destroy', function () {
                            scope.fileslist = [];
                            slider = null;
                        });

                        scope.fullscreenImage=function (indx) {
                          var id='imagesId'+indx
                          var fullScreenObj = document.getElementById(id);
                          scope.fullScreenFunc(fullScreenObj);
                        }
                        scope.fullscreenImageSingle=function () {
                          var fullScreenObj1 = document.getElementById('imagesId');
                          scope.fullScreenFunc(fullScreenObj1);
                        }
                        scope.fullScreenFunc=function(obj){
                        	if (obj.requestFullscreen) {
                        		obj.requestFullscreen();
                        	}
                        	else if (obj.mozRequestFullScreen) {
                        		obj.mozRequestFullScreen();
                        	}
                        	else if (obj.webkitRequestFullScreen) {
                        		obj.webkitRequestFullScreen();
                        	}
                        }
                    }



                };
            }])
        /*
         .directive('ellipsis', ['$timeout', '$window', '$filter', function($timeout, $window, $filter) {
         return {
         restrict    : 'A',
         scope       : {
         ngBind              : '=',
         ellipsisAppend      : '@',
         ellipsisAppendClick : '&',
         ellipsisSymbol      : '@'
         },
         compile : function(elem, attr, linker) {
         return function(scope, element, attrs) {
         // Window Resize Variables
         attrs.lastWindowResizeTime = 0;
         attrs.lastWindowResizeWidth = 0;
         attrs.lastWindowResizeHeight = 0;
         attrs.lastWindowTimeoutEvent = null;
         // State Variables
         attrs.isTruncated = false;
         function buildEllipsis() {
         if (typeof(scope.ngBind) !== 'undefined') {
         var bindArray = scope.ngBind.split(" "),
         //var bindArray = scope.ngBind.split(/[ ,@.]+/g),
         i = 0,
         ellipsisSymbol = (typeof(attrs.ellipsisSymbol) !== 'undefined') ? attrs.ellipsisSymbol : '&hellip;',
         appendString = (typeof(scope.ellipsisAppend) !== 'undefined' && scope.ellipsisAppend !== '') ? ellipsisSymbol + '<span>' + scope.ellipsisAppend + '</span>' : ellipsisSymbol;
         attrs.isTruncated = false;
         element.html(scope.ngBind);

         // If text has overflow
         if (isOverflowed(element)) {
         jQuery(element[0]).dotdotdot();
         }
         }
         }
         function isOverflowed(thisElement) {
         return thisElement[0].scrollHeight > thisElement[0].clientHeight;
         }
         scope.$watch('ngBind', function () {
         buildEllipsis();
         });
         scope.$watch('ellipsisAppend', function () {
         buildEllipsis();
         });
         angular.element($window).bind('resize', function () {
         $timeout.cancel(attrs.lastWindowTimeoutEvent);
         attrs.lastWindowTimeoutEvent = $timeout(function() {
         if (attrs.lastWindowResizeWidth != window.innerWidth || attrs.lastWindowResizeHeight != window.innerHeight) {
         buildEllipsis();
         }
         attrs.lastWindowResizeWidth = window.innerWidth;
         attrs.lastWindowResizeHeight = window.innerHeight;
         }, 75);
         });
         };
         }
         };
         }])
         */
        .directive('ellipsis', ['$timeout', '$window', function ($timeout, $window) {

                return {
                    restrict: 'A',
                    scope: {
                        ngBind: '=',
                        ellipsisAppend: '@',
                        ellipsisAppendClick: '&',
                        ellipsisSymbol: '@'
                    },
                    compile: function (elem, attr, linker) {

                        return function (scope, element, attributes) {
                            /* Window Resize Variables */
                            attributes.lastWindowResizeTime = 0;
                            attributes.lastWindowResizeWidth = 0;
                            attributes.lastWindowResizeHeight = 0;
                            attributes.lastWindowTimeoutEvent = null;
                            /* State Variables */
                            attributes.isTruncated = false;

                            function buildEllipsis() {
                                if (scope.ngBind) {
                                    var bindArray = scope.ngBind.split(" "),
                                            i = 0,
                                            ellipsisSymbol = (typeof (attributes.ellipsisSymbol) !== 'undefined') ? attributes.ellipsisSymbol : '&hellip;',
                                            appendString = (typeof (scope.ellipsisAppend) !== 'undefined' && scope.ellipsisAppend !== '') ? ellipsisSymbol + '<span class="readmore">' + scope.ellipsisAppend + '</span>' : ellipsisSymbol;

                                    attributes.isTruncated = false;
                                    element.html(scope.ngBind);

                                    // If text has overflow
                                    if (isOverflowed(element)) {
                                        var bindArrayStartingLength = bindArray.length,
                                                initialMaxHeight = element[0].clientHeight;

                                        element.html(scope.ngBind + appendString);

                                        // Set complete text and remove one word at a time, until there is no overflow
                                        for (; i < bindArrayStartingLength; i++) {
                                            bindArray.pop();
                                            element.html(bindArray.join(" ") + appendString);

                                            if (element[0].scrollHeight < initialMaxHeight || isOverflowed(element) === false) {
                                                attributes.isTruncated = true;
                                                break;
                                            }
                                        }

                                        // If append string was passed and append click function included
                                        if (ellipsisSymbol != appendString && typeof (scope.ellipsisAppendClick) !== 'undefined' && scope.ellipsisAppendClick !== '') {
                                            element.find('span').bind("click", function (e) {
                                                scope.$apply(scope.ellipsisAppendClick);
                                            });
                                        }
                                    }
                                }
                            }

                            /**
                             * Test if element has overflow of text beyond height or max-height
                             *
                             * @param element (DOM object)
                             *
                             * @return bool
                             *
                             */
                            function isOverflowed(thisElement) {
                                return thisElement[0].scrollHeight > thisElement[0].clientHeight;
                            }

                            /**
                             * Watchers
                             */

                            /**
                             * Execute ellipsis truncate on ngBind update
                             */
                            scope.$watch('ngBind', function () {
                                $timeout(function () {
                                    buildEllipsis();
                                });
                            });

                            /**
                             * Execute ellipsis truncate on ngBind update
                             */
                            scope.$watch('ellipsisAppend', function () {
                                buildEllipsis();
                            });

                            /**
                             * When window width or height changes - re-init truncation
                             */

                            function onResize() {
                                $timeout.cancel(attributes.lastWindowTimeoutEvent);

                                attributes.lastWindowTimeoutEvent = $timeout(function () {
                                    if (attributes.lastWindowResizeWidth != window.innerWidth || attributes.lastWindowResizeHeight != window.innerHeight) {
                                        buildEllipsis();
                                    }

                                    attributes.lastWindowResizeWidth = window.innerWidth;
                                    attributes.lastWindowResizeHeight = window.innerHeight;
                                }, 75);
                            }

                            var $win = angular.element($window);
                            $win.bind('resize', onResize);

                            /**
                             * Clean up after ourselves
                             */
                            scope.$on('$destroy', function () {
                                $win.unbind('resize', onResize);
                            });


                        };
                    }
                };
            }])
        .directive('ngHtmlCompile', ['$compile', function ($compile) {
                //compiles and bind the provided html string to given element
                return {
                    restrict: 'A',
                    scope: {
                        str: "&ngHtmlCompile"
                    },
                    link: function (scope, element, attrs) {

                        element.html(scope.str);
                        $compile(element.contents())(scope);

                    }
                }
            }])
        .directive("stickyCover", function () {
            return {
                link: function ($scope, element, attrs) {
                    var top = parseFloat(attrs['sticky' + 'Top']);
                    var stOffset = parseFloat(attrs['sticky' + 'Offset']);

                    attrs.$observe('stickyTop', function () {
                        //observe if parameters has been changed
                        top = parseFloat(attrs['sticky' + 'Top']);
                    });
                    attrs.$observe('stickyOffset', function () {
                        //observe if parameters has been changed
                        stOffset = parseFloat(attrs['sticky' + 'Offset']);
                    });

                    function activate() {
                        var elementHeight = jQuery(element).css('height');
                        jQuery('.stickyhalf-child').css({
                            'position': 'fixed',
                            'max-width': '1200px',
                            'top': (top + 'px')
                        });
                        jQuery(element).css({
                            'display': 'block',
                            'height': elementHeight,
                            'width': '100%'
                        });
                        /*jQuery('.stickychild').css({
                         'padding-top': elementHeight
                         });*/

                    }
                    function deactivate() {
                        /*jQuery(element).css({
                         'position': 'relative',
                         'top': '0px'
                         });*/
                        /*jQuery('.stickychild').css({
                         'padding-top': '0px'
                         });*/
                        jQuery('.stickyhalf-child').removeAttr('style');
                        jQuery(element).removeAttr('style');
                    }

                    function onscroll() {
                        var offsetTop = window.pageYOffset || document.documentElement.scrollTop;
                        if (offsetTop > stOffset) {
                            //{left: 0px;
                            //margin: 0;
                            //position: fixed;
                            //transition: none;
                            //top: -100px;
                            //width: 1357px;}
                            /*jQuery('.stickyhalf').css({
                             'position': 'fixed',
                             'top': '-100px'
                             });*/
                            activate();
                        }
                        else if (offsetTop <= stOffset) {
                            /*jQuery('.stickyhalf').css({
                             'position': 'relative',
                             'top': '0px'
                             }); */
                            deactivate();
                        }
                    }

                    window.addEventListener('scroll', onscroll);

                    $scope.$on("$destroy", function () {
                        window.removeEventListener('scroll', onscroll, false);
                    });

                    window.scrollTo(0, 0);
                }
            };
        })
        /*
         .directive('activeLink', ['$location', function(location) {
         return {
         restrict: 'A',
         link: function(scope, element, attrs, controller) {
         var clazz = attrs.activeLink;
         var path = attrs.href;
         path = path.substring(1); //hack because path does not return including hashbang
         scope.location = location;
         scope.$watch('location.path()', function(newPath) {
         if (path === newPath) {
         element.addClass(clazz);
         } else {
         element.removeClass(clazz);
         }
         });
         }
         };
         }])
         */
        .directive('imgCropped', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    src: '@',
                    aspectratio: '@',
                    minwidth: '@',
                    minheight: '@',
                    truewidth: '@',
                    trueheight: '@',
                    selected: '&'
                },
                link: function (scope, element, attr) {
                    var myImg;
                    var clear = function () {
                        if (myImg) {
                            myImg.next().remove();
                            myImg.remove();
                            myImg = undefined;
                        }
                    };

                    scope.$watch('src', function (nv) {
                        clear();
                        var boundx, boundy, bounds;
                        //get the parent div width to pass as boxWidth
                        if (nv) {
                            element.after('<img />');
                            myImg = element.next();
                            myImg.attr('src', nv);

                            var selx = parseInt(scope.truewidth) / 2 - parseInt(scope.minwidth) / 2;
                            var sely = scope.trueheight / 2 - scope.minheight / 2;

                            var selx1 = selx + parseInt(scope.minwidth);
                            var sely1 = sely + parseInt(scope.minheight);

                            myImg.bind('load', function () {
                                var parentWidth = parseInt(jQuery(element).parent().css('width'));
                                jQuery(myImg).Jcrop({
                                    trackDocument: true,
                                    aspectRatio: scope.aspectratio,
                                    minSize: [scope.minwidth, scope.minheight],
                                    trueSize: [scope.truewidth, scope.trueheight],
                                    keySupport: false,
                                    allowSelect: false,
                                    boxWidth: parentWidth, //Maximum width you want for your bigger images
                                    onSelect: function (x) {
                                        //scope.$apply(function() {
                                        x.boundx = boundx;
                                        x.boundy = boundy;
                                        scope.selected({cords: x});
                                        //});
                                    },
                                    setSelect: [selx, sely, selx1, sely1],
                                    onChange: function (x) {
                                        //scope.$apply(function() {
                                        x.boundx = boundx;
                                        x.boundy = boundy;
                                        scope.selected({cords: x});
                                        //});
                                    }
                                },
                                function () {
                                    // Use the API to get the real image size
                                    bounds = this.getBounds();
                                    boundx = bounds[0];
                                    boundy = bounds[1];
                                }
                                );

                            });//imgload

                        }//if nv
                    });

                    scope.$on('$destroy', clear);
                }
            };
        })
        .directive('multiimgCropped', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    src: '@',
                    aspectratio: '@',
                    minwidth: '@',
                    minheight: '@',
                    truewidth: '@',
                    trueheight: '@',
                    moreoption: '@',
                    selected: '&'

                },
                link: function (scope, element, attr) {
                    var myImg;
                    element.backgroundColor = "red";
                    var clear = function () {
                        if (myImg) {
                            myImg.next().remove();
                            myImg.remove();
                            myImg = undefined;
                        }
                    };

                    scope.$watch('src', function (nv) {
                        clear();
                        var boundx, boundy, bounds;
                        if (nv) {
                            element.after('<img />');
                            myImg = element.next();
                            myImg.attr('src', nv);

                            var selx = parseInt(scope.truewidth) / 2 - parseInt(scope.minwidth) / 2;
                            var sely = scope.trueheight / 2 - scope.minheight / 2;

                            var selx1 = selx + parseInt(scope.minwidth);
                            var sely1 = sely + parseInt(scope.minheight);

                            myImg.bind('load', function () {
                                var parentWidth = parseInt(jQuery(element).parent().css('width'));

                                jQuery(myImg).Jcrop({
                                    trackDocument: true,
                                    aspectRatio: scope.aspectratio,
                                    minSize: [scope.minwidth, scope.minheight],
                                    trueSize: [scope.truewidth, scope.trueheight],
                                    keySupport: false,
                                    allowSelect: false,
                                    boxWidth: parentWidth, //Maximum width you want for your bigger images
                                    onSelect: function (x) {
                                        //scope.$apply(function() {
                                        x.boundx = boundx;
                                        x.boundy = boundy;
                                        scope.selected({cords: x, moreoption: scope.moreoption});
                                        //});
                                    },
                                    setSelect: [selx, sely, selx1, sely1],
                                    onChange: function (x) {
                                        //scope.$apply(function() {
                                        x.boundx = boundx;
                                        x.boundy = boundy;
                                        scope.selected({cords: x, moreoption: scope.moreoption});
                                        //});
                                    }
                                },
                                function () {
                                    // Use the API to get the real image size
                                    bounds = this.getBounds();
                                    boundx = bounds[0];
                                    boundy = bounds[1];
                                }
                                );
                            });//myimgload
                        }
                    });

                    scope.$on('$destroy', clear);
                }
            };
        })
        .directive('imagesManager', ["$document", "$timeout", function ($document, $timeout) {
                return{
                    restrict: 'E',
                    replace: true,
                    scope: {
                        src: '@',
                        mdfimgsrc: '@',
                        mdfimgposx: '@',
                        mdfimgposy: '@',
                        mdfbgcolor: '@',
                        mdfimgangle: '@',
                        truewidth: '@',
                        trueheight: '@',
                        imgwidth: '@',
                        imgheight: '@',
                        moreoption: '@',
                        movepos: '&',
                        resizable: '&',
                        rotateangle: '&',
                        backgroundcolor: '&'
                    },
                    templateUrl: '../app/views/popups/image_manager_custom.tpl.html',
                    link: function (scope, element, attr) {

                        //Selected element for container images
                        var containImgDiv = jQuery(element.find('div').first());
                        var chidrenDiv = jQuery(containImgDiv.find('div'));
                        var colorBox = jQuery(element.find('.color-box').first());
                        var rangerSlider = jQuery(element.find('.range'));

                        //Init default value
                        scope.customColor = 'rgba(0,0,0,1)';
                        scope.showCustom = false;
                        scope.isCenter = false;
                        scope.isTransform = false;

                        //variable for rotate
                        var roration = 0;
                        var translatesX = 0;
                        var translatesY = 0;

                        //count rotate times
                        var rotateRightTimes = 0;
                        var rotateLeftTimes = 4;

                        //function init data if modified images
                        scope.initData = function () {
                            if (scope.mdfimgsrc != '' && scope.mdfimgsrc != null) {
                                var image = new Image();
                                image.src = scope.mdfimgsrc;
                                var realImgWidth = scope.imgwidth;
                                var realImgHeight = scope.imgheight;
                                image.onload = function () {
                                    $timeout(function () {

                                        //convert Width and height if rotate img
                                        if (scope.mdfimgangle != null && scope.mdfimgangle != 0 && ((scope.mdfimgangle / 90) % 4) % 2 != 0) {
                                            var temp = image.width;
                                            image.width = image.height;
                                            image.height = temp;
                                        }
                                        chidrenDiv.css({
                                            width: image.width + "px",
                                            'max-width': scope.truewidth + "px",
                                            'max-height': scope.trueheight + "px"
                                        });
                                        //save size if no-edit
                                        scope.resizable({width: image.width, height: image.height, moreoption: scope.moreoption});
                                        chidrenDiv.css({
                                            left: scope.mdfimgposx + "%",
                                            top: scope.mdfimgposy + "%",
                                        });
                                        containImgDiv.css({
                                            backgroundColor: scope.mdfbgcolor
                                        });
                                        colorBox.css({
                                            backgroundColor: scope.mdfbgcolor,
                                        });
                                        scope.customColor = scope.mdfbgcolor;
                                        scope.imgwidth = image.width;
                                        scope.imgheight = image.height;

                                        //re-calculartor max-ranger
                                        scope.maxRanger = scope.maxSlider(scope.trueheight, scope.truewidth, scope.imgheight, scope.imgwidth);
                                        rangerSlider.prop({
                                            max: scope.maxRanger
                                        });
                                        scope.rangeValue = Math.round(scope.imgwidth * scope.maxRanger / scope.truewidth);

                                        var posX = chidrenDiv.position().left;
                                        var posY = chidrenDiv.position().top;
                                        //save position and background color
                                        scope.movepos({left: posX, top: posY, moreoption: scope.moreoption});
                                        scope.backgroundcolor({color: scope.mdfbgcolor, moreoption: scope.moreoption});

                                        //Rotate image
                                        if (scope.mdfimgangle != null && scope.mdfimgangle != '' && (scope.mdfimgangle != 0 || scope.mdfimgangle != "0")) {
                                            var timesRotate = (scope.mdfimgangle / 90) % 4;

                                            if (timesRotate < 0) {
                                                rotateLeftTimes = 4 + timesRotate;
                                                rotateRightTimes = rotateLeftTimes;
                                            } else {
                                                rotateRightTimes = timesRotate;
                                                rotateLeftTimes = rotateRightTimes;
                                            }

                                            roration = parseFloat(scope.mdfimgangle);

                                            //Calculator transform before rotate
                                            var ratioWidhtAndHeight = realImgWidth / realImgHeight;
                                            if (ratioWidhtAndHeight > 1) {
                                                translatesX = 50 - Math.round(50 / ratioWidhtAndHeight);
                                                translatesY = Math.round(50 * ratioWidhtAndHeight) - 50;
                                            }
                                            if (ratioWidhtAndHeight < 1) {

                                                translatesY = -(50 - Math.round(50 * ratioWidhtAndHeight));
                                                translatesX = -(Math.round(50 / ratioWidhtAndHeight) - 50);
                                            }
                                            if (rotateLeftTimes == 1 || rotateRightTimes == 1) {
                                                translatesX = translatesX
                                                translatesY = translatesY
                                            }
                                            if (rotateLeftTimes == 3 || rotateRightTimes == 3) {
                                                translatesX = -translatesX
                                                translatesY = -translatesY
                                            }
                                            if (rotateLeftTimes == 4 || rotateRightTimes == 0 || rotateLeftTimes == 2 || rotateRightTimes == 2) {
                                                translatesX = 0;
                                                translatesY = 0;
                                            }

                                            chidrenDiv.css({
                                                '-webkit-transform': 'rotate(' + scope.mdfimgangle + 'deg)',
                                                '-moz-transform': 'rotate(' + scope.mdfimgangle + 'deg)',
                                                '-ms-transform': 'rotate(' + scope.mdfimgangle + 'deg)',
                                                'transform': 'rotate(' + scope.mdfimgangle + 'deg)' + 'translate(' + translatesX + '%,' + translatesY + '%)'
                                            });

                                            scope.rotateangle({angle: scope.mdfimgangle, moreoption: scope.moreoption});
                                        }

                                    }, 300);

                                }

                            } else {
                                scope.rangeValue = 100;
                            }
                        }

                        //Funciton calculator max Slider width
                        scope.maxSlider = function (trueheight, truewidth, imgheight, imgwidth) {
                            var newheight = (imgheight / imgwidth) * truewidth;
                            var newwidth = (trueheight * imgwidth) / imgheight;
                            if (newheight > trueheight) {
                                return Math.round(newwidth * 100 / imgwidth);
                            }
                            if (newwidth > truewidth) {
                                return Math.round(truewidth * 100 / imgwidth);
                            }
                        }

                        //Function caculator X-Y tranform
                        scope.axisTransform = function () {
                            var obj = {
                                translatesX: 0,
                                translatesY: 0
                            }

                            translatesX = 50;
                            translatesY = 50;

                            var ratioWidhtAndHeight = scope.imgwidth / scope.imgheight;
                            if (ratioWidhtAndHeight > 1) {
                                translatesY = Math.round(50 * ratioWidhtAndHeight);
                                translatesX = Math.round(50 / ratioWidhtAndHeight);
                            }
                            if (ratioWidhtAndHeight < 1) {
                                translatesX = Math.round(50 / ratioWidhtAndHeight);
                                translatesY = Math.round(50 * ratioWidhtAndHeight);
                            }
                            if (rotateLeftTimes == 4 && rotateRightTimes == 0) {
                                translatesX = -50;
                                translatesY = -50;
                            }
                            if (rotateLeftTimes == 1 || rotateRightTimes == 1) {
                                translatesX = -translatesX
                                translatesY = translatesY
                            }
                            if (rotateLeftTimes == 2 || rotateRightTimes == 2) {
                                translatesX = 50
                                translatesY = 50
                            }
                            if (rotateLeftTimes == 3 || rotateRightTimes == 3) {
                                translatesX = translatesX
                                translatesY = -translatesY
                            }

                            obj.translatesX = translatesX;
                            obj.translatesY = translatesY;

                            return obj
                        }
                        //Max value for slider
                        scope.maxRanger = scope.maxSlider(scope.trueheight, scope.truewidth, scope.imgheight, scope.imgwidth);

                        containImgDiv.css({
                            border: '1px solid #f18e00',
                            backgroundColor: 'lightgrey',
                            width: scope.truewidth + 'px',
                            height: scope.trueheight + 'px',
                            position: 'relative',
                            overflow: 'hidden'
                        });


                        chidrenDiv.css({
                            cursor: 'move',
                            float: 'left',
                        });

                        chidrenDiv.draggable({
                            /*containment: "parent",*/
                            scroll: false,
                            start: function (event, ui) {
                                //scope.resetTranform(chidrenDiv,roration);
                                scope.isCenter = false;
                            },
                            stop: function (event, ui) {
                                var xPos = ui.helper.position().left;
                                var yPos = ui.helper.position().top;
                                scope.movepos({left: xPos, top: yPos, moreoption: scope.moreoption});
                            }

                        });/*.resizable(
                         {
                         maxWidth: scope.truewidth,
                         maxHeight: scope.trueheight,
                         minHeight: 25,
                         minWidth: 25,
                         aspectRatio: true,
                         start: function(event,ui){
                         scope.resetTranform(chidrenDiv,roration);
                         },
                         stop: function(event,ui){
                         var reWidth = ui.size.width;
                         var reHeight = ui.size.height;
                         scope.resizable({width : reWidth,height: reHeight, moreoption: scope.moreoption});
                         chidrenDiv.css({
                         position: 'relative',
                         });

                         //re calculator for range
                         scope.rangeValue = Math.round(reWidth * 100 / scope.imgwidth);
                         }
                         });*/

                        function rotate(degrees) {

                            var axis = scope.axisTransform();
                            if (scope.isTransform == false) {
                                axis.translatesX = 0,
                                        axis.translatesY = 0
                            }
                            chidrenDiv.css({
                                '-webkit-transform': 'rotate(' + degrees + 'deg)',
                                '-moz-transform': 'rotate(' + degrees + 'deg)',
                                '-ms-transform': 'rotate(' + degrees + 'deg)',
                                'transform': 'rotate(' + degrees + 'deg)' + 'translate(' + axis.translatesX + '%,' + axis.translatesY + '%)'
                                        /*'transform' : 'rotate('+ degrees +'deg)'*/
                            });
                            scope.rotateangle({angle: degrees, moreoption: scope.moreoption});
                        }
                        ;

                        scope.rotateLeft = function () {
                            //scope.resetTranform(chidrenDiv,roration);
                            roration -= 90;
                            rotateLeftTimes -= 1;
                            rotateRightTimes = rotateLeftTimes;
                            if (rotateLeftTimes == 0) {
                                rotateLeftTimes = 4;
                                rotateRightTimes = 0;
                            }

                            rotate(roration);

                            if (scope.isCenter) {
                                scope.makeCenter();
                            }

                            var posX = chidrenDiv.position().left;
                            var posY = chidrenDiv.position().top;
                            scope.movepos({left: posX, top: posY, moreoption: scope.moreoption});
                        }
                        scope.rotateRight = function () {
                            //scope.resetTranform(chidrenDiv,roration);
                            roration += 90;
                            rotateRightTimes += 1;
                            rotateLeftTimes = rotateRightTimes;
                            if (rotateRightTimes == 4) {
                                rotateRightTimes = 0;
                                rotateLeftTimes = 4;
                            }
                            rotate(roration);

                            if (scope.isCenter) {
                                scope.makeCenter();
                            }

                            var posX = chidrenDiv.position().left;
                            var posY = chidrenDiv.position().top;
                            scope.movepos({left: posX, top: posY, moreoption: scope.moreoption});
                        }
                        scope.autoFill = function () {
                            $.adaptiveBackground.run({
                                selector: '[data-adaptive-background="' + scope.moreoption + '"]',
                                success: function ($img, data) {
                                    containImgDiv.css({
                                        backgroundColor: data.color,
                                    });
                                    jQuery('.img_canvas').css({
                                        backgroundColor: 'transparent'
                                    });
                                    colorBox.css({
                                        backgroundColor: data.color,
                                    });
                                    scope.backgroundcolor({color: data.color, moreoption: scope.moreoption});
                                    //set value for customColor choose
                                    scope.customColor = data.color;
                                }
                            });
                            scope.showCustom = false;
                        }

                        //Show / Hidden the input color
                        scope.chooseColor = function () {
                            if (scope.showCustom) {
                                scope.showCustom = false;
                            } else {
                                scope.showCustom = true;
                            }
                        }

                        scope.changeColor = function (color) {
                            containImgDiv.css({
                                backgroundColor: color,
                            });
                            colorBox.css({
                                backgroundColor: color,
                            });
                            scope.backgroundcolor({color: color, moreoption: scope.moreoption});
                        }

                        scope.reset = function () {
                            roration = 0;
                            translatesX = 0;
                            translatesY = 0;
                            rotateRightTimes = 0;
                            rotateLeftTimes = 4;
                            scope.isCenter = false;
                            scope.isTransform = false;
                            containImgDiv.css({
                                backgroundColor: 'lightgrey',
                            });
                            colorBox.css({
                                backgroundColor: '#000',
                            });
                            chidrenDiv.css({
                                '-webkit-transform': 'rotate(0deg)',
                                '-moz-transform': 'rotate(0deg)',
                                '-ms-transform': 'rotate(0deg)',
                                'transform': 'rotate(0deg) translate(0%, 0%)',
                                left: 0,
                                top: 0,
                                width: '',
                                height: ''
                            });
                            scope.customColor = 'rgba(0,0,0,1)';
                            scope.resizable({width: scope.imgwidth, height: scope.imgheight, moreoption: scope.moreoption});
                            scope.movepos({left: 0, top: 0, moreoption: scope.moreoption});
                            scope.rotateangle({angle: 0, moreoption: scope.moreoption});
                            scope.backgroundcolor({color: 'transparent', moreoption: scope.moreoption});
                            scope.initData();
                        }

                        //Make image center of thumbnail
                        scope.makeCenter = function () {
                            scope.isCenter = true;
                            scope.isTransform = true;
                            var tranlslates = scope.axisTransform();

                            chidrenDiv.css({
                                top: '50%',
                                left: '50%',
                                '-webkit-transform': 'rotate(' + roration + 'deg)',
                                '-moz-transform': 'rotate(' + roration + 'deg)',
                                '-ms-transform': 'rotate(' + roration + 'deg)',
                                'transform': 'rotate(' + roration + 'deg) translate(' + tranlslates.translatesX + '%,' + tranlslates.translatesY + '%)'
                                        /*'transform' : 'rotate('+ roration +'deg) translate(-50%, -50%)'*/
                            });

                            var posX = chidrenDiv.position().left;
                            var posY = chidrenDiv.position().top;
                            scope.movepos({left: posX, top: posY, moreoption: scope.moreoption});
                        }

                        //Reset transform to default
                        scope.resetTranform = function (element, angle) {
                            element.css({
                                '-webkit-transform': 'rotate(' + angle + 'deg)',
                                '-moz-transform': 'rotate(' + angle + 'deg)',
                                '-ms-transform': 'rotate(' + angle + 'deg)',
                                'transform': 'rotate(' + angle + 'deg) translate(0%, 0%)'
                            });
                        }

                        //Change size with range
                        scope.changeSize = function (value) {
                            var newWidth = Math.round(value * scope.imgwidth / 100);
                            chidrenDiv.css({
                                width: newWidth + 'px',
                                height: ''
                            });
                            var newHeight = chidrenDiv.height();
                            scope.resizable({width: newWidth, height: newHeight, moreoption: scope.moreoption});
                        }

                        //auto Fill-Bg color Default
                        $timeout(function () {
                            if (scope.mdfimgsrc == '' || scope.mdfimgsrc == null) {
                                scope.autoFill();
                            }
                            scope.initData();
                        }, 800);

                    }
                };
            }])
        .directive('globleSearch', ['$window', '$timeout', function ($window, $timeout) {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        //fileslist: '=',
                        //gallerytype: '='
                    },
                    controller: "@",
                    name: "controllerName",
                    /*controller: function($scope, $element){

                     },*/
                    templateUrl: '../app/views/blocks/globle_search.tpl.html',
                    link: function ($scope, element, attrs) {
                        function onDocumentClick(event) {
                            var isChild = element.find(event.target).length > 0;
                            if (!isChild) {
                                $timeout(function () {
                                    $scope.selSearchType = false;
                                });
                            }
                        }
                        ;
                        angular.element($window).bind('click', onDocumentClick);

                        element.bind('click', function (event) {
                            $timeout(function () {
                                $scope.selSearchType = true;
                            });
                        });
                    }//link
                };
            }])
        .directive('ngAutocomplete', ['$parse', function ($parse) {
                return {
                    scope: {
                        details: '=',
                        ngAutocomplete: '=',
                        options: '='
                    },
                    link: function (scope, element, attrs, model) {

                        //options for autocomplete
                        var opts

                        //convert options provided to opts
                        var initOpts = function () {
                            opts = {}
                            if (scope.options) {
                                if (scope.options.types) {
                                    opts.types = []
                                    opts.types.push(scope.options.types)
                                }
                                if (scope.options.bounds) {
                                    opts.bounds = scope.options.bounds
                                }
                                if (scope.options.country) {
                                    opts.componentRestrictions = {
                                        country: scope.options.country
                                    }
                                }
                            }
                        }
                        initOpts()

                        //create new autocomplete
                        //reinitializes on every change of the options provided
                        var newAutocomplete = function () {
                            scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                                scope.$apply(function () {
                                    //if (scope.details) {
                                    scope.details = scope.gPlace.getPlace();
                                    //}
                                    scope.ngAutocomplete = element.val();
                                });
                            })
                        }
                        newAutocomplete()

                        //watch options provided to directive
                        scope.watchOptions = function () {
                            return scope.options
                        };
                        scope.$watch(scope.watchOptions, function () {
                            initOpts()
                            newAutocomplete()
                            element[0].value = '';
                            scope.ngAutocomplete = element.val();
                        }, true);
                    }
                };
            }])
        .directive('thisInfiniteScroll', function () {
            return function (scope, elm, attr) {
                var raw = elm[0];
                elm.bind('scroll', function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attr.infiniteScroll);
                    }
                });
            };
        })
        .directive('contenteditable', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    // view -> model
                    elm.bind('blur', function () {
                        scope.$apply(function () {
                            ctrl.$setViewValue(elm.html());
                        });
                    });

                    // model -> view
                    ctrl.render = function (value) {
                        elm.html(value);
                    };

                    // load init value from DOM
                    //ctrl.$setViewValue(elm.html());

                    elm.bind('keydown', function (event) {
                        var esc = event.which == 27,
                                el = event.target;

                        if (esc) {
                            ctrl.$setViewValue(elm.html());
                            el.blur();
                            event.preventDefault();
                        }

                    });

                }
            };
        })
        .directive('searchBox', ['$compile', '$timeout', function ($compile, $timeout) {
                return {
                    require: 'ngModel',
                    scope: {},
                    link: function (scope, el, attrs, ctrl) {
                        // limit to input element of specific types
                        var inputTypes = /text|search|tel|url|email|password/i;
                        if (el[0].nodeName !== "INPUT") {
                            throw new Error("resetField is limited to input elements");
                        }
                        if (!inputTypes.test(attrs.type)) {
                            throw new Error("Invalid input type for resetField: " + attrs.type);
                        }

                        // compiled reset icon template
                        var template = $compile('<i ng-show="enabled" ng-mousedown="reset()" class="fa fa-times-circle"></i>')(scope);
                        el.after(template);

                        scope.reset = function () {
                            ctrl.$setViewValue(null);
                            ctrl.$render();
                            $timeout(function () {
                                el[0].focus();
                            }, 0, false);
                        };

                        el.bind('input', function () {
                            scope.enabled = !ctrl.$isEmpty(el.val());
                        })
                                .bind('focus', function () {
                                    scope.enabled = !ctrl.$isEmpty(el.val());
                                    scope.$apply();
                                })
                                .bind('blur', function () {
                                    /*
                                     scope.enabled = false;
                                     scope.$apply();
                                     */
                                });
                    }
                };
            }])
        .directive('vpDetectFocus', ['$timeout', '$parse', function ($timeout, $parse) {
                return {
                    restrict: 'A',
                    link: function ($scope, $element, $attrs) {
                        var model = $parse($attrs.vpDetectFocus);
                        $element.bind('focus', function () {
                            $scope.$apply(model.assign($scope, true));
                        });
                        $element.bind('blur', function () {
                            $scope.$apply(model.assign($scope, false));
                        });
                    }
                };
            }])
        .directive('compile', ['$compile', function ($compile) {
                return function (scope, element, attrs) {
                    //usage : <div class="acti-sentence" compile="actSentence"></div>
                    scope.$watch(
                            function (scope) {
                                // watch the 'compile' expression for changes
                                return scope.$eval(attrs.compile);
                            },
                            function (value) {
                                // when the 'compile' expression changes
                                // assign it into the current DOM
                                element.html(value);

                                // compile the new DOM and link it to the current
                                // scope.
                                // NOTE: we only compile .childNodes so that
                                // we don't get into infinite loop compiling ourselves
                                $compile(element.contents())(scope);
                            }
                    );
                };
            }])
        .directive('onerrorSrc', function () {
            //usage in HTML: onerror-src="images/no_image_user.png"
            var fallbackSrc = {
                link: function postLink(scope, iElement, iAttrs) {
                    iElement.bind('error', function () {
                        angular.element(this).attr("src", iAttrs.fallbackSrc);
                    });
                }
            }
            return fallbackSrc;
        })
        .directive('ngPrint', ['$q', '$timeout', function ($q, $timeout) {
                //<button class="btn btn-primary" ng-print print-element-id="printThisElement"><i class="fa fa-print"></i> Print</button>
                //add this CSS
                /*
                 @media screen {
                 #printSection {
                 display: none;
                 }
                 }
                 @media print {
                 body * {
                 visibility:hidden;
                 }
                 #printSection, #printSection * {
                 visibility:visible;
                 }
                 #printSection {
                 display: block;
                 position:absolute;
                 left:0;
                 top:0;
                 }
                 }
                 */
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        scope.printElement = function (elem) {
                            //clear prinSection first
                            // clones the element you want to print
                            var domClone = elem.cloneNode(true);
                            printSection.appendChild(domClone);
                            //printSection.innerHTML = elem.innerHTML;
                            $timeout(function () {
                                window.print();
                            });
                        };

                        element.on('click', function () {
                            printSection.innerHTML = "";
                            var elemToPrint = document.getElementById(attrs.printElementId);
                            if (elemToPrint) {
                                scope.printElement(elemToPrint);
                            }
                        });
                        window.onafterprint = function () {
                            // clean the print section before adding new content
                            printSection.innerHTML = '';
                        }

                        var printSection = document.getElementById('printSection');
                        // if there is no printing section, create one
                        if (!printSection) {
                            printSection = document.createElement('div');
                            printSection.id = 'printSection';
                            document.body.appendChild(printSection);
                        }
                    }//link
                };
            }])
        .directive('setTitle', function () {
            return {
                restrict: "A",
                priority: 100,
                link: function ($scope, $el, $attr) {
                    jQuery($el).attr('title', $scope.$eval($attr.setTitle));
                }
            };
        })
        .directive('xngClearable', ['$timeout', function ($timeout) {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    compile: function (tElement) {
                        //angular.element(tElement).ready(function () {
                        //$timeout(function(){
                        var clearClass = 'clear_button',
                                divClass = clearClass + '_div';

                        if (!tElement.parent().hasClass(divClass)) {
                            tElement.wrap('<div style="position: relative;" class="' + divClass + '">' + tElement.html() + '</div>');
                            tElement.after('<a style="position: absolute; cursor: pointer;" tabindex="-1" class="' + clearClass + '">&times;</a>');

                            var btn = tElement.next();

                            $timeout(function () {
                                //apply the css to button, after the element has been rendered
                                btn.css('font-size', Math.round(tElement.prop('offsetHeight') * 0.8) + 'px');
                                btn.css('top', '0px');
                                //btn.css('left', Math.round(tElement.prop('offsetWidth') - btn.prop('offsetWidth')*1.3) + 'px');
                                btn.css('right', '0px');
                                btn.css('line-height', Math.round(tElement.prop('offsetHeight')) + "px");
                                btn.css('width', Math.round(tElement.prop('offsetHeight')) + "px");
                                btn.css('text-align', "center");
                            }, 700);

                            return function (scope, iElement, iAttrs) {
                                if (iElement[0].tagName == 'DIV') {
                                    var text = angular.element(iElement.children()[0]);

                                    btn.bind('mousedown', function (e) {
                                        text.val('');
                                        text.triggerHandler('input');
                                        e.preventDefault();
                                    });

                                    scope.$watch(iAttrs.ngModel, function (v) {
                                        if (v && v.length > 0) {
                                            btn.css('display', 'block');
                                        } else {
                                            btn.css('display', 'none');
                                        }
                                    });
                                }
                            }
                        }
                        //});
                        //});
                    }//compile
                }
            }])
        .directive('profilePhoto', ['$compile', function ($compile) {
                /**
                 info: used to show profile pic of user, if no profile pic is present then show the name initials
                 Usage in HTML:
                 <div profile-photo="{url: <profile pic url>, firstName: <fname>, lastName: <lname>, lazyload: true, nochache: true}"> </div>
                 */
                return {
                    restrict: 'A',
                    scope: {
                        profilePhoto: "=profilePhoto"
                    },
                    compile: function (element, attrs) {
                        return function (scope, element, attrs) {
                            var htmlText = "";
                            //scope.profilePhoto.url = null;
                            if (scope.profilePhoto.url && scope.profilePhoto.url != '') {
                                if (scope.profilePhoto.lazyload) {
                                    htmlText = '<div block-right-click class="afkl-lazy-wrapper" afkl-lazy-image="{{profilePhoto.url}}"></div>';
                                }
                                else if (scope.profilePhoto.nochache) {
                                    htmlText = '<img block-right-click no-cache-src="' + scope.profilePhoto.url + '">';
                                }
                                else {
                                    htmlText = '<img block-right-click src="' + scope.profilePhoto.url + '"/>';
                                }
                            }
                            else {
                                //var initials = "NA";
                                var initials = "";
                                if (scope.profilePhoto.firstName && scope.profilePhoto.lastName) {
                                    initials = (scope.profilePhoto.firstName.charAt(0) + "" + scope.profilePhoto.lastName.charAt(0)).toUpperCase();
                                }
                                htmlText = "<div class='username-initials disp_table'><div class='tblc_m'>" + initials + "</div></div>";
                            }
                            //element.replaceWith(htmlText);
                            element.html(htmlText);
                            $compile(element.contents())(scope);
                        }
                    }//compile
                }
            }])
        .directive('setLocalMonth', ['$filter', '$translate', function ($filter, $translate) {
                //compiles and bind the provided html string to given element
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var m = attrs["setLocalMonth"];
                        var d = new Date(m + " 1, 1970");
                        element.html($filter('date')(d, "MMMM"));

                        scope.$on('change.month.language', function (event, data) {
                            $translate(m).then(function (translation) {
                                element.html(translation);
                            });
                        });
                    }
                }
            }])
        .directive('showPhoneNumber', ['$compile', function ($compile) {
                //compiles and bind the provided html string to given element
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var str = attrs.showPhoneNumber;
                        //element.html(str.match(new RegExp('.{1,2}', 'g')).join(" "));
                        str = str.replace(/\s/g, '');
                        str = str.replace(/(.{2})/g, "$1 ");
                        element.html(str);
                    }
                }
            }])
        .directive('phoneNumberInput', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {
                        // this next if is necessary for when using ng-required on your input.
                        // In such cases, when a letter is typed first, this parser will be called
                        // again, and the 2nd time, the value will be undefined
                        if (inputValue == undefined)
                            return ''
                        var transformedInput = inputValue.replace(/[^0-9]/g, '');
                        transformedInput = transformedInput.replace(/(.{2})/g, "$1 ");
                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
            };
        })
        .directive('numberInput', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {
                        // this next if is necessary for when using ng-required on your input.
                        // In such cases, when a letter is typed first, this parser will be called
                        // again, and the 2nd time, the value will be undefined
                        if (inputValue == undefined)
                            return ''
                        var transformedInput = inputValue.replace(/[^0-9]/g, '');
                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
            };
        })
        .directive('translateTitle', ['$compile', '$filter', function ($compile, $filter) {
                //compiles and bind the provided html string to given element
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var str = $filter('translate')(attrs.translateTitle);
                        element.attr("title", str);
                    }
                }
            }])
        .directive('setIconSrc', ['$filter', function ($filter) {
                //apply src="<icon file>" attribute to html element
                //usage: set-icon-src="{type: <filetype>, url: <thumburl>}"
                return {
                    restrict: 'A',
                    scope: {
                        fileObj: "=setIconSrc"
                    },
                    link: function (scope, element, attrs) {
                        if (scope.fileObj && scope.fileObj.type) {
                            var filetype = $filter("getFileType")(scope.fileObj.type);
                            var iconpath = (filetype != "img") ? ("../images/media/" + filetype + ".png") : scope.fileObj.url;
                            element.attr("src", iconpath);
                        }
                        else {
                        }
                    }
                };
            }])
        .directive('customColorPicker', ['$timeout', '$rootScope', function (timer, $rootScope) {
                return {
                    restrict: 'AE',
                    replace: true,
                    require: "?ngModel",
                    scope: {
                        genereatedColor: "=ngModel"
                    },
                    templateUrl: '../app/views/blocks/customColorPicker.tpl.html',
                    link: function (scope, element, attrs, ngModel) {
                        scope.alpha = 0;
                        scope.rgb = 0;

                        scope.getColor = function () {
                            scope.genereatedColor = "rgba(" + scope.rgb + "," + scope.rgb + "," + scope.rgb + "," + scope.alpha + ")";
                            //ngModel.$setViewValue(scope.genereatedColor);
                            //ngModel.$setViewValue(scope.genereatedColor);
                            //ngModel.$render();
                        };

                        scope.calculateValues = function (cstr) {
                            if (cstr) {
                                var tmp = cstr.match(/\((.*)\)/i)[1];
                                var rgba = tmp.split(",");
                                scope.rgb = rgba[0];
                                scope.alpha = rgba[(rgba.length - 1)];
                                scope.getColor();
                            }
                        };

                        var watchPChanges = scope.$watch('genereatedColor', function (newValue, oldValue) {
                            scope.calculateValues(newValue);
                        });

                        var watchLChanges = scope.$watch(scope.ngModel, function (newValue, oldValue) {
                            scope.calculateValues(scope.ngModel);
                        });

                        scope.alphaChange = function () {
                            scope.getColor();
                        };

                        scope.colorChange = function () {
                            scope.getColor();
                        };
                        scope.$on("$destroy", function () {
                            watchPChanges();
                            watchLChanges();
                        });
                    }
                };
            }])
        .directive('useEngArtilce', [function () {
                //places corrct grammer article for english use-eng-artilce
                return {
                    restrict: 'EA',
                    link: function (scope, element, attrs) {
                        var str = attrs.useEngArtilce;
                        var vowels = ['a', 'e', 'i', 'o', 'u'];
                        if (vowels.indexOf(str.charAt(0).toLowerCase()) > -1) {
                            element.html("an");
                        }
                        else {
                            element.html("a");
                        }
                    }
                }
            }])
        .directive('toggleClass', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('click', function () {
                        if (element.attr("class") == "lnr lnr-chevron-up clk") {
                            element.removeClass("lnr lnr-chevron-up clk");
                            element.addClass(attrs.toggleClass);
                        } else {
                            element.removeClass("lnr lnr-chevron-down clk");
                            element.addClass("lnr lnr-chevron-up clk");
                        }
                    });
                }
            };
        })

        .directive('bootstrapModal', function ($defer) {
            var link = function (scope, elm, attrs) {
                var escapeEvent;
                var openModal;
                var closeModal;

                //Escape event has to be declared so that when modal closes,
                //we only unbind modal escape and not everything
                escapeEvent = function (e) {
                    if (e.which == 27)
                        closeModal();
                };

                openModal = function (event, hasBackdrop, hasEscapeExit) {
                    var modal = jQuery('#' + attrs.modalId);

                    //Make click on backdrop close modal
                    if (hasBackdrop === true) {
                        //If no backdrop el, have to add it
                        if (!document.getElementById('modal-backdrop')) {
                            jQuery('body').append(
                                    '<div id="modal-backdrop" class="modal-backdrop"></div>'
                                    );
                        }
                        jQuery('#modal-backdrop').
                                css({display: 'block'}).
                                bind('click', closeModal);
                    }

                    //Make escape close modal
                    if (hasEscapeExit === true)
                        jQuery('body').bind('keyup', escapeEvent);

                    //Add modal-open class to body
                    jQuery('body').addClass('modal-open');

                    //Find all the children with class close,
                    //and make them trigger close the modal on click
                    jQuery('.close', modal).bind('click', closeModal);

                    modal.css({display: 'block'});
                };

                closeModal = function (event) {
                    jQuery('#modal-backdrop').
                            unbind('click', closeModal).
                            css({display: 'none'});
                    jQuery('body').
                            unbind('keyup', escapeEvent).
                            removeClass('modal-open');
                    jQuery('#' + attrs.modalId).css({display: 'none'});
                };

                //Bind modalOpen and modalClose events, so outsiders can trigger it
                //We have to wait until the template has been fully put in to do this,
                //so we will wait 100ms
                $defer(function () {
                    jQuery('#' + attrs.modalId).
                            bind('modalOpen', openModal).
                            bind('modalClose', closeModal);
                }, 100);
            };

            return {
                link: link,
                restrict: 'E',
                scope: {
                    modalId: 'attribute'
                },
                template: '<div id="{{modalId}}" class="modal hide"><div ng-transclude></div></div>',
                transclude: true
            };
        })
        .directive('bootstrapModalOpen', function () {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {

                    var hasBackdrop = attrs.backdrop === undefined ? true : attrs.backdrop;
                    var hasEscapeExit = attrs.escapeExit === undefined ? true : attrs.escapeExit;

                    //Allow user to specify whether he wants it to open modal on click or what
                    //Defaults to click
                    var eventType = attrs.modalEvent === undefined ? 'click' : eventType;

                    jQuery(elm).bind(eventType, function () {
                        jQuery('#' + attrs.bootstrapModalOpen).trigger(
                                'modalOpen', [hasBackdrop, hasEscapeExit]
                                );
                    });
                }
            };
        })
        .directive('setIconFile', ['$filter', function ($filter) {
                //apply src="<icon file>" attribute to html element
                //usage: set-icon-file="{fileName: <filename>, url : <thumburl>}"
                return {
                    restrict: 'A',
                    scope: {
                        fileObj: "=setIconFile"
                    },
                    link: function (scope, element, attrs) {
                        if (scope.fileObj && scope.fileObj.fileName) {
                        	var iconpath = '';
                             //console.log('condition',scope.fileObj.internal);
                        	if(scope.fileObj.internal){
	                            var filetype = $filter("getTypeByFileName")(scope.fileObj.fileName);
	                            iconpath = (filetype != "img") ? ("../images/media/" + filetype + ".png") : scope.fileObj.url;
                        	}else{
                        		iconpath = $filter("getTypeByFileNameGDrive")(scope.fileObj.fileName);
                        	}
                            element.attr("src", iconpath);
                        }
                        else {
                        }
                    }
                };
            }])
// .directive("custCanalPlayer", ['$window', function($window){
//       return {
//       restrict: 'EA',
//       transclude: false,
//       scope: {
//           videoid: '@',
//           },
//       replace : true,
//       template: '<canal:player videoid="{{vdoid}}"></canal:player>',
//       link: function(scope, element, attrs){
//           setTimeout(function(){
//             window.CANAL.initPlayers();
//           },1);
//       }
//     };
// }]);
        .directive('customVideogularDirective', ['$sce', function ($sce) {
                return {
                    restrict: 'EA', //E = element, A = attribute,
                    scope: {
                        data: '=data'
                    },
                    templateUrl: '../app/views/blocks/videogular_directive.tpl.html',
                    controller: ["$scope", function ($scope) {
                            $scope.flag = {hideInput: true};
                            if (typeof $scope.data == 'string') {
                                $scope.flag.hideInput = false;
                                $scope.data = JSON.parse($scope.data)
                            }
                            $scope.location = ''
                            $scope.API = null;
                            $scope.onPlayerReady = function (API) {
                                $scope.API = API;
                            };
                            $scope.$watch('data', function () {
                                if ($scope.data.videoUrl) {
                                    $scope.flag.hideInput = false;
                                    $scope.data.source = $scope.data.videoUrl;
                                    $scope.data.poster = $scope.data.thumbUrl + '?t=' + (new Date()).getTime();
                                }else if ($scope.data.url) {
                                    $scope.flag.hideInput = false;
                                    $scope.data.source = $scope.data.url;
                                    $scope.data.poster = $scope.data.videoThumbUrl + '?t=' + (new Date()).getTime();
                                }
                                $scope.API.stop();
                                changeVideoSource();
                            });
                            var changeVideoSource = function () {
                                $scope.config = {
                                    sources: [
                                        {src: $sce.trustAsResourceUrl($scope.data.source), type: "video/mp4"}
                                    ],
                                    tracks: [
                                        {
                                            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                                            kind: "subtitles",
                                            srclang: "en",
                                            label: "English",
                                            default: ""
                                        }
                                    ],
                                    theme: "../bower_components/videogular-themes-default/videogular.css",
                                    preload: "none",
                                    plugins: {
                                        poster: $scope.data.poster
                                    }
                                };
                            }

                            $scope.playThisVideo = function (sourceLocation) {
                                if (sourceLocation.length > 0) {
                                    $scope.data.source = sourceLocation;
                                    $scope.API.stop();
                                    changeVideoSource();
                                }
                            };
                            changeVideoSource();
                        }],
                    link: function ($scope, element, attrs) {
                    } //DOM manipulation
                }
            }])
        .directive("grandArticle", ['$window', function ($window) {
                return {
                    restrict: 'EA',
                    transclude: false,
                    scope: {
                        videoid: '@',
                    },
                    replace: true,
                    templateUrl: '../app/views/article.html',
                    link: function (scope, element, attrs) {
                        $(window).scrollTop(1);
                        (function ()
                        {
                            var e, t = function (e, t)
                            {
                                return function ()
                                {
                                    return e.apply(t, arguments)
                                }
                            };
                            e = function ()
                            {
                                function e()
                                {
                                }
                                return e.prototype.LAUNCHING_LATENCY = 2e3, e.prototype.launchApplication = function ()
                                {
                                    return $application.addClass("loadstatus__unload").trigger(MYEvents.applicationWillLaunch), setTimeout(true, this.LAUNCHING_LATENCY), true, $application.removeClass("loadstatus__unload").addClass("loadstatus__loading").trigger(MYEvents.applicationDidLaunch)
                                }, e
                            }(), window.MYLoader = e
                        }).call(this);
                        !function (e, t)
                        {
                            "use strict";
                            function n(e, t)
                            {
                                var n = {};
                                for (var r in e)
                                    n[r] = e[r];
                                for (var r in t)
                                    n[r] = t[r];
                                return n
                            }
                            t.fn.scrollTo = function (e)
                            {
                                var r = {
                                    position: 0,
                                    callback: null,
                                    animated: !1,
                                    duration: 1e3
                                };
                                e || (e = {}), e = n(r, e), e.animated || (e.duration = 10), t(this).stop().animate(
                                        {
                                            scrollTop: e.position
                                        }, e.duration, "easeInOutSine", e.callback)
                            }, t.fn.scrollToID = function ()
                            {
                                var e = t(t(this).attr("href")),
                                        n = e.data("scrolloffset") ? e.data("scrolloffset") : 0;
                                t("html,body").scrollTo(
                                        {
                                            duration: 1e3,
                                            animated: !0,
                                            position: e.offset().top - n
                                        })
                            }, t.fn.onClickScrollToID = function ()
                            {
                                t(this).on("click", function (e)
                                {
                                    e.preventDefault(), t(e.currentTarget).scrollToID()
                                })
                            }
                        }(window, jQuery);


                        !function (e, t)
                        {
                            "use strict";
                            var n;
                            n = function ()
                            {
                                function n(e)
                                {
                                    if (e.selector.length > 1)
                                    {
                                        var r = [];
                                        return t.each(e.selector, function ()
                                        {
                                            r.push(n.creer(t(this)))
                                        }), r
                                    }
                                    this.init(e)
                                }
                                return n.creer = function (e)
                                {
                                    return new n(
                                            {
                                                selector: e
                                            })
                                }, n.prototype = {
                                    init: function (n)
                                    {
                                        return this.selector = n.selector, this.parent = t(this.selector).parent(), t(e).on("scroll", t.proxy(this.scrooler, this)), this
                                    },
                                    scrooler: function ()
                                    {
                                        var n = t(e).scrollTop(),
                                                r = t(this.parent),
                                                i = t(this.parent).find(".container-text"),
                                                a = 15,
                                                o = 25,
                                                s = 4,
                                                l = Math.max(n - r.offset().top, 0);
                                        l -= i.position().top;
                                        var c = Math.round(Math.min(Math.max(o, o + l / s), 100)),
                                                u = Math.round(Math.max(Math.min(a, a - l / s / 4), 0));
                                        t(this.selector).removeAttr("style"), e.innerWidth > 640 && t(this.selector).css(
                                                {
                                                    filter: "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-webkit-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-moz-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-o-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-ms-filter": "opacity(" + c + "%) blur(" + u + "px)"
                                                })
                                    },
                                    resizer: function () {
                                    }
                                }, n
                            }(), e.LMDimgFilter = n
                        }(window, jQuery);

                        jQuery(function ()
                        {
                            "use strict";
                            var e, t, n = function ()
                            {
                                t = document.body.clientWidth, e = window.innerHeight, jQuery(".item .header .container-text").removeAttr("style"), window.innerWidth > 640 && $.each(jQuery(".item .header"), function ()
                                {
                                    var e = jQuery(this).height(),
                                            t = jQuery(this).children(".container-text").height();
                                    jQuery(this).children(".container-text").css(
                                            {
                                                top: (e - t) / 2
                                            })
                                }), l()
                            };
                            jQuery(window).on("resize", n);
                            var r = function ()
                            {
                                n()
                            },
                                    i = function ()
                                    {
                                        new LMDimgFilter(
                                                {
                                                    selector: $(".item .article-bg")
                                                });
                                        jQuery(window).on("scroll", o), setTimeout(function ()
                                        {
                                            jQuery(window).trigger("resize")
                                        }, 1e3)
                                    };
                            jQuery(".main-container").on("applicationWillLaunch", r), jQuery(".main-container").on("applicationDidLaunch", i);
                            var a, o = function ()
                            {
                                l()
                            },
                                    s = !0,
                                    l = function ()
                                    {
                                        var t = jQuery(window).scrollTop() + 100;
                                        jQuery(".articles .nav div.menu-opener").removeClass("menu-opened");
                                        jQuery(".articles .nav ul").removeClass("visible");
                                        $.each(jQuery(".item"), function (n)
                                        {
                                            var r = Math.round(jQuery(this).offset().top),
                                                    i = Math.round(jQuery(this).height() - e),
                                                    o = r + i,
                                                    l = Math.min(o, Math.max(0, Math.round(t - r)));
                                            if (t >= r && o > t)
                                            {
                                                var c = e / 5 / i,
                                                        u = -l * c / 2;
                                                jQuery(this).find(".background-container").addClass("fixed"), jQuery(this).find(".bg").css(
                                                        {
                                                            top: u
                                                        })
                                            }
                                            else
                                                t >= o || (jQuery(this).find(".background-container").removeClass("fixed"), jQuery(this).find(".bg").css(
                                                        {
                                                            top: 0
                                                        }));
                                            t >= r - e / 10 && s && (a = n + 1)
                                        });
                                        c()
                                    },
                                    c = function ()
                                    {
                                        jQuery(".articles .nav ul li").removeClass("active"), jQuery("#article" + a).addClass("active")
                                    };
                            jQuery(".articles .nav ul li").on("click", function ()
                            {
                                a = jQuery(this).data("id"), c(), s = !1, setTimeout(function ()
                                {
                                    s = !0
                                }, 1e3)
                            })
                            jQuery(".articles .nav").on("click", function ()
                            {
                                jQuery(this).find("div.menu-opener").toggleClass("menu-opened");
                                jQuery(this).find("ul").toggleClass("visible");
                            })
                        });
                        var root = jQuery(".main-container"),
                                $application = jQuery(".main-container"),
                                MYEvents = {};
                        jQuery("div.not-printable footer").css({"position": "absolute", "width": "100%"})
                        !function (e, t)
                        {
                            "use strict";

                            function n()
                            {

                                t(".scroll-to-id").onClickScrollToID(), (t(document).on("scrollstart", function ()
                                {
                                    s = setInterval(r(), 30)
                                }), t(document).on("scrollstop", function ()
                                {
                                    clearInterval(s)
                                }));
                            }

                            function r()
                            {
                                t(e).trigger(MYEvents.applicationScroll)
                            }

                            function scrollPosition()
                            {
                                root.scrollTo(
                                        {
                                            position: 0,
                                            animated: !1
                                        })
                            }
                            MYEvents.applicationWillLaunch = "applicationWillLaunch", MYEvents.applicationDidLaunch = "applicationDidLaunch", MYEvents.applicationScroll = "applicationScroll";
                            var s;
                            $application.on("applicationWillLaunch", n), true, t(document).ready(function ()
                            {
                                var e = new MYLoader;
                                e.launchApplication();
                            })
                        }(window, jQuery);

                    }
                };
            }])


        .directive("newExampleArticle", ['$window', function ($window) {
                return {
                    restrict: 'EA',
                    transclude: false,
                    scope: {
                        videoid: '@',
                    },
                    replace: true,
                    templateUrl: '../app/views/article_new.html',
                    link: function (scope, element, attrs) {
                        $('footer').css('position','relative');
                        scope.x = {articleMenuShow: true};
                        $(window).scrollTop(0);
                        (function () {
                            var t, i = function (t, i) {
                                return function () {
                                    return t.apply(i, arguments)
                                }
                            };
                            t = function () {
                                function t() {
                                }
                                return t.prototype.LAUNCHING_LATENCY = 2e3, t.prototype.launchApplication = function () {
                                    return $application.addClass("loadstatus__unload").trigger(INSPEvent.applicationWillLaunch), $application.removeClass("loadstatus__unload").addClass("loadstatus__loading").trigger(INSPEvent.applicationDidLaunch)
                                }, t
                            }(), window.INSPLoader = t
                        }).call(this);
                        ;
                        !function (o, t) {
                            "use strict";

                            function n(o, t) {
                                var n = {};
                                for (var i in o)
                                    n[i] = o[i];
                                for (var i in t)
                                    n[i] = t[i];
                                return n
                            }
                            t.fn.scrollTo = function (o) {
                                var i = {
                                    position: 0,
                                    callback: null,
                                    animated: !1,
                                    duration: 1e3
                                };
                                o || (o = {}), o = n(i, o), o.animated || (o.duration = 10), t(this).stop().animate({
                                    scrollTop: o.position
                                }, o.duration, "easeInOutSine", o.callback)
                            }, t.fn.scrollToID = function () {
                                var o = t(t(this).attr("href")),
                                        n = o.data("scrolloffset") ? o.data("scrolloffset") : 0;
                                t("html,body").scrollTo({
                                    duration: 1e3,
                                    animated: !0,
                                    position: o.offset().top - n
                                })
                            }, t.fn.onClickScrollToID = function () {
                                t(this).on("click", function (o) {
                                    o.preventDefault(), t(o.currentTarget).scrollToID()
                                })
                            }
                        }(window, jQuery);
                        ;

                        !function (e, t) {
                            "use strict";
                            var s;
                            s = function () {
                                function s(e) {
                                    if (e.selector.length > 1) {
                                        var r = [];
                                        return t.each(e.selector, function () {
                                            r.push(s.creer({
                                                selector: t(this),
                                                selector_fixed: e.selector_fixed
                                            }))
                                        }), r
                                    }
                                    this.init(e)
                                }
                                return s.creer = function (e) {
                                    return new s(e)
                                }, s.prototype = {
                                    init: function (s) {
                                        return this.selector = s.selector, this.inner = t(this.selector).children("." + s.selector_fixed), this.timer, t(this.inner).removeClass("fixed").removeClass("bottom").addClass("top"), t(e).on("scroll", t.proxy(this.scrooler, this)), this.resizer(), t(e).on("resize", t.proxy(this.resizer, this)), this.touchstart(), this.scrooler(), this
                                    },
                                    touchstart: function () {
                                        this.timer = setInterval(t.proxy(this.scrooler, this), 5)
                                    },
                                    touchend: function () {
                                        clearInterval(this.timer)
                                    },
                                    scrooler: function () {
                                        var s = t(e).scrollTop();
                                        this.scroolerImg(s)
                                    },
                                    scroolerImg: function (e) {
                                        var s = this.selector.offset().top,
                                                r = this.selector.offset().top + this.selector.height() - this.h;
                                        e >= s && r > e ? t(this.inner).hasClass("fixed") || t(this.inner).addClass("fixed") : e > r ? t(this.inner).attr({
                                            style: "none"
                                        }).removeClass("fixed").removeClass("top").addClass("bottom") : t(this.inner).attr({
                                            style: "none"
                                        }).removeClass("fixed").removeClass("bottom").addClass(s > e ? "top" : "top")
                                    },
                                    resizer: function () {
                                        this.h = e.innerHeight, this.l = e.innerWidth, this.scrooler()
                                    }
                                }, s
                            }(), e.LMDEffetfixedAuto = s
                        }(window, jQuery);
                        ;
                        !function (r, e) {
                            "use strict";
                            var t;
                            t = function () {
                                function t(r) {
                                    if (r.selector.length > 1) {
                                        var o = [];
                                        return e.each(r.selector, function () {
                                            o.push(t.creer(e(this)))
                                        }), o
                                    }
                                    this.init(r)
                                }
                                return t.creer = function (r) {
                                    return new t({
                                        selector: r
                                    })
                                }, t.prototype = {
                                    init: function (t) {
                                        return this.selector = t.selector, this.resizer(), e(r).on("scroll", e.proxy(this.scrooler, this)), e(r).on("touchmove", e.proxy(this.scrooler, this)), this
                                    },
                                    scrooler: function () {
                                        var t = e(r).scrollTop(),
                                                o = (r.innerHeight, r.innerWidth, e(this.selector).height()),
                                                i = Math.min(1.2, 1 + t / o / 4);
                                        i = Math.max(1, i), e(this.selector).css({
                                            "background-position": "center center",
                                            transform: "scale(" + i + ")"
                                        })
                                    },
                                    resizer: function () {
                                    }
                                }, t
                            }(), r.LMDbgZoomScroll = t
                        }(window, jQuery);
                        ;


                        $(function () {
                            var e, n, o = function () {
                                e = window.innerWidth, n = window.innerHeight, $.each($(".inner-titre"), function () {
                                    var e = $(this).children(".titre").position().top + $(this).children(".titre").height();
                                    $(this).css({
                                        height: e
                                    })
                                })
                            };
                            $(window).on("resize", o);
                            var t = function () {
                                var e = $(window).scrollTop(),
                                        n = $(".container-titres").offset().top,
                                        o = $(".intro").offset().top;
                                e >= o ? $(".container-general header .article-bg").addClass("relatived") : $(".container-general header .article-bg").removeClass("relatived"), e >= n ? $(".container-titres .nav-title").addClass("fixed") : $(".container-titres .nav-title").removeClass("fixed");
                                var t;
                                $.each($(".container-titres .container-titre"), function () {
                                    var n = $(this).offset().top - 35,
                                            o = n + $(this).height();
                                    e >= n && o > e && (t = $(this).attr("id"))
                                }), $(".container-titres .nav-title ul li").removeClass("actif"), $('.container-titres .nav-title ul li[data-id="' + t + '"]').addClass("actif")
                            },
                                    a = function () {
                                        o()
                                    },
                                    i = function () {
                                        new LMDbgZoomScroll({
                                            selector: $(".background-zoomer")
                                        }), new LMDEffetfixedAuto({
                                            selector: $(".container-titre"),
                                            selector_fixed: "article-bg"
                                        });
                                        o(), $(window).on("scroll", t)
                                    };
                            $(".article-container").on('applicationWillLaunch', a), $(".article-container").on('applicationDidLaunch', i)
                        });
                        ;
                        var navigationTracker, root = $("html,body"),
                                $application = $(".article-container"),
                                viewport = $(window),
                                INSPEvent = {};
                        !function (i, a) {
                            "use strict";

                            function n() {
                                a(".scroll-to-id").onClickScrollToID()
                            }

                            function l() {
                                root.scrollTo({
                                    position: 0,
                                    animated: !1
                                })
                            }
                            INSPEvent.applicationWillAppear = "applicationWillAppear", INSPEvent.applicationDidAppear = "applicationDidAppear", INSPEvent.applicationWillLaunch = "applicationWillLaunch", INSPEvent.applicationDidLaunch = "applicationDidLaunch", INSPEvent.applicationWillQuit = "applicationWillQuit", INSPEvent.viewWillAppear = "viewWillAppear", INSPEvent.viewDidAppear = "viewDidAppear", INSPEvent.viewWillLoad = "viewWillLoad", INSPEvent.viewDidLoad = "viewDidLoad", INSPEvent.viewWillDisappear = "viewWillDisappear", INSPEvent.viewDidDisappear = "viewDidDisappear", INSPEvent.viewWillUnload = "viewWillUnload", INSPEvent.viewDidUnload = "viewDidUnload", $application.on(INSPEvent.applicationWillLaunch, n), viewport.unload(function () {
                                l()
                            }), a(document).ready(function () {
                                var i = new INSPLoader;
                                i.launchApplication()
                            })
                        }(window, jQuery);
                    }
                };
            }])
            .directive("grandArticleTemplate1", ['$window', function ($window) {
                return {
                    restrict: 'EA',
                    transclude: false,
                    scope: {
                        videoid: '@',
                        feed:'=',
                    },
                    replace: true,
                    templateUrl: '../app/views/grand_article_template_1.html',
                    link: function (scope, element, attrs) {
                        $(window).scrollTop(1);
                        (function ()
                        {
                            var e, t = function (e, t)
                            {
                                return function ()
                                {
                                    return e.apply(t, arguments)
                                }
                            };
                            e = function ()
                            {
                                function e()
                                {
                                }
                                return e.prototype.LAUNCHING_LATENCY = 2e3, e.prototype.launchApplication = function ()
                                {
                                    return $application.addClass("loadstatus__unload").trigger(MYEvents.applicationWillLaunch), setTimeout(true, this.LAUNCHING_LATENCY), true, $application.removeClass("loadstatus__unload").addClass("loadstatus__loading").trigger(MYEvents.applicationDidLaunch)
                                }, e
                            }(), window.MYLoader = e
                        }).call(this);
                        !function (e, t)
                        {
                            "use strict";
                            function n(e, t)
                            {
                                var n = {};
                                for (var r in e)
                                    n[r] = e[r];
                                for (var r in t)
                                    n[r] = t[r];
                                return n
                            }
                            t.fn.scrollTo = function (e)
                            {
                                var r = {
                                    position: 0,
                                    callback: null,
                                    animated: !1,
                                    duration: 1e3
                                };
                                e || (e = {}), e = n(r, e), e.animated || (e.duration = 10), t(this).stop().animate(
                                        {
                                            scrollTop: e.position
                                        }, e.duration, "easeInOutSine", e.callback)
                            }, t.fn.scrollToID = function ()
                            {
                                var e = t(t(this).attr("href")),
                                        n = e.data("scrolloffset") ? e.data("scrolloffset") : 0;
                                t("html,body").scrollTo(
                                        {
                                            duration: 1e3,
                                            animated: !0,
                                            position: e.offset().top - n
                                        })
                            }, t.fn.onClickScrollToID = function ()
                            {
                                t(this).on("click", function (e)
                                {
                                    e.preventDefault(), t(e.currentTarget).scrollToID()
                                })
                            }
                        }(window, jQuery);


                        !function (e, t)
                        {
                            "use strict";
                            var n;
                            n = function ()
                            {
                                function n(e)
                                {
                                    if (e.selector.length > 1)
                                    {
                                        var r = [];
                                        return t.each(e.selector, function ()
                                        {
                                            r.push(n.creer(t(this)))
                                        }), r
                                    }
                                    this.init(e)
                                }
                                return n.creer = function (e)
                                {
                                    return new n(
                                            {
                                                selector: e
                                            })
                                }, n.prototype = {
                                    init: function (n)
                                    {
                                        return this.selector = n.selector, this.parent = t(this.selector).parent(), t(e).on("scroll", t.proxy(this.scrooler, this)), this
                                    },
                                    scrooler: function ()
                                    {
                                        var n = t(e).scrollTop(),
                                                r = t(this.parent),
                                                i = t(this.parent).find(".container-text"),
                                                a = 15,
                                                o = 25,
                                                s = 4,
                                                l = Math.max(n - r.offset().top, 0);
                                        l -= i.position().top;
                                        var c = Math.round(Math.min(Math.max(o, o + l / s), 100)),
                                                u = Math.round(Math.max(Math.min(a, a - l / s / 4), 0));
                                        t(this.selector).removeAttr("style"), e.innerWidth > 640 && t(this.selector).css(
                                                {
                                                    filter: "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-webkit-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-moz-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-o-filter": "opacity(" + c + "%) blur(" + u + "px)",
                                                    "-ms-filter": "opacity(" + c + "%) blur(" + u + "px)"
                                                })
                                    },
                                    resizer: function () {
                                    }
                                }, n
                            }(), e.LMDimgFilter = n
                        }(window, jQuery);

                        jQuery(function ()
                        {
                            "use strict";
                            var e, t, n = function ()
                            {
                                t = document.body.clientWidth, e = window.innerHeight, jQuery(".item .header .container-text").removeAttr("style"), window.innerWidth > 640 && $.each(jQuery(".item .header"), function ()
                                {
                                    var e = jQuery(this).height(),
                                            t = jQuery(this).children(".container-text").height();
                                    jQuery(this).children(".container-text").css(
                                            {
                                                top: (e - t) / 2
                                            })
                                }), l()
                            };
                            jQuery(window).on("resize", n);
                            var r = function ()
                            {
                                n()
                            },
                                    i = function ()
                                    {
                                        new LMDimgFilter(
                                                {
                                                    selector: $(".item .article-bg")
                                                });
                                        jQuery(window).on("scroll", o), setTimeout(function ()
                                        {
                                            jQuery(window).trigger("resize")
                                        }, 1e3)
                                    };
                            jQuery(".main-container").on("applicationWillLaunch", r), jQuery(".main-container").on("applicationDidLaunch", i);
                            var a, o = function ()
                            {
                                l()
                            },
                                    s = !0,
                                    l = function ()
                                    {
                                        var t = jQuery(window).scrollTop() + 100;
                                        jQuery(".articles .nav div.menu-opener").removeClass("menu-opened");
                                        jQuery(".articles .nav ul").removeClass("visible");
                                        $.each(jQuery(".item"), function (n)
                                        {
                                            var r = Math.round(jQuery(this).offset().top),
                                                    i = Math.round(jQuery(this).height() - e),
                                                    o = r + i,
                                                    l = Math.min(o, Math.max(0, Math.round(t - r)));
                                            if (t >= r && o > t)
                                            {
                                                var c = e / 5 / i,
                                                        u = -l * c / 2;
                                                jQuery(this).find(".background-container").addClass("fixed"), jQuery(this).find(".bg").css(
                                                        {
                                                            top: u
                                                        })
                                            }
                                            else
                                                t >= o || (jQuery(this).find(".background-container").removeClass("fixed"), jQuery(this).find(".bg").css(
                                                        {
                                                            top: 0
                                                        }));
                                            t >= r - e / 10 && s && (a = n + 1)
                                        });
                                        c()
                                    },
                                    c = function ()
                                    {
                                        jQuery(".articles .nav ul li").removeClass("active"), jQuery("#article" + a).addClass("active")
                                    };
                            jQuery(".articles .nav ul li").on("click", function ()
                            {
                                a = jQuery(this).data("id"), c(), s = !1, setTimeout(function ()
                                {
                                    s = !0
                                }, 1e3)
                            })
                            jQuery(".articles .nav").on("click", function ()
                            {
                                jQuery(this).find("div.menu-opener").toggleClass("menu-opened");
                                jQuery(this).find("ul").toggleClass("visible");
                            })
                        });
                        var root = jQuery(".main-container"),
                                $application = jQuery(".main-container"),
                                MYEvents = {};
                        jQuery("div.not-printable footer").css({"position": "absolute", "width": "100%"})
                        !function (e, t)
                        {
                            "use strict";

                            function n()
                            {

                                t(".scroll-to-id").onClickScrollToID(), (t(document).on("scrollstart", function ()
                                {
                                    s = setInterval(r(), 30)
                                }), t(document).on("scrollstop", function ()
                                {
                                    clearInterval(s)
                                }));
                            }

                            function r()
                            {
                                t(e).trigger(MYEvents.applicationScroll)
                            }

                            function scrollPosition()
                            {
                                root.scrollTo(
                                        {
                                            position: 0,
                                            animated: !1
                                        })
                            }
                            MYEvents.applicationWillLaunch = "applicationWillLaunch", MYEvents.applicationDidLaunch = "applicationDidLaunch", MYEvents.applicationScroll = "applicationScroll";
                            var s;
                            $application.on("applicationWillLaunch", n), true, t(document).ready(function ()
                            {
                                var e = new MYLoader;
                                e.launchApplication();
                            })
                        }(window, jQuery);

                    }
                };
            }])
            .directive("grandArticleTemplate2", ['$window', function ($window) {
                return {
                    restrict: 'EA',
                    transclude: false,
                    scope: {
                        videoid: '@',
                        feed:'='
                    },
                    replace: true,
                    templateUrl: '../app/views/grand_article_template_2.html',
                    link: function (scope, element, attrs) {
                        $('footer').css('position','relative');
                        scope.x = {articleMenuShow: true};
                        $(window).scrollTop(0);
                        (function () {
                            var t, i = function (t, i) {
                                return function () {
                                    return t.apply(i, arguments)
                                }
                            };
                            t = function () {
                                function t() {
                                }
                                return t.prototype.LAUNCHING_LATENCY = 2e3, t.prototype.launchApplication = function () {
                                    return $application.addClass("loadstatus__unload").trigger(INSPEvent.applicationWillLaunch), $application.removeClass("loadstatus__unload").addClass("loadstatus__loading").trigger(INSPEvent.applicationDidLaunch)
                                }, t
                            }(), window.INSPLoader = t
                        }).call(this);
                        ;
                        !function (o, t) {
                            "use strict";

                            function n(o, t) {
                                var n = {};
                                for (var i in o)
                                    n[i] = o[i];
                                for (var i in t)
                                    n[i] = t[i];
                                return n
                            }
                            t.fn.scrollTo = function (o) {
                                var i = {
                                    position: 0,
                                    callback: null,
                                    animated: !1,
                                    duration: 1e3
                                };
                                o || (o = {}), o = n(i, o), o.animated || (o.duration = 10), t(this).stop().animate({
                                    scrollTop: o.position
                                }, o.duration, "easeInOutSine", o.callback)
                            }, t.fn.scrollToID = function () {
                                var o = t(t(this).attr("href")),
                                        n = o.data("scrolloffset") ? o.data("scrolloffset") : 0;
                                t("html,body").scrollTo({
                                    duration: 1e3,
                                    animated: !0,
                                    position: o.offset().top - n
                                })
                            }, t.fn.onClickScrollToID = function () {
                                t(this).on("click", function (o) {
                                    o.preventDefault(), t(o.currentTarget).scrollToID()
                                })
                            }
                        }(window, jQuery);
                        ;

                        !function (e, t) {
                            "use strict";
                            var s;
                            s = function () {
                                function s(e) {
                                    if (e.selector.length > 1) {
                                        var r = [];
                                        return t.each(e.selector, function () {
                                            r.push(s.creer({
                                                selector: t(this),
                                                selector_fixed: e.selector_fixed
                                            }))
                                        }), r
                                    }
                                    this.init(e)
                                }
                                return s.creer = function (e) {
                                    return new s(e)
                                }, s.prototype = {
                                    init: function (s) {
                                        return this.selector = s.selector, this.inner = t(this.selector).children("." + s.selector_fixed), this.timer, t(this.inner).removeClass("fixed").removeClass("bottom").addClass("top"), t(e).on("scroll", t.proxy(this.scrooler, this)), this.resizer(), t(e).on("resize", t.proxy(this.resizer, this)), this.touchstart(), this.scrooler(), this
                                    },
                                    touchstart: function () {
                                        this.timer = setInterval(t.proxy(this.scrooler, this), 5)
                                    },
                                    touchend: function () {
                                        clearInterval(this.timer)
                                    },
                                    scrooler: function () {
                                        var s = t(e).scrollTop();
                                        this.scroolerImg(s)
                                    },
                                    scroolerImg: function (e) {
                                        var s = 0,//this.selector.offset().top,
                                                r = 0 + this.selector.height() - this.h;//this.selector.offset().top + this.selector.height() - this.h;
                                        e >= s && r > e ? t(this.inner).hasClass("fixed") || t(this.inner).addClass("fixed") : e > r ? t(this.inner).attr({
                                            style: "none"
                                        }).removeClass("fixed").removeClass("top").addClass("bottom") : t(this.inner).attr({
                                            style: "none"
                                        }).removeClass("fixed").removeClass("bottom").addClass(s > e ? "top" : "top")
                                    },
                                    resizer: function () {
                                        this.h = e.innerHeight, this.l = e.innerWidth, this.scrooler()
                                    }
                                }, s
                            }(), e.LMDEffetfixedAuto = s
                        }(window, jQuery);
                        ;
                        !function (r, e) {
                            "use strict";
                            var t;
                            t = function () {
                                function t(r) {
                                    if (r.selector.length > 1) {
                                        var o = [];
                                        return e.each(r.selector, function () {
                                            o.push(t.creer(e(this)))
                                        }), o
                                    }
                                    this.init(r)
                                }
                                return t.creer = function (r) {
                                    return new t({
                                        selector: r
                                    })
                                }, t.prototype = {
                                    init: function (t) {
                                        return this.selector = t.selector, this.resizer(), e(r).on("scroll", e.proxy(this.scrooler, this)), e(r).on("touchmove", e.proxy(this.scrooler, this)), this
                                    },
                                    scrooler: function () {
                                        var t = e(r).scrollTop(),
                                                o = (r.innerHeight, r.innerWidth, e(this.selector).height()),
                                                i = Math.min(1.2, 1 + t / o / 4);
                                        i = Math.max(1, i), e(this.selector).css({
                                            "background-position": "center center",
                                            transform: "scale(" + i + ")"
                                        })
                                    },
                                    resizer: function () {
                                    }
                                }, t
                            }(), r.LMDbgZoomScroll = t
                        }(window, jQuery);
                        ;


                        $(function () {
                            var e, n, o = function () {
                                e = window.innerWidth, n = window.innerHeight, $.each($(".inner-titre"), function () {
                                    var e = $(this).children(".titre").position().top + $(this).children(".titre").height();
                                    $(this).css({
                                        height: e
                                    })
                                })
                            };
                            $(window).on("resize", o);
                            var t = function () {
                                var e = $(window).scrollTop(),
                                        n = $(".container-titres").offset().top,
                                        o = $(".intro").offset().top;
                                e >= o ? $(".container-general header .article-bg").addClass("relatived") : $(".container-general header .article-bg").removeClass("relatived"), e >= n ? $(".container-titres .nav-title").addClass("fixed") : $(".container-titres .nav-title").removeClass("fixed");
                                var t;
                                $.each($(".container-titres .container-titre"), function () {
                                    var n = $(this).offset().top - 35,
                                            o = n + $(this).height();
                                    e >= n && o > e && (t = $(this).attr("id"))
                                }), $(".container-titres .nav-title ul li").removeClass("actif"), $('.container-titres .nav-title ul li[data-id="' + t + '"]').addClass("actif")
                            },
                                    a = function () {
                                        o()
                                    },
                                    i = function () {
                                        new LMDbgZoomScroll({
                                            selector: $(".background-zoomer")
                                        }), new LMDEffetfixedAuto({
                                            selector: $(".container-titre"),
                                            selector_fixed: "article-bg"
                                        });
                                        o(), $(window).on("scroll", t)
                                    };
                            $(".article-container").on('applicationWillLaunch', a), $(".article-container").on('applicationDidLaunch', i)
                        });
                        ;
                        var navigationTracker, root = $("html,body"),
                                $application = $(".article-container"),
                                viewport = $(window),
                                INSPEvent = {};
                        !function (i, a) {
                            "use strict";

                            function n() {
                                a(".scroll-to-id").onClickScrollToID()
                            }

                            function l() {
                                root.scrollTo({
                                    position: 0,
                                    animated: !1
                                })
                            }
                            INSPEvent.applicationWillAppear = "applicationWillAppear", INSPEvent.applicationDidAppear = "applicationDidAppear", INSPEvent.applicationWillLaunch = "applicationWillLaunch", INSPEvent.applicationDidLaunch = "applicationDidLaunch", INSPEvent.applicationWillQuit = "applicationWillQuit", INSPEvent.viewWillAppear = "viewWillAppear", INSPEvent.viewDidAppear = "viewDidAppear", INSPEvent.viewWillLoad = "viewWillLoad", INSPEvent.viewDidLoad = "viewDidLoad", INSPEvent.viewWillDisappear = "viewWillDisappear", INSPEvent.viewDidDisappear = "viewDidDisappear", INSPEvent.viewWillUnload = "viewWillUnload", INSPEvent.viewDidUnload = "viewDidUnload", $application.on(INSPEvent.applicationWillLaunch, n), viewport.unload(function () {
                                l()
                            }), a(document).ready(function () {
                                var i = new INSPLoader;
                                i.launchApplication()
                            })
                        }(window, jQuery);
                    }
                };
            }])
        .directive('footerset', ['$window', function ($window) {
                return {
                    link: link,
                    restrict: 'EA'
                };
                function link(scope, element, attrs) {

                    var bodyHeight = $(window).height();
                    if ((bodyHeight - 200) > 650) {
                        $('.webcontent-view').css({'min-height': bodyHeight - 200});
                    }
                    angular.element($window).bind('resize', function () {
                        bodyHeight = $(window).height();
                        if ((bodyHeight - 200) > 660) {
                            $('.webcontent-view').css({'min-height': bodyHeight - 200});
                        } else {
                            $('.webcontent-view').css({'min-height': 650});
                        }
                    });
                }
            }])

                    //            Textarea expand Height
        .directive('expandableTextarea', ['$window', function () {
                return {
                    link: link,
                    restrict: 'EA'
                };
                function link(scope) {
                    var observe;
                    if (window.attachEvent) {
                        observe = function (element, event, handler) {
                            element.attachEvent('on' + event, handler);
                        };
                    }
                    else {
                        observe = function (element, event, handler) {
                            element.addEventListener(event, handler, false);
                        };
                    }
                    scope.init = function (id) {
                        var text = document.getElementById(id);
                        function resize() {
                            text.style.height = 'auto';
                            text.style.height = text.scrollHeight + 'px';
                        }
                        /* 0-timeout to get the already changed text */
                        function delayedResize() {
                            window.setTimeout(resize, 0);
                        }
                        observe(text, 'change', resize);
                        observe(text, 'cut', delayedResize);
                        observe(text, 'paste', delayedResize);
                        observe(text, 'drop', delayedResize);
                        observe(text, 'keydown', delayedResize);

                        text.focus();
                        text.select();
                        resize();
                    }
                }
            }])
            .directive('filePreview', ['$timeout', '$rootScope', '$filter', function (timer, $rootScope, $filter) {
                return {
                    restrict: 'AE',
                    replace: true,
                    scope: {
                        file: '=',
                        fileType: '=',
                        click: "&",
                        closepop1:"&"
                    },
                    templateUrl: '../app/views/containers/file_preview_details.tpl.html',
                    link: function (scope, element, attrs) {
                        scope.closePopup=function(){
                            scope.closepop1();
                        }
                        scope.videoTypeFlag = function (url) {
                            if (url.substring(0, 4) == 'http') {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        //element.css("background-color", "red");
                        var windowWidth = window.innerWidth;
                        var windowHeight = window.innerHeight;
                        var elementWidth = element.width();
                        var thumbsize = 100;
                        scope.currentIndex = 0;
                        if (scope.fileType == 'document') {
                            var thumbsize = 72;
                        }
                        var sliderWidth = 0;
                        if (windowWidth > windowHeight) {
                            sliderWidth = windowHeight
                        }
                        else {
                            sliderWidth = windowWidth;
                        }

                        if (windowWidth <= 500) {
                            thumbsize = 50;
                        }
                        var carousel = null;
                        var slider = null;
                        var applySlider = function () {
                            slider = jQuery('#bx-slider').bxSlider({
                                mode: 'fade',
                                slideWidth: windowHeight,
                                pager: false,
                                adaptiveHeight: true,
                                onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                                },
                                onSliderLoad: function () {
                                    if ('document' == scope.fileType) {
                                        scope.currentIndex = 0;
                                        if('pdf' == $filter('getTypeByFileName')(scope.file.url)
                                        		|| 'ppt' == $filter('getTypeByFileName')(scope.file.url)
                                        		|| 'doc' == $filter('getTypeByFileName')(scope.file.url)
                                        		|| 'xls' == $filter('getTypeByFileName')(scope.file.url)){
                                        	pdfViewerLoader(scope.file.pdfUrl, 0);
                                        }
                                    }

                                },
                                onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                                    scope.currentIndex = newIndex;
                                }
                            });
                            var bxSliderOpns = {
                                minSlides: 1,
                                maxSlides: 4,
                                slideWidth: thumbsize,
                                slideMargin: 10,
                                infiniteLoop: false,
                                pager: false
                            };
                            if (scope.fileType == "video") {
                                bxSliderOpns.video = true;
                                bxSliderOpns.useCSS = false;
                            }
                            carousel = jQuery('#bxthumb-slider').bxSlider(bxSliderOpns);
                        };

                        //Set hidden element if gallery type is 'document'
                        if ('document' == scope.fileType) {
                            jQuery(element).hide();
                        }
                        setTimeout(function () {
                            applySlider();
                            if ('document' == scope.fileType) {
                                jQuery(element).show();
                                slider.redrawSlider();
                            }
                        }, 200);


                        $rootScope.$on('redrawSlider', function (evt, data) {
                            timer(function () {
                                if (slider && carousel) {
                                    slider.redrawSlider();
                                    carousel.redrawSlider();
                                }
                            });
                        });
                        $rootScope.$on('reloadSlider', function (evt, data) {
                            timer(function () {
                                if (slider && carousel) {
                                    slider.reloadSlider();
                                    carousel.reloadSlider();
                                }
                            });
                        });

                        scope.clicked = function (position) {
                            slider.goToSlide(position);
                            scope.currentIndex = position;
                        };
                        scope.$on('$destroy', function () {
                            scope.file = null;
                            slider = null;
                        });

                        scope.fullscreenImageSingle=function () {
                          var fullScreenObj1 = document.getElementById('imagesId');
                          scope.fullScreenFunc(fullScreenObj1);
                        }
                        scope.fullScreenFunc=function(obj){
                          if (obj.requestFullscreen) {
                            obj.requestFullscreen();
                          }
                          else if (obj.mozRequestFullScreen) {
                            obj.mozRequestFullScreen();
                          }
                          else if (obj.webkitRequestFullScreen) {
                            obj.webkitRequestFullScreen();
                          }
                        }
                    }

                };
            }]);
