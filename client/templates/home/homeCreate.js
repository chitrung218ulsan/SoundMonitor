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
        var options = _.map(Apartment.find({}).fetch(), function(obj){
            return {label: obj.name, value: obj._id}
        });
        return options;
    },
    buildingOptions: function () {
        var apId = AutoForm.getFieldValue('apartmentId');
        var opts = Building.find({apartmentId: apId}).map(function(obj){
            return {label: obj.name, value: obj._id};
        });
        return opts;
    },
    nodeOptions: function () {
        return Node.find().map(function (c) {
          return {label: c.name, value: c._id};
        });
    }
});

