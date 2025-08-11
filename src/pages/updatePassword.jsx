import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { resetPassword } from "../services/operations/authAPI";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";


const UpdatePassword = ()=>{
    
    const dispatch=useDispatch();
    const location=useLocation();
    const navigate = useNavigate()

    const {loading}= useSelector((state)=>state.auth);
    const [showPassword,setShowPassword]= useState(false);
    /* showpassword variable password "dot dot" mei dikhana hai ya fir password visible
       krna hai uss cheez ki state handle karega*/
    const [showConfirmPassword,setShowConfirmPassword]= useState(false);
    const [formData,setFormData]=useState({password:"", confirmPassword:""})
     
    const {password,confirmPassword}=formData;

    const handleOnChange= (e)=>{
               
          setFormData((prevData)=>(
                 {
                    ...prevData,
                    [e.target.name]:e.target.value

                 }
          ))
    }

    const handleOnSubmit=(e)=>{
        
          e.preventDefault();
          /* iss token feild ke andar jo humei reset password ka mail gaya hai jo link hai uss link end mei 
             token/string hai humei vo iss "token" ke andar store karana hai   */

          const token=location.pathname.split("/").at(-1);
          // ye resetpassword function bhi import kiya hai
          dispatch(resetPassword(password,confirmPassword,token,navigate));

    }

    return(
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                 loading ? (
                       <div className="spinner">
                       </div>
                    ) :

                 (
                     <div className="max-w-[500px] p-4 lg:p-8">

                             <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                                 Choose New Password
                             </h1>

                             <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                                        Almost done. Enter your new password and youre all set.
                             </p>

                         <form onSubmit={handleOnSubmit}>

                              <label className="relative">

                                   {/* adding css and <sup> operator</sup> */}
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                            New Password <sup className="text-pink-200">*</sup>
                                    </p>

                                    <input  required 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            value={password} 
                                            onChange={handleOnChange} 
                                            placeholder="Enter Password" 
                                           className="form-style w-full !pr-10">
                                        
                                    </input>
                                 
                                    {/* Eye wala icon - password visible and not visible */}

                                    <span onClick={()=>setShowPassword((prev)=> !prev )}
                                           className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                                      {  /* ye function aise banaya hai ki iss span mtlb logo par 
                                                           click karein to jo previous value thi show password ki 
                                                           vo toggle kr jaaye mtlb agar pehele, previously visible 
                                                           thi to click hone par invisible ho jaaye aur agar visible
                                                            thi to invisible ho jaaye */}
                                            {
                                               showPassword ?  ( <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : 
                                                               ( <AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                                            }

                                   </span>
                            </label>

                               
                                {/* confirm password wala div */}

                                <label className="relative mt-3 block">

                                    {/* adding css and <sup> operator</sup> */}

                                   <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                         Confirm New Password <sup className="text-pink-200">*</sup>
                                   </p>

                                   <input required 
                                          type={showConfirmPassword  ?  "text" : "password"} 
                                          name="confirmPassword" 
                                          value={confirmPassword} 
                                          onChange={handleOnChange} 
                                          placeholder="Confirm Password" 
                                          className="form-style w-full !pr-10" >
                                        
                                    </input>
                                 
                                    {/* Eye wala icon - password visible and not visible */}

                                    <span onClick={()=>setShowConfirmPassword((prev)=> !prev )}
                                                className="absolute right-3 top-[38px] z-[10] cursor-pointer" >
                                                      {  /* ye function aise banaya hai ki iss span mtlb logo par 
                                                           click karein to jo previous value thi show password ki 
                                                           vo toggle kr jaaye mtlb agar pehele, previously visible 
                                                           thi to click hone par invisible ho jaaye aur agar visible
                                                            thi to invisible ho jaaye */}
                                         {
                                               showConfirmPassword ? ( <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : 
                                                                     ( <AiOutlineEye fontSize={24} fill="#AFB2BF" />)


                                         }
                                   </span>
                            </label>

                            {/* button to reset password */}

                            <button type="submit" className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                                  Reset Password
                            </button>

                         </form>

                        {/* back to login wala button */}

                        <div className="mt-6 flex items-center justify-between">
                                 <Link to="/login">
                                        <p className="flex items-center gap-x-2 text-richblack-5">
                                            <BiArrowBack /> Back To Login
                                        </p>
                                </Link>
                        </div>



                     </div>
                 )
            }       
        </div>
    )
}

export default UpdatePassword;