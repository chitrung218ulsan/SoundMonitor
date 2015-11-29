/**
 * Created by Hieu on 11/11/2015.
 */
Node = new Mongo.Collection('Node');
var nodeSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
	name :{
		type: String,
        label: "The name of device"
	},
    nodeNumber : {
        type: Number,
        label: "The node #"
    },
    hardwareVersion: {
        type: String,
        label: "Hardware version"
    },
    softwareVersion: {
        type: String,
        label: "Software version"
    },
	nodeSerial: {
        type: String,
        label: "Serial #"
    },
    remarks: {
        type: String,
        label: "Note on the node"
    }
    
	/*
    sound: {
        type: Number,
        label: "Sound level in dB"
    },
    vibration: {
        type: Number,
        label: "Vibration level in dB"
    },
    battery: {
        type: Number,
        label: "Battery level in voltage"
    }
	*/
}
]);
Node.attachSchema(nodeSchema);
Node.helpers({
    home: function(){
        return Home.findOne({nodeId: this._id});
    },
    datas: function(startDate, endDate){
        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);
        return Data.find({nodeNumber: this.nodeNumber, createdAt: {$gte: startDate, $lte: endDate}});
    },
    maxInfo: function(startDate, endDate,thresholdSound, thresholdVibration){
        var dataInfo = this.datas(startDate,endDate);
        var maxSound = 0;
        var maxVibration = 0;
        var overThresholdSound = 0;
        var overThresholdVibration = 0;
        _.each(dataInfo.fetch(),function(element,index,list){
            if(element.sound > maxSound)
                maxSound = element.sound;
            if(element.vibration > maxVibration)
                maxVibration = element.vibration;
            if(element.sound > thresholdSound)
                overThresholdSound++;
            if(element.vibration > thresholdVibration)
                overThresholdVibration++;
        })
        return {
            maxSound: maxSound,
            maxVibration: maxVibration,
            overThresholdSound: overThresholdSound,
            overThresholdVibration: overThresholdVibration
        }
    }
});
