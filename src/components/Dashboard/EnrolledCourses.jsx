import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {getUserEnrolledCourses} from "../../services/operations/profileAPI" 
import ProgressBar from "@ramonak/react-progress-bar";



const EnrolledCourses=()=>{

     /* enrolled courses ka data mtlb konse konse courses mei vo user enrolled hai vo data "operations" folder 
        mei "profileApi.jsx" file mei  ek function hai "getUserEnrolledCourses" waha se data le lenge aur uss function mei
        humei "token" paas krne padta hai */

      // pehele to humei "token"  legega
      const {token}=useSelector((state)=>state.auth);
       console.log("Token in EnrolledCourses:", token);
      
       // enrolled courses ka ek state variable bana lena
       const[enrolledCourses,setEnrolledCourses]=useState(null);
       

       const getEnrolledCourses= async()=>{
             
             try{
                   
                 // backend ko call kr rhe hai by using function "getUserEnrolledCourses()" present in "profileAPI" this "getUserEnrolledCourses()" function in "profileAPI" file calls the actual backend's function
                  const response =await getUserEnrolledCourses(token) ;
                  
                  // "response" variable mei uss user ke saare ke saare enrolled courses aa jayenge
                  // jo jo enrolled courses hai unko maine "setEnrolledCourses" function se "enrolledCourses" variable mei store kar liya
                  setEnrolledCourses(response);
             }

             catch(error)
               {
                   console.log("Unable to Fetch Enrolled Courses")
               }
       }

       // mujhe backend ko call krni hai isiliye maine useEffect use kr liya
         
       useEffect(()=>{
             
            // getEnrolledCourses function ko call \nhi kiya tha usko idhar call kr liya
             getEnrolledCourses();
       },[])

     
      return(
         
        <div className="text-white">

               
               <div>Enrolled Courses</div>

               {
                      
                       // agar mere paas abhi currently enrolledCourses mei data nhi hai to laoding screen dikha do
                       !enrolledCourses ? (<div>
                            Loading....
                       </div>)
                       :
                       // agar enrolledCourses ki length nhi hai mtlb zero hai to user ke pass courses nhi hai
                       !enrolledCourses.length ?  (<p>You Have Not Enrolled in any course yet </p>)
                       //agar length zero nhi hai mtlb kuch course mei enrolled hai to courseDetail ka Card dikhana padega
                        :( 
                             <div>
                                  <div>
                                       <p>Course Name</p>
                                       <p>Duration</p>
                                       <p>Progress</p>
                                  </div>
                                  {/* Card for each course */}

                                  {
                                      enrolledCourses.map((course,index)=>{
                                              
                                              <div>

                                                   <div>
                                                       <img src={course.thumbnail}></img>
                                                       <div>
                                                              <p>{course.courseName}</p>
                                                              <p>{course.courseDescription}</p>
                                                       </div>
                                                   </div>
                                              
                                                   <div>
                                                        {course?.totalDuration}
                                                   </div>
                                                    
                                                  {/* Course Progress Info */}
                                                    <div>
                                                          <p>Progress:{course.progressPercentage || 0}%</p>

                                                          {/* progress bar lagana hai - for that we will use "@ramonak/react-progress-bar" library*/}
                                                          <ProgressBar completed={course.progressPercentage || 0}
                                                                       height="8px" 
                                                                       isLabelVisible={false} 
                                                                 
                                                          />;

                                                    </div>

                                              </div>


                                      })
                                  }
                             </div>
                        )
               }
        </div> 
      )
}

export default EnrolledCourses;