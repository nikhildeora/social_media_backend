const express = require("express");
const PostRoute = express.Router();
const { PostModel } = require("../models/post.model")
const mongoose = require("mongoose");
const ToId = mongoose.Types.ObjectId;

PostRoute.get("/", async (req, res) => {
    try {
        let findPost = await PostModel.find().populate(["user", "likes", "comments.user"]);
        res.status(200).send(findPost);
    } catch (error) {
        res.send({ message: "Error occured while getting posts", error })
    }
})

PostRoute.post("/", async (req, res) => {
    const post = req.body;
    const { userId: user } = req.body;
    post.user = new ToId(user);
    delete post.userId;

    try {
        let newPost = new PostModel(post);
        await newPost.save();
        res.status(201).send("Post created successfully");
    } catch (error) {
        res.send({ message: "Error occured while posting post", error })
    }
})

PostRoute.patch("/:id", async (req, res) => {
    const Id = req.params.id;
    const payload = req.body;
    try {
        await PostModel.findByIdAndUpdate(Id, payload);
        res.status(204).send("post update successfully");
    } catch (error) {
        res.send({ message: "Error occured while updating post", error })
    }
})

PostRoute.delete("/:id", async (req, res) => {
    const Id = req.params.id;
    try {
        await PostModel.findByIdAndDelete(Id);
        res.status(202).send("Post deleted successfully");
    } catch (error) {
        res.send({ message: "Error occured while deleting post", error })
    }
})

PostRoute.post("/:id/like", async (req, res) => {
    const Id = req.params.id;
    let { userId } = req.body;
    userId = new ToId(userId);
    try {
        let findPost = await PostModel.find({ _id: Id });
        findPost = findPost[0];
        let filt = findPost.likes.filter((el) => {
            return userId.toString() === el.toString()
        })
        if (filt.length > 0) {
            res.send("Already you liked that post");
        } else {
            findPost.likes = [...findPost.likes, userId];
            await findPost.save();
            res.status(201).send({ message: "post liked successfully", findPost });
        }

    } catch (error) {
        res.send({ message: "Error occured while liking post", error })
    }
})


PostRoute.post("/:id/comment", async (req, res) => {
    const Id = req.params.id;
    let comment = req.body;
    let { userId } = req.body;
    comment.user = new ToId(userId);
    
    try {
        let findPost = await PostModel.find({ _id: Id });
        findPost = findPost[0];
        findPost.comments = [...findPost.comments, comment];
        await findPost.save();
        res.status(201).send({ message: "comment posted successfully", findPost });
    } catch (error) {
        res.send({ message: "Error occured while commenting on post", error })
    }
})

PostRoute.get("/:id", async (req, res) => {
    const Id = req.params.id;
    try {
        const findPost = await PostModel.find({ _id: Id }).populate(["user", "likes", "comments.user"]);
        res.status(200).send(findPost);
    } catch (error) {
        res.send({ message: "Error occured while getting post", error })
    }
})

module.exports = {
    PostRoute
}