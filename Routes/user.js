
const {Router}=require("express");
const { usermodel, purchasemodel, coursemodel } = require("../db");
const userrouter=Router();
const jwt = require("jsonwebtoken");  
const {JWT_USER_PASS}=require("../config")
const {usermiddleware}=require("../Middleware/user");
const bcrypt= new require("bcrypt");
const {z}=require("zod")


    userrouter.post("/signup",async function(req,res){
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
        await usermodel.create({
            email:email,
            password:hashedpassword,
            firstname:firstname,
            lastname:lastname

        })
       
    }catch(e){
        res.json({
            msg:"user already exists"
        })
        errorthrown=true;
    }
       

if(!errorthrown){
   res.json({
      
            msg:"signup succeeded"
        })}
}) 
userrouter.post("/signin",async function(req,res){
    const {email,password}=req.body;

    const user=await usermodel.findOne({
        email:email,
        
    })
    if(!user){
        res.json({
            msg:"user does not exists in our database"
        })
        return;
    }
    const passwordmatch =await bcrypt.compare(password,user.password)
    if(passwordmatch){
       const token =jwt.sign({
        id:user._id

        },JWT_USER_PASS)
        res.json({
           token:token
        })


    }else{
        res.status(403).json({
            msg:"incorrect credentials "
        })
    }
})
userrouter.get("/purchases",usermiddleware,async function(req,res){
    const userid=req.userid
    const purchases= await purchasemodel.find({
        userid:userid
    })
    let courseidss=[]
    for(let i=0;i<purchases.length;i++){
        courseidss.push(purchases[i].courseid)


    }
    const coursedata=await coursemodel.findOne({
    //   _id:{$in:purchases.map(x=>x.courseid)}
     _id:{$in:courseidss}
    })


    res.json({
           purchases,
           coursedata
        })

})


module.exports={
    userrouter:userrouter
}
