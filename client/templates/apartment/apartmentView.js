/**
 * Created by Hieu on 12/6/2015.
 */
Template.apartmentView.helpers({
    getSchema: function(){
        return new SimpleSchema([Apartment.simpleSchema(), {
            numOfBuildings:{
                type: Number,
                label: "동수"
            },
            numOfHomes:{
                type: Number,
                label: "세대 수"
            }
        }]);
    }
});