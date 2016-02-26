/**
 * Created by Hieu on 11/11/2015.
 */
Data = new Mongo.Collection('Data');
var dataSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
    nodeNumber: {
        type: Number,
        label: "The node #"
    },
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
    },
	minSound: {
        type: Number,
        label: "Min Sound level in dB"
    },
    minVibration: {
        type: Number,
        label: "Min Vibration level in dB"
    },
	maxSound: {
        type: Number,
        label: "Max Sound level in dB"
    },
    maxVibration: {
        type: Number,
        label: "Max Vibration level in dB"
    }
}
]);
Data.attachSchema(dataSchema);
Data.helpers({
    node : function(){
        return Node.findOne({nodeNumber: this.nodeNumber});
    }
});
