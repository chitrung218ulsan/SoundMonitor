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
	warningSoundThreshold:{
		type: Number,
        label: "사운드 임계 값 경고"
	},
	warningVibThreshold:{
		type: Number,
        label: "경고 진동 임계"
	},
	dangerSoundThreshold:{
		type: Number,
        label: "위험한 소리 임계 값"
	},
	dangerVibThreshold:{
		type: Number,
        label: "위험한 진동 임계 값"
	},
	/*thresholds:{
		type:Array,
		label:"Threshold Value",
		optional:true
	},
	'thresholds.$':{
		type:Object,
		
	},
	'thresholds.$.type':{
		type:String
	},
	'thresholds.$.threshold1':{
		type:Number
	},
	'thresholds.$.threshold2':{
		type:Number
	},	
	'thresholds.$.from':{
		type:String
	},
	'thresholds.$.to':{
		type:String
	},	
	*/
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
	homesWithFloor:function(floorNumber){
		return Home.find({buildingId: this._id, floor: floorNumber,isDeleted: false},{sort:{homeNumber:1}});
	},
    numOfHomes: function(){
        return this.homes().count();
    },
	numOfFloors:function(){
		return this.floor;
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
    },
	dataSound: function(){
        
        return SoundData.find({});
    },
	dataVib: function(){
        
        return VibData.find({});
    },
	maxInfo_1: function(){
        var maxSound = 0;
        var maxVib = 0;
        var overThresholdSound = 0;
		 var overThresholdVib = 0;
		var dataSoundInfo = this.dataSound();
		
		var dataVibInfo = this.dataVib();
		
        _.each(dataSoundInfo.fetch(),function(element,index,list){
            if(element.maxSound > maxSound)
                maxSound = element.maxSound;
            
			overThresholdSound += element.numOfSoundOverThreshold;
            
        })
		_.each(dataVibInfo.fetch(),function(element,index,list){
            if(element.maxVib > maxVib)
                maxVib = element.maxVib;
            
			overThresholdVib += element.numOfVibOverThreshold;
            
        })
        return {
            maxSound: maxSound,
            maxVib: maxVib,
            overThresholdSound: overThresholdSound,
			overThresholdVib: overThresholdVib
            
        }
    }
});