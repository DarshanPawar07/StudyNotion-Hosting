
const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
        
    
    courseName:{
        type: String,
    },
    courseDescription:{
        type: String,
    },

    price:{
        type: Number,
    },
    tag: {
        type: [String],
        require: true,
    },
    whatYouWillLearn:{
        type:String,
    },
      category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
     status:{
        type: String,
        enum: ["Draft", "Published"],
    },
      instructions: {
        type: [String],
    },
   
      thumbnailImage:{
        type:String,
    },
    

    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
   
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],
    
  
  
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User",
        }
    ],
  
	createdAt: {
		type:Date,
		default:Date.now
	},
   })

module.exports=mongoose.model("Course",courseSchema);