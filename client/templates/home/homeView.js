AutoForm.hooks({
    viewHomeForm: {
        docToForm: function(doc) {
            var realDoc = Home.findOne({_id: doc._id});
            
            doc.buildingId = realDoc.building().name;
			doc.apartmentId = realDoc.building().apartment().name;
			doc.nodeId = realDoc.node().name;
            return doc;
        }
    }
});
Template.homeView.helpers({
    getSchema: function(){
		
		return new SimpleSchema([{
            /*numOfHomes:{
                type: Number,
                label: "세대 수"
            },*/
            apartmentId:{
                type: String,
                label: "공동주택 명"
            },
			buildingId:{
                type: String,
                label: "동 명"
            },
			nodeId: {
				type: String,
				label: "단말기 이름"
			},
        },Home.simpleSchema()]);
		
      
    }
});