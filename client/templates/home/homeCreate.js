AutoForm.hooks({
    createHomeForm : {
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



Template.homeCreate.helpers({
  apartNameOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c.name};
    });
  },
   apartIdOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  },
  buildingNameOptions: function () {
	var apId = AutoForm.getFieldValue('apartmentId') || "empty";
    return Building.find({apartmentId:apId}).map(function (c) {
      return {label: c.name, value: c.name};
    });
  },
   buildingIdOptions: function () {
	var apId = AutoForm.getFieldValue('apartmentId') || "empty";   
    return Building.find({apartmentId:apId}).map(function (c) {
      return {label: c.name, value: c._id};
    });
  },
  nodeIdOptions: function () {
    return Node.find().map(function (c) {
      return {label: c.nodeNumber, value: c.nodeNumber};
    });
  }
  
});

