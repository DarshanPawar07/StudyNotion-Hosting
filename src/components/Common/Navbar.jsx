
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart,AiOutlineMenu } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import {ACCOUNT_TYPE} from "../../utils/constants"




const Navbar=()=>{
          
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile);
    const {totalItems} =useSelector((state)=>state.cart);
   
    const location=useLocation();
    
    // FUNCTION FOR api call - to fetch catalog/courses list

     const [subLinks,setSubLinks] =useState([]);
     const [loading, setLoading] = useState(false);

     

    useEffect(()=>{ 
            ;
             (   async() =>{
                  setLoading(true)

                  try{
                     
                     const res = await apiConnector("GET", categories.CATEGORIES_API)
                      setSubLinks(res.data.data);
                      
                      if (res?.data?.data) 
                        {
                             setSubLinks(res.data.data);
                        }
                     else {
                               console.warn("API returned no data:", res);
                                       setSubLinks([]); // fallback to empty
                          }
                  }

                  catch(error)
                    {
                        console.log("Could not fetch Categories.", error)
                    }
                 
                  setLoading(false)
             } )()
          
        },[])

    const matchRoute=(route)=>{
        // ye fun true return karega agar current route aur jis section par click kiya hai uska path
       
        return matchPath({path:route}, location.pathname);

    }


    return(

        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
              location.pathname !== "/" ? "bg-richblack-800" : ""
              } transition-all duration-200`}>
             
             <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                    
                     <Link to="/">
                            <img src={logo} width={160} height={32} loading="lazy" alt="StudyNotion Logo" ></img>
                     </Link>

                     {/* NavLinks */}

                     <nav className="hidden md:block">
                           <ul className="flex gap-x-6 text-richblack-25">
                                   {
                                       NavbarLinks.map((link,index)=>(
                                                      
                                               <li key={index}>
                                                         
                                                         {
                                                            link.title==="Catalog"?
                                                            

                                                            // agar title Catalog hai to... 

                                                            (  
                                                                  <>
                                                                <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                                                                          matchRoute("/catalog/:catalogName")
                                                                                          ? "text-yellow-25"
                                                                                         : "text-richblack-25"}`
                                                                                     }>

                                                                     <p>{link.title}</p>
                                                                     <IoIosArrowDown />
                                                                       
                                                                           {/* squarish shape */}
                                                                     <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                                                 
                                                                                  {/* triangular shape */}
                                                                                  <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"> </div>
                                                                                   
                                                                                    {/* List of courses or sublinks */} 

                                                                                  {      
                                                                                       loading ? (
                                                                                                    <p className="text-center">Loading...</p>
                                                                                                 ) : 

                                                                                          subLinks.length ? 
                                                                                           // mtblb sublinks ki length exist karti hai mtlb courses hai
                                                                                           (
                                                                                                 <>
                                                                                                 { subLinks?.filter( (subLink) => subLink?.courses?.length > 0)?.map((subLink, i) => 
                                                                                                        ( <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                                                                                                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                                                                                              key={i} >
                                                                                                                                              <p>{subLink.name}</p>
                                                                                                           </Link>
                                                                                                        ))
                                                                                                }

                                                                                                </>
                                                                                            
                                                                                          ) :
                                                                                          // mtlb sublinks ki length exist nhi krti mtlb no courses
                                                                                           (
                                                                                                <p className="text-center">No Courses Found</p>
                                                                                           )
                                                                                  }
                                                                    </div> 

                                                                </div>
                                                                 </>
                                                            ):

                                                            // agar title Catalog nahi hai to...

                                                              (    
                                                                   <Link to={link?.path}>

                                                                       <p className={`${matchRoute(link?.path)? "text-yellow-25" :"text-richblack-25"}`}>{link.title}</p>

                                                                   </Link> 
                                                               )

                                                         }
                                               </li>
                                       ))
                                   }
                           </ul>

                     </nav>

                     {/* Login / Signup Dashboard */}

                     <div className="hidden items-center gap-x-4 md:flex">
                            
                            {    
                                // agar existing user hai aur vo instructor hai to..

                                user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR &&(

                                    <Link to="/dashboard/cart" className="relative">

                                                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" ></AiOutlineShoppingCart>
                                                  {
                                                      totalItems >0 && (
                                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                                             {totalItems}
                                                        </span>
                                                      )
                                                  }
                                    </Link>
                                )
                            }

                            {
                                  // user loggedin hai ya nahi

                                  // a) agar user loggein nhi hai to mujhe login wala button dikhana hai

                                  token ===null && (

                                      <Link to="/login">
                                          <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                                 Log in
                                          </button>
                                      </Link>
                                  )
                            }

                            {
                                 token === null && (
                                      <Link to="/signup">
                                          <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                                 Sign Up
                                          </button>
                                      </Link>
                                 )
                            }

                             {/* agar token null nahi hai to*/}

                             {
                                    token !==null && <ProfileDropDown></ProfileDropDown>
                             }
                             
                     </div>

                      <button className="mr-4 md:hidden">
                               <AiOutlineMenu fontSize={24} className="text-[#AFB2BF]" />
                     </button>


             </div>
        </div>
    )
}

export default Navbar;