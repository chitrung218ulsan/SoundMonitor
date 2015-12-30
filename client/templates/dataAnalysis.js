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
    this.soundThreshold = new ReactiveVar(undefined);
    this.vibrationThreshold = new ReactiveVar(undefined);

    this.autorun(function(){
        var bu = self.buildingSelected.get();
        //self.subscribe(SoundMonitor.Constants.DATA_SOURCE, (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get(),self.vibrationThreshold.get());
		self.subscribe('SoundData', (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get(),self.vibrationThreshold.get());
		
		self.subscribe('VibData', (bu && bu._id) || null,self.startDate.get().toDate(), self.endDate.get().toDate(),self.soundThreshold.get(),self.vibrationThreshold.get());
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
    startDate: function() {
        return Template.instance().startDate.get().toDate();
    },
    endDate: function(){
        return Template.instance().endDate.get().toDate();
    },
    soundThreshold: function(){
        return Template.instance().soundThreshold.get();
    },
    vibrationThreshold: function(){
        return Template.instance().vibrationThreshold.get();
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

Template.dataHome.helpers({
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
