
const {Router}=require("express");
const adminrouter=Router();
const {adminmodel}=require("../db")
const jwt = require("jsonwebtoken");  
const {JWT_ADMIN_PASS}=require("../config")
const {coursemodel}=require("../db")
const {adminmiddleware}=require("../Middleware/admin")
const bcrypt= new require("bcrypt");
const {z}=require("zod")

adminrouter.post("/signup",async function(req,res){
     const requiredbody = z.object({
            email:z.string().email(),
            password:z.string().min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number"),
        })
        const parseddatasucces =requiredbody.safeParse(req.body);
        if(!parseddatasucces.success){
            res.json({
                msg:"incorrect format"
            })
            return
        }
    const {email,password,firstname,lastname}=req.body;
    let errorthrown=false;
    try{
        const hashedpassword = await bcrypt.hash(password,4);
        console.log(hashedpassword);
        await adminmodel.create({
            email:email,
            password:hashedpassword,
            firstname:firstname,
            lastname:lastname

        })
       
    }catch(e){
        res.json({
            msg:"admin already exists"
        })
        errorthrown=true;
    }
       

if(!errorthrown){
   res.json({
      
            msg:"signup succeeded"
        })}
}) 

adminrouter.post("/signin",async function(req,res){
    const {email,password}=req.body;

    const admin=await adminmodel.findOne({
        email:email,
        
    })
    if(!admin){
        res.json({
            msg:"user does not exists in our database"
        })
        return;
    }
    const passwordmatch =await bcrypt.compare(password,admin.password)
    if(passwordmatch){
       const token =jwt.sign({
        id:admin._id

        },JWT_ADMIN_PASS)
        res.json({
           token:token
        })


    }else{
        res.status(403).json({
            msg:"incorrect credentials "
        })
    }
})
adminrouter.post("/course",adminmiddleware,async function(req,res){
    const adminId=req.userid;

    const {title,description,imageurl,price}=req.body;
    const course =await coursemodel.create({
        title:title,
        description:description,
        imageurl:imageurl,
        price:price,
        creatorid:adminId

    })
    res.json({
        msg:"Course created",
        courseid:course._id
    })
})
adminrouter.put("/course",adminmiddleware,async function(req,res){

     const adminId=req.userid;

    const {title,description,imageurl,price,courseid}=req.body;
    const course =await coursemodel.updateOne({
        _id:courseid,
        creatorid:adminId

    },{
        title:title,
        description:description,
        imageurl:imageurl,
        price:price,
      

    })
    res.json({
        msg:"updated courses sucessfully",
        courseid:course._id
    })
})
adminrouter.get("/course/bulk",async function(req,res){
     const adminId=req.userid;
     const courses =await coursemodel.find({
        creatorid:adminId
        
     })


    res.json({
        msg:"found succesfully",
        courses
    })
})
module.exports={
    adminrouter:adminrouter
}