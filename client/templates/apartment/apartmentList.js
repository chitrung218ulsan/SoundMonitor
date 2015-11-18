/**
 * Created by Hieu on 11/15/2015.
 */
Template.apartmentList.helpers({
    settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Apartment.simpleSchema(),'_id', {hidden: true}),
            SoundMonitor.Functions.getFieldForTable(Apartment.simpleSchema(),'name'),
            SoundMonitor.Functions.getFieldForTable(Apartment.simpleSchema(),'address'),
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['apartment.view'].path({_id:value})+">View</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['apartment.edit'].path({_id:value})+">Edit</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['apartment.delete'].path({_id:value})+">Delete</a>");
            }}
        ];
        return {
            fields: fields
        };
    }
});