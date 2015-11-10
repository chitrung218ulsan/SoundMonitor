Template.setup.helpers({
	AparmentsLoaded:function(){
		return Session.get('apartmentsLoaded');
	},
	BuildingsLoaded:function(){
		return Session.get('buildingsLoaded');
	},
	HomesLoaded:function(){
		return Session.get('homesLoaded');
	},
	NodesLoaded:function(){
		return Session.get('nodesLoaded');
	},
	
	
	
	apartmentsList:function(){
		return Apartment.find();
	},
	buildingsList:function(){
		return Building.find({},{sort:{order:1}});
	},
	homesList:function(){
		return Home.find({},{sort:{order:1}});
	},
	nodesList:function(){
		return Node.find({},{sort:{order:1}});
	},
	
	apartCollection: function () {
        return Apartment;
    },
	
	setupApartFields:function(){
		var fields= [
								
						{ key: '',label: '', fn: function (value, object) { return new Spacebars.SafeString("<input type='checkbox' id='tableCheckbox'/>");}},
						{ key: 'name', label: 'Apartment Name' },
						{ key: 'address', label: 'Address' },
						{ key: 'numOfHouses', label: 'Total Of Homes' },
						{ key: 'numOfBuildings', label: 'Total Of Buildings' },
						{ key: 'constructDate', label: 'Construction Date' },
						{ key: 'manager', label: 'Manager' },
						{ key: 'remark', label: 'Remark' }
						
					];
		return fields;
	}
	
	
});

Template.setup.events({
	'click .reactive-table tbody tr ': function (event) {
    // set the blog post we'll display details and news for
	var selectedObject = this;
    console.log(selectedObject);
	Apartment.TRACK_DELETE.apartId.push(selectedObject._id);
	var i = 0;
	for(i;i<Apartment.TRACK_DELETE.apartId.length;i++)
	{
		console.log(Apartment.TRACK_DELETE.apartId[i]);
	}
	Session.set('modifyApartObject',this);
	
  }
});
