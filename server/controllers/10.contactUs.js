
const ContactUs=require("../models/contactUs");
const mailSender = require("../utils/mailSender");

exports.contactUs=async(req,res)=>{
       
       try{
          
           // a) take user email from req body
            const userEmail=req.body;

           // b) take mail of the admin of the website from 

           // c) take other details of the user which he had fill in the form
            const {firstName, lastName, phoneNumber, message} =req.body;

           // d) validation - all feilds are required
           if(!firstName || !lastName || !phoneNumber || !message || !userEmail)
               {
                    return res.status(400).json({
                           success:true,
                           message:"All Feilds Are Required"
                    })
               }
           

            // e) create a entry to DB - i dont think we have need to store this in db bcoz we are sending response to mail thats all we want
                
              const response=await ContactUs.create({
                           
              })
    
           // f) send mail to the user's email
                const sendMailToUser=await mailSender(  userEmail , 
                                                        "Thank You For Contacting Us !",
                                                        `Hey ! ${firstName} Thank you for contacting with us we will reach out you soon.`)

           // g) send mail to the admin's email
              

           // h) send a response
               return res.status(200).json({
                    success:true,
                    message:"Mail Sent Successfully"
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