
import CTAButtons from "./Button";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "./HighlightText";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks=({position, heading, subheading, ctabtn1, ctabtn2,codeblock, backgroundGradient, codeColor})=>{
    return(
         
        <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>
                     
                    {/* Section 1 -  text wala div */}

                  <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
                                   
                              {heading}

                           {/* subheading-  text */}

                            <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
                                  {subheading}
                            </div>

                           {/* buttons */}

                           <div className="flex gap-7 mt-7">

                                    <CTAButtons active={ctabtn1.active} linkto={ctabtn1.link}>
                                            <div className="flex gap-2 items-center">
                                                   {ctabtn1.btnText}
                                                   <FaArrowRight></FaArrowRight>
                                            </div>
                                            
                                    </CTAButtons>

                                    <CTAButtons active={ctabtn2.active} linkto={ctabtn2.link}>
                                             {ctabtn2.btnText}    
                                    </CTAButtons>
                          </div>
 
                  </div>


                    {/* Section 2  - moving code wala animation - code-border relative*/}

                    <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-full md:w-[90%] lg:w-[470px] text-bold overflow-x-auto">

                             {backgroundGradient} 

                             {/* Indexing */}
                            <div className="text-center flex flex-col w-[10%] min-w-[40px] select-none text-richblack-400 font-inter font-bold">
                                         <p>1</p>
                                         <p>2</p>
                                         <p>3</p>
                                         <p>4</p>
                                         <p>5</p>
                                         <p>6</p>
                                         <p>7</p>
                                         <p>8</p>
                                         <p>9</p>
                                         <p>10</p>
                                         <p>11</p>
                            </div>

                            {/* using TYPE-ANIMATION */}

                            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1 text-start`} >
                                   <TypeAnimation 
                                         sequence={[codeblock,1000,""]}
                                         repeat={Infinity}
                                         cursor={true}
                                         style={{
                                            whiteSpace:"pre-line",
                                            display:"block",
                                         }}
                                         omitDeletionAnimation={true}
                                         >
                                        
                                     </TypeAnimation>
                            </div>
                           
                    </div>




        </div>
    )
}

export default CodeBlocks;