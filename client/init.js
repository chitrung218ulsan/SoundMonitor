SoundMonitor.Client.apartmentSubscription = Meteor.subscribe(SoundMonitor.Constants.APARTMENT_SOURCE);
SoundMonitor.Client.builingSubscription = Meteor.subscribe(SoundMonitor.Constants.BUILDING_SOURCE);
SoundMonitor.Client.homeSubscription = Meteor.subscribe(SoundMonitor.Constants.HOME_SOURCE);
SoundMonitor.Client.nodeSubscription = Meteor.subscribe(SoundMonitor.Constants.NODE_SOURCE);
AutoForm.hooks({
    viewApartmentForm : {
        docToForm: function(doc) {
            var realDoc = Apartment.findOne({_id: doc._id});
            doc.numOfBuildings = realDoc.numOfBuildings();
            doc.numOfHomes = realDoc.numOfHomes();
            return doc;
        }
    },
    viewBuildingForm: {
        docToForm: function(doc) {
            var realDoc = Building.findOne({_id: doc._id});
            doc.numOfHomes = realDoc.numOfHomes();
            doc.apartmentName = realDoc.apartment().name;
            return doc;
        }
    }
});