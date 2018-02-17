'use strict';
/*angular.module('inspherisProjectApp').
    filter('timeago', function() {
        return function(input, p_allowFuture) {
            var substitute = function (stringOrFunction, number, strings) {
                    var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings= {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d days",
                    month: "about a month",
                    months: "%d months",
                    year: "about a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
            
                // var strings = this.settings.strings;
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
                
            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);

            return $.trim([prefix, words, suffix].join(separator));
            // conditional based on optional argument
            // if (somethingElse) {
            //     out = out.toUpperCase();
            // }
            // return out;
        }
    });*/

angular.module('inspherisProjectApp')
	.filter('urlEncode', [function() {
		return function(url){
            return encodeURIComponent(url).replace("'","\\'"); 
			}
		}])

    .filter('encodeUrl',[function(){
            return function(url){
                return encodeURI(url);   
            }
        }])
    .filter('htmlToPlaintext',[function(){
            return function(htmlstr){
                return angular.element('<div>'+htmlstr+'</div>').text();
                //return String(htmlstr).replace(/<[^>]+>/gm, '');
            }
        }])
    .filter('uniqueImageUrl',[function(){
            return function(url){
                return encodeURI(url+"#"+(new Date().getTime()));   
            }
        }])
    .filter('isValidUserName',[function(){
            return function(str){
                //check if string is valid name or not
                //var regex = /^([a-zA-Z ]){2,30}$/;
                var regex = /^[\w.\-_$@*!]{3,50}$/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])
    .filter('isValidUrl',[function(){
            return function(str){
                //check if string is valid name or not
                //var regex = /^([a-zA-Z ]){2,30}$/;
                var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])    
    .filter('isValidName',[function(){
            return function(str){
                //check if string is valid name or not
                //var regex = /^([a-zA-Z ]){2,30}$/;
                var regex = /^([$0-9A-Z\&\«\»\‹\›\“\”\‘\’\:\-\/\—\–\(\)\'\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176\s]){2,}$/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])
    .filter('isBlankString',[function(){
            return function(str){
                //check if is string is blank return true if blank
                var regex = /^\s*$/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])
    .filter('isValidPhone',[function(){
            return function(str){
                //check for these formats: 0999999999, 099-999-999, (099)-999-9999, (099)9999999, 099 999 9999, 099 999-9999, (099) 999-9999, 099.999.9999
                //var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

                //+XX-XXXX-XXXX, +XX.XXXX.XXXX, +XX XXXX XXXX
                var regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])
    .filter('isValidEmail',[function(){
            return function(str){
                //check if is string is blank return true if blank
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
                if(mailformat.test(str))  
                {
                    return true;
                }
                else  
                {  
                    //invalid email
                    return false;  
                }
            }
        }])
    .filter('validateDocFiles',[function(){
            return function($files){
                angular.forEach($files, function(val, key){
                });
            }
        }])
    .filter('newDate',['$filter', function($filter){
            return function(inputDt){
                if(inputDt)
                {
                    var yr = $filter('date')(inputDt, 'yyyy');
                    var mn = $filter('date')(inputDt, 'M') - 1;
                    var dy = $filter('date')(inputDt, 'd');
                    var hrs = $filter('date')(inputDt, 'H');
                    var min = $filter('date')(inputDt, 'm');
                    var sec = $filter('date')(inputDt, 's');
                    var msec = $filter('date')(inputDt, 'sss');
                    
                    return (new Date(yr, mn, dy, hrs, min, sec, msec));    
                }
                return 0;   
            }
        }])
    .filter('percentageHeight',['$filter', function($filter){
            return function(w, h){    
                var r = w/h;
                var adjusted_height = 100 * h / w;
                return adjusted_height+'%';
            }
        }])
    .filter('timeago', ['$filter', '$translate', function($filter, $translate) {
        
            return function(input, p_allowFuture) {

                    var date = ($filter('newDate')(input)).getTime();
                    
                    var generateStr = function(milisec, flag){
                        //words = days < 1 && generateStr(date,'') || days == 1 && generateStr(date,'yesterday') || days > 1 && generateStr(date,'showdate');
                        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var retStr = "";
                        var dt = new Date(milisec);
                        minutes= ("0" + dt.getMinutes()).substr(-2);
                        hours=dt.getHours();
                        
                        if(flag == 'showdate'){
                            var day = dt.getDate();
                            var month = months[dt.getMonth()];
                            retStr = month+" "+day+", ";
                        }
                        else if(flag == "yesterday")
                        {
                            retStr = "yesterday ";
                        }
                        retStr += hours+":"+minutes;
                        return (retStr);
                    },
                    
                    dateCompare = function(dt){
                        var currDt = new Date();
                        var tempDt = new (dt);
    
                        currDt.setHours(0,0,0,0);
                        tempDt.setHours(0,0,0,0);
    
                        var ONE_DAY = 1000 * 60 * 60 * 24;
    
                        var currMtime = currDt.getTime();
                        var tempMtime = tempDt.getTime();
                        var dateDifference = Math.abs(currMtime - tempMtime);
    
                        return 0;
                    },
                    nowTime = new Date().getTime(),
                    //date = new Date(input.replace("-","/")).getTime(),
                    //date = new Date(input).getTime(),
                    //refreshMillis= 6e4, //A minute
                    allowFuture = p_allowFuture || false,
                    
                    dateDifference = nowTime - date,
                    words,
                    seconds = Math.abs(dateDifference) / 1000,
                    minutes = seconds / 60,
                    hours = minutes / 60,
                    days = hours / 24,
                    years = days / 365;
    
                    if (allowFuture) {
                        if (dateDifference < 0) {
                            prefix = strings.prefixFromNow;
                            suffix = strings.suffixFromNow;
                        }
                    }
                    //generate string for date if depending upon the days count
                    words = days < 1 && generateStr(date,'') || days == 1 && generateStr(date,'yesterday') || days > 1 && generateStr(date,'showdate');
                
                return (words);
            }
        }])
    .filter('timeagolocal', ['$filter', '$translate', function($filter, $translate) {
        
            return function(input, p_allowFuture) {

                    var date = ($filter('newDate')(input)).getTime();
                    /*
                    var generateStr = function(milisec, flag){
                        //words = days < 1 && generateStr(date,'') || days == 1 && generateStr(date,'yesterday') || days > 1 && generateStr(date,'showdate');
                        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var retStr = "";
                        var dt = new Date(milisec);
                        minutes= ("0" + dt.getMinutes()).substr(-2);
                        hours=dt.getHours();
                        
                        if(flag == 'showdate'){
                            var day = dt.getDate();
                            var month = months[dt.getMonth()];
                            retStr = month+" "+day+", ";
                        }
                        else if(flag == "yesterday")
                        {
                            retStr = "yesterday ";
                        }
                        retStr += hours+":"+minutes;
                        return (retStr);
                    },
                    */
                    var generateStr = function(milisec, flag){
                        //words = days < 1 && generateStr(date,'') || days == 1 && generateStr(date,'yesterday') || days > 1 && generateStr(date,'showdate');
                        var dateJson = {
                            
                        };

                        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var retStr = "";
                        var dt = new Date(milisec);
                        minutes= ("0" + dt.getMinutes()).substr(-2);
                        hours=dt.getHours();

                        //var activeLangCode = $translate.use();

                        if(flag == 'showdate'){
                            var day = dt.getDate();
                            var month = months[dt.getMonth()];
                            retStr = month+" "+day+", ";

                            dateJson.month = month;
                            dateJson.day = day;
                        }
                        else if(flag == "yesterday")
                        {
                            retStr = "yesterday ";

                            dateJson.month = 'yesterday';
                        }

                        dateJson.hours = hours;
                        dateJson.min = minutes;
                        //retStr += hours+":"+minutes;

                        return (dateJson);
                    },
                    dateCompare = function(dt){
                        var currDt = new Date();
                        var tempDt = new (dt);
    
                        currDt.setHours(0,0,0,0);
                        tempDt.setHours(0,0,0,0);
    
                        var ONE_DAY = 1000 * 60 * 60 * 24;
    
                        var currMtime = currDt.getTime();
                        var tempMtime = tempDt.getTime();
                        var dateDifference = Math.abs(currMtime - tempMtime);
    
                        return 0;
                    },
                    nowTime = new Date().getTime(),
                    //date = new Date(input.replace("-","/")).getTime(),
                    //date = new Date(input).getTime(),
                    //refreshMillis= 6e4, //A minute
                    allowFuture = p_allowFuture || false,
                    
                    dateDifference = nowTime - date,
                    words,
                    seconds = Math.abs(dateDifference) / 1000,
                    minutes = seconds / 60,
                    hours = minutes / 60,
                    days = hours / 24,
                    years = days / 365;
    
                    if (allowFuture) {
                        if (dateDifference < 0) {
                            prefix = strings.prefixFromNow;
                            suffix = strings.suffixFromNow;
                        }
                    }
                    //generate string for date if depending upon the days count
                    //words = days < 1 && generateStr(date,'') || days == 1 && generateStr(date,'yesterday') || days > 1 && generateStr(date,'showdate');
                    words =generateStr(date,'showdate');
                return (words);
            }
        }])
    .filter('getDate',['$filter','sharedData', function($filter, sharedData){
            return function(inputDt){
                if(inputDt)
                {
                    var tempDt = $filter('newDate')(inputDt);
                    return tempDt.getDate();    
                }
                return 0;   
            }
        }])
    .filter('showHoursAndMins',['$filter', function($filter){
            return function(inputDt, format){
                //format: hours, mins, hoursmins
                //retuns date in this format: 15h, 20m, 15h 20m
                if(inputDt){
                    var date = ($filter('newDate')(inputDt));
                    var tmstr = '';
                    switch(format){
                        case 'hours':
                            tmstr = date.getHours()+"h";
                        break;
                        case 'mins':
                            tmstr = date.getMinutes()+"m";
                        break;
                        case 'hoursmins':
                            tmstr = date.getHours()+"h "+date.getMinutes()+"m";
                        break;
                        default:
                            tmstr = "null";
                    }
                    return tmstr;
                }
                return 0;   
            }
        }])
    .filter('hashtagString', function(){
        return function(arr){
            var hashtagList = '';
              angular.forEach(arr, function(val, key){
                hashtagList += val.text;
                if(key != (arr.length - 1))
                  hashtagList += ', ';
              });
              return hashtagList;
        }
    })
    .filter('getMonthName',['$filter', function($filter){
            return function(inputDt){
                if(inputDt){
                    var months = ['January','Ferbuary','March','April','May','June','July','August','September','October','November','December'];
                    var tempDt = $filter('newDate')(inputDt);
                    return months[tempDt.getMonth()];
                }
            }
        }])
    .filter('getFileType',function(){
        return function(inputStr){
            var xls = ["xlsm","xltx","xltm","xlam","xlsx","xlsb","application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel.sheet.macroEnabled.12","application/vnd.openxmlformats-officedocument.spreadsheetml.template","application/vnd.ms-excel.template.macroEnabled.12","application/vnd.ms-excel.sheet.binary.macroEnabled.12","application/vnd.ms-excel.addin.macroEnabled.12"];
            var doc = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template", "application/vnd.ms-word.document.macroEnabled.12", "application/vnd.ms-word.template.macroEnabled.12"];
            var ppt = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-powerpoint.presentation.macroEnabled.12","application/vnd.openxmlformats-officedocument.presentationml.slideshow","application/vnd.ms-powerpoint.slideshow.macroEnabled.12","application/vnd.openxmlformats-officedocument.presentationml.template","application/vnd.ms-powerpoint.template.macroEnabled.12","application/vnd.ms-powerpoint.addin.macroEnabled.12","application/vnd.ms-powerpoint.slide.macroEnabled.12"];
            var image =["image/jpeg", "image/png", "image", 'jpg', 'jpeg', 'png', 'image'];
            if(inputStr){
                if(inputStr == "application/pdf" || inputStr == "pdf")
                return "pdf";
                else if(xls.indexOf(inputStr) >= 0)
                return "xls";

                else if(doc.indexOf(inputStr) >= 0)
                return "doc";

                else if(ppt.indexOf(inputStr) >= 0)
                return "ppt";
                else if(image.indexOf(inputStr) >= 0)
                return "img";
            
                else
                    return 'unknown';
            }
            else{
                return 'unknown';   
            }
        }
    })
    .filter('fileTypeFilter', function () {
      return function (items, type, searchName) {
        var filtered = [];
        var pdf =["application/pdf"];
        var xls = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel.sheet.macroEnabled.12","application/vnd.openxmlformats-officedocument.spreadsheetml.template","application/vnd.ms-excel.template.macroEnabled.12","application/vnd.ms-excel.sheet.binary.macroEnabled.12","application/vnd.ms-excel.addin.macroEnabled.12"];
        var doc = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template", "application/vnd.ms-word.document.macroEnabled.12", "application/vnd.ms-word.template.macroEnabled.12"];
        var ppt = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-powerpoint.presentation.macroEnabled.12","application/vnd.openxmlformats-officedocument.presentationml.slideshow","application/vnd.ms-powerpoint.slideshow.macroEnabled.12","application/vnd.openxmlformats-officedocument.presentationml.template","application/vnd.ms-powerpoint.template.macroEnabled.12","application/vnd.ms-powerpoint.addin.macroEnabled.12","application/vnd.ms-powerpoint.slide.macroEnabled.12"];
        var image =["image/jpeg", "image/png"];
        if(type == 'pdf'){
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (pdf.indexOf(item.fileType) >= 0) {
                if(searchName.length > 0)
                {
                    if(item.fileName.indexOf(searchName) > -1){
                        filtered.push(item);
                    }    
                }
                else{
                    filtered.push(item);
                }
              }
            }
        }
        else if(type == 'xls'){
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (xls.indexOf(item.fileType) > -1) {
                if(searchName.length > 0){
                    if(item.fileName.indexOf(searchName) > -1){
                        filtered.push(item);
                    }    
                }
                else{
                    filtered.push(item);
                }
              }
            }
        }
        else if(type == 'doc'){
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (doc.indexOf(item.fileType) >= 0) {
                if(searchName.length > 0){
                    if(item.fileName.indexOf(searchName) > -1){
                        filtered.push(item);
                    }    
                }
                else{
                    filtered.push(item);
                }
              }
            }
        }
        else if(type == 'ppt'){
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (ppt.indexOf(item.fileType) >= 0) {
                if(searchName.length > 0){
                    if(item.fileName.indexOf(searchName) > -1){
                        filtered.push(item);
                    }    
                }
                else{
                    filtered.push(item);
                }
              }
            }
        }
        else if(type == 'image'){
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (image.indexOf(item.fileType) >= 0) {
                if(searchName.length > 0){
                    if(item.fileName.indexOf(searchName) > -1){
                        filtered.push(item);
                    }    
                }
                else{
                    filtered.push(item);
                }
              }
            }
        }
        else{

            if(searchName.length > 0){
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if(item.fileName.indexOf(searchName) > -1){
                            filtered.push(item);
                        }
                    }    
                }
                else{
                    filtered = items;;
                }
            
        }
        return filtered;
      };
    })
    .filter('unsafehtml', ['$sce', function($sce){
            return function(htmlCode){
                return $sce.trustAsHtml(htmlCode);
            };
        }])
    .filter('safeurl', ['$sce', function($sce){
        return function(url){
            return $sce.trustAsResourceUrl(url);
        };     
        }])
    .filter('highlight', ['$sce', function($sce) {
          return function(text, search) {
            /*if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));*/
            if (!search) {
                return text;
            }
            else if(text && text.length > 0){
                search = search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                return text.replace(new RegExp(search, 'gi'), '<span class=\"highlightedText\">$&</span>');
            }
            return text;
          };
        }])
        .filter('isEmbedHtml',[function(){
            return function(str){
                //check if is string is blank return true if blank
                var regex = /<img[^>]+>(<\/img>)?|<iframe.+?<\/iframe>|<embed.+?src="(.+?)".+?<\/embed>|<\/?object(\s\w+(\=\".*\")?)*\>/;
                if (regex.test(str)){
                    return true;
                }
                else {
                    return false;
                }
            }
        }])
        .filter('getTypeByFileNameGDrive',function(){
            return function(inputStr){            	

            	var text =['text/xml','text/plain'];
            	var spreadsheet = ['application/vnd.google-apps.spreadsheet'];
            	var image =["image/jpeg", "image/png",'image/svg+xml','gif','png','jpg','jpeg'];
            	var json = ['application/json','application/octet-stream'];
            	var document = ['application/vnd.google-apps.document','application/msword'];
            	var presentation = ['application/vnd.google-apps.presentation'];
            	var sheet = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            	var folder =['application/vnd.google-apps.folder'];
                if(inputStr){
                    if(inputStr == "application/pdf" || inputStr == "pdf")
                    return "../images/media/gpdf.png";
                    else if(text.indexOf(inputStr) >= 0)
                    return "../images/media/gxml.png";

                    else if(sheet.indexOf(inputStr) >= 0)
                    return "../images/media/gxls.png";

                    else if(presentation.indexOf(inputStr) >= 0)
                    return "../images/media/presentation.png";
                    else if(document.indexOf(inputStr) >= 0)
                    return "../images/media/document.png";
                    else if(json.indexOf(inputStr) >= 0)
                    return "../images/media/json.png";
                    else if(spreadsheet.indexOf(inputStr) >= 0)
                    return "../images/media/spreadsheet.png";
                    else if(image.indexOf(inputStr) >= 0)
                    return "../images/media/png.png";
                    else if(folder.indexOf(inputStr) >= 0)
                        return "../images/media/gfolder.png";
                    else
                        return "../images/media/drive_file.png";
                }
                else{
                    return "../images/media/drive_file.png";   
                }
            }
        })
        .filter('getTypeByFileName',function(){
            return function(inputStr){
            	
                var xls = ['xls','xlsx'];
                var doc = ['doc','docx'];
                var ppt = ['ppt','pptx'];
                var image =["image/jpeg", "image/png",'gif','png','jpg','jpeg'];
                var zip = ["zip"];
                var tgz = ["tgz"];
                var zip7 = ["7z"];
                if(inputStr){
                	var extensions = inputStr.split('.').pop().toLowerCase();
                    if(extensions == "application/pdf" || extensions == "pdf")
                    return "pdf";
                    else if(xls.indexOf(extensions) >= 0)
                    return "xls";

                    else if(doc.indexOf(extensions) >= 0)
                    return "doc";

                    else if(ppt.indexOf(extensions) >= 0)
                    return "ppt";
                    else if(image.indexOf(extensions) >= 0)
                    return "img";
                    else if(zip.indexOf(extensions) >= 0)
                    return "zip";
                    else if(tgz.indexOf(extensions) >= 0)
                    return "tgz";
                    else if(zip7.indexOf(extensions) >= 0)
                    return "7z";
                    else
                        return 'unknown';
                }
                else{
                    return 'unknown';   
                }
            }
        })
                .filter('videoPlayerTimeString', function () {
            return function (millseconds) {
                var oneSecond = 1000;
                var oneMinute = oneSecond * 60;
                var oneHour = oneMinute * 60;
                var oneDay = oneHour * 24;

                var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
                var minutes = Math.floor((millseconds % oneHour) / oneMinute);
                var hours = Math.floor((millseconds % oneDay) / oneHour);

                var timeString = '';
                if (seconds !== 0 || millseconds < 1000) {
                    timeString = ((hours > 0) ? (hours + ":") : ("")) + ((minutes < 10) ? ("0" + minutes) : minutes) + " : " + ((seconds < 10) ? ("0" + seconds) : seconds);
                }
                return timeString;
            };
        });
