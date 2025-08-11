
const User =require("../models/User");
const mailSender=require("../utils/1.mailSender");
const bcrypt=require("bcrypt");

//resetpassword token

exports.resetPasswordToken=async(req,res)=>{
     
     try{
           
      //get email from req body
      const email=req.body.email;

     //check user for this email and email verifiacation
      const user=await User.findOne({email});

      if(!user)
         {
             return res.status(400).json({
                success:true,
                message:"User with this email does not exist"
             });
         }
     
    // generating "randomString"
     const randomString=crypto.randomUUID();


    // update user by adding randomString and expiration time
      const updatedDetails=await User.findOneAndUpdate(
                                                        { email:email},  // email ke basis par us user ko dhoondo

                                                        {      //aur us matching email waale user ke  radomString mei ye daaldo
                                                              randomString:randomString,
                                                        },

                                                        {
                                                              resetPasswordExpires:Date.now() + 5*60*1000,
                                                        },

                                                        {new:true}  // new true se humei updated document return hota hai
                                                     );

    // create url
    const url=`https://study-notion-frontend-theta-two.vercel.app/update-password/${randomString}`
      /* 3000 port number par frontend cha; rha hai aur 4000 par backend 
          hum url mei ye bata rhe hai ki 3000 port par mtlb frontend par ek url generate karo jiska link aisa aisa hoga 
          aur usmei diffrentating factor hpga "randomString" jisko hum "crypto" naam ki library se lekar aayenge */                                                 
    
    // send mail

    await mailSender(email,"Pasword Reset LinK",
                     `Password Reset Link: ${url}`
    );



    // return response

     return res.json({
         success:true,
         message:"Email Sent Successfully, Please check email and try again",
         updatedDetails,
     })
}


catch(error)
       {    
            console.log(error)
            return res.status(500).json({
             success:false,
            message:"Something went wrong while sending reset password mail"
        })
     }
     
    


}


//reset password

exports.resetPassword=async(req,res)=>
     {
         // input mei humei randomString ayegi jo humne abhi banayi thi mail send krte vakt by using "crypto" function, 

          /* ab idhar problem ye tha ki hum jab reset password link par jab visit karenge tab jo
             user previous password aur new password enter karega to hum uss password ko DB mei
             kaise save karenge  kyunki humei pata hi nhi hai ki ye password aur new password 
             konse user ke hai - isiliye humne User waale model ke andar "randomString" naam ki 
             cheez har ek user ke liye banayi thi - iss resetPassword function mei humei ek randomString 
             aayegi jis user ne request bheji thi uski to hum uss randomString ko User waale model mei 
             dekhenge ki e randomString kiski hai match karenge jiss user ki hogi uske password mei ye 
             naya password enter update kr denge*/
          

            
         try{
                   // a) data fetch
                   const {password,confirmPassword,randomString}=req.body;
                      /* iss  "randomString" ko to humne upar idhar  {const url=`https://localhost:3000/update-password/${randomString}` } 
                         as a parameter pass kiya tha to ye "body" mei kaise aa gaya? - iska anser hai ki since request frontend se aayi hai
                         isiliye issey frontend ne body mei daal diya hai */


                 // b) validation
                       if(password!==confirmPassword)
                           {
                               return res.json({
                                       success:false,
                                       message:"Password does not matches"
                               })
                           }

                 // c) get userdetails from DB using randomString
                      const userDetails=await User.findOne({randomString:randomString});

                 // d) invalid randomString - if no entry in DB
                 if(!userDetails)
                      {
                          return res.json({
                              success:false,
                              message:"random String invalid"
                          })
                      }

                 // e) invalid randomString - if randomString time has expired
                     if(userDetails.resetPasswordExpires < Date.now() )
                         {
                               // it means randomString has expired
                               return res.json({
                                  success:false,
                                  message:"randomString has expired please regenerate randomString"
                             })
                         }

                 // hash password
                    const hashedPassword= await bcrypt.hash(password,10);

                 // password update in DB
                  const response1=  await User.findOneAndUpdate(
                         
                           {randomString:randomString},
                           {password:hashedPassword},
                           {new:true},  // to return new document
                    )

                 //return response

                  return res.status(200).json({
                                  success:true,
                                  message:"Password reset successful",
                                  response1,
                             })
         }

         catch(error)
            {
                 console.log(error)
                 return res.status(500).json({
                           success:false,
                           message:"Something went wrong while resetting password"
                       });
            }

     }
