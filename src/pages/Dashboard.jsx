import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";

const Dashboard=()=>{

      // AGAR PROFILE YA FIR AUTHENTICATION KA DATA LOAD NHI HUA HAI TO EK LOADING.... SPINNER DIKHA DENGE
       
      const {loading:authLoading} =useSelector((state)=> state.auth);
      // mtlb auth waale file se "loading" variale ki state/value lekar aao

      const {loading:profileLoading} = useSelector((state)=> state.profile);
      // mtlb profile waale file se "loading" variale ki state/value lekar aao
       

     // agar data load nhi hua hai to spinner dikha denge

     if(profileLoading || authLoading)
          {
                 return (
                    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                            <div className="spinner"></div>
                     </div>
               )
          }
 
      // agar profile aut auth ka data load hua hai to ye wala div dikha denge 
      return(
           <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                         
                    {/* side bar */}

                    <Sidebar></Sidebar>
                     
                     {/*  */}
                    <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                                      <Outlet></Outlet>
                                </div>    
                    </div>
           </div>
      )
}

export default Dashboard;