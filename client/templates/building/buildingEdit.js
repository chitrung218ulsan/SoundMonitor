/**
 * Created by Hieu on 11/15/2015.
 */
AutoForm.hooks({
    editBuildingForm : {
        onSuccess: function(formType, result){
            var entityType = Router.current().route.options.entityType;
            Template.soundAlert.theInstance.setMessage(
                SoundMonitor.Constants.ALERT_TYPE.success,
                "The " + entityType + " " + this.currentDoc.name + " has been edited successfully."
            );
            var url = Template.soundAlert.previousRoute ||
                Router.routes[Router.current().route.options.parent].path({_id: this.currentDoc._id});
            Router.go(url);
        }
    }
});

Template.buildingEdit.events({
    'click .edit-deny': function(){
        var url = Template.soundAlert.previousRoute ||
            Router.routes[Router.current().route.options.parent].path({_id: Router.current().params._id});
        Router.go(url);
    }
});

Template.buildingEdit.helpers({
    apartmentOptions: function(){
        var opts = Apartment.find().map(function(obj){
            return {label: obj.name, value: obj._id};
        });
        return opts;
    }
});