/**
 * Created by Hieu on 11/13/2015.
 */

// GLOBAL TEMPLATE HELPERS
// https://github.com/monbro/meteor-breadcrumb-plugin/blob/master/examples/advanced/meteor.js
Template.navigation.helpers({
    isActiveRoute : function(routeName){
        var currentRoute = Router.current();
        return currentRoute && routeName === currentRoute.route.getName() ? 'active' : '';
    }
});
Template.soundAlert.theInstance = null;
Template.soundAlert.onCreated(function(){
    this.type = new ReactiveVar(SoundMonitor.Constants.ALERT_TYPE.info);
    this.message = new ReactiveVar(SoundMonitor.Constants.ALERT_TYPE.info.defaultMes);
    this.status = new ReactiveVar("none");
    this.previousRoute = "";
    this.currentRoute = "";
    this.setMessage = function(type, mes){
        this.type.set(type);
        this.message.set(mes || type.defaultMes);
        this.show();
    };
    this.hide = function(){
        this.status.set("none");
    };
    this.show = function(){
        this.status.set("");
    };
    Template.soundAlert.theInstance = this;
});
Template.soundAlert.helpers({
    status : function(){
        return Template.instance().status.get();
    },
    messageType : function(){
        return Template.instance().type.get().class;
    },
    catchWord : function(){
        return Template.instance().type.get().notification;
    },
    message : function(){
        return Template.instance().message.get();
    }
});
Template.soundAlert.events({
    'click .close' : function(event){
        Template.instance().status.set("none");
    }
});