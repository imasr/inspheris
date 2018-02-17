'use strict';
angular.module('inspherisProjectApp')
.service('notifyModal', ['notify', '$translate', '$filter', function(notify, $translate, $filter) {
  notify.config({
    duration: 3000,
    startTop: 0,
    position: 'center'
  });
  this.show = function(msg, msgType){
    //pass class as 'success' or 'error'
    notify({
      message: msg,
      classes: msgType
    });
  };
  this.showTranslated = function(msg, msgType, params){
    //pass class as 'success' or 'error'
    notify({
        message: $filter('translate')(msg, params),
        classes: msgType
      });
  };
}])
.service('uiModals', ["ngDialog", function(ngDialog) {
  var modalService = {};
  modalService.alertModal = function($scope, title, message){
    var modal = ngDialog.open({
        template:'<div class="modal-dialog"><div class="modal-content">\n'+
              '<div class="modal-header"><div class="modal-title"><h4>'+title+'</h4></div></div>\n'+
                '<div class="modal-body">'+message+'</div>\n'+
                '<div class="modal-footer">\n'+
                  '<button type="button" class="btn btn-default" ng-click="closeThisDialog(\'ok\')">OK</button>\n'+
                '</div>\n'+
              '</div></div>',
        plain: true,
        scope: $scope
      });
      return modal;
  };
  modalService.progressModal = function($scope, title, message){
	  var modal = ngDialog.open({
		  template:'<div class="modal-dialog"><div class="modal-content">\n'+
		  				'<div class="modal-header"><div class="modal-title"><h4>'+title+'</h4></div></div>\n'+
		  					'<div class="modal-body">'+message+'</div>\n'+
		  			'</div></div>',
	        plain: true,
	        scope: $scope
	      });
	      return modal;
  };
  return modalService;
}])

