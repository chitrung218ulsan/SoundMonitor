/**
 * Created by Hieu on 11/15/2015.
 */
AutoForm.hooks({
    createApartmentForm : {
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