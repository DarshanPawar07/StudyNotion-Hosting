

const Section=require("../models/Section");
const Course=require("../models/Course");


// 1) HANDLER FOR CREATING A SECTION

exports.createSection=async(req,res)=>{

     try{
        
         //a) data fetching
          const {sectionName,courseId}=req.body;

          //b) data validation
          if(!sectionName || !courseId)
              {
                  return res.status(400).json({
                      success:false,
                      message:"All Feilds Are Required"
                  })
              }
        
          // c) create section
           const newSection= await Section.create({sectionName});

           //d) update course details with section by putting the id of this section into the course's array of name "section"
            const updateCourseDetails=await Course.findByIdAndUpdate(courseId ,
                                         { 
                                             $push:{
                                                 courseContent:newSection,
                                             }
                                         }, 
                                           {new:true}
                                        
                                     );
            //  use populate to replace section and subsection both in updatedCourseDetails
            
            // e) return response
            return res.status(200).json({
                      success:true,
                      message:"Section Created Successfully",
                      updateCourseDetails,
                  })
     }

     catch(error)
       {
             console.log(error);
             return res.status(400).json({
                      success:false,
                      message:"Problem While Creating a Section",
                      error:error.message,
                  })
       }
}


// 2) HANDLER FOR UPDATE SECTION

exports.updateSection=async(req,res)=>{

      try{
            
       // a) section mei sirf section name hai to update bhi sirf sectionName kr skte hai - hence request ki body se data i.e new section name le lo
         
           const {sectionName , sectionId}=req.body;

        // b) data validation

           if(!sectionName)
             {
                return res.status(400).json({
                      success:false,
                      message:"All Feilds Are Required"
                  })
             }

        //c) update data
           const section=await Section.findByIdAndUpdate(sectionId ,
                                                  {sectionName},
                                                  {new:true},
           );

        // d) return response
           
        return res.status(200).json({
                      success:true,
                      message:"Section Updated Successfully",
                      section,
                  })
           
           
      }

      catch(error)
        {
              console.log(error);
             return res.status(400).json({
                      success:false,
                      message:"Problem While Updating a Section",
                      error:error.message,
                  })
        }
}


// 3) HANDLER FOR DELETE SECTION

exports.deleteSection=async(req,res)=>{

      try{
            
       // a) section delete krne ke liye sirf section ki "id" pata honi chahiye uss "id" ke basis par hum uss section ko delete ke denge
         // assuming that we are sending "id" in params
           const {sectionId}=req.body;

    
        //b) delete section
           const section=await Section.findByIdAndDelete(sectionId);
            // TODO : DO we need to delete the entry from course schema
        // c) return response 
        return res.status(200).json({
                      success:true,
                      message:"Section deleted Successfully",
                      section,
                  })
           
           
      }

      catch(error)
        {
              console.log(error);
             return res.status(400).json({
                      success:false,
                      message:"Problem While Updating a Section",
                      error:error.message,
                  })
        }
}