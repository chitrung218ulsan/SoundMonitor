Template.addBuilding.onRendered(function() {
   
	
});
Template.addBuilding.helpers({
	
	AparmentsLoaded:function(){
		return Session.get('apartmentsLoaded');
	},
	apartmentsList:function(){
		return Apartment.find();
	}
});
Template.addBuilding.events({
   'click #buildingSubmit':function(event){
	    event.preventDefault();
		console.log('Enter event');
        var apartSelectObject= document.getElementById('apartNameSelection');
		var apartName;
		for (i=0; i<apartSelectObject.options.length; i++) {
			if (apartSelectObject.options[i].selected) {
			  apartName = apartSelectObject.options[i].value;
			  
			}
		 }
		 
		
        var buildingNum = $('[name=buildingNum]').val();
		var numOfFloors = $('[name=numOfFloors]').val();
		var numOfHomePerFloor = $('[name=numOfHomePerFloor]').val();
		var manager = $('[name=building_manager]').val();
		var remark = $('[name=building_remark]').val();
		
		
		var selObj = document.getElementById('buildingType');
		
		var buildingType;
		for (i=0; i<selObj.options.length; i++) {
			if (selObj.options[i].selected) {
			  buildingType = selObj.options[i].value;
			  
			}
		 }
		
		
		console.log(apartName);
		console.log(buildingNum);
		console.log(numOfFloors);
		console.log(numOfHomePerFloor);
		console.log(manager);
		console.log(remark);
		
		
		Meteor.call('createBuilding',apartName,buildingNum,numOfFloors,numOfHomePerFloor,buildingType,manager,remark);
   },
   
    'click #deleteBuilding':function(event){
	   event.preventDefault();
	   //var object = Session.get('deleteApartObject');
	   //console.log(object.name);
	   var i=0;
	   for(i;i<Building.TRACK_DELETE.buildingId.length;i++)
	   {
		    Meteor.call('removeBuilding',Building.TRACK_DELETE.buildingId[i]);
	   }
	   Building.TRACK_DELETE.buildingId = [];
	   Session.set('modifyBuildingObject',undefined);
	   
   },
   'click #modifyBuilding':function(event){
	   //Building.TRACK_DELETE.buildingId = [];
	   var object = Session.get('modifyBuildingObject');
	   if(object == undefined)
	   {
		   
		   //alert('Please select an apartment to modify');
		    document.getElementById("modify_buildingNum").setAttribute('value','');
			document.getElementById("modify_numOfFloors").setAttribute('value','');
			document.getElementById("modify_numOfHomePerFloor").setAttribute('value','');
			document.getElementById("modify_buildingManager").setAttribute('value','');
			document.getElementById("modify_buildingRemark").setAttribute('value','');
	   }
	   else{
			document.getElementById("modify_buildingNum").setAttribute('value',object.buildingNumber);
			document.getElementById("modify_numOfFloors").setAttribute('value',object.numOfFloors);
			document.getElementById("modify_numOfHomePerFloor").setAttribute('value',object.numHousePerFloor);
			document.getElementById("modify_buildingManager").setAttribute('value',object.manager);
			document.getElementById("modify_buildingRemark").setAttribute('value',object.remarks);
	   }
   },
   'click #modifyBuildingSubmit':function(event){
	   
	    event.preventDefault();
		var buildingSelectedObject = Session.get('modifyBuildingObject');
		var buildingId = buildingSelectedObject._id;
		
        var apartSelectObject= document.getElementById('modify_apartNameSelection');
		var apartName;
		for (i=0; i<apartSelectObject.options.length; i++) {
			if (apartSelectObject.options[i].selected) {
			  apartName = apartSelectObject.options[i].value;
			  
			}
		 }
		 
		
        var buildingNum = $('[name=modify_buildingNum]').val();
		var numOfFloors = $('[name=modify_numOfFloors]').val();
		var numOfHomePerFloor = $('[name=modify_numOfHomePerFloor]').val();
		var manager = $('[name=modify_buildingManager]').val();
		var remark = $('[name=modify_buildingRemark]').val();
		
		
		var selObj = document.getElementById('modify_buildingType');
		
		var buildingType;
		for (i=0; i<selObj.options.length; i++) {
			if (selObj.options[i].selected) {
			  buildingType = selObj.options[i].value;
			  
			}
		 }
		console.log(apartName);
		console.log(buildingNum);
		console.log(numOfFloors);
		console.log(numOfHomePerFloor);
		console.log(manager);
		console.log(remark);
		
		Meteor.call('updateBuilding',buildingId,apartName,buildingNum,numOfFloors,numOfHomePerFloor,buildingType,manager,remark);
   },
   'click #modifyBuildingClose':function(event){
	    event.preventDefault();
	    //Session.set('modifyBuildingObject',undefined);
		
		
   }
});