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
Meteor.publish(SoundMonitor.Constants.DATA_SOURCE,function(buildingId, startDate, endDate,soundThreshold,vibrationThreshold){
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	var nodes = [];
	var bu = Building.findOne({_id: buildingId});
	if (bu){
		_.each(bu.homes().fetch(),function(ele,index,list){
			
				nodes.push(ele.node().nodeNumber);
			
		});
	}
	//return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate},sound:{$gt:0},vibration:{$gt:0}},{sort:{createdAt:1}});
	//return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate}},{sort:{createdAt:1}});
	return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate},$or:[{sound:{$gte:soundThreshold}},{vibration:{$gte:vibrationThreshold}}]},{sort:{createdAt:1}});
});

Meteor.publish('SoundData',function(buildingId, startDate, endDate,soundThreshold,vibrationThreshold){
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	var self = this;
	var nodes = [];
	var bu = Building.findOne({_id: buildingId});
	if (bu){
		_.each(bu.homes().fetch(),function(ele,index,list){
			
				nodes.push(ele.node().nodeNumber);
			
		});
	}
	console.log(nodes);
	console.log(soundThreshold);
	
	var pipeline = [
	{"$match":{
                nodeNumber:{$in:nodes},
				isDeleted:false,
				createdAt: {$gte: startDate, $lte: endDate},
                sound:{$gte:600}
			}
	}, 
	{"$group":{
				_id:"$nodeNumber",
				
				maxSound:{$max:"$sound"},
				
				numOfSoundOverThreshold:{$sum:1}
		}
	}
	
	];
	
	var results = Data.aggregate(pipeline);
	results.forEach(function(result){
			//console.log(result);
			self.added ('SoundData',result._id,{
				nodeNumber:result._id,
				maxSound:result.maxSound,
				numOfSoundOverThreshold:result.numOfSoundOverThreshold
			});
	});
	
	return SoundData.find({});
	
	
});

Meteor.publish('VibData',function(buildingId, startDate, endDate,soundThreshold,vibrationThreshold){
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	var self = this;
	var nodes = [];
	var bu = Building.findOne({_id: buildingId});
	if (bu){
		_.each(bu.homes().fetch(),function(ele,index,list){
			
				nodes.push(ele.node().nodeNumber);
			
		});
	}
	console.log(nodes);
	console.log(vibrationThreshold);
	
	var pipeline = [
	{"$match":{
				
                nodeNumber:{$in:nodes},
				isDeleted:false,
				//createdAt: {$gte: startDate, $lte: endDate},
				vibration: {$gte:600}
			}
	}, 
	{"$group":{
				_id:"$nodeNumber",
				
				maxVib:{$max:"$vibration"},
				
				numOfVibOverThreshold:{$sum:1}
		}
	}
	
	];
	
	var results = Data.aggregate(pipeline);
	results.forEach(function(result){
			//console.log(result);
			self.added ('VibData',result._id,{
				nodeNumber:result._id,
				maxVib:result.maxVib,
				numOfVibOverThreshold:result.numOfVibOverThreshold
			});
		});
	
	return VibData.find({});
	
	
});