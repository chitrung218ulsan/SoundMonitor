/**
 * Created by Hieu on 11/11/2015.
 */
Home = new Mongo.Collection('Home');
var homeSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
	
    buildingId: {
        type: String,
        label: "동 ID"
    },
	floor: {
        type: Number,
        label: "층"
    },
    homeNumber : {
        type: Number,
        label: "호수"
    },
    name: {
        type: String,
        label: "세대 주"
    },
    telNumber: {
        type: String,
        label: "연락처"
    },
	homeSize: {
        type: Number,
        label: "므기 (m2)"
    },
	
    nodeId: {
        type: String,
        label: "단말기 이름"
    },
	remarks : {
        type: String,
        label: "비고"
        /*autoValue: function(){
            return "";
        }*/
    },
	
	sound:{
		type: Number,
		label: "소음",
		autoValue: function(){
			if (this.isInsert){
				
				return 0;
			} else if (this.isUpsert){
				return {$setOnInsert: 0};
			} 
		}
		
		
	},
	vibration: {
		type:Number,
		label: "진동",
		autoValue: function(){
			if (this.isInsert){
				
				return 0;
			} else if (this.isUpsert){
				return {$setOnInsert: 0};
			} 
		}
		
		
	},
	lastOverThreshold:{
		type: Number,
		label: "기준 초과",
		autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
            return 0;
        }
	},
	nodeBattery: {
		type: Number,
		label: "배터리",
		autoValue: function(){
			if (this.isInsert){
				
				return 70;
			} else if (this.isUpsert){
				return {$setOnInsert: 0};
			} 
		}
		
	},
	
	commStatus: {
		type: String,
		label: "통신상태",
		autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
            return "OFF";
        }
	},
	
	lastDataUpdate:{
		type:Date,
		label: "최종 업데이트 날짜",
		autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
			var date = new Date();
            if (this.isInsert){
				
                return date;
            } else if (this.isUpsert){
                return {$setOnInsert: date};
            } 
			else if(this.isUpdate)
			{
				return date;
			}
        }
	}
	
	
}
]);
Home.attachSchema(homeSchema);
Home.helpers({
    building: function(){
        return Building.findOne({_id: this.buildingId});
    },
    node: function(){
        return Node.findOne({_id: this.nodeId});
    },
	maxInfo: function(startDate, endDate, thresholdSound, thresholdVibration){
		return this.node().maxInfo(startDate,endDate,thresholdSound, thresholdVibration);
	}
});