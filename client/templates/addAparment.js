Template.addApartment.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
	
});
Template.addApartment.events({
   'click #apartSubmit':function(event){
	    event.preventDefault();
        var apartName = $('[name=apartName]').val();
        var address = $('[name=address]').val();
		var numOfHomes = $('[name=numOfHomes]').val();
		var numOfBuildings = $('[name=numOfBuildings]').val();
		var constructDate = $('[name=constructDate]').val();
		var manager = $('[name=manager]').val();
		var remark = $('[name=remark]').val();
		console.log(apartName);
		console.log(address);
		console.log(numOfHomes);
		console.log(numOfBuildings);
		console.log(constructDate);
		console.log(manager);
		console.log(remark);
		Meteor.call('createAparment',apartName,address,numOfHomes,numOfBuildings,constructDate,manager,remark);
   },
   
   'click #modifySubmit':function(event){
	   event.preventDefault();
	   var apartName = $('[name=modifyApartName]').val();
	   if(apartName==undefined)
	   {
		   alert('Please select an apartment to modify');
	   }
	   else{
		   Session.set('modifyApartObject',undefined);
			
	   }
   },
   
   'click #modifyClose':function(event){
	   Session.set('modifyApartObject',undefined);
		document.getElementById("modifyApartName").setAttribute('value','');
		document.getElementById("modifyAddr").setAttribute('value','');
		document.getElementById("modifyNumOfHomes").setAttribute('value','');
		document.getElementById("modifyNumOfBuildings").setAttribute('value','');
		document.getElementById("modifyConstructDate").setAttribute('value','');
		document.getElementById("modifyManager").setAttribute('value','');
		document.getElementById("modifyRemark").setAttribute('value','');
   },
   
   'click #deleteApart':function(){
	   event.preventDefault();
	   //var object = Session.get('deleteApartObject');
	   //console.log(object.name);
	   var i=0;
	   for(i;i<Apartment.TRACK_DELETE.apartId.length;i++)
	   {
		    Meteor.call('removeApartment',Apartment.TRACK_DELETE.apartId[i]);
	   }
	   Apartment.TRACK_DELETE.apartId = [];
	   Session.set('deleteApartObject',undefined);
   },
   
   'click #modifyApart':function(){
	   event.preventDefault();
	   Apartment.TRACK_DELETE.apartId = [];
	   var object = Session.get('modifyApartObject');
	   if(object == undefined)
	   {
		   
		   alert('Please select an apartment to modify');
	   }
	   else{
		    console.log(object.name);
			document.getElementById("modifyApartName").setAttribute('value',object.name);
			document.getElementById("modifyAddr").setAttribute('value',object.address);
			document.getElementById("modifyNumOfHomes").setAttribute('value',object.numOfHouses);
			document.getElementById("modifyNumOfBuildings").setAttribute('value',object.numOfBuildings);
			document.getElementById("modifyConstructDate").setAttribute('value',object.constructDate);
			document.getElementById("modifyManager").setAttribute('value',object.manager);
			document.getElementById("modifyRemark").setAttribute('value',object.remarks);
			
	   }
	  
   }
   
});