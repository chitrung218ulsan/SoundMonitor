Template.addHome.helpers({
	AparmentsLoaded:function(){
		return Session.get('apartmentsLoaded');
	},
	BuildingsLoaded:function(){
		return Session.get('buildingsLoaded');
	},
	apartmentsList:function(){
		return Apartment.find();
	},
	buildingsList:function(){
		return Building.find({},{sort:{order:1}});
	}
});

Template.addHome.events({
	'click #home_addSubmit':function(event){
		event.preventDefault();
		
        var apartSelectObject= document.getElementById('home_apartNameSelection');
		var apartName;
		for (i=0; i<apartSelectObject.options.length; i++) {
			if (apartSelectObject.options[i].selected) {
			  apartName = apartSelectObject.options[i].value;
			  
			}
		 }
		 
		
        var buildingSelectObject= document.getElementById('home_buildingNameSelection');
		var buildingName;
		for (i=0; i<buildingSelectObject.options.length; i++) {
			if (buildingSelectObject.options[i].selected) {
			  buildingName = buildingSelectObject.options[i].value;
			  
			}
		 }
		
		console.log('click #home_addSubmit');
		console.log(buildingName);
		var floor = $('[name=home_floorNumber]').val();
		var homeNumber = $('[name=home_homeNumber]').val();
		var owner = $('[name=home_ownerName]').val();
		var telNumber = $('[name=home_telNumber]').val();
		var nodeId = $('[name=home_NodeId]').val();
		var nodeSerial = $('[name=home_nodeSerial]').val();
		
		Meteor.call('createHome',apartName,buildingName,floor,homeNumber,owner,telNumber,nodeId,nodeSerial);
	},
	
	'click #modifyHome':function(event){
	   //Building.TRACK_DELETE.buildingId = [];
	   var object = Session.get('modifyHomeObject');
	   if(object == undefined)
	   {
		   
		   //alert('Please select an apartment to modify');
		    document.getElementById("modify_home_homeNumber").setAttribute('value','');
			document.getElementById("modify_home_floorNumber").setAttribute('value','');
			document.getElementById("modify_home_ownerName").setAttribute('value','');
			document.getElementById("modify_home_telNumber").setAttribute('value','');
			document.getElementById("modify_home_NodeId").setAttribute('value','');
			document.getElementById("modify_home_nodeSerial").setAttribute('value','');
	   }
	   else{
			document.getElementById("modify_home_homeNumber").setAttribute('value',object.homeNumber);
			document.getElementById("modify_home_floorNumber").setAttribute('value',object.floor);
			document.getElementById("modify_home_ownerName").setAttribute('value',object.owner);
			document.getElementById("modify_home_telNumber").setAttribute('value',object.telNumber);
			document.getElementById("modify_home_NodeId").setAttribute('value',object.nodeId);
			document.getElementById("modify_home_nodeSerial").setAttribute('value',object.nodeSerial);
	   }
   },
});
