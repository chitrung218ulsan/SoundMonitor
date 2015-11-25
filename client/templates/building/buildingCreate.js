AutoForm.hooks({
    createBuildingForm : {
        onSuccess: function(formType, result){
            var entityType = Router.current().route.options.entityType;
            Template.soundAlert.theInstance.setMessage(
                SoundMonitor.Constants.ALERT_TYPE.success,
                "The " + entityType + " has been created successfully."
            );
            Router.go(entityType);
        }
    }
});
Template.buildingCreate.helpers({
  apartNameOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c.name};
    });
  }
});
Template.buildingCreate.helpers({
  apartIdOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  }
});