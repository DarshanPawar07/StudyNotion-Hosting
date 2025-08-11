import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HomePageExplore } from "../../../data/homepage-explore";
import Home from "../../../pages/Home";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName=[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const ExploreMore=()=>{

    const [currentTab,setCurrentTab] =useState(tabsName[0]);
    const [courses,setCourses]  =useState(HomePageExplore[0].courses)
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading)  
     
    const setMyCards=(value)=>{
            setCurrentTab(value);
            const result =HomePageExplore.filter((course)=>course.tag === value);
            setCourses(result[0].courses);
            setCurrentCard(result[0].courses[0].heading);
    }
    return(

        <div className="">

                    <div className="text-4xl font-semibold text-center">
                         Unlock the 
                         <HighlightText text={"Power of Code"}></HighlightText>
                    </div> 

                    <p className="text-center text-richblack-300 text-lg font-semibold mt-3">Learn to Build Anything You Can Imagine</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-0 rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 py-1 place-self-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] overflow-x-auto">
                            
                            {
                                tabsName.map((element,index)=>{

                                    return(
                                        <div className={`min-w-fit whitespace-nowrap text-[14px] sm:text-[16px] flex items-center gap-2 
                                                       ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium ": 
                                                       "text-richblack-200 "} rounded-full duration-200 transition-all cursor-pointer
                                                       hover:bg-richblack-900 hover:text-richblack-5  px-7 py-2 `} key={index} 
                                                       onClick={()=>setMyCards(element)}   >


                                              {element}
                                        </div>

                                    )
                                })
                            }
   
                    </div>

                    <div className="h-[150px] hidden lg:block lg:h-[200px] "></div>

                    {/* course card wala div */}

                    <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3 ">
                         {
                            courses.map((element,index)=>{

                                 return(
                                      
                                      <CourseCard  key={index} cardData={element} currentCard={currentCard} 
                                                   setCurrentCard={setCurrentCard} >

                                      </CourseCard>
                                     
                                 )
                            })
                         }
                    </div>

        </div>
    )
}

export default ExploreMore;