.service('confirmModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function($scope, title, message){
    if(modal){
      modal.close();
    }
    modal = ngDialog.open({
      template:'<div class="modal-dialog"><div class="modal-content">\n'+
              '<div class="modal-header"><div class="modal-title"><h4>'+title+'</h4></div></div>\n'+
              '<div class="modal-body">'+message+'</div>\n'+
              '<div class="modal-footer">\n'+
                '<button type="button" class="btn btn-primary" ng-click="closeThisDialog(\'ok\')">Yes</button>\n'+
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(\'cancel\')">No</button>\n'+
              '</div>\n'+
          '</div></div>',
      plain: true,
      scope: $scope
    });
    return modal;
  };
  this.showTranslated = function($scope, modalData){
    var modal = null;
    if(modal){
      modal.close();
    }
    modal = ngDialog.open({
      template:'../app/views/containers/confirm_dialog.tpl.html',
      scope: $scope,
      data: modalData
    });
    return modal;
  };
  this.showSaveDraftConfirm = function($scope, modalData){
    var modal = null;
    if(modal){
      modal.close();
    }
    modal = ngDialog.open({
      template:'../app/views/containers/save_quit_continue_confirm.tpl.html',
      scope: $scope,
      data: modalData
    });
    return modal;
  };
}])
.service('cropImagesModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(mdata){
    modal = ngDialog.open({
      template: '../app/views/popups/images_crop.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0',
      closeByEscape: false,
      data: mdata
    });
    return modal;
  };
}])
.service('managerImagesModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(mdata){
    modal = ngDialog.open({
      template: '../app/views/popups/images_manager.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0',
      closeByEscape: false,
      data: mdata
    });
    return modal;
  };
}])
.service('galleryModal', ["ngDialog", function(ngDialog) {
  var galleryPopup = "";
  this.show = function(imgArr){
    galleryPopup = ngDialog.open(
      {
        template: '../app/views/popups/image_video_viewer.tpl.html',
        showClose: false,
        className: 'full_screen_popup',
        closeByEscape: false,
        closeByDocument: true,
        data: imgArr
      }
      );

      
      setTimeout(function() {
        ResetEditPopupHeaderToDefault();
        setTimeout(function() {
          ResetEditPopupHeader();   
        }, 500);
      }, 1500);
  };
  this.hide = function(){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(galleryPopup.id);
  };

}])
.service('generalSearchModal', ["ngDialog", "ModalService", function(ngDialog, ModalService) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(searchData){
    /*
    modal = ngDialog.open({
      template: '../app/views/popups/general_search.tpl.html',
      showClose: false,
      className: 'full_screen_popup',
      closeByEscape: false,
      closeByDocument: false,
      data: searchData
    });
    */
    modal = ModalService.showModal({
      templateUrl: '../app/views/popups/general_search.tpl.html',
      controller: "GeneralSearchCtrl",
      inputs: {modalData: searchData}
    });
    return modal;
  };
}])
.service('fileDetailEditorModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(fileArr){
    modal = ngDialog.open(
      {
        template: '../app/views/popups/file_detail_editor.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level1',
        closeByEscape: false,
        data: fileArr
      }
    );
  };
  this.hide = function(){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(modal.id);

  };
}])
.service('editQuickpostModal', ["ngDialog", function(ngDialog) {
  /*
  var popup = "";
  this.show = function($scope, data){
    popup = ngDialog.open(
      {
        template: '../app/views/popups/edit_quickpost.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level1',
        scope: $scope,
        data: data
      }
      );
  };
  this.hide = function(){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(popup.id);
  };
  */
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(modalData){
    modal = ngDialog.open({
      template: '../app/views/popups/edit_quickpost.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      data: modalData
    });
    return modal;
  };
  this.hide = function(){
	    ngDialog.close(modal.id);
  };
}])
.service('collectionArticleDetail', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(feeds){
    modal = ngDialog.open(
        {
          template: '../app/views/popups/article_detail_collection.tpl.html',
          showClose: false,
          className: 'inspopup-theme-level0',
          closeByEscape: false,
           closeByDocument: true,
          data: feeds
        }
      );
  };
  /*
    this.hide = function(){
      //this boolvalue is passed to preCloseCallback function
      ngDialog.close(popup.id);
    };
  */
}])
.service('createArticleModal', ["ngDialog", function(ngDialog) {
  var createArticlePopup = "";
  this.show = function($scope, editdata){
    createArticlePopup = ngDialog.open(
      {
        template: '../app/views/popups/create_article.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: false,
        scope: $scope,
        data: editdata
        /*preCloseCallback: function(value) {
          if(value){
            return true;
          }
          else{
            if(confirm('Are you sure you want to close without saving your changes?')) {
                    return true;
                }
                return false;
          }
        }*/
      }
    );
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(createArticlePopup.id, boolvalue);
  };
  /*var createArticlePopup = "";
  this.show = function($scope){
    createArticlePopup = ngDialog.open(
      {
        template: '../app/views/popup_create_article.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: false,
        scope: $scope,
        preCloseCallback: function(value) {
          if(value){
            return true;
          }
          else{
            if(confirm('Are you sure you want to close without saving your changes?')) {
                    return true;
                }
                return false;
          }
        }
      }
    );
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    //ngDialog.close(createArticlePopup.id, boolvalue);
    createArticlePopup.close();
  };*/
}])

