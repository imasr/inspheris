'use strict';

angular.module('inspherisProjectApp')
.component('pollWidget', {
  templateUrl: 'views/widgets/poll_widget.tpl.html',
  controller: 'WidgetPollCtrl',
  bindings: {
   userCanEditWidget: '=',
   widget: '='
  }
}).component('fckeditorWidget', {
  templateUrl: 'views/widgets/html_widget.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('regularCalendarWidget', {
  templateUrl: 'views/widgets/regular_calendar.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('foodTruckWidget', {
  templateUrl: 'views/widgets/food_truck.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  } 
}).component('birthdayWidget', {
  templateUrl: 'views/widgets/birthday.tpl.html',
  controller: 'BirthdayWidgetCtrl',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('imagesSliderLevel1', {
  templateUrl: 'views/imgSliderLevel1.html',
  controller: 'HeaderSliderCtrl',
  bindings: {
    imagesShow: '=',
    onClickPrevImageSlider:'&',
    onClickNextImageSlider: '&'
  }
}).component('secondSlider', {
  templateUrl: 'views/second_slider.html',
  bindings: {
    sliderContent: '=',
  }     
}).component('rssWidget', {
  templateUrl: 'views/widgets/rss.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('imageGalleryWidget', {
  templateUrl: 'views/widgets/image_gallery_widget.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('videoGalleryWidget', {
  templateUrl: 'views/widgets/video_gallery_widget.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('authorNameWidget', {
  templateUrl: 'views/widgets/author_name.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    authorInfo: '=',
    feed: '='
  }
}).component('communityActionsWidget', {
  templateUrl: 'views/widgets/community_actions.tpl.html',
  controller: 'SimpleWidgetController',
  bindings: {
    userCanEditWidget: '='
  }
}).component('userActionsWidget', {
  templateUrl: 'views/widgets/user_actions.tpl.html',
  controller: 'SimpleWidgetController'      
}).component('automatedCalendarWidget', {
  templateUrl: 'views/widgets/automated_calendar.tpl.html',
  controller: 'WidgetAutomatedCalendarCtrl',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }                
}).component('noteDeServiceWidget', {
	  templateUrl: 'views/widgets/note_service.tpl.html',
	  controller: 'WidgetNoteServiceController',
	  bindings: {
	    userCanEditWidget: '=',
	    widget: '='
	  }                
//}).component('userSkillsWidget', {
//	  templateUrl: 'views/widgets/user_skills.tpl.html',
////          controller:'MyProfileCtrl',
//           bindings: {
//	    widget: '='
//	  }
//}).component('userHobbiesWidget', {
//	  templateUrl: 'views/widgets/user_hobbies.tpl.html'                
//}).component('myFollowersWidget', {
//	  templateUrl: 'views/widgets/my_followers.tpl.html',
//	  controller: 'WidgetMyFollowers'               
//}).component('myFollowingsWidget', {
//	  templateUrl: 'views/widgets/my_followings.tpl.html',
//	  controller: 'WidgetMyFollowers'                
//}).component('userHashtagWidget', {
//	  templateUrl: 'views/widgets/user_hashtag.tpl.html'              
//}).component('userCalendarWidget', {
//	  templateUrl: 'views/widgets/user_calendar.tpl.html'              
}).component('countdownClockWidget', {
  templateUrl: 'views/widgets/countdown_clock_widget.tpl.html',
  controller: 'WidgetCountdownClockController',
  bindings: {
    userCanEditWidget: '=',
    widget: '='
  }
}).component('userPinnedPostSlider', {
	templateUrl: 'views/widgets/user_pinned_post_slider.html',
	controller: 'UserPinnedPostCtrl'
}).component('bikeBookingWidget', {
	templateUrl: 'views/widgets/bike_booking_widget.tpl.html',
	controller: 'SimpleWidgetController',
	bindings: {
		userCanEditWidget: '=',
	    widget: '='	
	} 
});