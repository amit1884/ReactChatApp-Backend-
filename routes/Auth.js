const express=require('express');
const router=express.Router();
const {JWT_SECRET}=require('../config/keys')
// const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const crypto=require('crypto')
const jwt =require('jsonwebtoken');
const User=require('../Models/Users')

router.post('/signup',(req,res)=>{

    const{username,email,password}=req.body;

    if(!email||!password||!username)
    {
       return res.status(422).json({
            error:"Please fill al the fields"
        })
    }

    User.findOne({username:username})
    .then(result=>{
        if(result)
        {
            console.log(result)
            return res.status(422).json({
                error:"Username Taken"
            })
        }
        else{

            User.findOne({email:email})
            .then(savedUser=>{
                
                if(savedUser){
                    return res.json({message:"Already Exist"});
                }
                bcrypt.hash(password,12)
                .then(hashedpassword=>{
        
                    const user=new User({
                        email,
                        password:hashedpassword,
                        username,
                    })
                    user.save()
                    .then(user=>{
                        res.json({message:"Successfully saved"})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
    .catch(err=>console.log(err))
})

router.post("/signin",(req,res)=>{

    const{email,password}=req.body;

    if(!email||!password){
        return res.status(422).json({error:"Please fill all the  fields are required"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){

                // res.json({message:"Successfull Logged In !!!!!!!"});
                const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,username,email,friendList,pic}=savedUser
                res.json({token,user:{_id,username,email,friendList,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})





module.exports=router;