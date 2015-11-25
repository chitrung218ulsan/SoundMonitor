Template.nodeList.helpers({
    settings: function(){
        var fields = [
            SoundMonitor.Functions.getFieldForTable(Node.simpleSchema(),'_id', {hidden: true}),
            SoundMonitor.Functions.getFieldForTable(Node.simpleSchema(),'name'),
            SoundMonitor.Functions.getFieldForTable(Node.simpleSchema(),'nodeNumber'),
			SoundMonitor.Functions.getFieldForTable(Node.simpleSchema(),'hardwareVersion'),
			SoundMonitor.Functions.getFieldForTable(Node.simpleSchema(),'softwareVersion'),
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['node.view'].path({_id:value})+">View</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['node.edit'].path({_id:value})+">Edit</a>");
            }},
            {key: '_id', label: '', fn : function(value, object){
                return new Spacebars.SafeString("<a href="+Router.routes['node.delete'].path({_id:value})+">Delete</a>");
            }}
        ];
        return {
            fields: fields
        };
    }
});