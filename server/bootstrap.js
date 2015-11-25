Meteor.startup(function()
{
<<<<<<< HEAD
	Apartment.remove({});
	Building.remove({});
	Home.remove({});
	
=======

>>>>>>> origin/master
	var apart1 =
	{
		name: "Lotte",
		address: "Ulsan",
		constructDate: new Date(),
		manager: "Trung",
		createdBy: "Trung",
		remarks: "Lotte"
	};
	//var apartId = findAparment('Lotte');
	//console.log(apartId);
	var building1 = {
		name: "Building 1",
		buildingNumber: 1,
		numOfFloors: 7,
		numHousePerFloor: 6,
<<<<<<< HEAD
		type: "type1",
		createdBy: "Trung",
		remarks: "Building 1"
	};

	var building2 = {
		name: "Building 2",
		buildingNumber: 3,
		numOfFloors: 2,
		numHousePerFloor: 3,
		type: "type2",
		createdBy: "Hieu Ngo",
		remarks: "Building 2"
	};

	var home1 = {
		floor: 1,
		homeNumber: 101,
		name: 'Hieu',
		telNumber: '7889302',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown',
		remarks: "home1"
	};

	var home2 = {
		floor: 2,
		homeNumber: 201,
		name: 'Hieu',
		telNumber: '9999999',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown',
		remarks: "home2"
	};

	var home3 = {
		floor: 1,
		homeNumber: 301,
		name: 'Hieu',
		telNumber: '7889302',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown',
		remarks: "home3"
	};

	var home4 = {
		floor: 2,
		homeNumber: 401,
		name: 'Hieu',
		telNumber: '9999999',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown',
		remarks: "home4"
	};
	
=======
		type: "complex",
		createdBy: "Trung",
		remarks: "Building 1"
	};

	var building2 = {
		name: "Building 2",
		buildingNumber: 3,
		numOfFloors: 2,
		numHousePerFloor: 3,
		type: "simple",
		createdBy: "Hieu Ngo",
		remarks: "Building 2"
	};

	var home1 = {
		floor: 1,
		homeNumber: 101,
		owner: 'Hieu',
		telNumber: '7889302',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown'
	};

	var home2 = {
		floor: 2,
		homeNumber: 201,
		owner: 'Hieu',
		telNumber: '9999999',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown'
	};

	var home3 = {
		floor: 1,
		homeNumber: 301,
		owner: 'Hieu',
		telNumber: '7889302',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown'
	};

	var home4 = {
		floor: 2,
		homeNumber: 401,
		owner: 'Hieu',
		telNumber: '9999999',
		createdBy: "Hieu Ngo",
		nodeId: 'unknown'
	};

>>>>>>> origin/master
	Apartment.insert(apart1, function(err,obj){
		if(err){
			console.log(err);
			return;
		}
		building1.apartmentId = obj;
<<<<<<< HEAD
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
			//home3.buildingId = bu1;
			//home4.buildingId = bu1;
			Home.insert(home1, function(err,hu1){
				console.log(err);
			});
			/*
			Home.insert(home3, function(err,hu1){
				console.log(err);
			});
			Home.insert(home4, function(err,hu1){
				console.log(err);
			});
			*/
			;
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
			//home3.buildingId = bu2;
			///home3.buildingName = building2.name;
			//home4.buildingId = bu2;
			//home4.buildingName = building2.name;
			Home.insert(home2,function(err,hu2){
				console.log(err);
			});
			/*
			Home.insert(home3,function(err,hu2){
				console.log(err);
			});
			Home.insert(home4,function(err,hu2){
				console.log(err);
			});
			*/
		;
=======
		building2.apartmentId = obj;
		Building.insert(building1,function(err,bu1){
			home1.buildingId = bu1;
			home3.buildingId = bu1;
			home4.buildingId = bu1;
			Home.insert(home1, function(err,hu1){
				console.log(err);
			});
			Home.insert(home3);
			Home.insert(home4);
		});
		Building.insert(building2, function(err,bu2){
			home2.buildingId = bu2;
			home3.buildingId = bu2;
			home4.buildingId = bu2;
			Home.insert(home2,function(err,hu2){
				console.log(err);
			});
			Home.insert(home3);
			Home.insert(home4);
>>>>>>> origin/master
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
			/*
			House.updateCommands({houseNumber:houseNumber},
				{$set:{
					sound:sound,
					vibration: vibration,
					battery: battery,
					dataUpdatedAt: new Date()
				}});
				*/
				
		}	
		catch(e)
		{
			
		}
	}
});