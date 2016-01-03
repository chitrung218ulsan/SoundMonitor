SoundData = new Mongo.Collection('SoundData');
var soundDataSchema = new SimpleSchema({
    nodeNumber: {
        type: Number,
        label: "The node #"
    },
    maxSound: {
        type: Number,
        label: "Maximum Sound level in dB"
    },
    numOfSoundOverThreshold: {
        type: Number,
        label: "Total number of times over threshold"
    }
});
SoundData.attachSchema(soundDataSchema);
SoundData.helpers({
    node : function(){
        return Node.findOne({nodeNumber: this.nodeNumber});
    }
	
});
