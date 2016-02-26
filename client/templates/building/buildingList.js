Template.buildingList.helpers({
    settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'_id', {hidden: true}),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'apartment.name', {label: "공동주택 명", fn: function(value,obj){
                return value;
            }}),
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'name'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'type'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'representative'),
			
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'totalHomesInBuilding',{label: "세대 수", fn: function(value, obj){
                return value;
            }}),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'warningSoundThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'dangerSoundThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'warningVibThreshold'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'dangerVibThreshold'),
			
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['building.view'].path({_id:value})+">View</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['building.edit'].path({_id:value})+">Edit</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['building.delete'].path({_id:value})+">Delete</a>");
            }}
        ];
        return {
            fields: fields
        };
    }
});