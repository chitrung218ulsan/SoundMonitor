/**
 * Created by Hieu on 11/11/2015.
 */
Apartment = new Mongo.Collection('Apartment');
var apartmentSchema = new SimpleSchema([SoundMonitor.BaseSchema, {
    name: {
        type: String,
        label: 'Name',
        max: 255
    },
    address: {
        type: String,
        label: 'Address',
        max: 255
    },
    constructDate: {
        type: Date,
        label: 'Date of Construction'
    },
    manager: {
        type: String,
        label: 'The ID or name of the manager'
    },
    remarks: {
        type: String,
        label: 'The note on this apartment',
        autoValue : function(){
            return "";
        }
    }
}
]);
Apartment.attachSchema(apartmentSchema);
Apartment.helpers({
    buildings: function(){
        return Building.find({apartmentId: this._id, isDeleted: false});
    },
    numOfHouses: function(){
        var homeCount = 0;
        this.buildings().forEach(function(bd){
            homeCount += bd.numOfHouses();
        });
        return homeCount;
    },
    numOfBuildings: function(){
        return this.buildings().count();
    }
});