
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../Common/IconBtn";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/operations/SettingsApi";

 
const genders=["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const EditProfile=()=>{

    const {user}=useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth);
    const {register, handleSubmit, formState: { errors }}=useForm();
    const navigate=useNavigate();
    console.log("Token being sent to updateProfile:--", token);
    const dispatch=useDispatch();

    const submitProfileForm=async(data)=>{
          
         try{
             
              dispatch(updateProfile(token,data))
         }

         catch(error)
           {
              console.log('Error Messsage - ', error.message)
           }
    }
    
    
    return(

        <>
             
             <form onSubmit={handleSubmit(submitProfileForm)}>   
                    
                     <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                             
                             <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

                             <div className="flex flex-col gap-5 lg:flex-row">
                                    
                                    <div className="flex flex-col gap-2 lg:w-[48%]">
                                         
                                         <label htmlFor="firstName" className="lable-style"> 
                                                      First Name 
                                        </label>

                                         <input type='text' id="firstName" name="firstName" 
                                                placeholder="First Name" className="form-style"
                                                defaultValue={user?.firstName}
                                                {...register("firstName", {required:true})}> 
                                            
                                         </input>

                                        {errors.firstName && (
                                            <span className="-mt-1 text-[12px] text-yellow-100">
                                                         Please enter your first name.
                                            </span>
                                         )}
                                         
                                    </div>

                                  

                                     <div className="flex flex-col gap-2 lg:w-[48%]">
                                          
                                           <label htmlFor="lastName" className="lable-style">
                                                      Last Name
                                           </label>

                                           <input type="text" name="lastName" id="lastName" placeholder="Enter Last Name" 
                                                    className="form-style" {...register("lastName",{required:true})}
                                                    defaultValue={user?.lastName} >
                                            </input>

                                           { errors.firstName && (
                                              <span className="-mt-1 text-[12px] text-yellow-100">
                                                         Please enter your first name.
                                              </span>
                                           )}
                                     </div>
                            </div>


                                  
                            <div className="flex flex-col gap-5 lg:flex-row">

                                         <div className="flex flex-col gap-2 lg:w-[48%]">
                                                
                                             <label htmlFor="dateOfBirth" className="lable-style">Date Of Birth</label>

                                              <input type="Date" name="dateOfBirth" id="dateOfBirth" 
                                                      placeholder="Date Of Birth" 
                                                      className="form-style"
                                                      defaultValue={user?.additionalDetails?.dateOfBirth}
                                                      {...register("dateOfBirth", { required: 
                                                                                     {
                                                                                         value: true,
                                                                                         message: "Please enter your Date of Birth.",
                                                                                      },

                                                                                     max: {
                                                                                             value: new Date().toISOString().split("T")[0],
                                                                                              message: "Date of Birth cannot be in the future.",
                                                                                          },
                                                                                  }
                                                                    )
                                                      }>
                                                    
                                            </input>

                                              {    errors.dateOfBirth && (
                                                   <span className="-mt-1 text-[12px] text-yellow-100">
                                                            {errors.dateOfBirth.message}
                                                    </span>
                                                 )
                                               }
                                 
                                         </div>

                                         <div className="flex flex-col gap-2 lg:w-[48%]">
                                              
                                               <label htmlFor="gender" className="lable-style">Gender</label>

                                               <select type="text" id="gender" name="gender"
                                                       className="form-style"
                                                       {...register("gender", {required:"true"})}
                                                       defaultValue={user?.additionalDetails?.gender} >
                                                    
                                                     {
                                                         genders.map((ele,i)=>{

                                                            return(
                                                                <option key={i} value={ele}>{ele}</option>
                                                            )
                                                         })
                                                     }

                                                </select>

                                                    {errors.gender && (
                                                            <span className="-mt-1 text-[12px] text-yellow-100">
                                                                 Please enter your Date of Birth.
                                                             </span>
                                                     )}

                                         </div>

                            </div>
 
                             <div className="flex flex-col gap-5 lg:flex-row">

                                         <div className="flex flex-col gap-2 lg:w-[48%]">

                                               <label htmlFor="contactNumber" className="lable-style">Phone Number</label>
                                               <input type="tel" name="contactNumber" id="contactNumber"
                                                       placeholder="Enter Contact Number" className="form-style"
                                                       defaultValue={user?.additionalDetails?.contactNumber}
                                                        {...register("contactNumber", {
                                                                                          required: {
                                                                                             value: true,
                                                                                              message: "Please enter your Contact Number.",
                                                                                             },

                                                                                          maxLength: { value: 12, message: "Invalid Contact Number" },
                                                                                          minLength: { value: 10, message: "Invalid Contact Number" },
                                                                                     })}
                                                >

                                                </input>

                                                    {errors.contactNumber && (
                                                              <span className="-mt-1 text-[12px] text-yellow-100">
                                                                          {errors.contactNumber.message}
                                                              </span>
                                                   )}
                                         </div>

                                         <div className="flex flex-col gap-2 lg:w-[48%]">

                                                <label htmlFor="about" className="lable-style">About</label>
                                                <input type="text" name="about" id="about"
                                                        placeholder="Enter Bio Details"
                                                        className="form-style"
                                                        defaultValue={user?.additionalDetails?.about}
                                                        {...register("about",{required:true})}>


                                                </input>

                                                {  errors.about && (
                                                       <span className="-mt-1 text-[12px] text-yellow-100">
                                                                   Please enter your About.
                                                       </span>
                                                )

                                                }
                                         </div>

                             </div>

                     </div>
                      

                      {/* Cancel and Save Button */}

                      <div className="flex gap-4 place-self-end">
                            
                             <button className=" cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                                onClick={() => {navigate("/dashboard/my-profile")}}>
                                
                                 Cancel
                       </button>

                             <IconBtn text="Save" ></IconBtn>
                      </div>
             </form>

        </>
    )
}

export default EditProfile;