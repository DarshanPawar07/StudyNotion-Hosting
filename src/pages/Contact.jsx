
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import Footer from "../components/Common/Footer";



const Contact=()=>{

    return(
        <div className="">
              
               <div className=" mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">

                     {/* chat with us wala div */}

                      <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6 h-fit lg:w-[40%]">

                          
                               <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">

                                     <div className="flex flex-row items-center gap-3">
                                             <HiChatBubbleLeftRight size={25} />
                                             <h1 className=" text-lg font-semibold text-richblack-5">Chat on us</h1>
                                     </div>
                                     
                                      <p className="font-semibold">Our friendly team is here to help.</p>
                                      <p className="font-semibold">info@studynotion.com</p>
                               </div>

                               <div className=" flex flex-col gap-[2px] p-3 text-sm text-richblack-200">

                                      <div className="flex flex-row items-center gap-3">
                                             <FaEarthAmericas size={25} />
                                             <h1 className=" text-lg font-semibold text-richblack-5">Visit us</h1>
                                      </div>

                                       <p className="font-semibold mt-1">Come and say hello at our office HQ.</p>

                                       <p className="font-semibold ">Address - Akshya Nagar 1st Block 1st Cross, Rammurthy nagar,Bangalore-560016.</p>
                                       
                                      
                                  
                               </div>

                               <div className=" flex flex-col gap-[2px] p-3 text-sm text-richblack-200">

                                      <div className="flex flex-row items-center gap-3">
                                           <IoIosCall size={25}/>
                                           <h1 className=" text-lg font-semibold text-richblack-5">Call us</h1>
                                      </div>

                                       <p className="font-semibold mt-1">Mon - Fri.  From 8am to 5pm</p>
                                       <p className="font-semibold ">+123 456 7869</p>
                               </div>

                         

                      </div>
                       
                       {/* contact us form  */}

                      <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col lg:w-[60%]">
                            
                             <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
                                             Got a Idea? We&apos;ve got the skills. Let&apos;s team up
                             </h1>

                              <p className="">
                                      Tell us more about yourself and what you&apos;re got in mind.
                              </p>
                                  
                             <div>
                                  <ContactUsForm></ContactUsForm>
                            </div>

                      </div>

                     
                      
               </div>

                {/* reviw slider */}
                    {/* <reviewsilder></reviewsilder> */}
 
                {/* Footer */}
               <Footer></Footer>
        </div>
    )
}

export default Contact;