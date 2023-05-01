const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: Date
    }]
},{
    versionKey : false
})

const PostModel = mongoose.model("Post",PostSchema);

module.exports = {
    PostModel
}