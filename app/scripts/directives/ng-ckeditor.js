(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'ckeditor'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
var app = angular.module('ngCkeditor', []);
var $defer, loaded = false;

app.run(['$q', '$timeout', function($q, $timeout) {
    $defer = $q.defer();

    if (angular.isUndefined(CKEDITOR)) {
        throw new Error('CKEDITOR not found');
    }
    CKEDITOR.disableAutoInline = true;
    function checkLoaded() {
        if (CKEDITOR.status == 'loaded') {
            CKEDITOR.config.filebrowserUploadUrl = '/api/mediamanager/upload-file';
            CKEDITOR.config.basicEntities = false;
            CKEDITOR.config.entities = false;
            CKEDITOR.config.entities_greek = false;
            CKEDITOR.config.entities_latin = false;
            CKEDITOR.config.htmlEncodeOutput = false;
            CKEDITOR.config.entities_processNumerical = false;
            CKEDITOR.config.enterMode = CKEDITOR.ENTER_DIV;
            
            loaded = true;
            $defer.resolve();
        } else {
            checkLoaded();
        }
    }
    CKEDITOR.on('loaded', checkLoaded);
    $timeout(checkLoaded, 100);
}])

app.directive('ckeditor', ['$timeout', '$q', function ($timeout, $q) {
    'use strict';

    return {
        restrict: 'AC',
        require: ['ngModel', '^?form'],
        scope: false,
        link: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0];
            var form    = ctrls[1] || null;
            var EMPTY_HTML = '<p></p>',
                isTextarea = element[0].tagName.toLowerCase() == 'textarea',
                data = [],
                isReady = false;
            var current_instance = null;
            if (!isTextarea) {
                element.attr('contenteditable', true);
            }

            var onLoad = function () {
                var options = {
                    toolbar: 'full',
                    toolbar_full: [
                        { name: 'basicstyles',
                            items: [ 'Bold', 'Italic', 'Underline' ] }, //'Strike',
                        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList'] },//, 'Blockquote'
                        { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
                        '/',
                        { name: 'styles', items: [ 'FontSize', 'TextColor', 'PasteFromWord', 'RemoveFormat' ] }, //'Format', 'PasteText',
                        { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },
                        { name: 'forms', items: [ 'Outdent', 'Indent' ] },
                        { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                        { name: 'document', items: [ 'Source' ] }//'PageBreak',
                    ],
                    disableNativeSpellChecker: false,
                    uiColor: '#FAFAFA',
                    height: '400px',
                    width: '100%'
                };
                options = angular.extend(options, scope[attrs.ckeditor]);

                //Set Compatible for android user agents
                CKEDITOR.env.isCompatible = true;
                var instance = (isTextarea) ? CKEDITOR.replace(element[0], options) : CKEDITOR.inline(element[0], options),
                    configLoaderDef = $q.defer();

                element.bind('$destroy', function () {
                    for(name in CKEDITOR.instances){
                        if(name == current_instance){
                            CKEDITOR.instances[name].destroy(false);
                        }
                    }
                    /*instance.destroy(
                        false //If the instance is replacing a DOM element, this parameter indicates whether or not to update the element with the instance contents.
                    );*/
                });
                var setModelData = function(setPristine) {
                    var data = instance.getData();
                    if (data == '') {
                        data = null;
                    }
                    $timeout(function () { // for key up event
                        (setPristine !== true || data != ngModel.$viewValue) && ngModel.$setViewValue(data);
                        (setPristine === true && form) && form.$setPristine();
                    }, 0);
                }, onUpdateModelData = function(setPristine) {
                    if (!data.length) { return; }


                    var item = data.pop() || EMPTY_HTML;
                    isReady = false;
                    instance.setData(item, function () {
                        setModelData(setPristine);
                        isReady = true;
                    });
                }

                //instance.on('pasteState',   setModelData);
                instance.on('change',       setModelData);
                instance.on('blur',         setModelData);
                //instance.on('key',          setModelData); // for source view

                instance.on('instanceReady', function() {
                    scope.$broadcast("ckeditor.ready");
                    scope.$apply(function() {
                        onUpdateModelData(true);
                    });

                    instance.document.on("keyup", setModelData);
                });
                instance.on('customConfigLoaded', function() {
                    configLoaderDef.resolve();
                });

                ngModel.$render = function() {
                    data.push(ngModel.$viewValue);
                    if (isReady) {
                        onUpdateModelData();
                    }
                };
                current_instance = instance.name;//store current instance name
            };

            if (CKEDITOR.status == 'loaded') {
                loaded = true;
            }
            if (loaded) {
                onLoad();
            } else {
                $defer.promise.then(onLoad);
            }

            scope.$on('rebuild.ckeditor', function(event, data){
                    
                    CKEDITOR.instances[current_instance].destroy();
                    onLoad();
                });
        }
    };
}]);

    return app;
}));