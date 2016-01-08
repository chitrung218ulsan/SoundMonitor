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

Meteor.publish('testData',function(homeArray,soundThreshold,vibThreshold,startDate, endDate){
	
	//console.log(homeArray);
	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,999);
	var nodes = [];
	homeArray.forEach(function(element,index,array){
		var home = Home.findOne({_id: element});
		if(home){
			var node = home.node();
			nodes.push(node.nodeNumber);
		}
	});
	var threshold_sound = parseFloat(soundThreshold);
	var threshold_vib = parseFloat(vibThreshold);
	
	return Data.find({nodeNumber : {$in :  nodes},isDeleted: false,$or:[{sound:{$gte:threshold_sound}},{vibration:{$gte:threshold_vib}}],createdAt:{$gte:startDate,$lte:endDate}},{"nodeNumber":1,"sound":1,"vibration":1,"createdAt":1},{sort:{createdAt:1}});
});