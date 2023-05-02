const express = require("express");
const {connection} = require("./main");
const {UserRoute} = require("./routes/user.route")
const {UserRegRoute} = require("./routes/userreg.route")
const {PostRoute} = require("./routes/post.route")
const {AuthMiddleware} = require("./middleware/auth.middleware")
const app = express();

app.use(express.json());
app.use("/api",UserRegRoute);
app.use(AuthMiddleware);
app.use("/api/users",UserRoute);
app.use("/api/posts",PostRoute);

app.listen(8080,async ()=>{
    try {
        await connection;
        console.log("Database connected");
        console.log("server is running on port 8080");
    } catch (error) {
        console.log("Error occured");
    }
})
