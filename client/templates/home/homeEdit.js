/**
 * Created by Hieu on 11/15/2015.
 */
AutoForm.hooks({
    editHomeForm : {
        onSuccess: function(formType, result){
            var entityType = Router.current().route.options.entityType;
            Template.soundAlert.theInstance.setMessage(
                SoundMonitor.Constants.ALERT_TYPE.success,
                "The " + entityType + " " + this.currentDoc.name + " has been edited successfully."
            );
            var url = Template.soundAlert.previousRoute ||
                Router.routes[Router.current().route.options.parent].path({_id: this.currentDoc._id});
            Router.go(url);
        },
        docToForm: function(doc) {
            var realDoc = Home.findOne({_id: doc._id});
            doc.apartmentId = realDoc.building().apartment()._id;
            return doc;
        }
    }
});

Template.homeEdit.events({
    'click .edit-deny': function(){
        var url = Template.soundAlert.previousRoute ||
            Router.routes[Router.current().route.options.parent].path({_id: Router.current().params._id});
        Router.go(url);
    }
});
Template.homeEdit.helpers({
    getSchema: function(){
        var newSchema = new SimpleSchema([Home.simpleSchema(),{
            apartmentId: {
                type: String,
                label: "공동주택 명",
                optional: true
            }
        }]);
        return newSchema;
    },
    apartmentOptions: function(){
        var opts = Apartment.find().map(function(obj){
           return {label: obj.name, value: obj._id};
        });
        return opts;
    },
    buildingOptions: function () {
        var apId = AutoForm.getFieldValue('apartmentId');
        var opts = Building.find({apartmentId: apId}).map(function(obj){
            return {label: obj.name, value: obj._id};
        });
        return opts;
    }
});