
import { useState } from "react";
import {sidebarLinks}  from "../../data/dashboard-links"
import { logout } from "../../services/operations/authAPI";
import { useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";

const Sidebar=()=>{
     
    const {user,loading:profileLoading} =useSelector((state)=>state.profile);
    const {loading:authLoading}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    /* ek state variable for keeping the value of Modal whether it is open or not*/

    const[confirmationModal,setConfirmationModal]=useState(null);
    

     // agar data mtlb profileLoading aur authLoading load nhi hua hai to spinner dikha denge

     if(profileLoading || authLoading)
          {
                 return (
                    <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
                            <div className="spinner"></div>
                     </div>
               )
          }

    return(
         
          /* jab ye conformationModal wala function chalega tabhi ye return() ke andar likha hua saara data render hoga - aur fir modal ki screen open hogi*/

        <>
                 <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
                           
                        <div className="flex flex-col">
                                 
                     {/* a) This is for creating myProfile, Enrolled Courses and Cart in the sidebar */}

                               {/* sidebarLinks mei jo links hai vo ek ek karke dikha dunga */}
                            
                                 {          
                                       /* ye hum isiliye kr rhe hai kyunki student ko aur instructor ko alaga alag 
                                          dashboard dikhana hai kyunki student ka aur instructor ka dashboard alag alag hai */

                                      sidebarLinks.map((link)=>{
                                            
                                        /* ye jo "sidebarLinks" hai vo array hai usmei abhi hum jis uss array ke index par khade hai
                                            usko "link" variable se darshaya hai */

                                        /* tumne jo "link" hai uska type exist karta hai to user ke type ko link ke type se compare karo 
                                           aur vo accounttype agar user ke "link" ke type ke equal nhi hau to kuch mat dikhao agar hua 
                                           to dikha do ye "<SidebarLink></SidebarLink>*/

                                           if(link.type &&user?.accountType !== link.type) return null;
                                           
                                           // agar type same hota to render kr leta i.e -  else return ...
                                           return(

                                                <SidebarLink key={link.id} link={link} iconName={link.icon}></SidebarLink>
                                             )
                                      })
                              }
                        </div>
                          
                      {/* b)this is for creating ek greyish color ki horizontal line */}

                          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

                      {/* c) this is for creating settings and logout button in the sidebar */}
                           
                           <div className="flex flex-col">
                                    
                                    <SidebarLink link={{name: "Settings", path: "/dashboard/settings"}} iconName="VscSettingsGear"></SidebarLink>
                                  
                                    
                                    {/* iss button par click krne se aapProfile model ko ye ye data paas hoga */}
                                       <button onClick=
                                             {  ()=>setConfirmationModal({
                                                    text1: "Are you sure?",
                                                    text2: "You will be logged out of your account.",
                                                    btn1Text: "Logout",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: () => dispatch(logout(navigate)),

                                                    /* since modal ki screen confirmationModal function ki wajah se open hui hai to cancel par click krne se screen band ho rhi hai to wo screen band bhi issi confirmationModal() function mei null pass krke hogi */
                                                    /* btn2 handler confirmationModal ko close krne ke liye use hoga */
                                                    btn2Handler: () => setConfirmationModal(null),
                                                  })

                                            }
                                    
                                            className="px-8 py-2 text-sm font-medium text-richblack-300" >
                                             

                                            {/* Logout wala btn */}
                                            <div className="flex items-center gap-x-2 text-[17px]">
                                                         <VscSignOut className="text-lg" />
                                                         <span className="">Logout</span>
                                            </div>
                                     </button>



                           </div>

                 </div>
                 { /* agar confirmationmodal mei kuch value hai to confirmationModal dikha do aur saath mei modal ka data bhi dedo*/}
               
                 {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    )
}

export default Sidebar;