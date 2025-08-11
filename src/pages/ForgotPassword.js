/*
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";



const ForgotPassword=()=>{

    const {loading} = useSelector((state)=>state.auth); 
    const [emailSent, setEmailSent] =useState(false);
    const [email, setEmail]=useState("");
    const dispatch=useDispatch();
      
    const handleOnSubmit=(e)=>{

        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

    // iss file k andar ke code se humei 2 pages show krne hai 1) reset password waali screen agar email sent nahi hua hai 
    // 2) agar email send hua hai to "email sent successfully" wala message wali screen
    return(
        <div className="text-white flex justify-center items-center ">
             
             {
                 loading? 
                 // agar loading true hai to mtlb abhi tak DB se data aaya nhi hai
                 (
                     <div>Loading...</div>
                 )
                 :
                 //agar loading true nahi hai to  mtlb DB se data aaya hai
                 (
                      <div>
                            <h1 >
                              {     
                                   !emailSent ? "Reset your Password" : "Check Your Email"
                                    // agar email send hua hai to ye "Reset your Password" heading agar nhi hua to ye "Check Your Email" heading
                                    
                               }
                            </h1>

                             <p>
                                {
                                    !emailSent? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                                    :`We have sent the reset email to ${email}`
                                }
                             </p>

                             <from onSubmit={handleOnSubmit}>
                                   {
                                      !emailSent && (
                                            // agar aapka email send hua hai to aaapko ye <label></label> dikhega nhi to nhi dikhega
                                               <label>
                                                        <p>Email Address :</p>
                                                        <input required type="email" name="email"  value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Your Email Address"></input>
                                               </label>
                                      )
                                   }

                                   <button type="submit">
                                           {
                                               !emailSent ? "Reset Password" : "Resend Email"
                                           }
                                   </button>
                                   
                             </from>

                             <div>
                                 <Link to="/login">
                                        <p>Back to Login</p>
                                 </Link>
                             </div>
                      </div>   
                 )
             }
        </div>
    )
}

export default ForgotPassword;*/


import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
         {  
               loading ? 
               (  <div className="spinner"></div> ) 
               : 
               ( <div className="max-w-[500px] p-4 lg:p-8">

                         <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 text-start">
                                     {!emailSent ? "Reset your password" : "Check email"}
                         </h1>

                         <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100 text-start">

                               { !emailSent  ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                                  : `We have sent the reset email to ${email}`}
                         </p>

                        <form onSubmit={handleOnSubmit}>
                                {  !emailSent && 
                                   ( <label className="w-full">

                                          <p className="mb-1 text-[0.899rem] leading-[1.375rem] text-richblack-5 text-start">
                                                      Email Address <sup className="text-pink-200">*</sup>
                                           </p>

                                          <input required  
                                                 type="email" 
                                                 name="email" 
                                                 value={email}
                                                 onChange={(e) => setEmail(e.target.value)}
                                                 placeholder="Enter email address"
                                                 className="form-style w-full"
                                           />
                                    </label>
                                   )
                                }

                                <button type="submit" className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"  >
                                           {!emailSent ? "Sumbit" : "Resend Email" }
                                </button>
                         </form>

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

export default ForgotPassword;
