'use strict';

angular.module('inspherisProjectApp')
.component('noteInfo', {
	  templateUrl: 'views/containers/note_info.tpl.html',
	  controller: 'WidgetNoteServiceInfoController',
	  bindings:{
	    note: '=',
	    index:'=',
	    isSingleDay:'='
	  }
}).component('noteDetails', {
	  templateUrl: 'views/containers/note_details.tpl.html',
	  bindings:{
		singleDayNoteDatas: '=',
		periodicNoteDatas: '=',
		permanentNoteDatas: '='
	  }
}).component('noteDetailsInfo', {
	  templateUrl: 'views/containers/note_details_info.tpl.html',
	  controller: 'NoteServiceDetailsInfoController',
	  bindings:{
	    note: '=',
	    index:'=',
	    isSingleDay:'='
	  }
});