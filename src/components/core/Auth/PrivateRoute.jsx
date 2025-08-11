
 /* iski resposiblity ye hai ki sirf loggedin user hi iske andar ke route ko use kr paaye */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

    

const PrivateRoute=({children})=>{
 
    const {token} =useSelector((state)=>state.auth);
       
    /* agar token null nhi hai mtlb user loggedin hai to uss user ko uss route ko access krne do mtlb children waale element ko dikha do */
   
    if(token !== null)
       {
          return children;
       }
 
    /* agar loggedin nhi hai to navigate krdo loginpage par */
    else 
    {
         return <Navigate to="/login"></Navigate>
    }
   
    
}

export default PrivateRoute;