/*
Each apartment should have the following structure
{
	name: "Lotte",
	address: "Ulsan",
	numOfHouses: 40,
	numOfBuildings: 30,
	constructDate: some_date_obj,
	manager: "Trung",
	remarks: "",
	createdAt: some_date_obj,
	createdBy: "some one"
}
*/

/*
Each building
{
	apartName: "Lotte",
	buildingNumber: 1,
	manager: "Trung",
	numOfFloors: 7,
	numHousePerFloor: 6,
	type: "complex",
	remarks: "",
	createdAt: some_date_obj,
	createdBy: "some one"
}
*/

/*
Each House
{
	apartName: "Lotte",
	buildingNumber: 1,
	floor:2,
	homeNumber: 42,
	owner: "Trung",
	telNumber: "01026348287",
	nodeId: 1,
	nodeSerial: "123456789",
	sound: 4.5 //dB
	vibration: 3.4 //dB
	updatedAt: some_date_obj,
	updatedBy: "some one"
	createdAt: some_date_obj,
	createdBy: "some one"
}
*/

/*
Each node has the following structure
{
	nodeId: 1,
	harwareVersion: 1,
	softwareVersion: 1,
	markerName: "Trung",
	remarks:"",
	createdAt: some_date_obj,
	createdBy: "some one"
}
/*
Each received data from device should have the following structure
{
	nodeId: 1,
	sound: 4.5, //dB,
	vibration: 4.5, //dB,
	battery: 3, // voltage
	createdAt: some_date_obj,
	createdBy: "some one"
}
*/

Apartment = new Mongo.Collection('Apartment');
Building = new Mongo.Collection('Building');
House = new Mongo.Collection('House');
Node = new Mongo.Collection('Node');
Data = new Mongo.Collection('Data');
