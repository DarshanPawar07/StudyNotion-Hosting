

const {instance}=require("../config/2.razorpay");

const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/1.mailSender");
const {courseEnrollementEmail} =require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");



// capture the payment and initiate the razorpay order
// 1) HANDLER FUNCTION FOR 
exports.capturePayment = async(req,res)=>
{
    
          
            // a) get courseId and UserId
              const {course_id} =req.body;   // auth middleware likhte wakt store kiya tha vo storee kr liya
              const userId=req.user.id;

            // b) validation
              if(!course_id)
                  {
                      return res.json({
                          success:false,
                          message:"Please Provide valid course ID"
                      })
                  }

            // c) valid courseId
                let course;

                try{
                      course=await Course.findById(course_id);
                      if(!course)
                         {
                              return res.json({
                                 success:false,
                                 message:"Could Not find the course "
                           })
                         }
                        
                          // e) user already pay for the same course
                        const uid= new mongoose.Types.ObjectId(userId);  // userId jo pehele "string" type mei thi ussey ab "ObjectId" type mei convert kr liya
                          
                           if(course.studentsEnrolled.includes(uid)) // agar Course model ke andar "studentsEnrolled" array ke andar iss current "userId" present hai mtlb ye student iss course mei pehele se enrolled hai
                               {
                                     return res.json({
                                         success:false,
                                         message:"Student Is Already Enrolled "
                                  })
                               }

                }


                catch(error)
                  {    
                          console.error(error);
                           return res.json({
                                         success:false,
                                         message:error.message,
                                  })
                  }

            // d) valid courseDetails
          
            // f) order create

            const amount= course.price;
            const currency="INR";

            const options={
                amount:amount*100,
                currency,
                reciept:Math.random(Date.now()).toString(),
                 notes:{
                        courseId:course_id,
                        userId,
                    }
                };

            try{

                const paymentResponse=await instance.orders.create(options);
                console.log(paymentResponse);
                 return res.status(200).json({
                                      success:true,
                                      courseName:course.courseName,
                                      courseDescription:course.courseDescription,
                                      thumbnail:course.thumbnail,
                                      orderId:paymentResponse.id,
                                      currency:paymentResponse.currency,
                                      amount:paymentResponse.amount,

                                
                                  })

            }

            catch(error)
               {
                     console.error(error);
                     return res.json({
                                         success:false,
                                         message:"Could not initiate the orser",
                                  })
               }

            // g) return response

};



// 2) HANDLER FUNCTION FOR VERIFY SIGNATURE

exports.verifySignature=async(req,res)=>{

    // iss function mei mujhe matching krni hai jo razorpay ne jo "secret_key / signature" bheja hai vo aur humare "backend/DB" mei pada hua hai vo "secret_key/signature" match ho rahi hai ya nhi agar match ho gayi mtlb transaction successfull hua
   

         
         const webhookSecret="12345678" //ye vo hai jo hemne DB/backend mei store kiya hai vo
         const signature=req.headers("x-razorpay-signature")  // ye razorpay ke dwara request mei bheja hua hai
       // this signature send by razorpay is hashed by using 3 steps becoz of security concerns
        

        /* THESE ARE THE 3 STEPS FOR CONVERTING webhooksecret into encrypted form (it is the same form which is used for encryption of "signature" done by razorpay) */

        // a) Hmac(algorith used for hashing , kisko hash krna hai )
        const shasum= crypto.createHmac("sha256",webhookSecret); 
        
        // b) ab isko string mei convert krna hai
        shasum.update(JSON.stringify(req.body));

        // c) isko hexadecimal mei convert krna hai 
        const digest=shasum.digest("hex");


        if(signature===digest)
             {
                   console.log("Payment is Authorised");

                   /* ab payment authorised bhi ho gaya ab humei student ko course ke andar enroll karana hai by adding
                      "courseId" in user schema and adding "studentId" in course schema  */
                 
                  /*student ko course mei enroll karane ke liye humei "studentId" aur "courseId" dono chahiye hoga aur iss
                    baar request "frontend" se nhi aayi hai iss baar request "razorpay" se aai hai to humei studentId aur courseId kaise milegi ? -
                    ANS - abhi humne upar "notes" naam ka variable banaya tha jismei humne "studentId" aur "courseId" dono ko store kiya 
                       tha hum vaha se le lenge */

                       const {courseId,userId}=req.body.payload.payment.entity.notes;

                       try{
                            
                           // fulfill the action

                           // 1) find the course and enroll the student in it
                           const enrolledCourse=await Course.findOneAndUpdate(
                                                                   {_id:courseId},
                                                                   {$push:{studentsEnrolled:userId}},
                                                                   {new:true}
                                                                );
                            if(!enrolledCourse)
                                 {
                                     return res.status(500).json({
                                          success:true,
                                          message:"Course Not Found"
                                     });
                                 }

                            console.log(enrolledCourse);
                            // add "courseId" in User's(student's) "enrolledCourses"
                            const enrolledStudent=await User.findOneAndUpdate(
                                                                        {_id:userId},
                                                                        {$push:{courses:courseId}},
                                                                        {new:true},
                            )

                            console.log(enrolledCourse);


                            //SENDING MAIL - YOU HAVE SUCCESSFULLY ENROLLED TO A COURSE
                            const emailResponse=await mailSender(
                                                                    enrolledStudent.email,
                                                                    "Congratulations From StudyNotion",
                                                                    "Congratulations You Have Enrolled to a new StudyNotion Course",
                                         )
                            
                                         console.log(emailResponse);

                            return res.status(200).json({
                                success:true,
                                message:"Signature Verified and Course Added"
                            })
                       }

                       catch(error)
                        { 
                                    console.error(error);
                                    return res.status(500).json({
                                           success:false,
                                           message:error.message,
                                    })
                        }


             }

        
       
    else{
           // no signature match
           console.error(error);
            return res.status(400).json({
                            success:false,
                            message:"invalid request",
                    })

    }
     

     
}