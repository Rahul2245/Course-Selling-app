const express = require("express");
const mongoose=require("mongoose");

const bcrypt= new require("bcrypt");
const {z}=require("zod")
const { userrouter}= require("./Routes/user");
const { coursesrouter}= require("./Routes/course");
const {adminrouter}=require("./Routes/admin");






const app =express();
app.use(express.json());
app.use("/api/user",userrouter);
app.use("/api/course",coursesrouter);

app.use("/api/admin",adminrouter);

async function main(){
    await mongoose.connect("mongodb+srv://Rahul_2245:Rahul%40123@cluster0.cuy85la.mongodb.net/CourseWorld")
    app.listen(3000);
}
main()


 
