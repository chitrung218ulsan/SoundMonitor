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
        return this.status.get();
    },
    messageType : function(){
        return this.type.get().class;
    },
    catchWord : function(){
        return this.type.get().notification;
    },
    message : function(){
        return this.message.get();
    }
});
Template.soundAlert.events({
    'click .close' : function(event){
        this.status.set("none");
    }
});