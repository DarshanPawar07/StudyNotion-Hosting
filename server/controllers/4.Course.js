
const Course=require("../models/Course")
const Category=require("../models/category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/2.imageUploader");
const SubSection=require("../models/SubSection");
const Section =require("../models/Section")
require("dotenv").config();

// 1)HANDLER FUNCTION TO "CREATE A COURSE"

exports.createCourse=async(req,res)=>{

      try{
            console.log("entered in backed controller of create course")
           // a) data fetch krlo - from re.body se 
            const{courseName,courseDescription,whatYouWillLearn,price}=req.body;
            const {category} =req.body;

            const thumbnail=req.files.thumbnailImage;
            
           //b) file fetch krlo - from req.files se
           //c) validation krlo - intructor level validation lagao
           if(!courseName || !courseDescription || !whatYouWillLearn || ! price || !category)
               {
                    return res.status(400).json({
                         status:false,
                         message:"All Feilds Are Required"
                    })
               }

           // check for instructor - we are doing DB call
            // we are doing this becoz - in "Course model" there is a attribute "instructor" which is requried in which we are storing "instructor id"
           //c)since ye course sirf "instructor" create kr skta hai isiliye instructor ka validation lagao
           const userId=req.user.id;
           const instructorDetails=await User.findById(userId);
           console.log("Instructor Details ", instructorDetails);
            
           // if there is not instructor with this "id"

            if(!instructorDetails)
                   {
                       return res.status(400).json({
                            success:true,
                            message:"Instructor Details Not Found"
                       })
                   }

           //d) category level validation - check given tag in input is valid or not

          console.log("Category received:", category);

           const categoryDetails=await Category.findById(category);
           if(!categoryDetails)
              {
                    return res.status(400).json({
                            success:true,
                            message:"Category  Details Not Found"
                       })
              }

           //e) upload image to cloudinary
            const  thumbnailImage= await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME,1000,1000);

           //f)create an entry for new course -  course create krna shruu kiya - create course entry in DB
              const newCourse=await  Course.create({
                   courseName,
                   courseDescription,
                   instructor:instructorDetails._id,
                   whatYouWillLearn:whatYouWillLearn,
                   price:price,
                   category:categoryDetails._id,
                   thumbnail:thumbnailImage.secure_url,
              })

           //g) update useSchema -  add the new course  in user i.e "instructor" schema - mtlb intructor ke liye uss instructor ne banaye hue courses dikhenge, student ke liye student ne purchase kiye honge vo courses dikhenge
                // update user  - ab idhar user "instructor" hai to instructor ke courseList mei ye wala course add krdo
                
                await User.findByIdAndUpdate(
                    {_id: instructorDetails._id},  // User ke andar "_id"  ke liye iss "instructorDetails._id" id ke liye serch karo   
                    {
                        $push:{
                             courses:newCourse._id,
                        },
                    },
                    {new:true},
                
                );

           // h)update categorySchema -  add course in category
              await Category.findByIdAndUpdate(
                {_id:category},
                {
                     $push:{
                        courses:newCourse._id,
                     }
                },
                { new: true }
            )

           // i) return response
            return res.status(200).json({
                success:true,
                message:"Course Created Successfully",
                data:newCourse
            })

      }

      catch(error)
        {    
              console.error(error);
              return res.status(500).json({
                success:false,
                message:"Error To Create A Course",
                error:error.message,
            })
        }
}


// 2) HANDLER FUNCTION FOR EDIT COURSE - Not done

exports.editCourse=async(req,res)=>{

      try{
           
          // a) get the "courseid "
              const { courseId } = req.body;
          
          // b) fetch other details of the course from the req body
           
                const updates = req.body;
            
           // c)find the course by its "id"
                const course = await Course.findById(courseId)
            
            // d) validation
                if (!course) {
                  return res.status(404).json({ error: "Course not found" })
                }
            
             // e) If Thumbnail Image is found, update it

                if (req.files) 

                    {
                         console.log("thumbnail update")
                         const thumbnail = req.files.thumbnailImage
                         const thumbnailImage = await uploadImageToCloudinary(
                                                 thumbnail,
                                                  process.env.FOLDER_NAME
                                              )

                          course.thumbnail = thumbnailImage.secure_url
                      }
            
                // f) Update only the fields that are present in the request body

                 for (const key in updates) 
                     {
                           if (updates.hasOwnProperty(key)) 
                              {
                                    if (key === "tag" || key === "instructions")
                                      {
                                           course[key] = JSON.parse(updates[key])
                                      } 

                                     else 
                                      {
                                         course[key] = updates[key]
                                      }
                               }
                      }
            
                await course.save()
            
                const updatedCourse = await Course.findOne({ id: courseId, })
                  .populate({
                    path: "instructor",
                    populate: {
                      path: "additionalDetails",
                    },

                  })

                  .populate("category")
                  .populate("ratingAndReviews")
                  .populate({
                    path: "courseContent",
                    populate: {
                      path: "subSection",
                    },
                  })
                  .exec()
            
                res.json({
                  success: true,
                  message: "Course updated successfully",
                  data: updatedCourse,
                })
              
      }

      catch(error)
        {
                console.error(error)
                 res.status(500).json({
                                  success: false,
                                  message: "Internal server error",
                                  error: error.message,})
        }
    }

