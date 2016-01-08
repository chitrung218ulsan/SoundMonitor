//Meteor.methods({
//	'createAparment':function(apartName,addr,totalHome,totalBuilding,constructDate,manager,remarks){
//
//		var currentUser = Meteor.userId();
//		var apart =
//		{
//			name: apartName,
//			address: addr,
//			numOfHouses: totalHome,
//			numOfBuildings: totalBuilding,
//			constructDate: constructDate,
//			manager: manager,
//			remarks: remarks,
//			createdAt: new Date(),
//			createdBy: currentUser
//		};
//		Apartment.insert(apart);
//	},
//
//	'createBuilding':function(apartName,buildingNum,totalFloor,totalHomePerFloor,type,manager,remarks){
//
//		var currentUser = Meteor.userId();
//		var building = {
//			apartName: apartName,
//			buildingNumber: buildingNum,
//			numOfFloors: totalFloor,
//			numHousePerFloor: totalHomePerFloor,
//			manager:manager,
//			type: type,
//			remarks: remarks,
//			createdAt: new Date(),
//			createdBy: currentUser
//		};
//		Building.insert(building);
//	},
//
//	'createHome':function(apartName,buildingName, floorNum, homeNum, owner, tel, nodeId, nodeSerialNum){
//
//		var currentUser = Meteor.userId();
//		var home = {
//			apartName: apartName,
//			buildingNumber: buildingName,
//			floor:floorNum,
//			homeNumber: homeNum,
//			owner: owner,
//			telNumber: tel,
//			nodeId: nodeId,
//			nodeSerial: nodeSerialNum,
//			//sound: 4.5 //dB
//			//vibration: 3.4 //dB
//			//updatedAt: some_date_obj,
//			//updatedBy: "some one"
//			createdAt: new Date(),
//			createdBy: currentUser
//		};
//		Home.insert(home);
//	},
//
//	'createNode':function(nodeId,hardVersion,softVersion,markerName, remarks){
//
//		var currentUser = Meteor.userId();
//		var node = {
//			nodeId: nodeId,
//			harwareVersion: hardVersion,
//			softwareVersion: softVersion,
//			markerName: markerName,
//			remarks:remarks,
//			createdAt: new Date(),
//			createdBy: currentUser
//		};
//		Node.insert(node);
//	},
//
//	'removeApartment':function(apartName){
//		Apartment.remove({_id:apartName});
//	},
//	'removeBuilding':function(buildingId){
//		Building.remove({_id:buildingId});
//	},
//	'updateBuilding':function(buildingId,apartName,buildingNum,numOfFloors,numHousePerFloor,type,manager,remarks){
//		var currentUser = Meteor.userId();
//		console.log('updateBuilding');
//		Building.update({_id:buildingId},
//			{$set:{
//				apartName: apartName,
//				buildingNumber: buildingNum,
//				manager: manager,
//				numOfFloors: numOfFloors,
//				numHousePerFloor: numHousePerFloor,
//				type: type,
//				remarks: remarks,
//				createdAt: new Date(),
//			    createdBy: currentUser
//			}});
//	}
//});
//var Future = Npm.require( 'fibers/future' ); 
Meteor.methods({
	'soundData':function(nodeId,startDate,endDate){
		var future = new Future();
		startDate.setHours(0,0,0,0);
		endDate.setHours(23,59,59,999);
		var testData = [];
		var home = Home.findOne({nodeId:nodeId});
		var node = home.node();
		var datas = Data.find({nodeNumber : node.nodeNumber,isDeleted: false},{sort:{createdAt:1}});
		_.each(datas.fetch(),function(element,index,list){
			var tempData = [element.createdAt,element.sound];
			//console.log(tempData);
			testData.push(tempData);
		});
		return testData;
		//future.return(testData);
		//return future.wait();
	
	}
});