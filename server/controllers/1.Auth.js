


const User=require("../models/User")
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const Profile=require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender=require("../utils/1.mailSender");
require("dotenv").config();


// 1) FUNCTION FOR SENDING OTP

exports.sendOTP=async(req,res)=>{
    
    try
     {    
       //fetch email from request body
       const {email}=req.body;

        //check if user already exist 
        const checkUserPresent=await User.findOne({email});
  
        // if user already exist, then return a response

        if(checkUserPresent)
             {
                   return res.status(401).json({
                   success:false,
                   message:"User already registered"
                 })

             }

          //generate otp - generate function of otp-generator library is used 

          let otp=otpGenerator.generate(6,{    // 6 is the length of otp
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
          });

          console.log("otp generated =",otp);


          // check the otp generated is unique or not 
          const result =await OTP.findOne({otp:otp});   // jo abhi generated otp hai uske jaise koi database mei "otp" hai ya nhi ye check karega
             
         // jab tak otp unique nhi aa jaata tab tak mei otp generate krta rahunga
          while(result)
              {
                  otp=otpGenerator(6,{
                           upperCaseAlphabets:false,
                          lowerCaseAlphabets:false,
                          specialChars:false,
                  });

                  //firse check karenge new generated otp unique hai ya nhi
                  const result =await OTP.findOne({otp:otp});
              }
        
              const otpPayload={email,otp};

              // create a entry in Database
              const otpBody=await OTP.create(otpPayload);
              console.log(otpBody);

              //return response successfull
             return  res.status(200).json({
                  success:true,
                  message:"OTP Send Successfully",
                  otp,
              })
      }
   
      catch(error)
        {
              console.log(error);
              return res.status(500).json({
                   success:false,
                   message:error.message
              })
        }
    
}


// 2) FUNCTION FOR SIGNUP

exports.signUp=async(req,res)=>{
  
    try 
       {    
            //a) fetch data from request ki body
            const {email,firstName,lastName,password,confirmPassword,accountType,contactNumber,otp} = req.body;

            //b) validate krlo
               
               // all feilds required validation
                if (!firstName || !lastName ||!email ||!password ||!confirmPassword ||!otp ) 
                    {
                               return res.status(403).json({
                               message: "All fields are required",
                               success: false,
                         });
                    }

                
                 //correct email address verification
             /*
                      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const isValidEmail =  regex.test(email);
                   */

                  /* if(isValidEmail)
                      {
                            res.status(403).json({
                                 message:"Invalid Email Address",
                                 success:false,
                           })
                      } */
    
    

             //c) password match krlo("password" feild aur "confirm password" feild same hai ya nahi)
                  if(password!==confirmPassword)
                     {
                         return res.status(400).json({
                         message:"Password Does not matches",
                         success:false,
                        })
                    }

             //d) check user already exist or not
                 const existingUser= await User.findOne({email})
                 if(existingUser)
                    {
                        return res.status(400).json({
                        message :"User is already registered",
                        success:false,
                         })
                    }

              //e) find out most recent otp stored in the database for the user
                     const recentOtp=await OTP.find({email}).sort({createdAt: -1 }).limit(1);
                      console.log("recent otp= ", recentOtp);
            

              //f) validate otp(check krlo otp entered by user and otp in DB same hai ya nhi)
                    if(recentOtp.length===0)
                        {
                           // means otp not found
                           return res.status(400).json({
                           success:false,
                            message:"OTP does not matches",
                            })
                        }
           
                    else if(otp!==recentOtp[0].otp)
                        {
                            // invalid otp
                              return res.status(400).json({
                              success:false,
                              message:"OTP is invalid",
                            })
                        }   

                //g) hash password
                   const hashedPassword=await bcrypt.hash(password,10);


                // h) create entry in db
       
                   const profileDetails= await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null})

                   const userPayload={ 
                          firstName,
                          lastName,
                          email,
                          password:hashedPassword,
                          contactNumber,
                          accountType,
                          additionalDetails:profileDetails._id,
                          image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
                          // ye api direct apne naame ke first letters se ek random image generate kr degi
                       }
                        
                   //i) return response
                    const response1=await User.create(userPayload);
      
                          return res.status(200).json({
                          success:true,
                          message:"Signed Up Successfully",
                          response1
                            })
    }

    catch(error)
        {
               console.log(error);
              return res.status(400).json({
                          success:false,
                          message:"Error while Sign Up",
                     })
        }

}


// 3) FUNCTION FOR LOGIN

exports.login=async(req,res)=>{

         try{
              
              //a) fetch data from req body
              const {email,password}=req.body;
               
              //b) validation of data
                if(!email || !password)
                     {
                           return res.status(403).json({
                            status:false,
                            message:"All feilds Are Required"
                           })
                     }
              //c) check if user is registered or not
              const user=await User.findOne({email}).populate("additionalDetails");

              //d) if user is not registered
                if(!user)
                   {
                       return res.status(400).json({
                            success:false,
                            message:"User is not registered"
                        })
                   }
               
                // e) if password is correct then generate a JWT token
                  const isPasswordCorrect= await bcrypt.compare(password,user.password);

                  if(isPasswordCorrect)
                       {    

                           const payload={ 
                                           email:user.email,
                                           id:user._id,
                                           accountType:user.accountType,
                                        }

                           const token=jwt.sign(payload,process.env.JWT_SECRET,{
                                   expiresIn:"2h",
                           });

                           user.token=token;
                           user.password=undefined;

                           // creating a cookie
                           const options={
                                  expires: new Date(Date.now() + 3*24*60*60*1000),
                                  hhtpOnly:true
                           }

                           res.cookie("token",token,options).status(200).json({
                               success:true,
                               message:"Logged In Successfully",
                               user,
                               token
                           })
                       }

                    else
                        {
                           return res.status(401).json({
                                 success:false,
                                 message:"Password is incorrect"
                              })
                       }

            
         }

         catch(error)
           {    
                  console.log(error);
                  return res.status(401).json({
                         success:false,
                         message:"Login Failure, Please try again"
                  })
           }
}



//4. CHANGE PASSWORD

exports.changePassword=async(req,res)=>{
      
      try{
           
          //  get data (oldpassword, new password, confirm password) from rreq body

            const {oldPassword,newPassword,confirmPassword}=req.body;
            const user=await User.findById(req.user.id)
          
          // validation lagana

             if(!oldPassword || !newPassword ||!confirmPassword)
                     {
                           return res.status(403).json({
                            status:false,
                            message:"All feilds Are Required"
                           })
                     }

             if(oldPassword!==user.password)
               {
                    return res.status(400).json({
                        success:false,
                        message:"Old Password is incorrect"
                    })
               }
           
            else if(confirmPassword!==newPassword){
                   
                   return res.status(400).json({
                        success:false,
                        message:"Password Does Not Matches"
                    })
                }    
        
            
          // update password in db
              user.password=newPassword;

          //send mail - password updated
          const mailBody= `Password For Your SudyNotion Account Has Been Changed Successfully`
          const response=await mailSender(user.email,mailBody);

          //return response
           res.status(200).json({
              success:false,
              message:"Password Successfully Changed"
           })
          
      }

      catch{
           
         res.status(400).json({
                        success:false,
                        message:"There is a problem while changing your password"
                    })
      }
}
