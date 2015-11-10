Meteor.startup(function()
{
	Apartment.remove({});
	Building.remove({});
	var apart1 = 
	{
		name: "Lotte",
		address: "Ulsan",
		numOfHouses: 40,
		numOfBuildings: 30,
		constructDate: new Date(),
		manager: "Trung",
		remarks: "",
		createdAt: new Date(),
		createdBy: "Trung"
	};
	//var apartId = findAparment('Lotte');
	//console.log(apartId);
	var building1 = {
		apartName: "Lotte",
		buildingNumber: 1,
		manager: "Trung",
		numOfFloors: 7,
		numHousePerFloor: 6,
		type: "complex",
		remarks: "",
		createdAt: new Date(),
		createdBy: "Trung"
	};
	
	Apartment.insert(apart1);
	Building.insert(building1);
	
	var wsURL = 'ws://203.250.78.212:9002/websockets/data_service';
	var Websocket = Meteor.npmRequire('recon-ws');
	//startWebsocket();
	
	/*
	Function Defitions
	*/ 
	
	
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
			var houseNumber = 1;//House.findOne({nodeId:nodeId});
			var sound = json.sound;
			var vibration = json.vibration;
			var battery = json.battery;
			
			var inputData = 
			{
				"nodeId": nodeId,
				"houseNumber" : houseNumber,
				"sound" : sound,
				"vibration": vibration,
				"battery" : battery,
				"createdAt": new Date(),
				"createdBy": "Trung"
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
	
	function findAparment(apartName)
	{
		var cursor = Apartment.find({name:apartName});
		
		cursor.forEach(function(myDoc)
		{
			//console.log(myDoc);
			console.log(myDoc._id);
			return myDoc._id;
		});
		
		
		
	}
});