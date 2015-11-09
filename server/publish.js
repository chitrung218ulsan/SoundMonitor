Meteor.publish('All-Aparment',function(){
	return Apartment.find({});
});
Meteor.publish('All-Building',function(){
	return Building.find({});
});
Meteor.publish('All-Home',function(){
	return Home.find({});
});
Meteor.publish('All-Node',function(){
	return Node.find({});
});
Meteor.publish('All-Data',function(){
	return Data.find({},{sort:{order:-1}});
});