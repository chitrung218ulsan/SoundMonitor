/**
 * Created by Hieu on 11/11/2015.
 */
SoundMonitor = {};
SoundMonitor.Client = {}; // Should be available only on client side
SoundMonitor.Server = {}; // Should be available only on server side
SoundMonitor.Constants = {
    APARTMENT_SOURCE : 'All-Apartment',
    BUILDING_SOURCE : 'All-Building',
    HOME_SOURCE : 'All-Home',
    NODE_SOURCE : 'All-Node',
    DATA_SOURCE : 'All-Data',
    ALERT_TYPE : {
        success : { class : 'alert-success', notification : 'Success!', defaultMes : 'Success.'},
        warning : { class : 'alert-warning', notification : 'Warning!', defaultMes : 'Warning.'},
        info : { class : 'alert-info', notification : 'Info!', defaultMes : 'Info.'},
        error : { class : 'alert-danger', notification : 'Error!', defaultMes : 'Error.'}
    }
};
SoundMonitor.Functions = {
    getFieldForTable: function(schemaInstance, fieldName, extra){
        var obj = {key: fieldName, label: fieldName};
        var label = schemaInstance.label(fieldName);
        obj.label = label || obj.label;
        if(extra)
            obj = _.extend(obj, extra);
        return obj;
    },
    getCollection : function(routeName){
        var col = routeName.indexOf('apartment') >= 0 ? Apartment
            : routeName.indexOf('building') >= 0 ? Building
            : routeName.indexOf('home') >= 0 ? Home
            : routeName.indexOf('node') >= 0 ? Node
            : undefined;
        return col;
    },
    generateDeleteEventHandlers : function(){
        return {
            'click .delete-confirm' : function () {
                var apId = Router.current().params._id;
                var col = SoundMonitor.Functions.getCollection(Router.current().route.getName());
                var entityType = Router.current().route.options.entityType;
                col.update(apId, {$set: {isDeleted: true}}, function (error, result) {
                    if (error || result == 0) {
                        Template.soundAlert.theInstance.setMessage(
                            SoundMonitor.Constants.ALERT_TYPE.error,
                            "Cannot delete this " + entityType + "."
                        );
                    } else {
                        Template.soundAlert.theInstance.setMessage(
                            SoundMonitor.Constants.ALERT_TYPE.success,
                            "The " + entityType + " has been deleted successfully."
                        );
                        Router.go(entityType);
                    }
                });
            }
            ,
            'click .delete-deny' : function () {
                var url = Template.soundAlert.previousRoute ||
                    Router.routes[Router.current().route.options.parent].path({_id: Router.current().params._id});
                Router.go(url);
            }
        }
    },
    createLinkObject: function(route, data, query, actionTitle){
        return {
            routeName: route,
            routeData: data,
            query: query,
            actionTitle: actionTitle
        };
    }
};