AutoForm.hooks({
    createBuildingForm : {
        onSuccess: function(formType, result){
            var entityType = Router.current().route.options.entityType;
            Template.soundAlert.theInstance.setMessage(
                SoundMonitor.Constants.ALERT_TYPE.success,
                "The " + entityType + " has been created successfully."
            );
            Router.go(entityType);
        },
        onError: function(formType, error){
            console.log("error");
        }
    }
});
Template.buildingCreate.helpers({
    apartmentOptions: function(){
        var options = _.map(Apartment.find({}).fetch(), function(obj){
            return {label: obj.name, value: obj._id}
        });
        return options;
    }
});