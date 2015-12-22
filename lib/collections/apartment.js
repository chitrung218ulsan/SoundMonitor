/**
 * Created by Hieu on 11/11/2015.
 */
Apartment = new Mongo.Collection('Apartment');
var apartmentSchema = new SimpleSchema([SoundMonitor.BaseSchema, {
    name: {
        type: String,
        label: '공동주택 명',
        max: 255
    },
	type:{
		type: String,
        label: '주거구분',
		allowedValues: ["아바트","빌라","다세대","기타"],
		autoform: {
		  afFieldInput: {
			firstOption: "(Select a Type)"
		  }
		}
	},
    address: {
        type: String,
        label: '주소',
        max: 255
    },
	numOfBuildings: {
        type: Number,
        label: '동수'
    },
	numOfHomes: {
        type: Number,
        label: '종세대수'
    },
    constructDate: {
        type: Date,
        label: '준공일'
    },
    manager: {
        type: String,
        label: '관리자'
    },
    remarks: {
        type: String,
        label: '비고'
    }
}
]);
Apartment.attachSchema(apartmentSchema);
Apartment.helpers({
    buildings: function(){
        return Building.find({apartmentId: this._id, isDeleted: false});
    },
    numOfHomes: function(){
        var homeCount = 0;
        this.buildings().forEach(function(bd){
            homeCount += bd.numOfHomes();
        });
        return homeCount;
    },
    numOfBuildings: function(){
        return this.buildings().count();
    }
});