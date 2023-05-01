const jwt = require("jsonwebtoken");

const AuthMiddleware = (req,res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token,"this_social_media_app",(err,decod)=>{
        if(err){
            res.send({message : "Please login first", error : err});
        }
        else{
            req.body.userId = decod.userId;
            next();
        }
    })
}

module.exports = {
    AuthMiddleware
}

// "644fcddc3e09b022bba76869",
    //   "644fcdc3da8fd3e8fe6bf925"
