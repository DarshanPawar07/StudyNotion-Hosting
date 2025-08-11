

const subSection=require("../models/SubSection");
const Section  =  require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/2.imageUploader");
const SubSection = require("../models/SubSection");
const { findByIdAndUpdate } = require("../models/Course");


//1) CREATE SUBSECTION

exports.createSubSection=async(req,res)=>{

     try{
       
         //a) fetch data from req body 
          const {sectionId, title,timeDuration,description}=req.body;   // ye "id"  section mei se aa rhi hai
          // b) fetch video from req.file
         const video=req.files.videoFile;
          // validation
             if(!sectionId || !title || ! timeDuration || !description)
                  {
                       return res.status(400).json({
                            success:false,
                            message:"Problem While Creating a Sub Section",
                            error:error.message,
                        })
                  }

         // c) upload the video to cloudinary and generate a secure url 
           const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);  
               // uploadDetails mei humei ek secure_url return hokar aayega

         // d) create a subsection
             const subSectionDetails=await SubSection.create({
                  title:title,
                  timeDuration:timeDuration,
                  description:description,
                  videoUrl:uploadDetails.secure_url,
             })

         // e) update section by adding "objectId" of this subsection in section
               const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                  { $push :{
                                                      subSection:subSectionDetails._id,
                                                  }},
                                                  {new:true},
                 // TODO: log updated section here after adding populate query
                                                     
               )

         // f) give response
           return res.status(200).json({
                success:true,
                message:"Sub Section Created Successfully",
                updatedSection,

           })

     }

     catch(error)
       {
              console.log(error);
               return res.status(400).json({
                      success:false,
                      message:"Problem While Creating a Sub Section",
                      error:error.message,
                  })
       }
}


// 2) HANDLER FUNCTION FOR UPDATE SUBSECTION - HW
 
 exports.updateSubSection=async(req,res)=>{

       try{
             
            // a) fetch data from request ki body
             const {subSectionId, title,timeDuration,description} =req.body;
             const videoFile=req.files.videoFile;

            // b) update data
            const updatedDetails=await subSection.findByIdAndUpdate(subSectionId , 
                                                                  {title},
                                                                  {timeDuration},
                                                                  {description},
                                                                  {videoUrl:videoFile},
                                                                  {new:true},
            )

            // c) send response
            return res.status(200).json({
               success:true,
               message:"Sub Section Updated Successfully",
               updatedDetails
            })


       }

       catch(error)
         {       
                 console.log(error);
                 return res.status(200).json({
                   success:true,
                   message:"Problem While Updating Sub Section",
                   error:error.message,
              })

         }
 }


// 3) HANDLER FUNCTION FOR DELETE SUBSECTION - HW

exports.deleteSubSection=async(req,res)=>{

      try{
             
              // a) take id of that subsection from req body 
                const {subSectionId}= req.body;

              // b) findbyid and delete
              const updatedSubSection= await subSection.findByIdAndDelete(subSectionId);

              // c) response
              return res.status(200).json({
                   success:true,
                   message:"Sub Section Deleted Successfully",
                   updatedSubSection
              })

      }

      catch(error)
        {
            console.log(error);
                 return res.status(200).json({
                   success:true,
                   message:"Problem While Deleteing Sub Section",
                   error:error.message,
              })
        }
}