.service('createYammerModal', ["ngDialog", function(ngDialog) {
  var popup = "";
  this.show = function($scope, editdata){
    popup = ngDialog.open(
      {
        template: '../app/views/popups/create_yammer.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: false,
        scope: $scope,
		data: editdata,
		controller: 'YammerEmbedCtrl',
      }
    );
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(popup.id, boolvalue);
  };
 
}])
.service('documentViewerModal', ["ngDialog", function(ngDialog) {
  var popup = "";
  this.show = function(modalData){
    popup = ngDialog.open(
      {
        template: '../app/views/popups/document_viewer.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: true,
        data: modalData
      }
    );
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(popup.id, boolvalue);
  };
}])
.service('carouselManagerModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(){
    modal = ngDialog.open(
        {
          template: '../app/views/popups/carousel_manager.tpl.html',
          showClose: false,
          className: 'inspopup-theme-level0',
          closeByEscape: false,
          closeByDocument: true,
        }
      );
  };
  this.hide = function(){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(modal.id);
  };
}])
.service('createCarouselModal', ["ngDialog", function(ngDialog) {
  var ccmModal = null;
  this.show = function(modalData){
    if(ccmModal && ccmModal.id){
      //ngDialog.close(ccmModal.id);
      ccmModal.close();
    }
    ccmModal = ngDialog.open(
      {
        template: '../app/views/popups/create_carousel.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: true,
        data: modalData
      }
    );
    return ccmModal;
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(modal.id, boolvalue);
  };
}])
.service('createCommunityModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(cdata){
    modal = ngDialog.open(
      {
        template: '../app/views/popups/create_community.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: true,
        data: cdata
      }
    );
    return modal;
  };
  /*
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(modal.id, boolvalue);
  };
  */
}])
.service('previewArticleModal', ["ngDialog", function(ngDialog) {
  var previewArticlePopup = "";
  this.show = function($scope, previewdata){
    previewArticlePopup = ngDialog.open(
      {
        template: '../app/views/popups/preview_article.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: true,
        scope: $scope,
        data: previewdata
      }
    );
  };
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(previewArticlePopup.id, boolvalue);
  };
}])
.service('selectCommunityModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(commarr){
    modal = ngDialog.open({
      template: '../app/views/popups/select_community.tpl.html',
      showClose: false,
      data: commarr,
      className: 'inspopup-theme-level1'
    });
    return modal;
  };
}])
.service('userManagerModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(mdata){
    modal = ngDialog.open({
      template: '../app/views/popups/user_manager.tpl.html',
      showClose: false,
      data: mdata,
      className: 'inspopup-theme-level1'
    });
    return modal;
  };
}])
.service('createUserModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(userdata){
    modal = ngDialog.open({
      template: '../app/views/popups/create_user.tpl.html',
      showClose: false,
      data: userdata,
      className: 'inspopup-theme-level1'
    });
    return modal;
  };
}])
.service('organizationManagerModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(){
    modal = ngDialog.open({
      template: '../app/views/popups/organization_management.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1'
    });
    return modal;
  };
}])
.service('createOrganizationModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(editdata){
    modal = ngDialog.open({
      template: '../app/views/popups/create_organization.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      data: editdata
    });
    return modal;
  };
}])
.service('selectLocationModal', ["ngDialog", function(ngDialog) {
  var selLoca = '';
  this.show = function(){
    selLoca = ngDialog.open({ template: '../app/views/popups/choose_location.tpl.html', showClose: false, className: 'inspopup-theme-level1'});
  };
  this.hide = function(){
    ngDialog.close(selLoca.id);
  };
}])
.service('selectHeaderImageModal', ["ngDialog", function(ngDialog) {
  var selHeaderImg = "";
  this.show = function($scope, sharedata){
    selHeaderImg = ngDialog.open({
      template: '../app/views/popup_select_header_image.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope,
      data : sharedata
    });
  };
  this.hide = function(){
    ngDialog.close(selHeaderImg.id);
  };
}])
.service('selectImageModal', ["ngDialog", function(ngDialog) {
  var selHeaderImg = "";
  this.show = function($scope, ctrl){
    selHeaderImg = ngDialog.open({
      template: '../app/views/popups/image_select.tpl.html',
      showClose: false,
      controller: ctrl,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
  };
  this.hide = function(){
    ngDialog.close(selHeaderImg.id);
  };
}])
.service('selectPeopleModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function(peoples){
    modal = ngDialog.open({
      template: '../app/views/popups/invite_people.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      data: peoples
    });
    return modal;
  };
}])
.service('videoUrlModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function($scope){
    modal = ngDialog.open({
      template: '../app/views/popups/video_url.tpl.html',
      controller: 'VideoUrlCtrl',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
    return modal;
  };
  this.hide = function(){
    ngDialog.close(videoUrl.id);
  };
}])
.service('videoBrowsePreviewModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function($scope, data){
      $scope.videoPreviewData = data;
    modal = ngDialog.open({
      template: '../app/views/popups/video_browse_preview.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
    return modal;
  };
  this.hide = function(){
    ngDialog.close(modal.id);
  };
}])
.service('canalUrlModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function($scope){
    modal = ngDialog.open({
      template: '../app/views/popups/canal_video.tpl.html',
      controller: 'CanalUrlCtrl',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
    return modal;
  };
  this.hide = function(){
    ngDialog.close(canalUrl.id);
  };
}])
.service('shareFeedModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(sharedata){
    modal = ngDialog.open({
      template: '../app/views/popups/share.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0',
      data: sharedata
    });
  };
}])
.service('browseImageModal', ["ngDialog", "ModalService", function(ngDialog, ModalService) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function($scope, imgData){
    modal = ngDialog.open({
      template: '../app/views/popups/browse_images.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      scope: $scope,
      data: imgData
    });
    return modal;
  };
}])
.service('browseVideoModal', ["ngDialog", "ModalService", function(ngDialog, ModalService) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function($scope, imgData){
    modal = ngDialog.open({
      template: '../app/views/popups/browse_video.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      scope: $scope,
      data: imgData
    });
    return modal;
  };
}])
.service('browseDocumentModal', ["ngDialog", function(ngDialog) {
  var popup = "";
  this.show = function($scope, docData){
    popup = ngDialog.open({
      template: '../app/views/popups/browse_documents.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0',//inspopup-theme-level1
      scope: $scope,
      data: docData
    });
    return popup;
  };
}])
.service('editCommentModal', ["ngDialog", function(ngDialog) {
  var popup = null;
  if(popup){
	  popup.close();
  }
  this.show = function($scope, cmntdata){
    popup = ngDialog.open({
      template: '../app/views/popups/comment_edit.tpl.html',
      //controller: 'CommentEditCtrl',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope,
      data: cmntdata
    });
  };
  this.hide = function(){
    ngDialog.close(popup.id);
  };
}])
.service('requestCommunityModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(cmntdata){
    modal = ngDialog.open({
      template: '../app/views/popups/request_community.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level1',
      data: cmntdata
    });
    return modal;
  };
  /*
  this.hide = function(){
    ngDialog.close(popup.id);
  };
  */
}])
.service('widgetManagerModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(){
    modal = ngDialog.open({
      template: '../app/views/popups/widget_manager.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0' //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('addWidgetModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(widgetData){
    modal = ngDialog.open({
      template: '../app/views/popups/create_widget.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: widgetData
    });
    return modal;
  };
}])
.service('usefulLinkManagerModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(pd){
    modal = ngDialog.open({
      template: '../app/views/popups/usefullink_manager.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: pd
    });
    return modal;
  };
}])
.service('createLinkOrHeadingModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(modalData){
    modal = ngDialog.open({
      template: '../app/views/popups/create_link_or_heading.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: modalData
    });
    return modal;
  };
}])
.service('attributeManagerModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(modalData){
    modal = ngDialog.open({
      template: '../app/views/popups/attribute_manager.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: modalData
    });
    return modal;
  };
}])
.service('createAttributeModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(modalData){
    modal = ngDialog.open({
      template: '../app/views/popups/create_attribute.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: modalData
    });
    return modal;
  };
}])
.service('commentViewerModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(modalData){
    modal = ngDialog.open({
      template: '../app/views/popups/comment_viewer.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: modalData
    });
    return modal;
  };
}])
.service('customActionsModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(md){
    modal = ngDialog.open({
      template: '../app/views/popups/usermanager_actions.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: md
    });
    return modal;
  };
}])
.service('communityMemberMgrModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(md){
    modal = ngDialog.open({
      template: '../app/views/popups/community_member_manager.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: md
    });
    return modal;
  };
}])
.service('memberViewerModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(md){
    modal = ngDialog.open({
      template: '../app/views/popups/member_viewer.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
      data: md
    });
    return modal;
  };
}])


