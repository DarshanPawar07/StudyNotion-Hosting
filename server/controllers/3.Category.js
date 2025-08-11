
const Category=require("../models/category");

// 1) CREATE A Category

exports.createCategory=async(req,res)=>{

    try{
          
          // a) fetch name and description from user body
          const {name,description}=req.body;
         
          // b) validation
          if(!name || !description)
               {
                  return res.status(400).json({
                        success:false,
                        message:"All feilds are required"
                  })
               }
         
         // c) create entry in DB
           const response = Category.create({
                name:name,
                description:description,
           });

           return res.status(200).json({
            success:true,
            message:"Category Created Successfully",
           })
        
    }
 
    catch(error)
      {
          return res.status(400).json({
                success:false,
                message:`Error while Creating A Category ${error.message}`,
           })
      }
}

// 2) "GET ALL Category" HANDLER FUNCTION

exports.showAllCategories=async(req,res)=>{

       try{
            
            const allCategories=await Category.find({},{name:true,description:true});
             // {} - mtlb kisi cheez ke basis par find nhi karna aur "{name:true,description:true}" iska mtlb sabhi ke sabhi entries mei name aur description dedo

            res.status(200).json({
                success:true,
                message:"All Categories returned successfully",
                allCategories,
            })
       }

       catch(error)
         {
             return res.status(400).json({
                success:false,
                message:`Error while Creating A Category ${error.message}`,
              })
        }


}


// 3) CATEGORY PAGE DETAILS - iss particular category ke courses show krna hai aim hai

exports.categoryPageDetails=async(req,res)=>{

      try{
             
             // a) get categoryId
                
                const {categoryId}=req.body;

             // b) get all courses for specified courseId - uss category ke corresponding jitne bhi courses hai unko fetch krlo
               const selectedCategory=await Category.findById(categoryId)
                                                      .populate()
                                                      .exec(); 
              
             // c) validation for that category - ho skta hai ki uss category mei ho skta hai ki courses hi na mil paaye
                  if(!selectedCategory)
                     {
                          return res.status(404).json({
                              success:false,
                             message:"Data Not Found"
                        })
                     }

             // d) get courses for different categories
                const differentCategories=await Category.find({
                                _id:{$ne :categoryId},     /* aisi categories ka data lakar do jinki 
                                                               categoryId iss user ne given "categoryId" ke equal na ho
                                                               "ne" mtlb not equal to    */
                                     })
                                     .populate("courses")
                                     .exec();

                 
             // e) HW - get top selling courses
                    

             // f) return response

                 return res.status(200).json({
                      success:true,
                      data:{
                           selectedCategory,
                           differentCategories,
                      },
                 })
      }

      catch(error)
        {    
             console.log(error);
             return res.status(500).json({
                success:false,
                message:error.message,
           })
        }

}