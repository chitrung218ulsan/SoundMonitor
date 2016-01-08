/**
 * Created by Hieu on 11/11/2015.
 */
Node = new Mongo.Collection('Node');
var nodeSchema = new SimpleSchema([SoundMonitor.BaseSchema,{
	name :{
		type: String,
        label: "단말기 이름"
	},
    nodeNumber : {
        type: Number,
        label: "디바이스 번호"
    },
    hardwareVersion: {
        type: String,
        label: "하드웨어 버전"
    },
    softwareVersion: {
        type: String,
        label: "소프트웨어 버전"
    },
	/*
	manufacture: 제조사 이름
	*/
	nodeSerial: {
        type: String,
        label: "단말기 S/N"
    },
    remarks: {
        type: String,
        label: "비고"
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
        return Data.find({nodeNumber: this.nodeNumber, createdAt: {$gte: startDate, $lte: endDate}},{sort:{createdAt:1}});
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
