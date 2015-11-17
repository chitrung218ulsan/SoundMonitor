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
        Meteor.setTimeout(function(){
            Template.soundAlert.theInstance.hide();
        },3000);
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
        Template.instance().hide();
    }
});

Template.pageTitle.helpers({
    actions: function(){
        var currentRoute = Router.current();
        var links = currentRoute.route.options.pageActionLinks && currentRoute.route.options.pageActionLinks();
        return _.map(links,function(li){
            var routeName = $.isFunction(li.routeName)? li.routeName() : li.routeName;
            var routeData = $.isFunction(li.routeData)? li.routeData() : li.routeData;
            var query = $.isFunction(li.query)? li.query() : li.query;
            var actionTitle = $.isFunction(li.actionTitle)? li.actionTitle() : li.actionTitle;
            return {
                link: new Spacebars.SafeString("<a class='btn btn-primary' role='button' href="+Router.routes[routeName].path(routeData, query)+">" + actionTitle + "</a>")
            };
        });
    }
});