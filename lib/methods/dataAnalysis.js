/**
 * Created by Hieu on 11/8/2015.
 */
Meteor.methods({
    getSoundStat:function(buildingId, startDate, endDate,soundThreshold) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        var self = this;
        var nodes = [];
        var bu = Building.findOne({_id: buildingId});
        if (bu) {
            _.each(bu.homes().fetch(), function (ele, index, list) {

                nodes.push(ele.node().nodeNumber);

            });
        }

        //console.log(soundThreshold);
        var sound_threshold = parseFloat(soundThreshold);
        var pipeline = [
            {
                "$match": {
                    nodeNumber: {$in: nodes},
                    isDeleted: false,
                    createdAt: {$gte: startDate, $lte: endDate},
                    sound: {$gte: sound_threshold}
                }
            },
            {
                "$group": {
                    _id: "$nodeNumber",

                    maxSound: {$max: "$sound"},

                    numOfSoundOverThreshold: {$sum: 1}
                }
            }

        ];

        var results = Data.aggregate(pipeline);
        return results;
    },
    getVibStat: function(buildingId, startDate, endDate,vibrationThreshold) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        var self = this;
        var nodes = [];
        var bu = Building.findOne({_id: buildingId});
        if (bu) {
            _.each(bu.homes().fetch(), function (ele, index, list) {

                nodes.push(ele.node().nodeNumber);

            });
        }
        //console.log(startDate);
        //console.log(vibrationThreshold);
        var vib_threshold = parseFloat(vibrationThreshold);

        var cond = [
            {nodeNumber: {$in: nodes}},
            {isDeleted: false},
            {createdAt: {$gte: startDate, $lte: endDate}},
            {vibration: {$gte: vib_threshold}}
        ];
        var pipeline = [
            {
                $match: {
                    $and: cond
                }
            },
            {
                "$group": {
                    _id: "$nodeNumber",

                    maxVib: {$max: "$vibration"},

                    numOfVibOverThreshold: {$sum: 1}
                }
            }

        ];

        var results = Data.aggregate(pipeline);
        return results;
    }
});