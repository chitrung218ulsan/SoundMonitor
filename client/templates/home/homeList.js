Template.homeList.helpers({
    settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'_id', {hidden: true}),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'building.apartment.name',{label: "공동주택 명", fn: function(value,obj){
                return value;
            }}),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'building.name', {label: "동 명", fn: function(value, obj){
                return value;
            }}),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'floor'),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'homeNumber'),
            SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'name'),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'telNumber'),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'homeSize'),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'node.name', {label: "단말기 이름", fn: function(value, obj){
                return value;
            }}),
			SoundMonitor.Functions.getFieldForTable(Home.simpleSchema(),'remarks'),
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['home.view'].path({_id:value})+">View</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['home.edit'].path({_id:value})+">Edit</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['home.delete'].path({_id:value})+">Delete</a>");
            }}
        ];
        return {
            fields: fields
        };
    }
});