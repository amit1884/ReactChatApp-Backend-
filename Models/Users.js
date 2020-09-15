var mongoose=require('mongoose');
const {ObjectId} =mongoose.Schema.Types
var UserSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{ 
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    friendList:[{
        users:{
            type:ObjectId,
            ref:'Users'
        },
        room:{
            type:String,
            default:'CommonRoom'
        }
    }]

});

module.exports=mongoose.model('Users',UserSchema);
