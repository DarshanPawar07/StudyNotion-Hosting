
const mongoose=require("mongoose");

const contactUs= new mongoose.Schema({

     firstName:{
        type:String,
        required:true,
     },

     lastName:{
           type:String,
           required:true,
     } ,

     userEmail:{
           type:String,
           required:true,
     },

     contactNumber:{
          type:Number,
          required:true,
     },

     message:{
         type:String,
     }
})

module.exports=mongoose.model("ContactUs",contactUs);