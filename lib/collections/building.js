/**
 * Created by Hieu on 11/11/2015.
 */
Building = new Mongo.Collection('Building');
var buildingSchema = new SimpleSchema([SoundMonitor.BaseSchema, {
    name : {
        type : String,
        label: "Name",
        max : 255
    },
    buildingNumber : {
        type: Number,
        label: "The number of the building"
    },
    numOfFloors : {
        type: Number,
        label: "The number of floors in the building"
    },
    numHousePerFloor : {
        type: Number,
        label: "The number of units on each floor"
    },
    type : {
        type: String,
        label: "Type of building",
		allowedValues: ["type1","type2","type3"],
		autoform: {
		  afFieldInput: {
			firstOption: "(Select a Type)"
		  }
		}
    },
	manager:{
		type: String,
        label: "The name of the manager of the building"
	},
    remarks : {
        type: String,
        label: "The note on the building"
        /*autoValue: function(){
            return "";
        }*/
    },
    apartmentId : {
        type: String,
        label: "The ID of the building's apartment"
    },
	 apartmentName : {
        type: String,
        label: "The name of the building's apartment",
		
		
    }
}
]);

Building.attachSchema(buildingSchema);
Building.helpers({
    apartment : function(){
        return Apartment.findOne({_id : this.apartmentId});
    },
    homes: function(){
        return Home.find({buildingId: this._id, isDeleted: false});
    },
    numOfHouses: function(){
        return this.homes().count();
    },
    maxInfo: function(startDate, endDate,thresholdSound, thresholdVibration){
        var maxSound = 0;
        var maxVibration = 0;
        var overThresholdSound = 0;
        var overThresholdVibration = 0;
        _.each(this.homes().fetch(),function(home,index,list){
            var element = home.maxInfo(startDate, endDate, thresholdSound, thresholdVibration);
            if(element.maxSound > maxSound)
                maxSound = element.maxSound;
            if(element.maxVibration > maxVibration)
                maxVibration = element.maxVibration;

            overThresholdSound += element.overThresholdSound;
            overThresholdVibration += element.overThresholdVibration;
        })
        return {
            maxSound: maxSound,
            maxVibration: maxVibration,
            overThresholdSound: overThresholdSound,
            overThresholdVibration: overThresholdVibration
        }
    }
});