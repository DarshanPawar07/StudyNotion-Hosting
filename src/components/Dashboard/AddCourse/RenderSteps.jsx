import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import PublishCourse from "./CourseBuilder/PublishCourse";


{/* upar jo course building ki process hai vo konsi step mei hai vo dikhane ke liye we are creating "RenderSteps" */}

const RenderSteps=()=>{

  {/* steps variable isiliye banaya kyunki AddCourse ke liye 3 steps hai to .map function lagakar ek ek step render karayenge aur upar jo ek progress bar dikh raha hai na course kaha tak build hua hai uska usko bhi isi ke help se banayenge */}
  
  const {step}=useSelector((state)=>state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
   ]

     return(


      /*
        <>

             <div className='hidden justify-between gap-4 sm:flex relative text-white'>
                     

                        <div className={`absolute border-t-2 border-dashed border-yellow-25 w-[45%] z-10 top-[25%] translate-y-[-50%] left-14
                            ${step > 1? "visible" : "invisible"} hidden sm:block
                        `}></div>
                        <div className={`absolute border-t-2 border-dashed border-yellow-25 xl:w-[35%] w-[40%] z-10 top-[25%] translate-y-[-50%] right-14
                            ${step > 2? "visible" : "invisible"} hidden sm:block
                        `}></div>
                  
                      {

                        steps.map((item,index)=>{
                                
                          { agar step waali "id" aur steps waali "id" match ho gayi mtlb abhi course builder ke jis step par hun usko highlight krdo }
                            
                         <>
                              <div className="flex flex-col items-center min-w-[70px] mb-6" key={index}>

                                  <div  className={`w-10 p-2 aspect-square rounded-full grid place-items-center z-50 ${step === item.id 
                                      ? "bg-yellow-900 border-yellow-50 text-yellow-50" 
                                     : "border-richblack-700 bg-richblack-800 text-richblack-300"}`}>
                                                    
                                            
                                                { jo peeche waala step hai mtlb jo create ho chuka hai vo yeelowish filled color mei aa rha hai aur uske upar ek tick ka button aa rha hai aur jo step complete nhi hua hai vaha par number aa jayega uss step ka}
                                                 {
                                                     step > item.id ? (<FaCheck/>) :(item.id)
                                    
                                                 }
                                  </div>

                                     <div>
                                            <p>{item.title}</p>    
                                     </div>

                             </div>

                              { jo progress bar hai usmei 2 steps ke beech dashed lines hai agar vo step complete ho chuko hai to yellow dash agar nhi hui hai to black dash }

                              {  
                                  item.id !== steps.length && (

                                   <>
                                       <div className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                                            step > item.id  ? "border-yellow-50" : "border-richblack-500"} `} >
                                    
                                        </div>
                                   </>  )
                               }

                        </> })
                    }  

             </div> 

                   
            <div className="relative mb-16 flex w-full select-none justify-between">
                   
                    {  
                         steps.map((item) => (
                            <>
                                   <div className="flex min-w-[130px] flex-col items-center gap-y-2" key={item.id} >
              
                                          <p className={`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`}>
                                              {item.title}
                                          </p>
                                   </div>
                             </> ))
                    }
            </div>

             { Render specific component based on current step }
             { step === 1 && <CourseInformationForm />}
             {step === 2 && <CourseBuilderForm />}
              {step === 3 && <PublishCourse />}
        </>*/

   <>
        <div className="relative mb-2 flex w-full justify-center">

                    {steps.map((item) => (
                          <>
                             <div className="flex flex-col items-center " key={item.id}>

                                     <button className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full
                                            border-[1px] ${step === item.id  ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                                            : "border-richblack-700 bg-richblack-800 text-richblack-300"
                                            } ${step > item.id && "bg-yellow-50 text-yellow-50"}} `}>
                                         
                                         {  step > item.id ? ( <FaCheck className="font-bold text-richblack-900" />  )
                                            : ( item.id )
                                         }

                                     </button>
              
                             </div>
                            
                              {item.id !== steps.length && ( <>

                                                       <div className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                                                             step > item.id  ? "border-yellow-50" : "border-richblack-500"} `} >
                                                            
                                                        </div>
                                                    </>
                               )}
                        </>
                   ))
                }

         </div>


      <div className="relative mb-16 flex w-full select-none justify-between">

                { steps.map((item) => ( <>
                                          <div className="flex min-w-[130px] flex-col items-center gap-y-2" key={item.id} >
              
                                                 <p className={`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`}>
                                                                       {item.title}
                                                 </p>
                                          </div>
            
                                       </>
                                     )
                          )
                }
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>


     )
}

export default RenderSteps;