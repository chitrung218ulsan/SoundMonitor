Meteor.methods({
	'soundData':function(nodeNumber,soundThreshold,vibThreshold,startDate,endDate){
		
		startDate.setHours(0,0,0,0);
		endDate.setHours(23,59,59,999);
		
		
		
		var testData = [];
		//var home = Home.findOne({nodeId:nodeId});
		//var node = home.node();
		var sound_threshold= parseFloat(soundThreshold);
		var vib_threshold= parseFloat(vibThreshold);
		
		var datas = Data.find({nodeNumber : nodeNumber,isDeleted: false,$or:[{sound:{$gte:sound_threshold}},{vibration:{$gte:vib_threshold}}],createdAt:{$gte:startDate,$lte:endDate},
		},{"nodeNumber":1,"sound":1,"vibration":1,"createdAt":1},{sort:{createdAt:1}});
		
		_.each(datas.fetch(),function(element,index,list){
			
			var tempData = {nodeNumber:element.nodeNumber,createdAt:element.createdAt,sound:element.sound,vibration:element.vibration};
			
			testData.push(tempData);
		});
		return testData;
		
	
	},
	'soundVibData':function(nodeNumber,soundThreshold,vibThreshold,startDate,endDate){
		
		startDate.setHours(0,0,0,0);
		endDate.setHours(23,59,59,999);
		//console.log(endDate);
		var UTC_starDate = Date.UTC(startDate.getFullYear(), (startDate.getMonth()-1), startDate.getDate(),startDate.getHours(),startDate.getMinutes(),0,0);
		var UTC_endDate = Date.UTC(endDate.getFullYear(), (endDate.getMonth()-1), endDate.getDate(),endDate.getHours(),endDate.getMinutes(),0,0);
		var timeThreshold = 0;
		//console.log(UTC_starDate);
		//console.log(UTC_endDate);
		if(UTC_endDate - UTC_starDate <=86400000)
		{
			timeThreshold = 60000;
		}
		else if( 86400000 < ( UTC_endDate - UTC_starDate) <=604800000)
		{
			timeThreshold = 60000;
		}
		else{
			timeThreshold = 60000;
		}
		var threshold_sound = parseFloat(soundThreshold);
		var threshold_vib = parseFloat(vibThreshold);
		var cond = [
						{nodeNumber:nodeNumber},
						{isDeleted:false},
						{createdAt: {$gte: startDate, $lte: endDate}},
						{$or:[{sound:{$gte:threshold_sound}},{vibration:{$gte:threshold_vib}}]}
						
					];
		var pipeline = [
		{$match:{
					//$and:cond
					nodeNumber:nodeNumber,
					isDeleted:false,
					createdAt: {$gte: startDate, $lte: endDate},
					$or:[{sound:{$gte:threshold_sound}},{vibration:{$gte:threshold_vib}}]
				}
		}, 
		{"$group":{
					 _id:{ month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" }, 
					hour:{ $hour: "$createdAt"}, minutes: { $minute: "$createdAt" }},
					maxSound:{$max:"$sound"},
					maxVib:{$max:"$vibration"},
					nodeNumber:{$max:"$nodeNumber"}
				}
		},
		{
			$sort:{_id:1}
		},{$project:{
				_id:'$nodeNumber',
				nodeNumber:'$nodeNumber',
				date:"$_id",
				sound:"$maxSound",
				vib:"$maxVib"
			
			}
		}
		
		];
		
		var lastTrackMinute = new Date();
		var start = true;
		var testData = [];
		var results = Data.aggregate(pipeline);
		//console.log(results.length);
		results.forEach(function(doc){
			
				
				var createdDate = new Date(Date.UTC(doc.date.year,doc.date.month-1,doc.date.day,doc.date.hour,doc.date.minutes,0,0));
				//console.log(createdDate);
				
				var d = Date.UTC(doc.date.year,doc.date.month-1,doc.date.day,doc.date.hour,doc.date.minutes,0,0);
			   //print(d);
			   if(start==true){
				   lastTrackMinute = d;
				   start = false;

			   }
			   var timeCompare = d - lastTrackMinute;
			   //print(a);
			   if(timeCompare >= timeThreshold)
			   {
				   
				   lastTrackMinute = d;
				   //console.log(doc);
				   
					var tempData = {nodeNumber:doc.nodeNumber,sound:doc.sound,vib:doc.vib,createdAt:createdDate};
			
					testData.push(tempData);
				   
			   }
				/*(self.added ('SoundVibDataGraph',doc._id,{
					nodeNumber:doc._id,
					maxSound:doc.sound,
					maxVib:doc.vib,
					dateTime:createdDate
				});*/
		});
		return testData;
	}
});