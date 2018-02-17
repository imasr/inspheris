angular.module('inspherisProjectApp')
        .controller('MainMenuCtrl', function ($scope, $timeout, $rootScope, userRights, $window, apiSearch, authService, ngDialog, $http, confirmModal, offCanvas, apiUsefulLinks) {
            $scope.usefulLinks = [];
            $scope.submenuFlag = false;
            $scope.showSubmenu = function () {
                if ($scope.submenuFlag) {
                    $scope.submenuFlag = false;
                }
                else {
                    $scope.submenuFlag = true;
                }
            };
            $scope.menuObj = {
                wMenuToggle: false,
                setDisabled: false,
                hideWidget: true
            };
            //Widget menu toggle for small screen 
            $scope.toggleWidgetClick = function (flag) {
                $scope.menuObj.setDisabled = true;
                $timeout(function () {
                    $scope.menuObj.setDisabled = false;
                }, 1000)
                $rootScope.$broadcast('widgetMenuToggle', flag);
                jQuery(".widget-nav .widget-nav-menu-opener").toggleClass("menu-opened");
                jQuery(".widget-nav .btn-group-justified").toggleClass("visible");
            };

            $('body').on('click', function (e) {
                if ($(e.target).closest('.widget-nav').length >= 1 || $(e.target).closest('.widget-header-menu').length >= 1) {
                    e.stopPropagation();
                } else {
                    if ($scope.menuObj.wMenuToggle) {
                        $rootScope.$broadcast('widgetMenuToggle', false);
                        jQuery(".widget-nav .widget-nav-menu-opener").removeClass("menu-opened");
                        jQuery(".widget-nav .btn-group-justified").removeClass("visible");
                        $scope.menuObj.wMenuToggle = false;
                    }
                }
            });
            
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $(window).scrollTop(0);
                if (toState.name == 'app.home' || toState.name == 'app.communityHome' || toState.name == 'app.communityHomeWithTab' || toState.name == 'app.myprofile') {
                    $scope.menuObj.hideWidget = true;
                } else {
                    $scope.menuObj.hideWidget = false;
                }
                $scope.menuObj.wMenuToggle = false;
            });

            $scope.showContentCreationOptns = userRights.userCanCreateContent($rootScope.userData);
   	        $scope.showNoteDeServiceCreationOptns = userRights.isUserHasRightToCreateNoteDeService($rootScope.userData);

            /*
             $scope.logout=function(){
             ngDialog.open({
             template:'<div class="modal-dialog"><div class="modal-content">\n'+
             '<div class="modal-header"><div class="modal-title"><h4>Log out</h4></div></div>\n'+
             '<div class="modal-body">Do you want log out?</div>\n'+
             '<div class="modal-footer">\n'+
             '<button type="button" class="btn btn-primary" ng-click="logoutConfirmed()">Yes</button>\n'+
             '<button type="button" class="btn btn-default" ng-click="closeThisDialog(\'button\')">No</button>\n'+
             '</div>\n'+
             '</div></div>', 
             controller: 'MainMenuCtrl',
             plain: true
             });
             };
             */
            $scope.showUsefulLinks = function (e) {
                apiUsefulLinks.showLinksData({footer: false}).then(function (data) {
                    $scope.usefulLinks = data;
                }, function (err) {
                    // body...
                });
            };

            $scope.stopDefault = function (e) {
                e.stopPropagation();
                //e.preventDefault();
            };
            $scope.showSubsection = function (e, index) {
                e.stopPropagation();
                //e.preventDefault();
                $scope.usefulLinks[index].isOpen = !$scope.usefulLinks[index].isOpen;
            };
            $scope.logoutConfirmed = function () {
                ngDialog.close();
                authService.clearCredentials();
                //window.location.href = "#/login";
                window.location.href = "/logout";
            };

            $scope.logout = function () {
                var modal = confirmModal.showTranslated($scope, {title: "Log out", message: "do_you_want_to_logout"});
                modal.closePromise.then(function (data) {
                    if (data.value == 'ok') {
                        $scope.logoutConfirmed();
                    }
                });
            };
            $scope.refreshFeeds = function () {
                $rootScope.$broadcast('home.feeds.refresh', {from: "Home"});
            };


            //*** specific for canal ***
            var closeCustomLinkMenu = function () {
                if ($("#custom").hasClass("in")) {
                    //$("#custom" ).removeClass("in");
                    $('#custom').collapse('hide');
                }
            };
            $scope.closeCustomLinkMenu = function () {
                closeCustomLinkMenu();
            }
            $(document).click(function (event) {
                if (!$(event.target).closest('#custom').length) {
                    closeCustomLinkMenu();
                }
            });
            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
                if(from.name == "app.newStaticArticle"){
                    $(window).off('scroll');
                }
                closeCustomLinkMenu();
            });

            if ($rootScope.customTemplate.logo) {
                $scope.logo = $rootScope.customTemplate.logo.image;
            }


        })
        .controller('navCtrl', function ($scope, $rootScope, offCanvas) {
            this.toggle = offCanvas.toggle;
        })
        .factory('offCanvas', function (cnOffCanvas) {
            return null;
            /*
             return cnOffCanvas({
             controller: 'navCtrl',
             controllerAs: 'nav',
             templateUrl: '../app/views/containers/offcanvas_nav.tpl.html'
             });
             */
        });