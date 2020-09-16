const express=require('express');
const router=express.Router();
const {JWT_SECRET}=require('../config/keys')
const FuzzySearch=require('fuzzy-search')
const jwt =require('jsonwebtoken');
const User=require('../Models/Users')
const crypto=require('crypto')
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

    console.log('got id',req.body.friendId)

    crypto.randomBytes(32,(err,buffer)=>{

        if(err)
        {
            console.log(err)
        }
        else{
            const room=buffer.toString("hex")
            User.findByIdAndUpdate(req.body.friendId,{
                $push:{friendList:{users:req.user._id,room:room}}
            },{
                new:true
            },(err,result)=>{
                if(err){
                    console.log(err)
                    return res.status(422).json({error:err})
                }
        
                User.findByIdAndUpdate(req.user._id,{
                    $push:{friendList:{users:req.body.friendId,room:room}}
                },{
                    new:true
                })
                .select("-password")
                .then(result=>{
                    console.log(result)
                    res.json(result)
                })
                .catch(err=>{
                    return res.status(422).json({error:err})
                })
            }
            )
        }
    })
})


router.get('/getfriends',requireLogin,(req,res)=>{

    User.findById(req.user._id)
    .populate("friendList.users","_id username email")
    .select("-password")
    .then(users=>{
        res.json(users)
    })
    .catch(err=>console.log(err))
})


router.get('/userprofile/:id',requireLogin,(req,res)=>{

    const userid=req.params.id;
    console.log(userid)
    User.findById(userid)
    .then(result=>{
        console.log(result)
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/friendprofile/:id',requireLogin,(req,res)=>{

    const userid=req.params.id;

    User.findById(userid)
    .then(result=>{
        // console.log(result)
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router;