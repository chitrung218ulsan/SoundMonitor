/**
 * Created by Hieu on 11/11/2015.
 */
Building = new Mongo.Collection('Building');
var buildingSchema = new SimpleSchema([SoundMonitor.BaseSchema, {
    apartmentId : {
        type: String,
        label: "공동주택 명"
    },
	 //apartmentName : {
    //    type: String,
    //    label: "공동주택 명",
		//
    //},
	name : {
        type : String,
        label: "동 명",
        max : 255
    },
	type : {
        type: String,
        label: "형식",
		allowedValues: ["계단식","복도식","기타"],
		autoform: {
		  afFieldInput: {
			firstOption: "(Select a Type)"
		  }
		}
    },
	representative:{
		type: String,
        label: "동 대표자"
	},
	manager:{
		type: String,
        label: "관리 책임자"
	},
    numOfFloors : {
        type: Number,
        label: "층 수"
    },
    numHousePerFloor : {
        type: Number,
        label: "층별 세대 수"
    },
    remarks : {
        type: String,
        label: "비고"
        /*autoValue: function(){
            return "";
        }*/
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
    numOfHomes: function(){
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