/**
 * Created by Hieu on 11/13/2015.
 */
UI.registerHelper('title', function(routeName){
    var title = "";
    if(routeName){
        var theR = Router.routes[routeName];
        title = theR.options.title || routeName;
    } else {
        var currentRoute = Router.current();
        title = currentRoute.route.options.title || currentRoute.route.getName();
    }
    return title;
});

Tracker.autorun(function(){
    var userId = Meteor.userId();
    if (!userId && Template.soundAlert.theInstance){
        Template.soundAlert.theInstance.setMessage(SoundMonitor.Constants.ALERT_TYPE.success, "You have signed out successfully!");
    }
});