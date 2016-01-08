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
    isRemainder: function(index, rem){
        return index % 2 == rem;
    },
    isGraphMode: function(){
        return Template.instance().viewMode.get() == "graph";
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
	
});

Template.dataAnalysis.events({
    'change #viewMode': function(event){
        var target = event.currentTarget;
        var mode = target.options[target.selectedIndex].value;
        Template.instance().viewMode.set(mode);
		var self = Template.instance();
		if(mode == "graph"){
			//console.log(Template.instance().homeSelected.array())
			//self.subscribe('testData', self.homeSelected.array(),self.startDate.get().toDate(), self.endDate.get().toDate());
		}
    },
    'change #apartment-selection-dashboard': function(event){
        var target = event.currentTarget;
        var newId = target.options[target.selectedIndex].value;
        Template.instance().apartmentSelected.set(Apartment.findOne({_id: newId}));
        Template.instance().buildingSelected.set(undefined);
    },
    'click #building-list .list-group-item': function(event){
        var target = event.currentTarget;
        $('#building-list .list-group-item').removeClass('active');
        $(target).addClass("active");
        var newId = target.value;
        Template.instance().buildingSelected.set(Building.findOne({_id: newId}));
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
	}
});

Template.dataHome.events({
    'click .homeCell': function(event){
        var target = event.currentTarget;
        var homeId = $(target).attr("id");
        var dataContext = Template.currentData();
        var parentTemplate = dataContext.masterTemplate;
        if($(target).hasClass("active")){
            $(target).removeClass("active");
            parentTemplate.homeSelected.remove(homeId);
        }else{
            $(target).addClass("active");
            parentTemplate.homeSelected.push(homeId);
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
				color: '#FF0000'
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
		}
	});
	template.subscribe('testData',parentTemplate.homeSelected.array(),soundThreshold,vibThreshold,startDate, endDate ,function () {
		
		
		
		//var datas = node.datas(startDate,endDate);
		var datas = Data.find({nodeNumber:node.nodeNumber,createdAt:{$gte:startDate,$lte:endDate}},{sort:{createdAt:1}});
		_.each(datas.fetch(),function(element,index,array){
				var date = element.createdAt;
				
				
				var tempSoundData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.sound]
				var tempVibData = [Date.UTC(date.getFullYear(), (date.getMonth()), date.getDate()-1,date.getHours(),date.getMinutes(),date.getSeconds()),element.vibration]
				if(element.sound >= parseFloat(soundThreshold))
				{
					dataSound.push(tempSoundData);
				}
				if(element.vibration >= parseFloat(vibThreshold))
				{
					dataVib.push(tempVibData);
				}
				
		});
		var serie1 = template.$(id).highcharts().series[0];
		var serie2 = template.$(id).highcharts().series[1];
		serie1.setData(dataSound);
		serie2.setData(dataVib);
		
    });
	/*Data.find({nodeNumber:node.nodeNumber,createdAt:{$gte:startDate,$lte:endDate}}).observe({
		added: function(doc) {
			//console.log(id);
			var series = template.$(id).highcharts().series[0];
			
			//series.setData(doc.createdAt,doc.sound);
			 //series.addPoint([doc.createdAt,doc.sound]);
		}
	});*/
	
	
});