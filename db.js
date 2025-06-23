const { ObjectId } = require("bson");
const {Schema, default: mongoose}=require("mongoose");
console.log("connec")

const userschema = new Schema({
    email:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String,

})
const adminschema =new  Schema({
     email:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String,

    
})
const coursechema = new Schema({
    title: String,
    description:String,
    price:Number,
    imageurl:String,
    creatorid:ObjectId
    
})
const purchaseschema = new Schema({
    userid:ObjectId,
    courseid:ObjectId
    
})
const usermodel =mongoose.model("users",userschema);
const adminmodel = mongoose.model("admins",adminschema);
const coursemodel = mongoose.model("courses",coursechema);
const purchasemodel=mongoose.model("purchases",purchaseschema);

module.exports={
    usermodel,
    coursemodel,
    adminmodel,
    purchasemodel
}