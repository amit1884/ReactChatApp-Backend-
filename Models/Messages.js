var mongoose=require('mongoose');
var MessagesSchema=new mongoose.Schema({
  room:{
      type:String
  },
  sender:{
    type:String
  },
  text:{
      type:String
  }
});

module.exports=mongoose.model('Messages',MessagesSchema);
