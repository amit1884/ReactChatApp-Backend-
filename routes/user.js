const express=require('express');
const router=express.Router();
const {JWT_SECRET}=require('../config/keys')
const FuzzySearch=require('fuzzy-search')
const jwt =require('jsonwebtoken');
const User=require('../Models/Users')

const requireLogin=require('../Middleware/requireLogin')


router.post('/search_user',(req,res)=>{

    var text=req.body.query;
    if(text!=='')
    {
    User.find({})
    .select("_id username email")
    .then(founduser=>{
        const searcher = new FuzzySearch(founduser, ['username','email'], {
            caseSensitive: false,
        })
        const user=searcher.search(text)
        res.json({user})
    })
    .catch(err=>console.log(err))
    }
    
})


router.post('/addfriend',requireLogin,(req,res)=>{

    User.findByIdAndUpdate(req.body.friendId,{
        $push:{friendList:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $push:{friendList:req.body.friendId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )

})


router.get('/getfriends',requireLogin,(req,res)=>{

    User.findById(req.user._id)
    .populate("friendList","_id username email")
    .then(users=>{
        res.json({users})
    })
    .catch(err=>console.log(err))
})

module.exports=router;