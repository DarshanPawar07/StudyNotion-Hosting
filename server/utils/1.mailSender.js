
const nodemailer=require("nodemailer");

const mailSender=async (email,title,body)=>{
      
     try{

         let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
         })

         let info=await transporter.sendMail({
                from:`StudyNotion`,  // mail is sending from darshan pawar 
                to:`${email}`,   // kisko behj rahe ho?  "doc" waale object mei ek attribute hai "email" krke usko send kr rhe hai
                subject:`${title}`,
                html:`${body}`,

             })
           
             console.log(info);
             return info;
         
     }

     catch(error){
          console.log(error.message);
          res.status(404).json({
               success:false,
               message:"Error while sending mail"
          })
     }
}

module.exports=mailSender;