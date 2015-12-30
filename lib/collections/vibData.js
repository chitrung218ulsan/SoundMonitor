VibData = new Mongo.Collection('VibData');
var vibDataSchema = new SimpleSchema({
    nodeNumber: {
        type: Number,
        label: "The node #"
    },
    maxVib: {
        type: Number,
        label: "Maximum Vib level in dB"
    },
    numOfVibOverThreshold: {
        type: Number,
        label: "Total number of times over threshold"
    }
});
VibData.attachSchema(vibDataSchema);
VibData.helpers({
    node : function(){
        return Node.findOne({nodeNumber: this.nodeNumber});
    }
});
