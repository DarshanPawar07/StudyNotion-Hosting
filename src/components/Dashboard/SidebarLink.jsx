
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux";
import { matchPath, NavLink, useLocation } from "react-router-dom";

const SidebarLink=({link,iconName})=>{
    
    const Icon=  Icons[iconName];
    // ye location hum isiliye use kr kr hai taaki humei pata chal paaye abhi hum kis route par khade hai aur usko sidebar mei yeelow background dena hai
    const location = useLocation();
    const dispatch=useDispatch(); 
    
    // match route ka function -     // ye match route hum isiliye use kr kr hai taaki humei pata chal paaye abhi hum kis route par khade hai aur usko sidebar mei yeelow background dena hai - aur uss tab ko mai currently active dikha paau

    const matchRoute =(route)=>{
         
        return matchPath({path:route},location.pathname)
    }


    return(
        <NavLink to={link.path} 
                   // onClick={() => dispatch(resetCourseState())}
                  className={`relative px-8 py-2 text-[17px] font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`} >
                    
                 { /* sidebar jo abhi current tab hai uske left mei ek yellow border thi ye uske liye*/}
                   {/* ye span tag tabhi visible hoga agar route match kr jayega */}
                  <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" :"opacity-0"}`}>

                  </span>

                  <div className="flex items-center gap-x-2">
                             <Icon className="text-lg"></Icon>
                             <span> {link.name}</span>
                  </div>


        </NavLink>
    )
}

export default SidebarLink;