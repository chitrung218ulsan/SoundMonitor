/**
 * Created by Hieu on 12/6/2015.
 */
/**
 * Created by Hieu on 12/6/2015.
 */
AutoForm.hooks({
    viewBuildingForm: {
        docToForm: function(doc) {
            var realDoc = Building.findOne({_id: doc._id});
            doc.numOfHomes = realDoc.numOfHomes();
            doc.apartmentName = realDoc.apartment().name;
            return doc;
        }
    }
});
Template.buildingView.helpers({
    getSchema: function(){
		
		return new SimpleSchema([{
            /*numOfHomes:{
                type: Number,
                label: "세대 수"
            },*/
            apartmentName:{
                type: String,
                label: "공동주택 명"
            }
        },Building.simpleSchema()]);
		
      
    }
});