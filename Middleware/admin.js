
 const jwt = require("jsonwebtoken")
  const {JWT_ADMIN_PASS}=require("../config")

 function adminmiddleware(req,res,next){
     const token= req.headers.token;
     const decode = jwt.verify(token,JWT_ADMIN_PASS)
     if(decode){
         req.userid =decode.id;
         next();
 
     }else{
         res.status(403).json({
             msg:"you have not signed in"
         })
     }
 }
 module.exports={
     adminmiddleware:adminmiddleware
 }