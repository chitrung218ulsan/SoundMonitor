AutoForm.hooks({
    createNodeForm : {
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
/*
Template.NodeCreate.helpers({
  buildingNameOptions: function () {
    return Building.find().map(function (c) {
      return {label: c.name, value: c.name};
    });
  }
});
Template.NodeCreate.helpers({
  buildingIdOptions: function () {
    return Building.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  }
});
*/