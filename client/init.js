
SoundMonitor.Client.apartmentsLoaded = new ReactiveVar(false);
SoundMonitor.Client.buildingsLoaded = new ReactiveVar(false);
SoundMonitor.Client.homesLoaded = new ReactiveVar(false);
SoundMonitor.Client.nodesLoaded = new ReactiveVar(false);

Meteor.subscribe(SoundMonitor.Constants.APARTMENT_SOURCE,function(){
	SoundMonitor.Client.apartmentsLoaded.set(true);
});
Meteor.subscribe(SoundMonitor.Constants.BUILDING_SOURCE,function(){
	SoundMonitor.Client.buildingsLoaded.set(true);
});
Meteor.subscribe(SoundMonitor.Constants.HOME_SOURCE,function(){
	SoundMonitor.Client.homesLoaded.set(true);
});
Meteor.subscribe(SoundMonitor.Constants.NODE_SOURCE,function(){
	SoundMonitor.Client.nodesLoaded.set(true);
});