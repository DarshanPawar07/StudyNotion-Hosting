import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RequirementFeild=({name, label,register , errors ,setValue, getValues})=>{
    
     const [requirement,setRequirement]=useState("");
     const [requirementList,setRequirementList] =useState([]);
     
      const { editCourse, course } = useSelector((state) => state.course)

     // requirements add krne ke liye function

     const handleAddRequirement=()=>{
         
         // pehele ye dekh lo ki requirement ke andar data hai bhi ya nhi

         if(requirement)
          {   
              // agar requirement kuch aayi hai requirement list mei pehele waale requiremens + abhi jo nayi aayi hai dono add krdo
              setRequirementList([...requirementList,requirement])
              setRequirement("");
          }
     }

      const handleRemoveRequirement=(index)=>{
           
         const updateRequirementList=[...requirementList];
         updateRequirementList.splice(index,1);  // splice function se jo nhi chahiye vo remove kr denge
         setRequirementList(updateRequirementList);

      }

      useEffect(()=>{

          if(editCourse)
              {
                  setRequirementList(course?.instructions)
              }

          register(name,{
               required:true,
               validate:(value)=>value.length >0
          })
      },[])


      // jab jab meri requirementList update ho rhi hai uss case ke andar setValur ke=r denge jisse value update ho jayegi

      useEffect(()=>{
           
            setValue(name,requirementList);

      },[requirementList]);


    return(
        
        <div className="flex flex-col space-y-2">

                <label className="text-sm text-richblack-5" htmlFor={name}>
                               {label} <sup className="text-pink-200">*</sup>
                </label>

                <div className="flex flex-col items-start space-y-2">

                       <input type="text" id={name} value={requirement} 
                              onChange={(e)=>setRequirement(e.target.value)}
                              className="form-style w-full">

                       </input>

                       <button type="button" onClick={handleAddRequirement}
                               className="font-semibold text-yellow-50"
                               >
                                Add
                        </button>

                </div>
               
               {/* jo requirements hai vo humei ek ek krke add krke vo dikhani bhi hai */}
            
                {
                        requirementList.length >0 && (
                             
                             <ul className="mt-2 list-inside list-disc">
                                  {
                                      requirementList.map((requirement,index)=>(
                                          
                                           <li  key={index} className="flex items-center text-richblack-5">

                                                <span>{requirement}</span>
                                                <button type="button" 
                                                         onClick={()=>handleRemoveRequirement(index)}
                                                         className="ml-2 text-xs text-pure-greys-300 "
                                                         >
                                                 
                                                   clear
                                                </button>
                                                
                                           </li>
                                      ))
                                  }
                             </ul>
                        ) 
                }

                {
                    errors[name] && (
                          <span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>
                    )
                }
        </div>
    )
}

export default RequirementFeild;