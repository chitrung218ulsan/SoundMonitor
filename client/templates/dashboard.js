/**
 * Created by Hieu on 11/15/2015.
 */
Template.dashboard.onCreated(function(){
    this.apartmentSelected = new ReactiveVar(undefined);
    this.buildingSelected = new ReactiveVar(undefined);
});
Template.checkDataSound.helpers({
	checkNormal:function(){
		var home = Template.currentData();
		var buildingSelected = Session.get("buildingSelected");
		
        var valueCheck = parseFloat(home.sound);
		
		if(valueCheck <= buildingSelected.warningSoundThreshold)
		{
			//console.log('check normal true' )
			return true;
		}
		else 
			return false;
		
		
	},
	checkWarning:function(){
		var home = Template.currentData();
		var buildingSelected = Session.get("buildingSelected");
        var valueCheck = parseFloat(home.sound);
		if(buildingSelected.warningSoundThreshold < valueCheck &&  valueCheck < buildingSelected.dangerSoundThreshold)
		{
			//console.log('check warning true' )
			return true;
		}
		else 
			//console.log('check warning false' )
			return false;
		
		
	},
	checkDanger:function(){
		var home = Template.currentData();
		var buildingSelected = Session.get("buildingSelected");
        var valueCheck = parseFloat(home.sound);
		if(buildingSelected.dangerSoundThreshold < valueCheck )
		{
			return true;
		}
		else 
			return false;
		
		
	}
});
Template.dashboard.helpers({
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
        return index % 3 == rem;
    },
	check: function(value,threshold)
	{
		if(value > 10)
		{
			return true;
		}
		else
			return false;
	}
	
});

Template.dashboard.events({
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
		Session.set("buildingSelected",Building.findOne({_id: newId}));
    }
});

