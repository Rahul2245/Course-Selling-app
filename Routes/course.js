
const {Router}=require("express");
const coursesrouter=Router();
const {usermiddleware}=require("../Middleware/user");
const {purchasemodel, coursemodel}=require("../db")

    coursesrouter.get("/preview",async function(req,res){
        const courses=await coursemodel.find({})
        res.json({
            courses,
            msg:"these are all courses available"
        })

})
coursesrouter.post("/purchases",usermiddleware,async function(req,res){
    const userid=req.userid
    const courseid=req.body.courseid
    await purchasemodel.create({
        userid:userid,
        courseid:courseid


    })

    res.json({
            msg:"you have sucesfully bought a course"
        })
        

})




module.exports={
    coursesrouter:coursesrouter
}
