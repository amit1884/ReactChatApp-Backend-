var mongoose=require('mongoose');
var RoomSchema=new mongoose.Schema({
    user1:{ 
        type:String,
        unique:true,
        required:true
    },
    user2:{
        type:String,
        required:true
    },
    room:{
        type:String
    }
});

module.exports=mongoose.model('Rooms',RoomSchema);
