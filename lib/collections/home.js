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
    owner: {
        type: String,
        label: "ID or Name of the owner"
    },
    telNumber: {
        type: String,
        label: "Telephone number"
    },
    buildingId: {
        type: String,
        label: "The ID of the home's building"
    },
    nodeId: {
        type: String,
        label: "The ID of the home's node"
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