const express = require("express");
const {UserModel} = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRegRoute = express.Router();

UserRegRoute.post("/register",async(req,res)=>{
    const user = req.body;
    try {
        let findUser = await UserModel.find({email:user.email});
        if(findUser.length===0){
            bcrypt.hash(user.password,4,async(err,hashpass)=>{
                if(err){
                    res.send({message : "Error while registring User", error : err})
                }
                let new_user = new UserModel({...user,password:hashpass})
                await new_user.save();
                findUser = await UserModel.find({email:user.email});
                const token = jwt.sign({userId : findUser[0]._id},"this_social_media_app");
                res.status(201).send({message : "User Registred Successfully", token});
            })
        }
        else{
            res.send({message : "User Already Exist"})
        }
    } catch (error) {
        res.send({message : "Error while registring User", error : error.message})
    }
})

module.exports = { 
   UserRegRoute
}