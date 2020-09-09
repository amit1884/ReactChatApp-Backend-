var mongoose=require('mongoose');
var MessagesSchema=new mongoose.Schema({
    sender:{ 
        type:String,
        unique:true,
        required:true
    },
    reciever:{
        type:String,
        required:true
    },
    text:{
        type:String
    }
});

module.exports=mongoose.model('Messages',MessagesSchema);
