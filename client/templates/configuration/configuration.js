AutoForm.hooks({
    editBuildingConfig : {
        onSuccess: function(formType, result){
           
            Template.soundAlert.theInstance.setMessage(
                SoundMonitor.Constants.ALERT_TYPE.success,
                "The " + 'configuration' + " " + this.currentDoc.name + " has been edited successfully."
            );
            
        }
    }
});


Template.configuration.onCreated(function(){
    this.apartmentSelected = new ReactiveVar(undefined);
    this.buildingSelected = new ReactiveVar(undefined);
	this.showConfiguration = new ReactiveVar(false)
});

Template.configuration.helpers({
	apartments: function(){
        var templ = Template.instance();
        var query = Apartment.find({});
        query.observeChanges({
            removed: function(id){
                if(id == templ.apartmentSelected.get()._id){
                    templ.apartmentSelected.set(undefined);
                    templ.buildingSelected.set(undefined);
					templ.showConfiguration.set(false);
                }

            }
        });
        return query;
    },
    buildings: function(){
        var ap = Template.instance().apartmentSelected.get();
		console.log(ap);
        return (ap)? ap.buildings() : [];
    },
	showConfiguration:function(){
		var templ = Template.instance();
		return templ.showConfiguration.get();
	},
	settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'_id', {hidden: true}),
			
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'name'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'type'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'representative'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'manager'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'numOfFloors'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'numHousePerFloor'),
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'numOfHomes',{label: "세대 수", fn: function(value, obj){
                return value;
            }}),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'warningSoundThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'dangerSoundThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'warningVibThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'dangerVibThreshold'),
			
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['configuration.view'].path({_id:value})+">View</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['configuration.edit'].path({_id:value})+">Edit</a>");
            }}
        ];
        return {
			
            fields: fields
        };
    },
	buildingColection:function(){
		var selectedBuilding =   Template.instance().buildingSelected.get();
		return Building.find({_id:selectedBuilding._id});
	},
	selectedBuildingDoc: function () {
		var selectedBuilding = Template.instance().buildingSelected.get();
		
		console.log(Session.get("buildingSelected"));
		return Building.findOne({_id:selectedBuilding._id});
	},
	 getSchema: function(){
		
		return new SimpleSchema(Building.simpleSchema());
		
      
    }
});
Template.configuration.events({
    'change #apartment-selection-dashboard': function(event){
        var target = event.currentTarget;
        var newId = target.options[target.selectedIndex].value;
        Template.instance().apartmentSelected.set(Apartment.findOne({_id: newId}));
        Template.instance().buildingSelected.set(undefined);
		Template.instance().showConfiguration.set(false);
		
    },
    'click #building-list .list-group-item': function(event){
        var target = event.currentTarget;
        $('#building-list .list-group-item').removeClass('active');
        $(target).addClass("active");
        var newId = target.value;
        Template.instance().buildingSelected.set(Building.findOne({_id: newId}));
		Template.instance().showConfiguration.set(true);
		
    }
});