/**
 * Created by Hieu on 12/6/2015.
 */
AutoForm.hooks({
   /* viewApartmentForm : {
        docToForm: function(doc) {
            var realDoc = Apartment.findOne({_id: doc._id});
            doc.numOfBuildings = realDoc.numOfBuildings();
            doc.numOfHomes = realDoc.numOfHomes();
            return doc;
        }
    }*/
});
Template.apartmentView.helpers({
    /*getSchema: function(){
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
		
		
    }*/
});