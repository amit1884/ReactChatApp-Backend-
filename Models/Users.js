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
    pic:{

        type:String,
        default:'http://res.cloudinary.com/webarts/image/upload/v1600350095/unchfgreyapn4uqrcxyi.png'
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
