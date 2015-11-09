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
		return Apartment.find({},{sort:{order:1}});
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
	
});