/**
 * Created by Hieu on 12/6/2015.
 */
/**
 * Created by Hieu on 12/6/2015.
 */
Template.buildingView.helpers({
    getSchema: function(){
        return new SimpleSchema([Building.simpleSchema(), {
            numOfHomes:{
                type: Number,
                label: "세대 수"
            },
            apartmentName:{
                type: String,
                label: "공동주택 명"
            }
        }]);
    }
});