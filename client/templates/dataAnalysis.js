/**
 * Created by Hieu on 11/15/2015.
 */
Template.dataAnalysis.onCreated(function(){
    var self = this;
    var startDate = moment().date(1);
    var endDate = moment();
    endDate.month(endDate.month() + 1).date(1);
    this.apartmentSelected = new ReactiveVar(undefined);
    this.buildingSelected = new ReactiveVar(undefined);
    this.startDate = new ReactiveVar(startDate);
    this.endDate = new ReactiveVar(endDate);
    this.soundThreshold = new ReactiveVar(0);
    this.vibrationThreshold = new ReactiveVar(0);

    this.viewMode = new ReactiveVar("data"); // "data" or "graph"
    this.homeSelected = new ReactiveArray();
	this.epicenterCheckedHome = [];
	this.homeMakingNoise = undefined;
    this.autorun(function(){
        var bu = self.buildingSelected.get();
        //self.subscribe(SoundMonitor.Constants.DATA_SOURCE, (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get(),self.vibrationThreshold.get());
		self.subscribe('SoundData', (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get());
		
		self.subscribe('VibData', (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.vibrationThreshold.get());
		//self.subscribe('Sound-Vib-Data', (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get(),self.vibrationThreshold.get());
    });

    this.autorun(function(){
        var bu = self.buildingSelected.get();
        self.homeSelected.clear();
    });
	
	
});
Template.dataAnalysis.onRendered(function(){
    var self = this;
    this.$('#startDatePicker').datetimepicker({
        defaultDate: self.startDate.get(),
        format: "MMM DD YYYY",
        keepOpen: false,
        allowInputToggle: true
    });
    this.$('#startDatePicker').on("dp.change", function(e) {
        self.startDate.set(e.date);
    });
    this.$('#endDatePicker').datetimepicker({
        defaultDate: self.endDate.get(),
        format: "MMM DD YYYY",
        keepOpen: false,
        allowInputToggle: true
    });
    this.$('#endDatePicker').on("dp.change", function(e) {
        self.endDate.set(e.date);
    });
});
Template.dataAnalysis.onDestroyed(function(){
    this.$('#startDatePicker').data("DateTimePicker").destroy();
    this.$('#endDatePicker').data("DateTimePicker").destroy();
});

Template.dataAnalysis.helpers({
    parametersUpdated: function(){
        // track parameter changes
        var val1 = Template.instance().startDate.get();
        var val2 = Template.instance().endDate.get();
        var val3 = Template.instance().soundThreshold.get();
        var val4 = Template.instance().vibrationThreshold.get();
        return val1.valueOf() + val2.valueOf() + (parseInt(val3) || 0) + (parseInt(val4) || 0);
    },
    masterTemplate: function(){
        return Template.instance();
    },
    homeSelected: function(){
        return Template.instance().homeSelected;
    },
	
	homeListForEpicenter:function(){
		if(Template.instance().homeSelected.length >=1 )
		{
			var checkedHome = [];
			var condRow1 = false;
			var condRow2 = false;
			var condCol1 = false;
			var condCol2 = false;
			var selectedBuilding = Template.instance().buildingSelected.get();
			var selectedHomeId = Template.instance().homeSelected[Template.instance().homeSelected.length - 1];
			var selectedHome = Home.findOne({_id:selectedHomeId});
			var selectedHomeNumber = selectedHome.homeNumber;
			var homeColumn = selectedHomeNumber % 100;
			var homeRow = selectedHomeNumber/100;
			
			if(selectedHome.maxSound >= Template.instance().soundThreshold.get() &&
			selectedHome.maxVibration >= Template.instance().vibrationThreshold.get())
			{
				condRow1 = (homeRow + 1 >= selectedBuilding.numOfFloors) ? (selectedBuilding.numOfFloors+1):homeRow + 1;
				condRow2 = (homeRow + 1 >= selectedBuilding.numOfFloors) ? (selectedBuilding.numOfFloors+1):homeRow + 1;
				
			} else if(selectedHome.maxSound > Template.instance().soundThreshold.get() &&
			selectedHome.maxVibration < Template.instance().vibrationThreshold.get()){
				var condRow1 = (homeRow - 1 >= 0)? (homeRow-1) : 0;
				var condRow2 = (homeRow + 1 >= selectedBuilding.numOfFloors) ? (selectedBuilding.numOfFloors):homeRow + 1;
				
			}
			var condCol1 = (0 >= homeColumn -1) ? 0 : homeColumn -1;
			var condCol2 = (homeColumn + 1 >= selectedBuilding.numHousePerFloor) ? selectedBuilding.numHousePerFloor :homeColumn + 1 ;
			var homeList = selectedBuilding.homes();
			
			_.each(homeList,function(element,index,array){
				if(element._id != selectedHomeId){
					var checkHomeColumn = element.homeNumber % 100;
					var checkHomeRow = element.homeNumber/100;
					if(condRow1 <= checkHomeRow && checkHomeRow <= condRow2 && condCol1 <= checkHomeColumn && checkHomeColumn <= condCol2){
						checkedHome.push(element.homeNumber);
					
					}
				}
			});
			return checkedHome;
		}
	},
	
    apartments: function(){
        var templ = Template.instance();
        var query = Apartment.find({});
        query.observeChanges({
            removed: function(id){
                if(id == templ.apartmentSelected.get()._id){
                    templ.apartmentSelected.set(undefined);
                    templ.buildingSelected.set(undefined);
                }

            }
        });
        return query;
    },
    buildings: function(){
        var ap = Template.instance().apartmentSelected.get();
        return (ap)? ap.buildings() : [];
    },
    homes: function(){
        var bu = Template.instance().buildingSelected.get();
        return (bu)? bu.homes().map(function(doc, index, cursor){
            var i = _.extend(doc,{index: index});
            return i;
        }) : [];
    },
	homes_1: function(){
        var bu = Template.instance().buildingSelected.get();
        return (bu)? bu.homes(): [];
    },
    isRemainder: function(index, rem){
        return index % 2 == rem;
    },
    isGraphMode: function(){
        return Template.instance().viewMode.get() == "graph";
    },
	isEpicenterMode:function(){
		 
		 return Template.instance().viewMode.get() == "epicenter";
	},
	selectedHomes:function(){
		var selectedHomes = Template.instance().homeSelected.array();
		return (selectedHomes)?Home.find({_id:{$in:selectedHomes}}):[];
		
	},
    buildingMaxInfo: function(){
        var chosenBuilding = Template.instance().buildingSelected.get();
        return chosenBuilding && chosenBuilding.maxInfo(Template.instance().startDate.get().toDate()
            , Template.instance().endDate.get().toDate()
            , Template.instance().soundThreshold.get()
            , Template.instance().vibrationThreshold.get());
    },
	buildingMaxInfo_1:function(){
		var chosenBuilding = Template.instance().buildingSelected.get();
		return chosenBuilding && chosenBuilding.maxInfo_1();
	},
	
	floors:function(){
		var bu = Template.instance().buildingSelected.get();
		if(bu!=undefined){
			var numOfFloor = bu.numOfFloors;
			var i=1;
			var floors = [];
			for(i;i<=numOfFloor;i++){
				var floorInfo={floorNumber:i};
				floors.push(floorInfo);
			}
			return floors;
		}
		else{
			return [];
		}
		
		
	},
	
});

Template.dataAnalysis.events({
    'change #viewMode': function(event){
        var target = event.currentTarget;
        var mode = target.options[target.selectedIndex].value;
        Template.instance().viewMode.set(mode);
		var self = Template.instance();
		if(mode == "epicenter"){
			
			var checkedHome = [] ;
			Template.instance().epicenterCheckedHome = checkedHome ;
			
			if(Template.instance().homeSelected.length >=1 )
			{
				
				var condRow1 = undefined;
				var condRow2 = undefined;
				var condCol1 = undefined;
				var condCol2 = undefined;
				var selectedBuilding = Template.instance().buildingSelected.get();
				var selectedHomeId = Template.instance().homeSelected[Template.instance().homeSelected.length - 1];
				var selectedHome = Home.findOne({_id:selectedHomeId});
				var selectedHomeNumber = selectedHome.homeNumber;
				var homeColumn = selectedHomeNumber % 100;
				var homeRow = parseInt(selectedHomeNumber/100);
				if(selectedHome.maxSound >= Template.instance().soundThreshold.get() &&
				selectedHome.maxVibration >= Template.instance().vibrationThreshold.get())
				{
					condRow1 = homeRow;
					condRow2 = homeRow;
				} else if(selectedHome.maxSound > Template.instance().soundThreshold.get() &&
				selectedHome.maxVibration < Template.instance().vibrationThreshold.get()){
					var condRow1 = (homeRow - 1 >= 0)? (homeRow-1) : 0;
					var condRow2 = (homeRow + 1 >= selectedBuilding.numOfFloors) ? (selectedBuilding.numOfFloors):homeRow + 1;
					
				}
				var condCol1 = (0 >= homeColumn -1) ? 0 : homeColumn -1;
				var condCol2 = (homeColumn + 1 >= selectedBuilding.numHousePerFloor) ? selectedBuilding.numHousePerFloor :homeColumn + 1 ;
				var homeList = selectedBuilding.homes().fetch();
				var maxHome = undefined;
				var maxSoundDetected = 0;
				var maxVibDetected = 0;
				_.each(homeList,function(element,index,array){
					
						var checkHomeColumn = element.homeNumber % 100;
						var checkHomeRow = parseInt(element.homeNumber/100);
						
						if(condRow1 <= checkHomeRow && checkHomeRow <= condRow2 && condCol1 <= checkHomeColumn && checkHomeColumn <= condCol2){
							checkedHome.push(element.homeNumber);
							if(condRow1 == condRow2){
								if(maxVibDetected < element.maxVibration && element.homeNumber != selectedHomeNumber)
								{
									maxHome = element;
									maxVibDetected = element.maxVibration;
								}
							}
							else if(condRow1 != undefined && condRow2 != undefined && condRow1 != condRow2)
							{
								if(maxSoundDetected < element.maxSound)
								{
									maxHome = element;
									maxSoundDetected = element.maxSound;
								}
							}
						}
					
				});
				
				Template.instance().homeMakingNoise = maxHome;
			}
		}
		
    },
    'change #apartment-selection-dashboard': function(event){
        var target = event.currentTarget;
        var newId = target.options[target.selectedIndex].value;
        Template.instance().apartmentSelected.set(Apartment.findOne({_id: newId}));
        Template.instance().buildingSelected.set(undefined);
    },
    'click #building-list .list-group-item': function(event,template){
        var target = event.currentTarget;
        $('#building-list .list-group-item').removeClass('active');
        $(target).addClass("active");
        var newId = target.value;
		var buildingSelected = Building.findOne({_id: newId});
		var soundDangerThreshold = buildingSelected.dangerSoundThreshold;
		var vibDangerThreshold = buildingSelected.dangerVibThreshold;
		
		var soundThresholdInput = template.find('#thresholdSoundPicker');
		soundThresholdInput.value = soundDangerThreshold;
		
		var vibThresholdInput = template.find('#thresholdVibrationPicker');
		vibThresholdInput.value = vibDangerThreshold;
		
        Template.instance().buildingSelected.set(Building.findOne({_id: newId}));
		Template.instance().soundThreshold.set(soundDangerThreshold);
		Template.instance().vibrationThreshold.set(vibDangerThreshold);
		
		Session.set("data_analysis_buildingSelected",Building.findOne({_id: newId}));
    },
    'change #thresholdSoundPicker': function(event){
        var target = event.currentTarget;
        var threshold = target.value;
        Template.instance().soundThreshold.set(threshold);
        $(target).blur();
    },
    'change #thresholdVibrationPicker': function(event){
        var target = event.currentTarget;
        var threshold = target.value;
        Template.instance().vibrationThreshold.set(threshold);
        $(target).blur();
    }
});

// Home
Template.dataHome.onRendered(function(){
    var dataContext = Template.currentData();
    var homeId = this.$(".homeCell").attr("id");
    if(dataContext.masterTemplate.homeSelected.indexOf(homeId) >= 0){
        this.$(".homeCell").addClass("active");
    }
    //console.log(dataContext.masterTemplate.homeSelected.array());
});
Template.dataHome.helpers({
	getResult: function(home,masterTemplate){
		/* var dataContext = Template.currentData();
		var masterTemplate = dataContext.masterTemplate; */
		
		if(masterTemplate.viewMode.get() == 'epicenter' )
		{
			if(home._id == masterTemplate.homeMakingNoise._id)
			{
				var result = {home:home, status:true};
				return result;
			}
			else
			{
				var result = {home:home, status:false};
				return result;
			}
		}
		else{
			var result = {home:home, status:false};
			return result;
		}
		
	},
    parametersUpdated: function(){
        var dataContext = Template.currentData();
        return dataContext.parametersUpdated;
    },
    isGraphMode: function(){
        var dataContext = Template.currentData();
        return dataContext.masterTemplate.viewMode.get() == "graph";
    },
	
    maxInfo: function(){
        var dataContext = Template.currentData();
        var home = dataContext.home;
        return home.maxInfo(dataContext.startDate, dataContext.endDate, dataContext.soundThreshold, dataContext.vibrationThreshold);
    },
	maxSoundInfo:function(){
		var dataContext = Template.currentData();
        var home = dataContext.home;
		var node = home.node();
		
		var soundData = undefined;
		soundData = SoundData.findOne({nodeNumber:node.nodeNumber});
		if(soundData!=undefined)
		{
			return {
				maxSound: soundData.maxSound,
           
				numOfSoundOverThreshold: soundData.numOfSoundOverThreshold
			}
		}
		else{
			return {
				maxSound: 0,
           
				numOfSoundOverThreshold: 0,
			}
			
            
		}
		
	},
	maxVibrationInfo:function(){
		var dataContext = Template.currentData();
        var home = dataContext.home;
		var node = home.node();
		//console.log(node.nodeNumber);
		//console.log(SoundData.find({nodeNumber:node.nodeNumber}));
		var vibData = undefined;
		vibData = VibData.findOne({nodeNumber:node.nodeNumber});
		if(vibData!=undefined)
		{
			return {
				maxVib: vibData.maxVib,
           
				numOfVibOverThreshold: vibData.numOfVibOverThreshold
			}
		}
		else{
			return {
				maxVib: 0,
           
				numOfVibOverThreshold: 0,
			}
		}
	},
	homeInfo:function(homeNumber,masterTemplate){
		
		var bu = Session.get("data_analysis_buildingSelected"); 
		//console.log(bu);
		var foundHome =  Home.findOne({buildingId:bu._id,homeNumber:parseInt(homeNumber)});
		var result = {home:foundHome,template:masterTemplate}
		if(foundHome != undefined)
		{
			return result;
		}
		return undefined;
	},
	maxSoundInfo_1:function(home){
		//var dataContext = Template.currentData();
        //var home = dataContext.home;
	
		var node = home.node();
		
		var soundData = undefined;
		soundData = SoundData.findOne({nodeNumber:node.nodeNumber});
		if(soundData!=undefined)
		{
			return {
				maxSound: soundData.maxSound,
           
				numOfSoundOverThreshold: soundData.numOfSoundOverThreshold
			}
		}
		else{
			return {
				maxSound: 0,
           
				numOfSoundOverThreshold: 0,
			}
			
            
		}
		
	},
	maxVibrationInfo_1:function(home){
		//var dataContext = Template.currentData();
        //var home = dataContext.home;
		var node = home.node();
		//console.log(node.nodeNumber);
		//console.log(SoundData.find({nodeNumber:node.nodeNumber}));
		var vibData = undefined;
		vibData = VibData.findOne({nodeNumber:node.nodeNumber});
		if(vibData!=undefined)
		{
			return {
				maxVib: vibData.maxVib,
           
				numOfVibOverThreshold: vibData.numOfVibOverThreshold
			}
		}
		else{
			return {
				maxVib: 0,
           
				numOfVibOverThreshold: 0,
			}
		}
	},
	listHomeNumber:function(floorNumber, masterTemplate){
		var bu = Session.get("data_analysis_buildingSelected"); 
		var isEpicenterMode = masterTemplate.viewMode.get() == 'epicenter';
		var list_HomeNumber = [];
		var numOfHomePerFloor = 0;
		var checkedHome = masterTemplate.epicenterCheckedHome;
		if(bu != undefined)
		{
			//numOfHomePerFloor = bu.numOFHomesPerFloor(floor.floorNumber);
			numOfHomePerFloor = bu.numHousePerFloor;
			if(numOfHomePerFloor>0)
			{
				var i=1;
				var temp_homeNumber;
				for(i;i<=numOfHomePerFloor;i++)
				{
					if(i<=9){
						temp_homeNumber =floorNumber.toString()+'0'+i.toString();
						//console.log(temp_homeNumber);
					}
					else {
						temp_homeNumber = floorNumber.toString()+i.toString();
						//console.log(temp_homeNumber);
					}
					var homeElement = {homeNumber:temp_homeNumber,template:masterTemplate};
					if(isEpicenterMode)
					{
						if(checkedHome.indexOf(parseInt(temp_homeNumber)) > -1 ){
							
							list_HomeNumber.push(homeElement);
						}
					}else{
						
						list_HomeNumber.push(homeElement);
					}
					
				}
				
			}
			
		}
		return list_HomeNumber;
	}
});

Template.dataHome.events({
    'click .homeCell': function(event,template){
        var target = event.currentTarget;
        var homeId = $(target).attr("id");
        var dataContext = Template.currentData();
        var parentTemplate = dataContext.masterTemplate;
		if(parentTemplate.viewMode.get() != 'epicenter')
		{
			 if($(target).hasClass("active")){
				$(target).removeClass("active");
				parentTemplate.homeSelected.remove(homeId);
			}else{
				$(target).addClass("active");
				parentTemplate.homeSelected.push(homeId);
			}
		}
		else{
			if(parentTemplate.homeSelected.length == 0){
				$(target).addClass("active");
				parentTemplate.homeSelected.push(homeId);
			}
		}
       
    }
});

Template.chartHome.helpers({
	
	
});

Template.chartHome.onCreated(function(){
	
});

/*
 * Call the function to built the chart when the template is rendered
 */
Template.chartHome.onRendered(function() {


    Highcharts.setOptions({
		global:{
			useUTC:true
		}
	});
	var template = this;
	var home = Template.currentData().home;	
	
	var node = home.node();
	
	var dataContext = Template.currentData();
	var parentTemplate = dataContext.masterTemplate;
	
	var startDate = parentTemplate.startDate.get().toDate();
	var endDate = parentTemplate.endDate.get().toDate();
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	
	var soundThreshold = parentTemplate.soundThreshold.get();
	var vibThreshold = parentTemplate.vibrationThreshold.get();
	var dataSound = [];
	var dataVib = [];
	console.log(node.nodeNumber);
	
	
	
	
	var id = '#'+home._id;
	template.$(id).highcharts({
				
		chart:{
			//type:'spline',
			panning:true,
			panKey:'shift',
			zoomType:'x'
		},
		title: {
			text: 'Sound and Vibration Data',
			x: -20 //center
		},
		
		xAxis: {
			/*categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']*/
			//categories : xData
			type:'datetime',
			dateTimeLabelFormats:{
				//second: '%H:%M:%S',
				//minute: '%H:%M',
				//hour: '%H:%M',
				//day: '%e. %b',
				
				//month: '%b \'%y',
				//year: '%Y'
			},
			title:{
				text:'Time'
			},
			label:{
				formatter:function(){
					 return moment(this.value).format("YYYY-MM-DD");
				}
			}
		},
		yAxis: {
			title: {
				text: 'Level (dB)'
			},
			plotLines: [{
				value: parseFloat(soundThreshold),
				width: 2,
				color: '#FFFFFF'
			}]
		},
		tooltip: {
			valueSuffix: 'dB'
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		plotOptions:{
			series:{
				turboThreshold:0//larger threshold or set to 0 to disable
			}
        },
		series: [{
			
			name: 'Sound',
			data:dataSound,
			color: '#0000FF'
		},{
			name: 'Vibration',
			data: dataVib
			//color: '#0000FF'
		}
		],
		lang:{
			noData: 'Please wait!, Data are processing'
		},
		 exporting: {
            type: 'image/jpeg'
        }
	});
	/*template.subscribe('testData',node.nodeNumber,soundThreshold,vibThreshold,startDate, endDate ,function () {
		
		
		var serie1 = template.$(id).highcharts().series[0];
		var serie2 = template.$(id).highcharts().series[1];
		
		var datas = Data.find({nodeNumber:node.nodeNumber,createdAt:{$gte:startDate,$lte:endDate}},{sort:{createdAt:1}});
		_.each(datas.fetch(),function(element,index,array){
				var date = element.createdAt;
				
				
				var tempSoundData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.sound]
				var tempVibData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.vibration]
				if(element.sound >= parseFloat(soundThreshold))
				{
					dataSound.push(tempSoundData);
					//serie1.addPoint(tempSoundData);
				}
				if(element.vibration >= parseFloat(vibThreshold))
				{
					dataVib.push(tempVibData);
					//serie2.addPoint(tempVibData);
				}
				
		});
		
		serie1.setData(dataSound);
		serie2.setData(dataVib);
		
    });*/
	
	
	
	
	
	/*Meteor.call('soundData',node.nodeNumber,soundThreshold,vibThreshold,startDate,endDate,function(error,result){
		
		_.each(result,function(element,index,array){
			
				var serie1 = template.$(id).highcharts().series[0];
				var serie2 = template.$(id).highcharts().series[1];
				console.log(element);
				var date = element.createdAt;
				
				var tempSoundData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.sound]
				var tempVibData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.vibration]
				if(element.sound >= parseFloat(soundThreshold))
				{
					//dataSound.push(tempSoundData);
					serie1.addPoint(tempSoundData);
				}
				if(element.vibration >= parseFloat(vibThreshold))
				{
					//dataVib.push(tempVibData);
					serie2.addPoint(tempVibData);
				}
				
		});
		
	});*/
	var serie1 = template.$(id).highcharts().series[0];
	var serie2 = template.$(id).highcharts().series[1];
	Meteor.call('soundVibData',node.nodeNumber,soundThreshold,vibThreshold,startDate,endDate,function(error,result){
		
		_.each(result,function(element,index,array){
			
				
				//console.log(element);
				var date = element.createdAt;
				
				var tempSoundData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()),element.sound]
				var tempVibData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()),element.vib]
				if(element.sound >= parseFloat(soundThreshold))
				{
					dataSound.push(tempSoundData);
					
				}
				if(element.vib >= parseFloat(vibThreshold))
				{
					dataVib.push(tempVibData);
				
				}
				
		});
		serie1.setData(dataSound);
		serie2.setData(dataVib);
	});
	
	template.$('#export').click(function () {
        var chart = template.$(id).highcharts();
        chart.exportChart();
    });
});