// 3) HANDLER FUNCTION TO "GET ALL COURSES" - Get all Registered Courses 

exports.getAllCourses=async(req,res)=>{
     
      try{

           const allCourses=await Course.find( {},
                               {    
                                  courseName:true,
                                  price:true,
                                  thumbnail:true,
                                  instructor:true})
                                  .populate("instructor")
                                  .exec();

            return res.status(200).json({
  success: true,
  message: "Data for all courses fetched successfully",
  data: allCourses,
});
 
      }

      catch(error)
        {
             console.error(error);
              return res.status(500).json({
                success:false,
                message:"Cannot fetch course data",
                error:error.message,
            })
        }
}

// HW- 4) TO GET COURSE DETAILS - details of single course

exports.getCourseDetails=async(req,res)=>{

       try{
 
            // a) get a "id" of that course - courseId mei req mei bhej dunga
            const {courseId}=req.body;

            // b) validation - the "id" is correct
             const courseDetails=await Course.findOne({_id:courseId}) // is courseId ke basis par find karo
                                             .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                            path:"additionalDetails"  // instructor ke saatah saath instructor ke profile ka data bhi populate kr liya jiska naam humne additionalDetails rakha tha
                                                    }
                                                }
                                             )

                                             .populate("category")
                                             .populate("ratingAndReviews")
                                             .populate({
                                                   path:"courseContent",
                                                   populate:{
                                                       path:"subSection"
                                                   },
                                             })
                                             .exec();
                                    
            // isse humei ek course ki saari ki saari details mil jayegi

             if(!courseDetails)
                 {
                    return res.status(400).json({
                        success:true,
                        message:`Could Not find the Course with ${courseId}`,
                    })
                 }

            // d) return the details of the course as a response
            return res.status(200).json({
                success:true,
                message:"Course Details fetched Successfully",
                data:courseDetails,
            })

       }

       catch(error)
        {
              console.log(error);
              return res.status(400).json({
                  success:false,
                  message:error.message,
            })
        }
}


// 5 - HANDLER FUNCTION TO DELETE A COURSE -not done

exports.deleteCourse=async(req,res)=>{

      try{
               
              // a)get courseId fromreq body
              const { courseId } = req.body
           
               // b) Find the course
               const course = await Course.findById(courseId)
                 if (!course) 
                     {
                          return res.status(404).json({ message: "Course not found" })
                     }
           
               // c) Unenroll students from the course

               const studentsEnrolled = course.studentsEnrolled

               for (const studentId of studentsEnrolled) 
                       {
                                await User.findByIdAndUpdate(studentId, 
                                            {
                                                 $pull: { courses: courseId },
                                            })
                       }
           
               // d) Delete sections and sub-sections

                  const courseSections = course.courseContent

                 for (const sectionId of courseSections) 
                    {
                         // f) Delete sub-sections of the section
                             const section = await Section.findById(sectionId)
                             if (section) 
                                  {
                                      const subSections = section.subSection
                                       for (const subSectionId of subSections) 
                                         {
                                                  await SubSection.findByIdAndDelete(subSectionId)
                                         }
                                  }
           
                           // g)  Delete the section
                            await Section.findByIdAndDelete(sectionId)
               }
           
               // h) Delete the course
               await Course.findByIdAndDelete(courseId)
           
               return res.status(200).json({
                        success: true,
                        message: "Course deleted successfully",
               })
      }

      catch(error)
        {
               console.error(error)
               return res.status(500).json({
                              success: false,
                              message: "Server error - Cannot Delete a Course",
                              error: error.message,
                           })
        }
}


// 6) getInstructorCourses - Get a list of Course for a given Instructor

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// 7) get full course details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

