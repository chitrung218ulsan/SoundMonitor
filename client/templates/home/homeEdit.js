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
  buildingNameOptions: function () {
    return Building.find().map(function (c) {
      return {label: c.name, value: c.name};
    });
  }
});
Template.homeEdit.helpers({
  buildingIdOptions: function () {
    return Building.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  }
});
Template.homeEdit.helpers({
  apartmentNameOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c.name};
    });
  }
});
Template.homeEdit.helpers({
  aparmentIdOptions: function () {
    return Apartment.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  }
});