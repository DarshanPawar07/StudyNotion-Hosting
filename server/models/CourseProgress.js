
const mongoose=require("mongoose");

const courseProgress=new mongoose.Schema({
        

    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },

    userId:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "User",
    }, 

    completedVideos:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"SubSection"
         // ek ek video ko hum ek subsection bolenge
        }
   ]
})

module.exports=mongoose.model("CourseProgress",courseProgress);