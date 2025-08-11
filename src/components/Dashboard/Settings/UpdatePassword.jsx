
import IconBtn from "../../Common/IconBtn";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../services/operations/SettingsApi";

const UpdatePassword=()=>{

    const {token} = useSelector((state)=>state.auth)
    const {register, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const updatePassword = async(data) =>{
        try{
            dispatch(changePassword(token, data, navigate))
        }
        catch(err){
            console.log("Error Message : ", err.message)
        }
    }


    return(

    <form onSubmit={handleSubmit(updatePassword)}>   

        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                
               <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

               <div className="flex flex-col gap-5 lg:flex-row">
                              
                              <div className="relative flex flex-col gap-2 lg:w-[48%]">
                                     
                                      <label htmlFor="currentPassword" className="lable-style">Current Password</label>
                                      <input type="" name="currentPassword" id="currentPassword"
                                             placeholder="Enter Current Password" className="form-style"
                                             {...register("oldPassword", { required: true })}  >

                                            
                                        </input>

                                        {errors.firstName && (<span className="-mt-1 text-[12px] text-yellow-100">
                                                                    Please enter your current password
                                                                </span>
                                         )} 
                              </div>

                              <div className="relative flex flex-col gap-2 lg:w-[48%]">
                                     <label htmlFor="currentPassword" className="lable-style"> New Password</label>
                                      <input type="" name="currentPassword" id="currentPassword"
                                             placeholder="Enter New Password" className="form-style"
                                             {...register("newPassword", { required: true })}>
                                             
                                      </input>

                                       {errors.firstName && (<span className="-mt-1 text-[12px] text-yellow-100">
                                                                    Please enter your new password.
                                              </span>
                                         )}
                                  
                              </div>
               </div>

         </div>

         {/* Cancel and Update Button */}
               
                 <div className="flex justify-end gap-2">
                                           
                       <button className=" cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                                onClick={() => {navigate("/dashboard/my-profile")}}>
                                
                                 Cancel
                       </button>
               
                      <IconBtn type="submit" text="Update"></IconBtn>
                </div>

    </form> 
    )
}

export default UpdatePassword;