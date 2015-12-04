/**
 * Created by Hieu on 11/11/2015.
 */
SoundMonitor.BaseSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Created Timestamp",
        autoValue: function(){
            // https://atmospherejs.com/aldeed/collection2
            if (this.isInsert){
                return new Date;
            } else if (this.isUpsert){
                return {$setOnInsert: new Date}
            } else{
                this.unset();
            }
        }
    },
    createdBy: {
        type: String,
        label: "추가한 사람의 이름 혹은 아이디"
    },
    lastModifiedAt: {
        type: Date,
        label: "Last Modified Timestamp",
        autoValue: function(){
            return new Date();
        }
    },
    lastModifiedBy: {
        type: String,
        label: "수정한 사람의 이름 혹은 아이디",
        autoValue: function(){
            if (this.isInsert){
                return this.field('createdBy').value;
            }
            return this.value;
        }
    },
    isDeleted: {
        type: Boolean,
        label: "Deleted flag",
        defaultValue: false
    }
});