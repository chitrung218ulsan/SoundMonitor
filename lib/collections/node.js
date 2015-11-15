/**
 * Created by Hieu on 11/11/2015.
 */
Node = new Mongo.Collection('Node');
var nodeSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
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
    remarks: {
        type: String,
        label: "Note on the node"
    },
    nodeSerial: {
        type: String,
        label: "Serial #"
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
    }
}
]);
Node.attachSchema(nodeSchema);
Node.helpers({
    home: function(){
        return Home.findOne({nodeId: this._id});
    }
});
