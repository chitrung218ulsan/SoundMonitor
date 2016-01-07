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
	
	return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate},$or:[{sound:{$gte:soundThreshold}},{vibration:{$gte:vibrationThreshold}}]},{sort:{createdAt:1}});
});

Meteor.publish("Sound-Vib-Data",function(buildingId, startDate, endDate,soundThreshold,vibrationThreshold){
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
	
	
	nodes.forEach(function(node){
		
		var datas = Data.find({nodeNumber : node,isDeleted: false, createdAt: {$gte: startDate, $lte: endDate}},{sort:{createdAt:1}});
		var maxSound = 0;
		var maxVib = 0;
		var numOfSoundOverThreshold = 0;
		var numOfVibOverThreshold = 0;
		
		_.each(datas.fetch(),function(element,index,list){
			
			
			if(element.sound > maxSound)
				maxSound = element.sound;
			
			if(element.vibration > maxVib)
				maxVib = element.vibration;
			
			if(element.sound > soundThreshold) 
				numOfSoundOverThreshold++
			
			if(element.vibration > vibrationThreshold)
				numOfVibOverThreshold++
			
			
		});
		self.added ('SoundData',node,{
				nodeNumber:node,
				maxSound:maxSound,
				numOfSoundOverThreshold:numOfSoundOverThreshold
		});
	});
	return SoundData.find({});
	//return Data.find({nodeNumber : {$in :  nodes},isDeleted: false, createdAt: {$gte: startDate, $lte: endDate},$or:[{sound:{$gte:soundThreshold}},{vibration:{$gte:vibrationThreshold}}]},{sort:{createdAt:1}});
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
	
	//console.log(soundThreshold);
	var sound_threshold = parseFloat(soundThreshold);
	var pipeline = [
	{"$match":{
                nodeNumber:{$in:nodes},
				isDeleted:false,
				createdAt: {$gte: startDate, $lte: endDate},
				sound:{$gte:sound_threshold}
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
	
});

Meteor.publish('VibData',function(buildingId, startDate, endDate,vibrationThreshold){
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
	//console.log(startDate);
	//console.log(vibrationThreshold);
	var vib_threshold = parseFloat(vibrationThreshold);
	
	
	var cond = [
					{nodeNumber:{$in:nodes}},
					{isDeleted:false},
					{createdAt: {$gte: startDate, $lte: endDate}},
					{vibration: {$gte:vib_threshold}}
				];
	var pipeline = [
	{$match:{
				$and:cond
			}
	}, 
	{"$group":{
				_id:"$nodeNumber",
				
				maxVib:{$max:"$vibration"},
				
				numOfVibOverThreshold:{$sum:1}
		}
	}
	
	];
	
	//Data.aggregate(pipeline,
	//
	//	Meteor.bindEnvironment(
	//		function(err, result){
	//
	//			_.each(result,function(e) {
	//
	//				self.added ('VibData',e._id,{
	//					nodeNumber:e._id,
	//					maxVib:e.maxVib,
	//					numOfVibOverThreshold:e.numOfVibOverThreshold
	//				});
	//
	//			});
	//			self.ready();
	//		},
	//		function(error){
	//			Meteor._debug("Error doing aggregation: " + error);
	//		}
	//	)
	//
	//);
	
	var results = Data.aggregate(pipeline);
	results.forEach(function(result){
			console.log(result);
			self.added ('VibData',result._id,{
				nodeNumber:result._id,
				maxVib:result.maxVib,
				numOfVibOverThreshold:result.numOfVibOverThreshold
			});
		});
	
});