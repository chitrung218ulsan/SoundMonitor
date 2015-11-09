Meteor.methods({
	'createAparment':function(apartName,addr,totalHome,totalBuilding,constructDate,manager,remarks){
		
		var currentUser = Meteor.userId();
		var apart = 
		{
			name: apartName,
			address: addr,
			numOfHouses: totalHome,
			numOfBuildings: totalBuilding,
			constructDate: constructDate,
			manager: manager,
			remarks: remarks,
			createdAt: new Date(),
			createdBy: currentUser
		};
		Aparment.insert(apart);
	},
	
	'createBuilding':function(apartName,buildingNum,totalFloor,totalHomePerFloor,type,manager,remarks){
		
		var currentUser = Meteor.userId();
		var building = {
			apartName: apartName,
			buildingNumber: buildingNum,
			numOfFloors: totalFloor,
			numHousePerFloor: totalHomePerFloor,
			manager:manager,
			type: type,
			remarks: remarks,
			createdAt: new Date(),
			createdBy: currentUser
		};
		Building.insert(building);
	},
	
	'createHome':function(apartName,buildingName, floorNum, homeNum, owner, tel, nodeId, nodeSerialNum){
		
		var currentUser = Meteor.userId();
		var home = {
			apartName: apartName,
			buildingNumber: buildingName,
			floor:floorNum,
			homeNumber: homeNum,
			owner: owner,
			telNumber: tel,
			nodeId: nodeId,
			nodeSerial: nodeSerialNum,
			//sound: 4.5 //dB
			//vibration: 3.4 //dB
			//updatedAt: some_date_obj,
			//updatedBy: "some one"
			createdAt: new Date(),
			createdBy: currentUser
		};
		Home.insert(home);
	},
	
	'createNode':function(nodeId,hardVersion,softVersion,markerName, remarks){
		
		var currentUser = Meteor.userId();
		var node = {
			nodeId: nodeId,
			harwareVersion: hardVersion,
			softwareVersion: softVersion,
			markerName: markerName,
			remarks:remarks,
			createdAt: new Date(),
			createdBy: currentUser
		};
		Node.insert(node);
	},
});