Meteor.publish(SoundMonitor.Constants.APARTMENT_SOURCE,function(){
	return Apartment.find({isDeleted : false});
});
Meteor.publish(SoundMonitor.Constants.BUILDING_SOURCE,function(){
	return Building.find({isDeleted: false});
});
Meteor.publish('All-Home',function(){
	return Home.find({isDeleted: false});
});
Meteor.publish('All-Node',function(){
	return Node.find({isDeleted: false});
});
Meteor.publish('All-Data',function(){
	return Data.find({isDeleted: false},{sort:{order:-1}});
});