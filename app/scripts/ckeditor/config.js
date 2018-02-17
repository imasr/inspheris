/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
 	// config.language = 'fr';
	 
	 config.allowedContent= true;
	// config.uiColor = '#AADC6E';
	config.toolbar_FRWorkshop = [
                                   	['Source','Bold','Italic','Underline','StrikeThrough','OrderedList','UnorderedList','Outdent'],
                                   	['Indent','JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
                                   	['Link','Unlink','Anchor','PasteWord','Print','Undo','Redo','RemoveFormat'],
                                   	['Image','Flash','FontFormat','FontName','TextColor','BGColor','Table']
                                   ] ;
	
	/* fileman configuration*/
	/*config.filebrowserBrowseUrl= 'scripts/ckeditor/fileman/index.html';
	config.filebrowserImageBrowseUrl= 'scripts/ckeditor/fileman/index.html?type=image';
	config.filebrowserImageBrowseLinkUrl= 'scripts/ckeditor/fileman/index.html?type=document';
	config.removeDialogTabs = 'image:Upload';*/
	
	/*ckfinder configuration */
	config.filebrowserBrowseUrl = 'scripts/ckeditor/ckfinder/ckfinder.html';
	config.filebrowserImageBrowseUrl = 'scripts/ckeditor/ckfinder/ckfinder.html?type=Images';
	config.filebrowserImageBrowseLinkUrl= 'scripts/ckeditor/ckfinder/ckfinder.html';
	config.filebrowserFlashBrowseUrl = 'scripts/ckeditor/ckfinder/ckfinder.html?type=Flash';
	

	
};
