
Session.setDefault('apartmentsLoaded',false);
Session.setDefault('buildingsLoaded',false);
Session.setDefault('homesLoaded',false);
Session.setDefault('nodesLoaded',false);
Session.setDefault('modifyApartObject',undefined)

Meteor.subscribe('All-Apartment',function(){
	Session.set('apartmentsLoaded',true);
});
Meteor.subscribe('All-Building',function(){
	Session.set('buildingsLoaded',true);
});
Meteor.subscribe('All-Home',function(){
	Session.set('homesLoaded',true);
});
Meteor.subscribe('All-Node',function(){
	Session.set('nodesLoaded',true);
});