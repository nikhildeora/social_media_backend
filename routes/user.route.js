const express = require("express");
const {UserModel} = require("../models/user.model");
const UserRoute = express.Router();

UserRoute.get("/", async (req,res)=>{
    try {
        let allUsers = await UserModel.find();
        res.status(200).send(allUsers);
    } catch (error) {
        res.send({message : "Error while getting User", error : error.message})
    }
})

UserRoute.get("/:id/friends", async(req,res)=> {
    let ID = req.params.id;
    try {
        let findFreinds = await UserModel.find({_id:ID}).populate("friends");
        // .populate(["friends","friendRequests"])
           if(findFreinds[0].friends.length===0){
                   res.status(200).send("Freinds list is Empty")
               }else{
                res.status(200).send(findFreinds[0].friends);
                   }
                
            } catch (error) {
                res.send({message : "Error while getting freinds list", error : error.message})
                
            }
 })
        
        // let findFreinds = await UserModel.find({_id:ID}).populate("friendRequests");
UserRoute.post("/:id/friends", async(req,res)=>{
    const ID = req.params.id;
    let {userId} = req.body;
    
    try {
        let payload = await UserModel.find({_id:ID});
        payload = payload[0];
        payload.friendRequests = [...payload.friendRequests,userId];
        await UserModel.findByIdAndUpdate(ID,payload);
        res.status(201).send("Friend request send successfully");
    } catch (error) {
        res.send({message : "Error while sending freind request", error : error.message})
        
    }
})

UserRoute.patch("/:id/friends/:friendId", async (req,res) => {
    const ID = req.params.id;
    const freindId = req.params.friendId;
    
    try {
        let findUser = await UserModel.find({_id:ID});
        findUser = findUser[0];
        let filtAllReq = findUser.friendRequests.filter((el)=>{
            return el.toString() === freindId;
        })
        
        if(filtAllReq.length>0){
            let filtReq = findUser.friendRequests.filter((el)=>{
                return el.toString() !== freindId;
            })
            findUser.friendRequests = filtReq;
            findUser.friends = [...findUser.friends,freindId];
            await findUser.save();
            res.status(204).send("Freind Request Accepted");
        }
        else{
            res.send("This freind is not in the list");
        }
        
    } catch (error) {
        res.send({message : "Error while accepting freind request", error : error.message})
    }
})

module.exports = {
    UserRoute
}