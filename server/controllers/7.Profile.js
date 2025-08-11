

// TODO -HW - HOW CAN WE SCHEDULE A DELETING OF AN ACCOUNT AFTER "N" DAYS

const Profile=require("../models/Profile");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/2.imageUploader");
const Course=require("../models/Course");
const CourseProgress = require("../models/CourseProgress");

require("dotenv").config();

// since profile already create hui padi hai, jab user create ho raha tha tabhi, ab bas us profile ko update krna hai


exports.updateProfile=async(req,res)=>{

      try{
         
        // ab yaha se user ki "id" kaha se laayenge ? - answer - agaruser loggedin hai to auth middleware ke andar "decode" naam ka object jismei "id" present hai usko humne "request" ke andar add kr diya tha vaha se le lenge
                    
          // a) get data from req body
          const {dateOfBirth="",about="",contactNumber,gender } =req.body;
          // b) get userid 
          const id=req.user.id;   // user.id humei "auth" middleware se mil jayegi

          // c) validation
           if(!contactNumber || !gender || !id)
               {
                     return res.status(400).json({
                        success:false,
                        message:"All Feilds Are Required",
                      
                    })
               }

          // d) get profile
           const userDetails = await User.findById(id);   // from this we got userId
             // ab hum iss userId se iss user ke andar se "profile" model ke andar se "additionalDetails" mei jo "profileId" padi hui hai usko bhi fetch kr lenge
           const profileId=userDetails.additionalDetails;
           const profileDetails=await Profile.findById(profileId);
                
          // e) update profile  -  
           profileDetails.dateOfBirth=dateOfBirth;
            profileDetails.gender=gender;
           profileDetails.contactNumber=contactNumber;
            // ab iss "profileDetails" object ko hum DB mei save save karenge by using "save" method
           await profileDetails.save();

            // f) return response
                return res.status(200).json({
                   success:true,
                   message:"Profile Updated Successfully",
                   profileDetails,
              })

      }                  
 
      catch(error)
         {
            console.log(error);
                 return res.status(400).json({
                   success:false,
                   message:"Problem While Updating a Profile",
                   error:error.message,
              })
         }
}


// 2) HANDLER FUNCTION FOR DELETE ACCOUNT

exports.deleteAccount=async(req,res)=>{
     
      try{
         
            // a) fetch accounts id  from req body
                 
               const id=req.user.id;

            // b) validation of valid id
               const userDetails=await User.findById(id);
                
               if(!userDetails)
               {
                     return res.status(400).json({
                        success:false,
                        message:"User Not Found",
                      
                    })
               }

            // c) pehele iss user ki profile(additional details) delete krdo
               await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
                
            //d) user delete krdo
            await User.findByIdAndDelete({_id:id});
            //TODO : HW - unenroll user from all enrolled courses

            //c) response 
              return res.status(200).json({
                   success:true,
                   message:"User Deleted Successfully",
                   
              })
             
      }

      catch(error)
        {
              console.log(error);
                 return res.status(400).json({
                   success:false,
                   message:"Problem While deleting a User",
                   error:error.message,
              })
        }
}

exports.getAllUserDetails=async(req,res)=>{

     try{
         
         // a) get the user "id"

          const id=req.user.id;


          //b) validation 
           const userDetails=await User.findById(id).populate("additionalDetails").exec();

         // c) "DB" call se saari ki saari user details lo aao
           
         //d) un userDetails ko dikhao
          return res.status(200).json({
              success:true,
              message:"User Details fetched successfully",
              userDetails,
          })
     }

     catch(error)
       {
            console.log(error);
                 return res.status(400).json({
                   success:false,
                   message:"Problem While fetching details of  User",
                   error:error.message,
              })
       }
}



// 4) UPDATE DISPLAY PROFILE PICTURE
exports.updateDisplayPicture=async(req,res)=>
 {      
       try
       
        {
          
          // a) get email from auth since it is loggedin
               const userId=req.user.id;

        //b)get the new image file
         const displayPicture=req.files.displayPicture;

        //c) upload it to cloudinary
        const image =await uploadImageToCloudinary(
                             displayPicture,
                             process.env.FOLDER_NAME,
                             1000,
                             1000
        )

        //d)save its link to db
          const response=await User.findOneAndUpdate(
                                  {_id:userId },
                                  {image:image.secure_url},
                                  {new:true}
                          )

        // e) send successful response
          return res.status(200).json({
                 success:true,
                 message:"Image Updated Successfully",
                 response
          })
     }

     catch(error)
       {
           console.log(error);
           return res.status(401).json({
                 success:false,
                 message:"Problem While Updating The Profile Picture"
           })
       }
 }


// 5) GET ALL ENROLLED COURSES OF THAT USER
exports.getEnrolledCourses = async (req, res) => {

  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

      // was facing issue untill i dont put up this if bracket 
      if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();
    
    var SubsectionLength = 0

    for (var i = 0; i < userDetails.courses.length; i++) {
      
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j]
        .subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// 6) INSTRUCTOR DASHBOARD
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
