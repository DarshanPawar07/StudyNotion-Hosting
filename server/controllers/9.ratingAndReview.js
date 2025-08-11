
const ratingAndReviewModel= require("../models/RatingAndReview");
const Course=require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

/* 1) CREATE RATING - imagine mei ko course ko rating de raha hun UI par mtlb mere paas "courseId" ajayegi 
                       kynki mei kisi course ke liye rating aur review de raha hun, uske baad mei logged in 
                       hu isiliye mei kisi course ki rating review de raha hu so "login" waale "auth" mei maine 
                       meri user "id" store kari hui hogi     */

exports.createRating=async(req,res)=>{
     
      try{
           
            // a) fetchcourseId and UserId 
              const userId=req.user.id; // auth middleware mei dala tha waha se liya
              const courseId =req.body;

            //b) fetch rating(number) and review(string)
               const {rating,review} =req.body;
          
            // c) ser enrolled or not - validation kr lo pehele ki ye user uss course mei enrolled hai ya nhi agar hoga to hi rating and review de payega nhi to nhi
                  const courseDetails=await Course.findOne(
                                              {  _id:courseId,
                                                 studentsEnrolled:{$eleMatch:{$eq:userId}}
                                              }
                
                  )      
                  if(!courseDetails)
                     {
                          return res.status(404).json({
                          success:true,
                          message:"Student is not enrolled in this course"
                         })
                     }                

           // d) check karlo ussi user ne pehele se hi koi review nhi diya hai na - kyunki ek user ek hi review and rating de payega
              
              const alreadyReviewed=await RatingAndReview.findOne({
                               user:userId,
                               course:courseId,
              });
            
               if(alreadyReviewed)
                   {
                         return res.status(404).json({
                          success:true,
                          message:"Course Is Already Reviewed By The User"
                         })
                   }
          //e) add this rating and review to the ratingreview model

                  const ratingReview=await RatingAndReview.create({
                                                    rating,review,
                                                    course:courseId,
                                                    user:userId,
                  });


        // f) update course schema - jis course ke liye ye rating review di hai us course ke model mei ye waali rating review add kr de
                
            const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},
                                  {
                                       $push:{
                                            ratingAndReviews:ratingReview._id,
                                       }
                                  },
                                  {new:true}

             );
             console.log(updatedCourseDetails);

        // g) return a successfull response

          return res.status(200).json({
              success:true,
              message:"Rating And Review Created Successfully",
              ratingReview,
          })
      }

      catch(error)
        {
             console.log(error);
             return res.status(400).json({
                  status:false,
                 message:"Problem while creating a rating"
              })
 
        }
}

// 2) GET AVERAGE RATING

exports.getAverageRating=async(req,res)=>{

     try{
         
         // a) get the courseId
            const courseId=req.body.courseId;

         // a) get all the ratings of that course from the "rating"
         const result=await RatingAndReview.aggregate([
                {     
                      $match:{   // mujhe "RatingAndReview" model mei "course" feild mei se  aise courses find kr do jinki "courseid" iss "courseId" ke equal hai
                          course:new mongoose.Types.ObjectId(courseId)
                      },
                      
                      // ab isse humei iss course ke upar jitne "ratingAndReview" the vo saare ek saath ekkatha mil gaye hai
                },

                {
                      $group:{
                          _id:null, // jitni bhi "id's" aayi thi un sabko maine ek saath wrap kr diya
                          averageRating:{$avg:"$rating"},
                      }
                }
         ])

    // d) return a successful response
            if(result.length>0)
                {
                      return res.status(200).json({
                      success:true,
                       message:"Average Rating Calculated",
                       averageRating:result(0).averageRating,
                      })
                }

        // if no rating/review exist - no user has rated or reviwed yet
           return res.status(200).json({
                 success:true,
                 message:"Average Rating is 0, no rating given till now",
                 averageRating:0,
           })
             
     }

     catch(error)
      {     
           console.log(error);

           return res.status(400).json({
                 status:false,
                 message:"Problem while finding the average rating"
           })
      }
}

// 3) GET ALL RATINGS AND REVIEWS - saare ke saare ratings and reviews not rating andreviews of a particular course

exports.getAllRatings=async(req,res)=>{
     
     try{
           
         const allReviews=await RatingAndReview.find({})
                                               .sort({rating:"desc"}) // sort se pehele 5 star rating waale courses dikhenge fir 4 star waale fir 3 star waale and so on
                                               .populate({
                                                     path:"user",
                                                     select:"firstName lastName email image"   // isse jisne rating ya fir review kiya hai uska sirf firstName lastName email image ye 4 cheezein aayengi
                                               })
                                               .populate({    // course mei se sirf courseName lekar aao
                                                      path:"course",
                                                      select:"courseName",
                                               })
                                               .exec();
            
            return res.status(200).json({
                 success:true,
                 message:"all reviews fetched successfully",
                 data:allReviews,
           })
     }

     catch(error)
       {
             console.log(error);

             return res.status(400).json({
                 status:false,
                 message:"Problem while finding the average rating"
             })
       }
}