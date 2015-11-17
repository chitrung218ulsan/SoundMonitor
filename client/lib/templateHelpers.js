/**
 * Created by Hieu on 11/13/2015.
 */
UI.registerHelper('titlePage', function(routeName){
    var routeObj = (routeName)? Router.routes[routeName] : Router.current().route;
    return $.isFunction(routeObj.options.title)? routeObj.options.title() : routeObj.options.title;
});
UI.registerHelper('theInstance', function(){
    var theCol = SoundMonitor.Functions.getCollection(Router.current().route.getName());
    var id = Router.current().params._id;
    return theCol.findOne({_id: id});
});

Tracker.autorun(function(){
    var userId = Meteor.userId();
    if (!userId && Template.soundAlert.theInstance){
        Template.soundAlert.theInstance.setMessage(SoundMonitor.Constants.ALERT_TYPE.success, "You have signed out successfully!");
    }
});

Tracker.autorun(function(){
    var currentR = Router.current();
    Template.soundAlert.previousRoute = Template.soundAlert.currentRoute;
    Template.soundAlert.currentRoute = (currentR && currentR.url) || "";
    //Template.soundAlert.theInstance && Template.soundAlert.theInstance.hide();
});