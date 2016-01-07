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
	}
});

Template.dataAnalysis.events({
    'change #viewMode': function(event){
        var target = event.currentTarget;
        var mode = target.options[target.selectedIndex].value;
        Template.instance().viewMode.set(mode);
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
		//console.log(node.nodeNumber);
		//console.log(SoundData.find({nodeNumber:node.nodeNumber}));
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

/*
 * Function to draw the area chart
 */


/*
 * Call the function to built the chart when the template is rendered
 */
Template.chartHome.onRendered(function() {
    var dataContext = Template.currentData();
    var categories = [];
    for(var day = dataContext.masterTemplate.startDate.get(); day <= dataContext.masterTemplate.endDate.get(); day = day.add(1,'d')){
        categories.push(day.format("YY/MM/DD"));
    }
    //this.$('#container-area').highcharts({
    this.$('#container-area').highcharts({
        title: {
            text: 'Sound and Vibration Timeline Chart',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
});