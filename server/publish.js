Meteor.publish(SoundMonitor.Constants.APARTMENT_SOURCE,function(){
	return Apartment.find({isDeleted : false});
});
Meteor.publish(SoundMonitor.Constants.BUILDING_SOURCE,function(){
	return Building.find({isDeleted: false});
});
Meteor.publish(SoundMonitor.Constants.HOME_SOURCE,function(){
	return Home.find({isDeleted: false});
});
Meteor.publish(SoundMonitor.Constants.NODE_SOURCE,function(){
	return Node.find({isDeleted: false});
});
Meteor.publish(SoundMonitor.Constants.DATA_SOURCE,function(buildingId, startDate, endDate){
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	var nodes = [];
	var bu = Building.findOne({_id: buildingId});
	if (bu){
		_.each(bu.homes().fetch(),function(ele,index,list){
			nodes.push(ele.node().nodeNumber);
		});
	}
	return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate}});
});