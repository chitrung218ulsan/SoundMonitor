Template.buildingList.helpers({
    settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'_id', {hidden: true}),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'apartmentName'),
            SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'name'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'type'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'representative'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'manager'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'numOfFloors'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'numHousePerFloor'),
			SoundMonitor.Functions.getFieldForTable(Building.simpleSchema(),'remarks'),
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