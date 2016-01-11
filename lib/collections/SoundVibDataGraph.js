SoundVibDataGraph = new Mongo.Collection('SoundVibDataGraph');
var soundvibDataGraphSchema = new SimpleSchema({
    nodeNumber: {
        type: Number,
        label: "The node #"
    },
    sound: {
        type: Number,
        label: "Maximum Sound level in dB"
    },
	vib: {
        type: Number,
        label: "Maximum Vibration level in dB"
    },
    createdAt: {
        type: Date,
        label: "created Time for data"
    }
});
SoundVibDataGraph.attachSchema(soundvibDataGraphSchema);
SoundVibDataGraph.helpers({
    node : function(){
        return Node.findOne({nodeNumber: this.nodeNumber});
    }
	
});
