'use strict';
angular.module('inspherisProjectApp')
.controller('StaticticReportCtrl', function ($scope, $rootScope,$timeout,$filter,$state,$stateParams,$interval,dateTimeService, apiStatisticReport,confirmModal,notifyModal,statUserDetailsReportModal){

	$scope.period = "thisweek";
	$scope.userFilter = 'userDetailsAndActions';
	$scope.reportType= "gbconnect";
	$scope.globalType = "connecttotal";
	$scope.communityContentFilter = 'contentpercommunity';
	$scope.selectedFormat = 'chart';
	$scope.page = 1;
	$scope.itemsPerPage = 20;
	$scope.sortKey = "";
	$scope.sortField = "";
	$scope.loadding = false;
	$scope.showMoreButton = false;
	$scope.selected = 2;
	$scope.golbalSelected = 0;
	$scope.reportDescription = "";
	$scope.chartTitle = "";
	$scope.dateFrom =  null;
	$scope.dateTo = null;
	$scope.searchText = null;
	var exportMenu = $('#menu-toogle');
	var exportGbconnectMenu = $('#menu-toogle-gbconnect');
	var datePicker = $('#period-button');
	var currentState = $state.current.name;
	var communityParam = (currentState == "app.communityHome" || currentState == "app.communityHomeWithTab" || currentState == "app.communityHomeWithArticle") ? {"communityUid": $stateParams.commuid , "viewingFrom" : "community"} : {"communityUid": '' , "viewingFrom" : "home"};
	$scope.listReport = [
	                     {name:'Global connections', type:'gbconnect'},
	                     {name:'Communities connections', type:'community'},
	                     {name:'Global content', type:'gbcontent'},
	                     {name:'Community', type:'communitycontent'},
	                     {name:'Content viewed by source', type:'contentviewdbysource'},
	                     {name:'Comments and likes', type:'commentlike'},
	                     {name:'User Details', type:'userdetails'}
	                     ];
	
	
	$scope.getData = function(period,userFilter){
		$scope.loadding = true;
		
		//Set opstion for chart
		var chart;
		Highcharts.setOptions({
			   lang: {
		            loading: 'Aguarde...',
		            months: [ $filter('translate')('January'), $filter('translate')('February'), $filter('translate')('March'),
		                      $filter('translate')('April'), $filter('translate')('May'), $filter('translate')('June'), 
		                      $filter('translate')('July'), $filter('translate')('August'), $filter('translate')('September'),
		                      $filter('translate')('October'), $filter('translate')('November'), $filter('translate')('December')],
		            weekdays: [$filter('translate')('Sunday'),$filter('translate')('Monday'), $filter('translate')('Tuesday'), $filter('translate')('Wednesday'),
		                       $filter('translate')('Thursday'), $filter('translate')('Friday'), $filter('translate')('Saturday')],
		            shortMonths: [ $filter('translate')('Jan'),  $filter('translate')('Feb'),  $filter('translate')('Mar'),
		                           $filter('translate')('Apr'),  $filter('translate')('May'),  $filter('translate')('Jun'),
		                           $filter('translate')('Jul'),  $filter('translate')('Aug'),  $filter('translate')('Sep'),
		                           $filter('translate')('Oct'),  $filter('translate')('Nov'),  $filter('translate')('Dec')],
		            resetZoom: $filter('translate')('Reset zoom'),
		            printChart:  $filter('translate')('')
		      }
		});
		
		var chartOptions = {
	    		chart: {
	                renderTo: 'gbconnectReport',
	                defaultSeriesType: 'area',
					zoomType: 'x',
					spacingRight: 20
	            },
	            title: {
	                text: ''
	            },
	            subtitle: {
	                text: $filter('translate')('Click and select a zone to zoom')
	            },
	            exporting: {
	            	enabled : true,
	            	allowHTML: true,
	            	buttons : {
	            		contextButton : {
		            		menuItems: [{
		            			text: $filter('translate')('Download XLSX document'),
		                        onclick: function () {
		                        	$scope.exportReport($scope.reportType,userFilter);
		                        }
		            		},{
		            			text: $filter('translate')('Download JPEG image'),
		                        onclick: function () {
		                        	this.exportChart({
		                                type: 'image/jpeg'
		                            });
		                        }
		            		},{
		            			text: $filter('translate')('Download PDF document'),
		                        onclick: function () {
		                        	this.exportChart({
		                        		type: 'application/pdf'
		                        	});
		                        }
		            		},{
		            			text: $filter('translate')('Download PNG image'),
		                        onclick: function () {
		                        	this.exportChart();
		                        }
		            		},{
		            			text: $filter('translate')('Download SVG vector image'),
		                        onclick: function () {
		                        	this.exportChart({
		                                type: 'image/svg+xml'
		                            });
		                        }
		            		}]
	            		}
	            	}
	            },
	            navigation: {
	                buttonOptions: {
	                    align: 'left'
	                }
	            },
	            xAxis: {
	            	type: 'datetime',
					maxZoom: 14 * 24 * 3600000, // fourteen days
					title: {
						text: null
					},
					showFirstLabel: true
	            },
	            yAxis: {
	            	title: {
						text: null
					},
					min: 0,
					startOnTick: false,
					showFirstLabel: true

	            },
	            tooltip: {
	                shared: true
	            },
	            legend: {
					enabled: true
				},
				credits: {
			         enabled: false
			    },
	            plotOptions: {
	            	area: {
						fillColor: {
							linearGradient: [0, 0, 0, 0],
							stops: [
							    [0, 'rgb(255, 255, 255)'],
								[1, 'rgba(0,0,0,0)']
							]
						},
						lineWidth: 1,
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: true,
									radius: 5
								}
							}
						},
						shadow: false,
						states: {
							hover: {
								lineWidth: 1						
							}
						}
					}
	            },
	            series: []
	    	};
		
		var chartBarOptions = {
		            chart: {
		                type: 'bar'
		            },
		            title: {
		                text: $filter('translate')('Content viewed by community')
		            },
		            subtitle: {
		                text: null
		            },
		            exporting: {
		            	enabled : true,
		            	allowHTML: true,
		            	buttons : {
		            		contextButton : {
			            		menuItems: [{
			            			text: $filter('translate')('Download XLSX document'),
			                        onclick: function () {
			                        	$scope.exportReport($scope.reportType,userFilter);
			                        }
			            		},{
			            			text: $filter('translate')('Download JPEG image'),
			                        onclick: function () {
			                        	this.exportChart({
			                                type: 'image/jpeg'
			                            });
			                        }
			            		},{
			            			text: $filter('translate')('Download PDF document'),
			                        onclick: function () {
			                        	this.exportChart({
			                        		type: 'application/pdf'
			                        	});
			                        }
			            		},{
			            			text: $filter('translate')('Download PNG image'),
			                        onclick: function () {
			                        	this.exportChart();
			                        }
			            		},{
			            			text: $filter('translate')('Download SVG vector image'),
			                        onclick: function () {
			                        	this.exportChart({
			                                type: 'image/svg+xml'
			                            });
			                        }
			            		}]
		            		}
		            	}
		            },
		            navigation: {
		                buttonOptions: {
		                    align: 'left'
		                }
		            },
		            xAxis: {
		                categories: [],
		                title: {
		                    text: ''
		                }
		            },
		            yAxis: {
		                min: 0,
		                labels: {
		                    overflow: 'justify'
		                },
		                title: {
		                    text: null
		                }
		            },
		            plotOptions: {
		                bar: {
		                    dataLabels: {
		                        enabled: true
		                    }
		                }
		            },
		            legend: {
		                layout: 'vertical',
		                align: 'right',
		                verticalAlign: 'top',
		                x: 0,
		                y: 15,
		                floating: true,
		                borderWidth: 1,
		                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		                shadow: true
		            },
		            credits: {
		                enabled: false
		            },
		            series: []
		       
				};
		
		
		switch($scope.reportType){
		    case 'commentlike':
		    	apiStatisticReport.commentAndLikeReport({period : period, page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, startDate : $scope.dateFrom, endDate:$scope.dateTo }).then(function(data){
		    		$scope.gridCommentAndLikeReport.data = data.rows;
		    		$scope.gridCommentAndLikeReport.totalItems = data.total;	
		    		$scope.loadding = false;
		    	});
		    	$scope.reportDescription = "This report be used to collect number of comments and number of likes of content";
		    	$scope.chartTitle = "Comments and likes";
		      break;
		    case 'contentviewdbysource':
		    	apiStatisticReport.listContentViewedBySource({period : period, page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, startDate : $scope.dateFrom, endDate:$scope.dateTo }).then(function(data){
		    		$scope.contentViewdBySourceReport.data = data.rows;
		    		$scope.contentViewdBySourceReport.totalItems = data.total;
		    		$scope.loadding = false;
		    	});
		    	$scope.reportDescription = "This report be used to collect number of times that users accessed source";
		    	$scope.chartTitle = "Content viewed by source";
		      break;		   	    
		    case 'gbconnect':
		    	//Report 1
		    	if('connecttotal' == $scope.globalType){
		    		if($scope.selectedFormat == 'chart'){
			    		apiStatisticReport.totalGlobalConnectionsByDate(communityParam).then(function(data){
			    			if(data.code != undefined && data.code == 302){
			    				$scope.periodLabel = '';
			    			}else{
			    				$scope.periodLabel = $filter('date')(data.startDate,'d MMM yy') +"-"+ $filter('date')(data.endDate,'d MMM yy');
			    			}
			    			chartOptions.title.text ='<small>'+$scope.periodLabel + '</small> <br />' +  $filter('translate')('Total connections');
			    			chartOptions.title.style = {"text-align" : "center"};
			    			chartOptions.title.useHTML= true;
			    			
			    			chartOptions.series.push(
				    					{
											name: $filter('translate')('totalConnectionSeries'),
											pointInterval: 24 * 3600 * 1000,
											pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
											data: data.totalConnectionSeries
											
										}
			    					);
			    			chartOptions.series.push(
			    					{
											name: $filter('translate')('uniqueConnectionSeries'),
											pointInterval: 24 * 3600 * 1000,
											pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1,$filter('date')(data.startDate,'dd')),
											data:data.uniqueConnectionSeries		
									}
		    					);
				    		chart = new Highcharts.Chart(chartOptions);
				    		$scope.loadding = false;
				    	});
		    		}else if($scope.selectedFormat == 'table'){
		    			var params = communityParam;
		    			params.page = $scope.page;
		    			params.itemsPerPage = $scope.itemsPerPage;
		    			params.sortKey = $scope.sortKey;
		    			params.sortField = $scope.sortField;
		    			params.period = period;
		    			params.startDate = $scope.dateFrom;
		    			params.endDate = $scope.dateTo;
			    		apiStatisticReport.totalGlobalConnectionsTableByDate(params).then(function(data){
				    		$scope.gridTotalGlobalConnectionsTableByDateReport.data = data.rows;
				    		$scope.gridTotalGlobalConnectionsTableByDateReport.totalItems = data.total;	
				    		$scope.loadding = false;
				    	});
				    	$scope.chartTitle = "Total connections";
		    		}
		    		$scope.reportDescription = "This report be used to collect number of times that users logged in system";
		    	}else if('connectDepartment' == $scope.globalType){
		    		apiStatisticReport.totalGlobalConnectionsByDepartment(communityParam).then(function(data){
		    			if(data.code != undefined && data.code == 302){
		    				$scope.periodLabel = '';
		    			}else{
		    				$scope.periodLabel = $filter('date')(data.startDate,'d MMM yy') +"-"+ $filter('date')(data.endDate,'d MMM yy');
		    			}
		    			chartOptions.title.text = '<small>'+$scope.periodLabel + '</small> <br />' + $filter('translate')('connectDepartment');
		    			chartOptions.title.useHTML= true;
		    			chartOptions.title.style = {"text-align" : "center"};
		    			//var date= moment(data.startDate).format('YYYY-MM-DD');
		    			var date = data.startDate;
		    			angular.forEach(data.connectionSeries, function(value, key) {
		    					
		    				  var item = {
		    					pointInterval: 24 * 3600 * 1000,
		    					pointStart: Date.UTC($filter('date')(date,'yyyy'),$filter('date')(date,'MM') - 1 ,$filter('date')(date,'dd')),
		    					data: value.connectionCount
		    				  };
		    				  if('noDepartmentSpecified' == value.name){
		    					  item.name = $filter('translate')(value.name);
		    				  }else{
		    					  item.name = value.name;
		    				  }
		    				  chartOptions.series.push(item);
		    				});
			    		chart = new Highcharts.Chart(chartOptions);
			    		$scope.loadding = false;
			    	});
		    		 $scope.reportDescription = "This report be used to collect number of times that users logged in system";
		    	}else if('connectStatus' == $scope.globalType){
		    		apiStatisticReport.totalGlobalConnectionsByStatus(communityParam).then(function(data){
		    			if(data.code != undefined && data.code == 302){
		    				$scope.periodLabel = '';
		    			}else{
		    				$scope.periodLabel = $filter('date')(data.startDate,'d MMM yy') +"-"+ $filter('date')(data.endDate,'d MMM yy');
		    			}
		    			chartOptions.title.text = '<small>'+$scope.periodLabel + '</small> <br />' +  $filter('translate')('connectStatus');
		    			chartOptions.title.useHTML= true;
		    			chartOptions.title.style = {"text-align" : "center"};
		    			//var date= moment(data.startDate).format('YYYY-MM-DD');
		    			var date = data.startDate;
		    			angular.forEach(data.connectionSeries, function(value, key) {
		    					
		    				  var item = {
		    					pointInterval: 24 * 3600 * 1000,
		    					pointStart: Date.UTC($filter('date')(date,'yyyy'),$filter('date')(date,'MM') - 1 ,$filter('date')(date,'dd')),
		    					data: value.connectionCount,
		    					name: $filter('translate')(value.name)
		    				  };
		    				  chartOptions.series.push(item);
		    				});
			    		chart = new Highcharts.Chart(chartOptions);
			    		$scope.loadding = false;
			    	});
		    		 $scope.reportDescription = "This report be used to collect number of times that users logged in system";
		    	}else if('connectCommunityStatus' == $scope.globalType){
		    		apiStatisticReport.totalGlobalConnectionsByCommunityStatus(communityParam).then(function(data){
		    			if(data.code != undefined && data.code == 302){
		    				$scope.periodLabel = '';
		    			}else{
		    				$scope.periodLabel = $filter('date')(data.startDate,'d MMM yy') +"-"+ $filter('date')(data.endDate,'d MMM yy');
		    			}
		    			chartOptions.title.text = '<small>'+$scope.periodLabel + '</small> <br />' +  $filter('translate')('connectCommunityStatus');
		    			chartOptions.title.useHTML= true;
		    			chartOptions.title.style = {"text-align" : "center"};
		    			//var date= moment(data.startDate).format('YYYY-MM-DD');
		    			var date = data.startDate;
		    			angular.forEach(data.connectionSeries, function(value, key) {
		    					
		    				  var item = {
		    					pointInterval: 24 * 3600 * 1000,
		    					pointStart: Date.UTC($filter('date')(date,'yyyy'),$filter('date')(date,'MM') - 1 ,$filter('date')(date,'dd')),
		    					data: value.connectionCount,
		    					name: $filter('translate')(value.name)
		    				  };
		    				  chartOptions.series.push(item);
		    				});
			    		chart = new Highcharts.Chart(chartOptions);
			    		$scope.loadding = false;
			    	});
		    		 $scope.reportDescription = "This report be used to collect number of times that users logged in system";
		    	}

		    	break;
		    case 'community':
		    		  apiStatisticReport.countCommunityMemberConnection({period : period, communityUid : communityParam.communityUid, viewingFrom : communityParam.viewingFrom, startDate : $scope.dateFrom, endDate:$scope.dateTo}).then(function(data){
		    			  if(data != null && data.communityNames != null && data.communityNames.length > 0){
		    				  var container = $('#communityrp');
		    				  container.css('height',data.communityNames.length==1? 200 :data.communityNames.length*100);
		    				  chartBarOptions.chart.renderTo =  'communityrp';
		    				  chartBarOptions.title.text = $filter('translate')('Connections per community');
		    				  chartBarOptions.xAxis.categories=data.communityNames
		    				  chartBarOptions.series.push(
		    						  {
						                name: $filter('translate')('Total'),
						                data: data.totalSeries
		    						  }
					            );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Followers'),
							              data: data.followerSeries
		    						  }
					            );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Contributors'),
							              data: data.contributorSeries
		    						  }
					            );
		    				  chart = new Highcharts.Chart(chartBarOptions);
						      $scope.loadding = false;
		    			  }
		    		  });
		    		  $scope.reportDescription = "This report be used to collect number of times that users logged in system in communities";
		    	
		    	break;
		    case 'communitycontent':
		    	if($scope.communityContentFilter == 'contentviewcommunity'){
		    		apiStatisticReport.countContentsViewedByCommunity({period : period, communityUid : communityParam.communityUid, viewingFrom : communityParam.viewingFrom, startDate : $scope.dateFrom, endDate:$scope.dateTo}).then(function(data){
		    			  if(data != null && data.communityNames != null && data.communityNames.length > 0){
		    				  
		    				  var container = $('#contentviewcommunityReport'); 
		    				  container.css('height',data.communityNames.length == 1 ? 220 :data.communityNames.length*160);
		    				  chartBarOptions.chart.renderTo =  'contentviewcommunityReport';
		    				  chartBarOptions.title.text = $filter('translate')('Content viewed by community');
		    				  chartBarOptions.xAxis.categories=data.communityNames;
		    				  chartBarOptions.series.push(
		    						  {
							                name: $filter('translate')('articles'),
							                data: data.articleSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Documents'),
							              data: data.documentSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Events'),
							              data: data.eventSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('imageGallery'),
							              data: data.imageGallerySeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Quickposts'),
							               data: data.quickpostSeries
							          }
		    				  );
		    				  chart = new Highcharts.Chart(chartBarOptions);
						      $scope.loadding = false;
		    			  }
		    		  });	  
		    		  $scope.reportDescription = "This report be used to collect number of times that users click to view details contents";
		    	}else if($scope.communityContentFilter == 'contentpercommunity'){
		    		apiStatisticReport.countContentsCreatedByCommunity({period : period, communityUid : communityParam.communityUid, viewingFrom : communityParam.viewingFrom, startDate : $scope.dateFrom, endDate:$scope.dateTo}).then(function(data){
		    			  if(data != null && data.communityNames != null && data.communityNames.length > 0){
		    				  var container = $('#contentcreatecommunityReport'); 
		    				  container.css('height',data.communityNames.length*250);
		    				  chartBarOptions.chart.renderTo =  'contentcreatecommunityReport';
		    				  chartBarOptions.title.text = $filter('translate')('Content creation per community');
		    				  chartBarOptions.xAxis.categories=data.communityNames;
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Total'),
							              data: data.totalSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('articles'),
							              data: data.articleSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Documents'),
							              data: data.documentSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Events'),
							              data: data.eventSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('imageGallery'),
							              data: data.imageGallerySeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Quickposts'),
							              data: data.quickpostSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Shared Contents'),
							              data: data.sharedContentSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Comments'),
							              data: data.commentSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Likes'),
							              data: data.likeSeries
							          }
		    				  );
		    				  chartBarOptions.series.push(
		    						  {
		    							  name: $filter('translate')('Number of unique views on all tabs'),
							              data: data.uniqueViewsOfAllTabsSeries
							          }
		    				  );
		    				  container.highcharts(chartBarOptions);
						    	$scope.loadding = false;
		    			  }
		    		  });	  
		    		  $scope.reportDescription = "This report be used to collect number of created and published contents by community";
		    	}else if($scope.communityContentFilter == 'activity'){
		    		apiStatisticReport.viewActivitiesOfCommunities({period : period, sortKey : $scope.sortKey, sortField : $scope.sortField, startDate : $scope.dateFrom, endDate:$scope.dateTo}).then(function(data){
			    		$scope.list = data;
			    		$scope.loadding = false;
			    	});
			        $scope.reportDescription = "This report be used to collect number of times that users accessed to tabs of all communities";
			        $scope.chartTitle = "Activity on a community";
		    	}
		    	break;
		    case 'gbcontent':
		    	apiStatisticReport.countContentCreatedAndPublishedByDate(communityParam).then(function(data){
		    		if(data.code != undefined && data.code == 302){
		    			$scope.periodLabel = '';
		    		}else{
		    			$scope.periodLabel = $filter('date')(data.startDate,'d MMM yy') +"-"+ $filter('date')(data.endDate,'d MMM yy');
		    		}	
	    			chartOptions.title.text = '<small>'+$scope.periodLabel + '</small> <br />' + $filter('translate')('Global content creation');
	    			chartOptions.title.useHTML= true;
	    			chartOptions.title.style = {"text-align" : "center"};
	    			chartOptions.chart.renderTo =  'gbcontentReport';
	    			chartOptions.series.push(
		    					{
									name: $filter('translate')('Articles'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
									data: data.articleSeries
									
								}
	    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Documents'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
									data:data.documentSeries		
							}
    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Quick posts'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1  ,$filter('date')(data.startDate,'dd')),
									data:data.quickpostSeries		
							}
    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Comments'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
									data:data.commentSeries		
							}
    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Events'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1  ,$filter('date')(data.startDate,'dd')),
									data:data.eventSeries		
							}
    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Image gallery'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
									data:data.imageGallerySeries		
							}
    					);
	    			chartOptions.series.push(
	    					{
									name: $filter('translate')('Partages'),
									pointInterval: 24 * 3600 * 1000,
									pointStart: Date.UTC($filter('date')(data.startDate,'yyyy'),$filter('date')(data.startDate,'MM') - 1 ,$filter('date')(data.startDate,'dd')),
									data:data.sharedContentSeries		
							}
    					);
		    		chart = new Highcharts.Chart(chartOptions);
		    		$scope.loadding = false;
		    	});
		    	 $scope.reportDescription = "This report be used to collect number of created and published contents";
		    	break;
			    case 'userdetails':
			    	if(userFilter != null && userFilter == 'userneverconnected'){
			    		apiStatisticReport.listUserNeverConnect({page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, q : $scope.searchText}).then(function(data){
				    		$scope.userNeverConnectedReport.data = data.rows;
				    		$scope.userNeverConnectedReport.totalItems = data.total;
				    		$scope.loadding = false;
				    	});
				    	$scope.loadding = false;
				    	$scope.reportDescription = "This report be used to show the list of users which never connected on the intranet since the opening";
				    	$scope.chartTitle = "Users never connected";
			    	}else if(userFilter != null && userFilter == 'userconnectedlessequal10'){
			    		apiStatisticReport.listUserConnectLessOrEqual10Times({page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, q : $scope.searchText}).then(function(data){
				    		$scope.userConnectedLessEqual10Report.data = data.rows;
				    		$scope.userConnectedLessEqual10Report.totalItems = data.total;
				    		$scope.loadding = false;
				    	});
				    	$scope.loadding = false;
				    	$scope.reportDescription = "This report be used to show the list of users which were connected less or equals 10 times on the intranet since the opening";
				    	$scope.chartTitle = "Users connected less or equal 10 times";
			    	}else if(userFilter != null && userFilter == 'allusersconnected'){
			    		apiStatisticReport.listUserConnected({page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, q : $scope.searchText}).then(function(data){
				    		$scope.allUsersConnectedReport.data = data.rows;
				    		$scope.allUsersConnectedReport.totalItems = data.total;
				    		$scope.loadding = false;
				    	});
				    	$scope.loadding = false;
				    	$scope.reportDescription = "This report be used to show the list of users which were connected on the intranet since the opening";
				    	$scope.chartTitle = "All users connected";
			    	}else if(userFilter != null && userFilter == 'userDetailsAndActions'){
			    		apiStatisticReport.listUserDetailsAndActionsReport({period : period, page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, startDate : $scope.dateFrom, endDate:$scope.dateTo, q : $scope.searchText }).then(function(data){
				    		$scope.gridUserDetailsAndActionsReport.data = data.rows;
				    		$scope.gridUserDetailsAndActionsReport.totalItems = data.total;	
				    		$scope.loadding = false;
				    	});
				    	$scope.reportDescription = "This report be used to show the list of users and user's actions on web";
				    	$scope.chartTitle = "User Details And Actions";
			    	}else if(userFilter != null && userFilter == 'connectUserSummary'){
			    		apiStatisticReport.listUserConnectionSummaryReport({period : period, page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, startDate : $scope.dateFrom, endDate:$scope.dateTo}).then(function(data){
				    		$scope.gridUserConnectionSummaryReport.data = data.rows;
				    		$scope.gridUserConnectionSummaryReport.totalItems = data.total;	
				    		$scope.loadding = false;
				    	});

				    	$scope.chartTitle = "User Connection Summary";
			    		$scope.reportDescription = "This report be used to to collect user connection summary who logged in system";
			    	}else if(userFilter != null && userFilter == 'usersConnectedAtTheMoment'){
			    		apiStatisticReport.listUserConnectedAtTheMoment({page:$scope.page, itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField, q : $scope.searchText}).then(function(data){
				    		$scope.gridUsersConnectedAtTheMomentReport.data = data.rows;
				    		$scope.gridUsersConnectedAtTheMomentReport.totalItems = data.total;	
				    		$scope.loadding = false;
				    	});

			    		$scope.reportDescription = "This report be used to show the list of users which were connected at the moment";
				    	$scope.chartTitle = "Users connected today";
			    	}
			    	break;
	    }

	};
	
	$scope.getData($scope.period,$scope.userFilter);
	apiStatisticReport.getLastUpdatedDate().then(function(data){
		$scope.lastUpdatedDate = data;
	});
	
	/*Config for UI-Grid*/
	//For report #6
	$scope.contentViewdBySourceReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('Content Name'), field: 'contentTitle', width: 265, headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Content Type'), field: 'contentType', width: 140, headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Home NF'), field: 'contentViewedByHomeCount', width: 120, headerTooltip: $filter('translate')('Home NF'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Community NF'), field: 'contentViewedByCommunityCount', width: 110,  headerTooltip: $filter('translate')('Community NF'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Tab NF'), field: 'contentViewedByTabCount', width: 61,  headerTooltip: $filter('translate')('Tab NF'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Total'), field: 'totalUniqueCount', width: 61,  headerTooltip: $filter('translate')('Total'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,null);
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,null);
	 	              });
	 	            }
		};
	
	//For report #7
	$scope.gridCommentAndLikeReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('Content Name'), field: 'contentTitle', width: 190, headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Content Community'), field: 'communityName', width: 205, headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Tab Name'), field: 'communityTabName', width: 205, headerTooltip: $filter('translate')('Tab Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Content Type'), field: 'contentType', width: 130, headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Number of comments'), field: 'commentCount', width: 190, headerTooltip: $filter('translate')('Number of comments'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Number of likes'), field: 'likeCount', width: 130,  headerTooltip: $filter('translate')('Number of likes'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Number of shares'), field: 'sharedContentCount', width: 155,  headerTooltip: $filter('translate')('Number of shares'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Number of downloads'), field: 'downloadCount', width: 210,  headerTooltip: $filter('translate')('Number of downloads'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Total Unique Visit'), field: 'totalUniqueCount', width: 210,  headerTooltip: $filter('translate')('Total Unique Visit'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Content Author'), field: 'contentAuthor', width: 150, headerTooltip: $filter('translate')('Content Author'),enableColumnMenu: false,cellTemplate:'<a href="#!/myprofile/{{row.entity.userUid}}/About" target="_blank"><span>{{row.entity.contentAuthor}}</span></a>' },
	       	          { name:$filter('translate')('Author Company'), field: 'userCompany', width: 160, headerTooltip: $filter('translate')('Author Company'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Author Service'), field: 'userService', width: 150, headerTooltip: $filter('translate')('Author Service'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Date Of Publication'), field: 'contentDateOfPublication', width: 175,cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.contentDateOfPublication)}}</p>', headerTooltip: $filter('translate')('Date Of Publication'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Date Of Last Modification'), field: 'contentDateOfModification', width: 230,cellTemplate: '<p>&nbsp; {{grid.appScope.showDate(row.entity.contentDateOfModification)}}</p>', headerTooltip: $filter('translate')('Date Of Last Modification'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,null);
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,null);
	 	              });
	 	            }
	};

	$scope.gridTotalGlobalConnectionsTableByDateReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        enableSorting: true,
	        columnDefs: [
	                     { name:$filter('translate')('Date'), field: 'connectionDate', cellTemplate: '<p>&nbsp; {{grid.appScope.showCustomDate(row.entity.connectionDate)}}</p>', headerTooltip: $filter('translate')('Date'),enableColumnMenu: false },
	                     { name:$filter('translate')('totalConnectionSeries'), field: 'connectionCount', headerTooltip: $filter('translate')('totalConnectionSeries'),enableColumnMenu: false },
	                     { name:$filter('translate')('uniqueConnectionSeries'), field: 'totalUniqueCount', headerTooltip: $filter('translate')('uniqueConnectionSeries'),enableColumnMenu: false }
	                    ],
	        onRegisterApi: function(gridApi) {
	        	$scope.gridApi = gridApi;
	        	$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	        		if (sortColumns.length != 0) {
	        			$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	           	}
	        		$scope.getData($scope.period,null);
	        	});
	 	       	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	       		$scope.page = newPage;
	 	       		$scope.itemsPerPage = pageSize;
	 	       		$scope.getData($scope.period,null);
	 	       	});
	 	   	}
	};
	// show date by custom format
	$scope.showCustomDate = function(dt){
		return $filter('date')(dt,$rootScope.customDateFormat);
	};
	
	// show date by format
	$scope.showDate = function(dt){
		return $filter('date')(dt,$rootScope.fullDateFormat);
	};
	
	//For report #9-2
	$scope.userNeverConnectedReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('First_Name'), field: 'firstName', headerTooltip: $filter('translate')('First_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Last_Name'), field: 'lastName', headerTooltip: $filter('translate')('Last_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('login'), field: 'login', headerTooltip: $filter('translate')('login'),enableColumnMenu: false},
	       	          { name:$filter('translate')('email'), field: 'email', headerTooltip: $filter('translate')('email'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Active'),field: 'active', cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'userneverconnected');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'userneverconnected');
	 	              });
	 	            }
	};
	
	//For report #9-4
	$scope.userConnectedLessEqual10Report ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('First_Name'), field: 'firstName', width: 110, headerTooltip: $filter('translate')('First_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Last_Name'), field: 'lastName', width: 110, headerTooltip: $filter('translate')('Last_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('login'), field: 'login', width: 160, headerTooltip: $filter('translate')('login'),enableColumnMenu: false},
	       	          { name:$filter('translate')('email'), field: 'email', width: 220, headerTooltip: $filter('translate')('email'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Active'), field: 'active', width: 60,cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Total Connection'), field: 'connectionCount', width: 230,  headerTooltip: $filter('translate')('Total Connection'),enableColumnMenu: false },
	       	          {	name:$filter('translate')('Last Connected Date'), field: 'lastLoginedDate', width: 225,  headerTooltip: $filter('translate')('Last Connected Date'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'userconnectedlessequal10');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'userconnectedlessequal10');
	 	              });
	 	            }
	};
	
	//For report #9-3
	$scope.allUsersConnectedReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('First_Name'), field: 'firstName', width: 110, headerTooltip: $filter('translate')('First_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Last_Name'), field: 'lastName', width: 110, headerTooltip: $filter('translate')('Last_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('login'), field: 'login', width: 160, headerTooltip: $filter('translate')('login'),enableColumnMenu: false},
	       	          { name:$filter('translate')('email'), field: 'email', width: 220, headerTooltip: $filter('translate')('email'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Active'), field: 'active', width: 60,cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Total Connection'), field: 'connectionCount', width: 230,  headerTooltip: $filter('translate')('Total Connection'),enableColumnMenu: false },
	       	          {	name:$filter('translate')('Last Connected Date'), field: 'lastLoginedDate', width: 225,  headerTooltip: $filter('translate')('Last Connected Date'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'allusersconnected');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'allusersconnected');
	 	              });
	 	            }
	};
	
	//For report #9-1
	$scope.gridUserDetailsAndActionsReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('User Name'), field: 'contentAuthor', width: 190, headerTooltip: $filter('translate')('User Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Active'), field: 'active', width: 55,cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false },
	       	          { name:$filter('translate')('company'), field: 'userCompany', width: 65, headerTooltip: $filter('translate')('company'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Service'), field: 'userService', width: 80, headerTooltip: $filter('translate')('Service'),enableColumnMenu: false },
	       	          { name:$filter('translate')('town'), field: 'userTown', width: 80, headerTooltip: $filter('translate')('town'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Status'), field: 'userCommunityStatus',cellTemplate: '<p>&nbsp; {{grid.appScope.translateStatus(row.entity.userCommunityStatus)}}</p>', width: 190, headerTooltip: $filter('translate')('Status'),enableColumnMenu: false,enableSorting: false },
	       	          { name:$filter('translate')('Number Of Connections'), field: 'connectionCount', width: 190, headerTooltip: $filter('translate')('Number Of Connections'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Number Of Publications'), field: 'publicationCount', width: 175,  headerTooltip: $filter('translate')('Number Of Publications'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.publicationCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'publish\')">(view details)</a></span>' },
	       	          { name:$filter('translate')('Number Of Views'), field: 'viewCount', width: 130,  headerTooltip: $filter('translate')('Number Of Views'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.viewCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'view\')">(view details)</a></span>'},
	       	          { name:$filter('translate')('Number of likes'), field: 'likeCount', width: 130,  headerTooltip: $filter('translate')('Number of likes'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.likeCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'like\')">(view details)</a></span>'},
	       	          { name:$filter('translate')('Number of comments'), field: 'commentCount', width: 190, headerTooltip: $filter('translate')('Number of comments'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.commentCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'comment\')">(view details)</a></span>'},	       	          
	       	          { name:$filter('translate')('Number of shares'), field: 'sharedContentCount', width: 150,  headerTooltip: $filter('translate')('Number of shares'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.sharedContentCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'share\')">(view details)</a></span>'},
	       	          { name:$filter('translate')('Number of downloads'), field: 'downloadCount', width: 205,  headerTooltip: $filter('translate')('Number of downloads'),enableColumnMenu: false
	       	        	  		,cellTemplate:' <span>&nbsp; {{row.entity.downloadCount}} <a ng-click="grid.appScope.viewDetails(row.entity.userUid,\'download\')">(view details)</a></span>'},
	       	          {	name:$filter('translate')('Last Connected Date'), field: 'lastLoginedDate', width: 225,  headerTooltip: $filter('translate')('Last Connected Date'),enableColumnMenu: false,enableSorting: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'userDetailsAndActions');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'userDetailsAndActions');
	 	              });
	 	            }
	};
	
	//For report #9-5
	$scope.gridUserConnectionSummaryReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('User Name'), field: 'contentAuthor', width: 190, headerTooltip: $filter('translate')('User Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Active'), field: 'active', width: 55,cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false },	       	          
	       	          { name:$filter('translate')('Last Total Connection'), field: 'connectionCount',  headerTooltip: $filter('translate')('Last Total Connection'),enableColumnMenu: false,enableSorting: false },
	       	          {	name:$filter('translate')('Last Connected Date'), field: 'lastLoginedDate',  headerTooltip: $filter('translate')('Last Connected Date'),enableColumnMenu: false }
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'connectUserSummary');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'connectUserSummary');
	 	              });
	 	            }
	};
	
	//For report #9-6
	$scope.gridUsersConnectedAtTheMomentReport ={
			paginationPageSizes: [ 20, 30, 50, 70, 100],
			paginationPageSize: 20,
			minRowsToShow : 20,
			showGridFooter : true,
	        useExternalPagination: true,
	        useExternalSorting: true,
	        
	        enableSorting: true,
	        columnDefs: [
	       	          { name:$filter('translate')('First_Name'), field: 'firstName', width: 110, headerTooltip: $filter('translate')('First_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Last_Name'), field: 'lastName', width: 110, headerTooltip: $filter('translate')('Last_Name'),enableColumnMenu: false },
	       	          { name:$filter('translate')('login'), field: 'login', width: 160, headerTooltip: $filter('translate')('login'),enableColumnMenu: false},
	       	          { name:$filter('translate')('email'), field: 'email', width: 220, headerTooltip: $filter('translate')('email'),enableColumnMenu: false},
	       	          { name:$filter('translate')('Active'), field: 'active', width: 60,cellTemplate: '<p>&nbsp; {{grid.appScope.showActive(row.entity.active)}}</p>',  headerTooltip: $filter('translate')('Active'),enableColumnMenu: false },
	       	          { name:$filter('translate')('Total Connection'), field: 'connectionCount', width: 230,  headerTooltip: $filter('translate')('Total Connection'),enableColumnMenu: false }	     	          
	       	          ],
	       	       onRegisterApi: function(gridApi) {
	 	             $scope.gridApi = gridApi;
	 	             $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	 	                if (sortColumns.length != 0) {
	 	             	$scope.sortKey = sortColumns[0].sort.direction;
	 	             	$scope.sortField = sortColumns[0].field;
	 	                }
	 	               $scope.getData($scope.period,'usersConnectedAtTheMoment');
	 	              });
	 	              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
	 	            	$scope.page = newPage;
	 	                $scope.itemsPerPage = pageSize;
	 	                $scope.getData($scope.period,'usersConnectedAtTheMoment');
	 	              });
	 	            }
	};
	
	$scope.showActive = function(active){
		return active == 'Yes' ? $filter('translate')('Yes'):$filter('translate')('No');
	};
	
	$scope.translateStatus = function(status){
		return $filter('translate')(status);
	};
	
	$scope.viewDetails = function(userUid, action){
        var modal = statUserDetailsReportModal.show(null, {userUid : userUid,action : action, startDate : $scope.dateFrom, endDate:$scope.dateTo,period : $scope.period});
        modal.closePromise.then(function (data) {
            if (data.value.flag == 'ok') {

            }
        });
	};
	
	if($scope.reportType == "userdetails"){
		//reload after every minute
		$interval(function(){
			$scope.getTotalConnectedUsers();
		}, 60000);
	}
	
	$scope.getTotalConnectedUsers = function() {
		apiStatisticReport.getTotalConnectedUsersAtTheMoment({period:$scope.period, startDate: $scope.dateFrom,endDate : $scope.dateTo}).then(function(data){
			$scope.totalConnections = data.totalConnections;
			$scope.totalUniqueUsers = data.totalUniqueUsers;
		});
	};
	$scope.defaultDateLabel =  "";
	$scope.showReport = function(type) {
		$scope.reportType = type;
		if($scope.reportType == "userdetails"){
			$scope.getTotalConnectedUsers();
		}
		$scope.page = 1;
		$scope.gridCommentAndLikeReport.paginationCurrentPage = 1;
		$scope.contentViewdBySourceReport.paginationCurrentPage = 1;
		$scope.itemsPerPage = 20;
		$scope.sortKey = "";
		$scope.sortField = "";
		$scope.period = "thisweek"; // reset period
		$scope.selected = 2; // reset period
		$scope.periodLabel =$scope.defaultDateLabel;
		$scope.getData($scope.period,$scope.userFilter);
		$scope.isTracking = false;
		if(type == 'activity' || type == 'contentviewcommunity' || type == 'contentviewdbysource'){
			$scope.isTracking = true;
		}
		
		apiStatisticReport.getLastUpdatedDate({isTracking : $scope.isTracking}).then(function(data){
			$scope.lastUpdatedDate = data;
		});
		if(exportMenu != null){
			exportMenu.toggle(false);
		}
		
		if(exportGbconnectMenu != null){
			exportGbconnectMenu.toggle(false);
		}
		
		if(datePicker != null){
			datePicker.hide();
		}
	};
	
	$scope.list = [];
	
	/*Golbal connection list text */
	$scope.golbalConnectText = ["connecttotal",
		                 "connectDepartment",
		                 "connectStatus",
		                 "connectCommunityStatus"
		                 ];
	
	
	$scope.selectGlobal = function(index,globalType){
		$scope.golbalSelected=index;
		$scope.globalType = globalType;
		$scope.period = "today";
		$scope.getData($scope.period,null);
	};
	
	/*Format type*/
	$scope.formatTypes = ["chart","table"];
	$scope.selectedFormatIndex = 0;
	$scope.selectFormat = function(index,format){
		$scope.selectedFormat = format;
		$scope.selectedFormatIndex = index;
		$scope.getData($scope.period,null);
	};
	
	$scope.preiodText = [];
	$scope.periodLabel = "";
	$scope.loadPeriod = function(){
		apiStatisticReport.getListPeriod().then(function(data){
			angular.forEach(data, function(value, key) {
					var period =  {
										name : value.period
										
									 }
					if(value.startDate == value.endDate){
						period.dateLabel = $filter('date')(value.startDate,'d MMM yy');
					}else{
						if(typeof(value.startDate)!=undefined){
							period.dateLabel = $filter('date')(value.startDate,'d MMM') +"-"+ $filter('date')(value.endDate,'d MMM yy');
						}
						
					}
					if("thisweek" == value.period){
						$scope.periodLabel = period.dateLabel;
						$scope.defaultDateLabel =period.dateLabel;
					}
					$scope.preiodText.push(period);
					
				});
		});
	};
		
	$scope.loadPeriod();
	
	//Filters of user details report : Connected , Never Connected , Connected Less than 10
	$scope.userDetailsFilters = [{name:'User Details And Actions', type:'userDetailsAndActions'},
	                             {name:'Users never connected', type:'userneverconnected'},
	                             {name:'All users connected', type:'allusersconnected'},
	                             {name:'Users connected less or equal 10 times', type:'userconnectedlessequal10'},
	                             {name:'User Connection Summary', type:'connectUserSummary'}
	                             //,{name:'Users connected today', type:'usersConnectedAtTheMoment'}
	                            ];
	$scope.defaultFilter = "Users never connected";
	$scope.selectedFilter=0;
	$scope.selectUserDetails = function(index,userFilter){
		$scope.userFilter = userFilter.type;
		$scope.selectedFilter=index;
		$scope.getData($scope.period,userFilter.type);
	};
	
	$scope.filterUsers = function(event,searchText){
		if(event.keyCode == 13 || event.keyCode == 1){
			$scope.doFilter(searchText);
		}	
	};
	
	$scope.doFilter = function(searchText){
		$scope.searchText = searchText;
		$scope.getData($scope.period,$scope.userFilter);	
	};
	
	//filters by community content tab
	$scope.communityContentFilters = [{name:'Content per communities', type:'contentpercommunity'},
	                                  {name:'Content viewed by community', type:'contentviewcommunity'},
	                                  {name:'Activity on a community', type:'activity'}
	                                 ];
	$scope.defaultCommunityContentFilter = "Content per communities";
	$scope.selectedCommunityContentFilter=0;
	$scope.selectCommunityContentDetails = function(index,communityContentFilter){
		$scope.communityContentFilter = communityContentFilter.type;
		$scope.selectedCommunityContentFilter=index;
		$scope.getData($scope.period,$scope.userFilter);
	};

	$scope.select = function(index,period){
		$scope.selected=index;
		$scope.page = 1;
		$scope.gridCommentAndLikeReport.paginationCurrentPage = 1;
		$scope.contentViewdBySourceReport.paginationCurrentPage = 1;
		$scope.itemsPerPage = 20;
		$scope.sortKey = "";
		$scope.sortField = "";
		$scope.period = period.name;
		$scope.periodLabel = period.dateLabel;
		if(exportMenu != null){
			exportMenu.toggle(false);
		}
		
		if(exportGbconnectMenu != null){
			exportGbconnectMenu.toggle(false);
		}
		
		if(datePicker != null){
			datePicker.hide();
		}
		if("choosedate" == period.name){
			datePicker = $('#period-button');
			datePicker.show();
		}else{
			$scope.getData(period.name,$scope.userFilter);
		}
		
		if($scope.reportType == "userdetails"){
			$scope.getTotalConnectedUsers();
		}
		
	};
	
	$scope.loadMore = function(){
		$scope.page++;
		$scope.getData($scope.period,null);
	};
	
	$scope.dateFromExport = null;
	$scope.dateToExport = null;
	$scope.exportReport = function (reportType,userFilter){
		var startDate = $scope.dateFromExport != null ? new Date($scope.dateFromExport).getTime() : null;
		var endDate = $scope.dateToExport != null ? new Date($scope.dateToExport).getTime() : null;
		if((reportType == 'userdetails' && userFilter != 'userDetailsAndActions' && userFilter != 'connectUserSummary') 
				|| (reportType == 'gbconnect' && $scope.globalType != 'connecttotal' && $scope.selectedFormat != 'table')
				|| reportType == 'gbcontent'){
			$scope.period = "sincebegining";
		}
		
		if(reportType == 'userdetails'){
			reportType = userFilter;
		}else if(reportType == 'gbconnect'){
			if($scope.globalType == 'connecttotal' && $scope.selectedFormat == 'table'){
				reportType = "connecttotaltable";
			}else{
				reportType = $scope.globalType;
			}
		}else if(reportType == 'communitycontent'){
			reportType = $scope.communityContentFilter;
		}
		
		var postData = {
				reportType : reportType,
				period: $scope.period,
				startDate : startDate, 
				endDate:endDate,
				language:$rootScope.currentLanguage.code,
				communityUid: $stateParams.commuid
	    };
//		postData.searchText = $scope.searchText;	
		
		apiStatisticReport.exportReport(postData).then(function(data){
			var link = document.createElement('a');
			link.setAttribute('download', null);
			link.style.display = 'none';
			document.body.appendChild(link);
			
			var path = '';
			if(reportType == 'activity'){
				path = '/api/mediamanager?file=export_activity_report.xlsx';
			}else if(reportType == 'commentlike'){
				path = '/api/mediamanager?file=export_comment_like_report.xlsx';
			}else if(reportType == 'contentviewdbysource'){
				path = '/api/mediamanager?file=export_content_viewed_by_source_report.xlsx';
			}else if(reportType == 'userneverconnected'){
				path = '/api/mediamanager?file=export_user_never_connected_report.xlsx';
			}else if(reportType == 'userconnectedlessequal10'){
				path = '/api/mediamanager?file=export_user_connected_less_or_equal_10_times_report.xlsx';
			}else if(reportType == 'allusersconnected'){
				path = '/api/mediamanager?file=export_all_users_connected_report.xlsx';
			}else if(reportType == 'connecttotal'){
				path = '/api/mediamanager?file=export_total_global_connections_by_date_counting_report.xlsx';
			}else if(reportType == 'connectDepartment'){
				path = '/api/mediamanager?file=export_total_global_connections_by_date_and_department_counting_report.xlsx';
			}else if(reportType == 'connectStatus'){
				path = '/api/mediamanager?file=export_total_global_connections_by_date_and_status_counting_report.xlsx';
			}else if(reportType == 'community'){
				path = '/api/mediamanager?file=export_total_connections_of_community_member_counting_report.xlsx';
			}else if(reportType == 'gbcontent'){
				path = '/api/mediamanager?file=export_content_created_and_published_by_date_counting_report.xlsx';
			}else if(reportType == 'contentpercommunity'){
				path = '/api/mediamanager?file=export_content_created_and_published_on_community_counting_report.xlsx';
			}else if(reportType == 'contentviewcommunity'){
				path = '/api/mediamanager?file=export_types_of_content_viewed_detail_by_community_analyzing_report.xlsx';
			}else if(reportType == 'connectCommunityStatus'){
				path = '/api/mediamanager?file=export_total_connections_by_cty_status_counting_report.xlsx';
			}else if(reportType == 'userDetailsAndActions'){
				path = '/api/mediamanager?file=export_user_details_and_actions_report.xlsx';
			}else if(reportType == 'connectUserSummary'){
				path = '/api/mediamanager?file=export_user_connection_summary_report.xlsx';
			}else if(reportType == 'usersConnectedAtTheMoment'){
				path = '/api/mediamanager?file=export_users_connected_at_the_moment_report.xlsx';
			}else if(reportType == 'connecttotaltable'){
				path = '/api/mediamanager?file=export_total_global_connections_table_by_date_counting_report.xlsx';
			}
			
			link.setAttribute('href', path);
			link.click();
			document.body.removeChild(link);
		});
	};
	
	/*Customize for menu toggle*/
	$scope.hiddenExport = function(){
		exportMenu = $('#menu-toogle');
		exportMenu.toggle(400);
	};
	
	/*Customize for menu toggle*/
	$scope.hiddenGbconnectExport = function(){
		exportGbconnectMenu = $('#menu-toogle-gbconnect');
		exportGbconnectMenu.toggle(400);
	};
	
	/*Customize  sort*/
	$scope.sortReport = function(field, key){
		if(field == $scope.sortField){
			if($scope.sortKey == 'asc'){
				key = 'desc';
			}else{
				key = 'asc'
			}
		}
		$scope.sortKey = key;
		$scope.sortField = field;
		$scope.getData($scope.period,null);
	};
	
	/*Select custom period*/
	$scope.selectPeriod = function(dateFrom, dateTo){
		$scope.period = "choosedate";
		$scope.dateFrom = dateFrom == null ? null : $filter('date')(dateFrom,'MM/dd/yyyy');
		$scope.dateTo = dateTo == null ? null : $filter('date')(dateTo,'MM/dd/yyyy');
		$scope.dateFromExport = dateFrom;
		$scope.dateToExport = dateTo;
		if(dateTo != null && dateFrom != null){
			$scope.periodLabel = $filter('date')(dateFrom,'d MMM') +"-"+ $filter('date')(dateTo,'d MMM yy');
		}else if(dateFrom != null && dateTo == null){
			$scope.periodLabel = $filter('date')(dateFrom,'d MMM') +"-"+ $filter('date')(dateFrom,'d MMM yy');
		}else if(dateFrom == null && dateTo != null){
			$scope.periodLabel = $filter('date')(dateTo,'d MMM') +"-"+ $filter('date')(dateTo,'d MMM yy');
		}
		$scope.getData($scope.period,$scope.userFilter);
		
		if($scope.reportType == "userdetails"){
			$scope.getTotalConnectedUsers();
		}
	};

	/* download all reports in same excel*/
	$scope.downloadAllReport = function(){
		var modal = confirmModal.showTranslated($scope, {title: "Download", message: "download_all_reports_confirm"});
		modal.closePromise.then(function (data) {
			if(data.value == 'ok'){
				var postData = {
						communityUid : $stateParams.commuid,
						language:$rootScope.currentLanguage.code
			    };
				apiStatisticReport.exportAllReportsInSameExcel(postData).then(function(data){
					var link = document.createElement('a');
					link.setAttribute('download', null);
					link.style.display = 'none';
					document.body.appendChild(link);
					
					var path = '/api/mediamanager?file=export_all_reports.xlsx';
					
					link.setAttribute('href', path);
					link.click();
					document.body.removeChild(link);
				}, function(err){
					notifyModal.showTranslated('something_went_wrong', 'error', null);
	            });
	          }
	      });
	};
 })
 .controller('ReportDetailsCtrl', function ($scope, $rootScope,$q, apiStatisticReport){
	 
 })
 .controller('StatUserDetailsReport', function ($scope, $rootScope,$q,$filter, apiStatisticReport,apiAlert){
	    $scope.popupData = $scope.$parent.ngDialogData;

		$scope.page = 1;
		$scope.itemsPerPage = 20;
		$scope.sortKey = "";
		$scope.sortField = "";
		
		// Details of Publications
		$scope.gridPublications ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
		       	          { name:$filter('translate')('Type'), field: 'type',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.type)}}</p>', width: "35%", headerTooltip: $filter('translate')('Title'),enableColumnMenu: false,enableSorting: false },	       	         
		       	          { name:$filter('translate')('Number of publications'), field: 'count',headerTooltip: $filter('translate')('Number of publications'),enableColumnMenu: false,enableSorting: false }
		       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       	}
		};
		
		// Details of Views
		$scope.gridViews ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
		                     { name:$filter('translate')('Content Name'), field: 'contentTitle', width: "40%", headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Community'), field: 'communityName', width: 220, headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Type'), field: 'contentType',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.contentType)}}</p>', width: 135, headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
		                     { name:$filter('translate')('Home NF'), field: 'contentViewedByHomeCount', width: 130, headerTooltip: $filter('translate')('Home NF'),enableColumnMenu: false},
			       	          { name:$filter('translate')('Community NF'), field: 'contentViewedByCommunityCount', width: 115,  headerTooltip: $filter('translate')('Community NF'),enableColumnMenu: false },
			       	          { name:$filter('translate')('Tab NF'), field: 'contentViewedByTabCount', width: 75,  headerTooltip: $filter('translate')('Tab NF'),enableColumnMenu: false },
			       	          { name:$filter('translate')('Total'), field: 'totalUniqueCount', width: 65,  headerTooltip: $filter('translate')('Total'),enableColumnMenu: false }
			       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
		       			if (sortColumns.length != 0) {
		       				$scope.sortKey = sortColumns[0].sort.direction;
		 	             	$scope.sortField = sortColumns[0].field;
		       			}
		       			
		       			$scope.getData('view');
		       		});
		       		
		 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		 	        	$scope.page = newPage;
		 	            $scope.itemsPerPage = pageSize;
		 	            $scope.getData('view');
		 	        });
		       	}
		};
		
		// Details of Likes
		$scope.gridLikes ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
		                     { name:$filter('translate')('Content Name'), field: 'contentTitle', width: "45%", headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Community'), field: 'communityName', headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Type'), field: 'contentType',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.contentType)}}</p>', headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false }
		       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
		       			if (sortColumns.length != 0) {
		       				$scope.sortKey = sortColumns[0].sort.direction;
		 	             	$scope.sortField = sortColumns[0].field;
		       			}
		       			
		       			$scope.getData('like');
		       		});
		       		
		 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		 	        	$scope.page = newPage;
		 	            $scope.itemsPerPage = pageSize;
		 	            $scope.getData('like');
		 	        });
		       	}
		};
		
		// Details of Comments
		$scope.gridComments ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
							{ name:$filter('translate')('Content Name'), field: 'contentTitle', width: "40%", headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
							{ name:$filter('translate')('Content Community'), field: 'communityName', headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
							{ name:$filter('translate')('Content Type'), field: 'contentType',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.contentType)}}</p>', headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
							{ name:$filter('translate')('Number of comments'), field: 'commentCount', headerTooltip: $filter('translate')('Number of comments'),enableColumnMenu: false}
		       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
		       			if (sortColumns.length != 0) {
		       				$scope.sortKey = sortColumns[0].sort.direction;
		 	             	$scope.sortField = sortColumns[0].field;
		       			}
		       			
		       			$scope.getData('comment');
		       		});
		       		
		 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		 	        	$scope.page = newPage;
		 	            $scope.itemsPerPage = pageSize;
		 	            $scope.getData('comment');
		 	        });
		       	}
		};
		
		// Details of Shares
		$scope.gridShares ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
		                     { name:$filter('translate')('Content Name'), field: 'contentTitle', width: "40%", headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Community'), field: 'communityName', headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
		                     { name:$filter('translate')('Content Type'), field: 'contentType',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.contentType)}}</p>', headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
		                     { name:$filter('translate')('Number of shares'), field: 'sharedContentCount',  headerTooltip: $filter('translate')('Number of shares'),enableColumnMenu: false },
			       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
		       			if (sortColumns.length != 0) {
		       				$scope.sortKey = sortColumns[0].sort.direction;
		 	             	$scope.sortField = sortColumns[0].field;
		       			}
		       			
		       			$scope.getData('share');
		       		});
		       		
		 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		 	        	$scope.page = newPage;
		 	            $scope.itemsPerPage = pageSize;
		 	            $scope.getData('share');
		 	        });
		       	}
		};
		
		// Details of Downloads
		$scope.gridDownloads ={
				paginationPageSizes: [ 20, 30, 50, 70, 100],
				paginationPageSize: 20,
				minRowsToShow : 20,
				showGridFooter : true,
		        useExternalPagination: true,
		        useExternalSorting: true,
		        
		        enableSorting: true,
		        columnDefs: [
		       	          	{ name:$filter('translate')('Content Name'), field: 'contentTitle', width: "40%", headerTooltip: $filter('translate')('Content Name'),enableColumnMenu: false },
							{ name:$filter('translate')('Content Community'), field: 'communityName', headerTooltip: $filter('translate')('Content Community'),enableColumnMenu: false },
							{ name:$filter('translate')('Content Type'), field: 'contentType',cellTemplate: '<p>&nbsp; {{grid.appScope.showType(row.entity.contentType)}}</p>', headerTooltip: $filter('translate')('Content Type'),enableColumnMenu: false },
							{ name:$filter('translate')('Number of downloads'), field: 'downloadCount',  headerTooltip: $filter('translate')('Number of downloads'),enableColumnMenu: false },
		       	          ],
		       	onRegisterApi: function(gridApi) {
		       		$scope.gridApi = gridApi;
		       		$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
		       			if (sortColumns.length != 0) {
		       				$scope.sortKey = sortColumns[0].sort.direction;
		 	             	$scope.sortField = sortColumns[0].field;
		       			}
		       			
		       			$scope.getData('download');
		       		});
		       		
		 	        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		 	        	$scope.page = newPage;
		 	            $scope.itemsPerPage = pageSize;
		 	            $scope.getData('download');
		 	        });
		       	}
		};

		// get data
		$scope.getData = function(action){
			apiStatisticReport.getDetailsOfActionByUser({userUid: $scope.popupData.userUid,action : action,period : $scope.popupData.period,
				startDate : $scope.popupData.startDate, endDate:$scope.popupData.endDate, page:$scope.page,
				itemsPerPage:$scope.itemsPerPage, sortKey : $scope.sortKey, sortField : $scope.sortField})
			.then(function(data){
	    		if(action == 'publish'){
					$scope.gridPublications.data = data.rows[0].typesOfContentCount;
		    		$scope.gridPublications.totalItems = data.total;
	    		}else if(action == 'view'){
	    			$scope.gridViews.data = data.rows;
		    		$scope.gridViews.totalItems = data.total;
	    		}else if(action == 'comment'){
	    			$scope.gridComments.data = data.rows;
		    		$scope.gridComments.totalItems = data.total;
	    		}else if(action == 'like'){
	    			$scope.gridLikes.data = data.rows;
		    		$scope.gridLikes.totalItems = data.total;
	    		}else if(action == 'share'){
	    			$scope.gridShares.data = data.rows;
		    		$scope.gridShares.totalItems = data.total;
	    		}else if(action == 'download'){
	    			$scope.gridDownloads.data = data.rows;
		    		$scope.gridDownloads.totalItems = data.total;
	    		}
	    	});
		};
		
		//load data on table
		$scope.getData($scope.popupData.action);
		
		//translate for content'stype
		$scope.showType = function(type){
			return $filter('translate')(type);
		};
		
		var exportMenu = $('#menu-toogle-userdetails');
		/*Customize for menu toggle*/
		$scope.hiddenExport = function(){
			exportMenu = $('#menu-toogle-userdetails');
			exportMenu.toggle(400);
		};
		
		$scope.exportReport = function (action){
			var postData = {
					period: $scope.popupData.period,
					startDate : $scope.popupData.startDate, 
					endDate:$scope.popupData.endDate,
					language:$rootScope.currentLanguage.code,
					userUid: $scope.popupData.userUid,
					action: action
		    };

			
			apiStatisticReport.exportUserDetailsByActionReport(postData).then(function(data){
				var link = document.createElement('a');
				link.setAttribute('download', null);
				link.style.display = 'none';
				document.body.appendChild(link);
				
				var path = '/api/mediamanager?file=export_user_details_by_action_report.xlsx';
				link.setAttribute('href', path);
				link.click();
				document.body.removeChild(link);
			});
		};
 });