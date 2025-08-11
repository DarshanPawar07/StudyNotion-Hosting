
import { ImTree } from "react-icons/im";
import { HiUsers } from "react-icons/hi";

const CourseCard=({cardData, currentCard, setCurrentCard})=>{

     return(
          
        <div className={`${currentCard=== cardData?.heading? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
                          :"bg-richblack-800"} w-full sm:w-[360px] lg:w-[30%]   text-richblack-25 min-h-[300px] h-auto box-border cursor-pointer`}
                          onClick={()=>setCurrentCard(cardData?.heading)}>

                            <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-4 sm:p-6 flex flex-col gap-3">
                                  
                                    <div className={` ${ currentCard === cardData?.heading && "text-richblack-800" } font-semibold text-[18px] sm:text-[20px] text-start`} >

                                             {cardData?.heading}
                                    </div>
                          
                                    <div className="text-richblack-400 text-start">{cardData?.description}</div>
                           </div>
                          
                           <div className={ `flex justify-between ${ currentCard === cardData?.heading ? 
                                             "text-blue-300" : "text-richblack-300"} px-6 py-3 font-medium text-start`} >

                                    {/* Level */}

                                     <div className="flex items-center gap-2 text-[14px] sm:text-[16px] text-start">
                                             <HiUsers />
                                             <p>{cardData?.level}</p>
                                     </div>
                          
                                     {/* Flow Chart */}

                                     <div className="flex items-center gap-2 text-[16px] text-start">
                                                <ImTree />
                                                <p>{cardData?.lessionNumber} Lesson</p>
                                     </div>
                           </div>
                              


        </div>

     )
}

export default CourseCard;