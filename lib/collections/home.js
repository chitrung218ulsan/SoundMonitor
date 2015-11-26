/**
 * Created by Hieu on 11/11/2015.
 */
Home = new Mongo.Collection('Home');
var homeSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
    floor: {
        type: Number,
        label: "Floor #"
    },
    homeNumber : {
        type: Number,
        label: "Home #"
    },
    name: {
        type: String,
        label: "ID or Name of the owner"
    },
    telNumber: {
        type: String,
        label: "Telephone number"
    },
	apartmentId: {
        type: String,
        label: "The Id of the home's apartment"
    },
	apartmentName: {
        type: String,
        label: "The name of the home's apartment"
    },
    buildingId: {
        type: String,
        label: "The ID of the home's building"
    },
	buildingName: {
        type: String,
        label: "The Name of the home's building"
    },
    nodeId: {
        type: Number,
        label: "The ID of the home's node"
    },
	remarks : {
        type: String,
        label: "The note on the home"
        /*autoValue: function(){
            return "";
        }*/
    },
		
	
	sound:{
		type: Number,
		label: "Current Value of Sound",
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
		label: "Current Value of Vibration",
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
		label: "The last Value over the Threshold",
		autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
            return 0;
        }
	},
	nodeBattery: {
		type: Number,
		label: "Remaining Battery",
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
		label: "Connection Status",
		autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
            return "OFF";
        }
	},
	
	lastDataUpdate:{
		type:Date,
		label: "The last Updated Data",
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
    }
});