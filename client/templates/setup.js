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
	
	
	setupApartFields:function(){
		var fields= [
								
						{ key: '',label: '', fn: function (value, object) { return new Spacebars.SafeString("<input type='checkbox' id='tableApartCheckbox'/>");}},
						{ key: 'name', label: 'Apartment Name' },
						{ key: 'address', label: 'Address' },
						{ key: 'numOfHouses', label: 'Total Of Homes' },
						{ key: 'numOfBuildings', label: 'Total Of Buildings' },
						{ key: 'constructDate', label: 'Construction Date' },
						{ key: 'manager', label: 'Manager' },
						{ key: 'remark', label: 'Remark' }
						
					];
		return fields;
	},
	setupBuildingFields:function(){
		var fields= [
								
						{ key: '',label: '', fn: function (value, object) { return new Spacebars.SafeString("<input type='checkbox' id='tableBuildingCheckbox'/>");}},
						{ key: 'apartName', label: 'Apartment Name' },
						{ key: 'buildingNumber', label: 'Building Number' },
						{ key: 'numOfFloors', label: 'Total Of Floors' },
						{ key: 'numHousePerFloor', label: 'Total Of Homes/Floor' },
						{ key: 'type', label: 'Type' },
						{ key: 'manager', label: 'Manager' },
						{ key: 'remarks', label: 'Remark' }
						
					];
		return fields;
	},
	setupHomeFields:function(){
		var fields= [
								
						{ key: '_id',label: '', fn: function (value, object) { return new Spacebars.SafeString("<input type='checkbox' id='tableHomeCheckbox' name=value/>");}},
						{ key: 'apartName', label: 'Apartment Name' },
						{ key: 'buildingNumber', label: 'Building Name' },
						{ key: 'floor', label: 'Floor' },
						{ key: 'homeNumber', label: 'Home Number' },
						{ key: 'owner', label: 'Owner Name' },
						{ key: 'telNumber', label: 'Phone Number' },
						{ key: 'nodeId', label: 'Node Id' },
						{ key: 'nodeSerial', label: 'Node Serial Number' }
						
					];
		return fields;
	}
	
	
});

Template.setup.events({
	'click #apartment .reactive-table tbody tr ': function (event) {
    // set the blog post we'll display details and news for
	var selectedObject = this;
	var checkCheckBox = document.getElementById("tableApartCheckbox").checked;
	
	if(checkCheckBox)
	{
		Apartment.TRACK_DELETE.apartId.push(selectedObject._id);
		var i = 0;
		for(i;i<Apartment.TRACK_DELETE.apartId.length;i++)
		{
			console.log('click #apartment .reactive-table tbody tr');
			console.log(Apartment.TRACK_DELETE.apartId[i]);
		}
		Session.set('modifyApartObject',this);
	}
    else{
		Apartment.TRACK_DELETE.apartId = [];
		Session.set('modifyApartObject',undefined);
	}
	
	
  },
  
  'click #building .reactive-table tbody tr ':function(){
	  var selectedObject = this;
	  var checkCheckBox = document.getElementById("tableBuildingCheckbox").checked;
	  
	  if(checkCheckBox)
	  {
		  Building.TRACK_DELETE.buildingId.push(selectedObject._id);
		  console.log('click #building .reactive-table tbody tr');
		  
		  for(var i=0;i<Building.TRACK_DELETE.buildingId.length;i++)
		  {
			
			console.log(Building.TRACK_DELETE.buildingId[i]);
		  }
		  Session.set('modifyBuildingObject',this);
	  }
	  else{
		  
		  Building.TRACK_DELETE.buildingId = [];
		  Session.set('modifyBuildingObject',undefined);
		  
	  }
	  
  },
  
  'click #home .reactive-table tbody tr ':function(){
	  var selectedObject = this;
	  
	  var checkCheckBox = document.getElementById("tableHomeCheckbox").checked;
	
	 
	 
	 
	  
	  if(checkCheckBox)
	  {
		  /*Building.TRACK_DELETE.buildingId.push(selectedObject._id);
		  console.log('click #building .reactive-table tbody tr');
		  
		  for(var i=0;i<Building.TRACK_DELETE.buildingId.length;i++)
		  {
			
			console.log(Building.TRACK_DELETE.buildingId[i]);
		  }*/
		  Session.set('modifyHomeObject',this);
	  }
	  else{
		  
		  //Building.TRACK_DELETE.buildingId = [];
		  Session.set('modifyHomeObject',undefined);
		  
	  }
	  
  }
});