/*****nethys Widget****/
.service('foodTruckModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
	  modal.close();
  }
  this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/foodtruck_widget.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('bikeBookingModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
	  modal.close();
  }
  this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/create_bike_booking.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])

/***changePassword***/

.service('changePasswordModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  this.show = function(){
    modal = ngDialog.open({
      template: '../app/views/popups/change_password.tpl.html',
      showClose: false,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('statisticReportModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function(){
	    modal = ngDialog.open({
	      template: '../app/views/popups/statistic_report.tpl.html',
	      showClose: false,
	      className: 'inspopup-theme-level0' //inspopup-theme-level1
	    });
	    return modal;
	  };
}])
.service('digestModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function(){
	    modal = ngDialog.open({
	      template: '../app/views/popups/digest.tpl.html',
	      showClose: false,
	      className: 'inspopup-theme-level0' //inspopup-theme-level1
	    });
	    return modal;
	  };
}])
.service('createDigestModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/create_distget.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('digestChooseContent', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/digest_choose_content.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('digestPreview', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, data){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/digest_preview.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: data
	      }
	    );
		  return modal;
	  };
}])
.service('visitorModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/visitor.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('LinkEmbedModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function($scope){
    modal = ngDialog.open({
      template: '../app/views/popups/link_embed.tpl.html',
      controller: 'LinkEmbedCtrl',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
    return modal;
  };
  this.hide = function(){
    ngDialog.close();
  };
}])
.service('configureNotificationModal', ["ngDialog", function(ngDialog) {
  var modal = "";
  this.show = function($scope){
    modal = ngDialog.open({
      template: '../app/views/popups/configureNotification.tpl.html',
      controller: 'ConfigureNotificationCtrl',
      showClose: false,
      className: 'inspopup-theme-level1',
      scope: $scope
    });
    return modal;
  };
  this.hide = function(){
    ngDialog.close();
  };
}])
.service('followerModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/follower.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('configureProfileCustomFieldModal', ["ngDialog", function(ngDialog) {
	var modal = "";
	this.show = function($scope){
		modal = ngDialog.open({
			template: '../app/views/popups/configure_profile_custom_field.tpl.html',
			showClose: false,
			className: 'inspopup-theme-level1',
			scope: $scope
	    });
	    return modal;
	};

	this.hide = function(){
	    ngDialog.close();
	};
}])
.service('privateMessageModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/private_message.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('birthdayModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/birthday_popup.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('participantModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/participant_popup.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('notificationParticipantModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
	    modal.close();
	}
	this.show = function($scope, data){
    modal = ngDialog.open({
      template: '../app/views/popups/notification_participant_popup.tpl.html',
      showClose: false,
      scope: $scope,
      data: data,
      className: 'inspopup-theme-level0', //inspopup-theme-level1
    });
    return modal;
  };
}])
.service('alertModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function(){
	    modal = ngDialog.open({
	      template: '../app/views/popups/alert.tpl.html',
	      showClose: false,
	      className: 'inspopup-theme-level0'
	    });
	    return modal;
	  };
}])
.service('createAlertModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/create_alert.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('pinCommunityModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/pin_community.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('noteModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function(){
	    modal = ngDialog.open({
	      template: '../app/views/popups/note.tpl.html',
	      showClose: false,
	      className: 'inspopup-theme-level0'
	    });
	    return modal;
	  };
}])
.service('createNoteModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/create_note.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('allNotesModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function(){
	    modal = ngDialog.open({
	      template: '../app/views/popups/all_notes_popup.tpl.html',
	      showClose: false,
	      className: 'inspopup-theme-level0'
	    });
	    return modal;
	  };
}])
.service('termsConditionModal', ["ngDialog", function (ngDialog) {
        var modal = null;
        var modalpolicy = null;
        this.show = function ($scope) {
        	if (modal) {
                modal.close();
            }
            modal = ngDialog.open({
                template: '../app/views/popups/terms_conditions.tpl.html',
                scope: $scope,
                className: 'full_screen_popup terms-class',
                closeByDocument: false
            });
            return modal;
	};

        this.showPolicyPDF = function ($scope) {
            if (modalpolicy) {
                modalpolicy.close();
            }
            modalpolicy = ngDialog.open({
                template: '../app/views/popups/policy_popup.tpl.html',
                scope: $scope,
                className: 'full_screen_popup terms-class'
            });
            return modalpolicy;
        };
}])
.service('statUserDetailsReportModal', ["ngDialog", function(ngDialog) {
	  var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, data){
		  modal = ngDialog.open({
			  template: '../app/views/popups/user_details_report.tpl.html',
			  showClose: false,
			  className: 'inspopup-theme-level0',
			  scope: $scope,
			  data: data
		  });
		  return modal;
	  };
}])
.service('CreateFileBrowseModal', ["ngDialog", function(ngDialog) {
  var modal = null;
  if(modal){
    modal.close();
  }
  this.show = function(cdata){
    modal = ngDialog.open(
      {
        template: '../app/views/popups/file_browse_popup.tpl.html',
        showClose: false,
        className: 'inspopup-theme-level0',
        closeByEscape: false,
        closeByDocument: true,
        data: cdata
      }
    );
    return modal;
  };
  /*
  this.hide = function(boolvalue){
    //this boolvalue is passed to preCloseCallback function
    ngDialog.close(modal.id, boolvalue);
  };
  */
}])
.service('filePreviewModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
		modal.close();
	}
	
	this.show = function(fileData){
		modal = ngDialog.open(
			{
		        template: '../app/views/popups/file_preview_popup.tpl.html',
		        showClose: false,
		        className: 'full_screen_popup',
		        closeByEscape: false,
		        closeByDocument: true,
		        data: fileData
			}
		);
		return modal;
	};
	this.hide = function(){
	    ngDialog.close(modal.id);

	};
}])
.service('grandArticlePageModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
		modal.close();
	}
	
	this.show = function($scope, editdata){
		modal = ngDialog.open(
				{
					template: '../app/views/popups/create_grand_article_page.tpl.html',
					showClose: false,
					className: 'inspopup-theme-level0',
					closeByEscape: false,
					closeByDocument: false,
					scope: $scope,
					data: editdata
				}
		);
		return modal;
	};
}])
.service('createUserPinnedPostModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/create_user_pinned_post.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level0',
	        closeByEscape: false,
	        closeByDocument: true,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('updateImageOfEmbedLinkModal', ["ngDialog", function(ngDialog) {
	var modal = "";
	this.show = function(editdata){
		modal = ngDialog.open({
			template: '../app/views/popups/upload_image.tpl.html',
			showClose: false,
			data: editdata,
			className: 'inspopup-theme-level1'
		});
		return modal;
	};
}])
.service('createUserSpecialityModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	  if(modal){
	    modal.close();
	  }
	  this.show = function($scope, editdata){
		  modal = ngDialog.open(
	      {
	        template: '../app/views/popups/create_user_speciality.tpl.html',
	        showClose: false,
	        className: 'inspopup-theme-level1',
	        closeByEscape: false,
	        closeByDocument: false,
	        scope: $scope,
	        data: editdata
	      }
	    );
		  return modal;
	  };
}])
.service('updateVideoImage', ["ngDialog", function(ngDialog) {
	var modal = "";
	this.show = function(postdata){
		modal = ngDialog.open({
			template: '../app/views/popups/upload_video_image.tpl.html',
			showClose: false,
			data: postdata,
			className: 'inspopup-theme-level1'
		});
		return modal;
	};
}])
.service('profilePinDetailsModal', ["ngDialog", function(ngDialog) {
	var modal = null;
	if(modal){
		modal.close();
	}
	
	this.show = function(pinData){
		modal = ngDialog.open(
			{
		        template: '../app/views/popups/profile_pin_details_popup.tpl.html',
		        showClose: false,
		        className: 'inspopup-theme-level0',
		        closeByEscape: false,
		        closeByDocument: true,
		        data: pinData
			}
		);
		return modal;
	};
	this.hide = function(){
	    ngDialog.close(modal.id);

	};
}]);
