Meteor.startup(function()
{
	
	//Apartment.remove({});
	//Building.remove({});
	//var apart1 =
	//{
	//	name: "Lotte",
	//	address: "Ulsan",
	//	constructDate: new Date(),
	//	manager: "Trung",
	//	createdBy: "Trung",
	//	remarks: "Lotte"
	//};
	////var apartId = findAparment('Lotte');
	////console.log(apartId);
	//var building1 = {
	//	name: "Building 1",
	//	buildingNumber: 1,
	//	numOfFloors: 7,
	//	numHousePerFloor: 6,
	//	type: "complex",
	//	createdBy: "Trung",
	//	remarks: "Building 1"
	//};
	//
	//Apartment.insert(apart1, function(err,obj){
	//	if(err){
	//		console.log(err);
	//		return;
	//	}
	//	building1.apartmentId = obj;
	//	Building.insert(building1);
	//});

	
	
	var wsURL = 'ws://203.250.78.212:9002/websockets/data_service';
	var Websocket = Meteor.npmRequire('recon-ws');
	startWebsocket();
	
	/*
	Function Defitions
	*/ 
	Accounts.validateLoginAttempt(function(attempt){
		if(attempt.allowed)
		{
			console.log('login sucess');
			console.log(attempt.user);
			return true;
		}
	});
	Accounts.config({
		forbidClientAccountCreation:false
	});
	/*******************************************************************************/
	
	function startWebsocket(){
		var Future = Npm.require('fibers');
		var ws = new Websocket(wsURL);
		
		ws.on('open',function()
		{
			console.log('connection opened');
		});
		ws.on('close',function(){
			console.log('connection closed');
		});
		ws.on('error',function(){
			console.log('connection error');
		});
		ws.on('message',Meteor.bindEnvironment(function(msg){
			console.log('Got message');
			readWsData(msg)
		}));
	}
	
	function readWsData(data)
	{
		try{
			
			var json = JSON.parse(data);
			console.log(json);
			var nodeId = json.nodeId;
			//var houseNumber = 1;//House.findOne({nodeId:nodeId});
			var sound = json.sound;
			var vibration = json.vibration;
			var battery = json.battery;
			
			var inputData = 
			{
				nodeNumber : nodeId,
				sound : sound,
				vibration : vibration,
				battery : battery,
				createdBy: "Trung"
			}
			
			
			// Insert received data into Data Collection
			Data.insert(inputData);
			
			// Update value in House
			/*
			House.updateCommands({houseNumber:houseNumber},
				{$set:{
					sound:sound,
					vibration: vibration,
					battery: battery,
					updatedAt: new Date()
				}});
				*/
				
		}	
		catch(e)
		{
			
		}
	}
});