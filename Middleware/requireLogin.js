const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys.js')
const mongoose=require('mongoose')
const User=require('../Models/Users')
module.exports=(req,res,next)=>{
    const {authorization}=req.headers

    if(!authorization){
       return res.status(401).json({error:"Not Authorised"})
    }

    const token = authorization.replace("Bearer ","");

    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err)
        {
            return res.status(401).json({error:"You must logged in"})
        }
        const {_id}=payload;

        User.findById(_id).then(userData=>{
            req.user=userData;
            next();
        })
    })
}