Meteor.startup(function()
{
	//Apartment.remove({});
	//Building.remove({});
	//Home.remove({});
	//Node.remove({});
	//Data.remove({});
	
	var apart1 = {
		name: "Lotte",
		address: "Ulsan",
		constructDate: new Date(),
		manager: "Trung",
		createdBy: "Trung",
		remarks: "Lotte"
	};

	var building1 = {
		name: "Building 1",
		buildingNumber: 1,
		numOfFloors: 7,
		numHousePerFloor: 6,
		type: "type1",
		manager: "Trung",
		createdBy: "Trung",
		remarks: "Building 1"
	};

	var building2 = {
		name: "Building 2",
		buildingNumber: 3,
		numOfFloors: 2,
		numHousePerFloor: 3,
		type: "type2",
		manager: "Trung",
		createdBy: "Hieu Ngo",
		remarks: "Building 2"
	};

	var node1 = {
		name: "Node 1",
		nodeNumber: 1,
		hardwareVersion: "Hard V1",
		softwareVersion: 'Soft V1',
		nodeSerial: "1111",
		remarks: "Node 1",
		createdBy: "Hieu"
	};

	var node2 = {
		name: "Node 2",
		nodeNumber: 2,
		hardwareVersion: "Hard V2",
		softwareVersion: 'Soft V2',
		nodeSerial: "2222",
		remarks: "Node 2",
		createdBy: "Hieu"
	};

	var home1 = {
		floor: 1,
		homeNumber: 101,
		name: 'Hieu',
		telNumber: '7889302',
		createdBy: "Hieu Ngo",
		nodeId: 1,
		sound:0,
		vibration:0,
		nodeBattery:0,
		remarks: "home1"
	};

	var home2 = {
		floor: 2,
		homeNumber: 201,
		name: 'Hieu',
		telNumber: '9999999',
		createdBy: "Hieu Ngo",
		nodeId: 1,
		sound:0,
		vibration:0,
		nodeBattery:0,
		remarks: "home2"
	};

	
	Apartment.insert(apart1, function(err,obj){
		if(err){
			console.log(err);
			return;
		}
		building1.apartmentId = obj;
		building1.apartmentName = apart1.name;
		building2.apartmentId = obj;
		building2.apartmentName = apart1.name;
		
		Building.insert(building1,function(err,bu1){
			if(err){
				console.log(err);
				return;
			}
			home1.apartmentName = apart1.name;
			home1.apartmentId = obj;
			home1.buildingId = bu1;
			home1.buildingName = building1.name;
			Node.insert(node1, function(err,realNode1){
				home1.nodeId = realNode1;
				var data1 = {
					nodeNumber: node1.nodeNumber,
					sound: 10,
					vibration: 15,
					battery: 2,
					createdBy: "Hieu"
				};
				var data2 = {
					nodeNumber: node1.nodeNumber,
					sound: 20,
					vibration: 10,
					battery: 4,
					createdBy: "Hieu"
				};
				Data.insert(data1);
				Data.insert(data2);
				Home.insert(home1, function(err,hu1){
					console.log(err);
				});
			});

		});
		Building.insert(building2, function(err,bu2){
			if(err){
				console.log(err);
				return;
			}
			home2.apartmentName = apart1.name;
			home2.apartmentId = obj;
			home2.buildingId = bu2;
			home2.buildingName = building2.name;
			Node.insert(node2,function(err,realNode2){
				home2.nodeId = realNode2;
				var data1 = {
					nodeNumber: node2.nodeNumber,
					sound: 100,
					vibration: 150,
					battery: 2,
					createdBy: "Hieu"
				};
				var data2 = {
					nodeNumber: node2.nodeNumber,
					sound: 50,
					vibration: 13,
					battery: 4,
					createdBy: "Hieu"
				};
				Data.insert(data1);
				Data.insert(data2);
				Home.insert(home2,function(err,hu2){
					console.log(err);
				});
			})

		});
	});

	
	
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
			
			Home.update({'nodeId':nodeId},
			{$set:{
				sound:sound,
				vibration: vibration,
				nodeBattery: battery,
				lastDataUpdate: new Date()
			}},{ multi: true });
				
				
		}	
		catch(e)
		{
			
		}
	}
});