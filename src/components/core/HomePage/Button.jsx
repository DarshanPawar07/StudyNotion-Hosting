
import { Link } from "react-router-dom";

const Button=({children,linkto,active})=>{
       
      return(
          <Link to={linkto}>
                <div  className={`text-center text-[13px] sm:text-[16px] px-4 py-2 sm:px-6 sm:py-3 rounded-md font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] ${
                      active ? "bg-yellow-50 text-black " : "bg-richblack-800"
                        } hover:shadow-none hover:scale-95 transition-all duration-200 `}>
                        
                       {children}
                </div>

          </Link>

      )
}

export default Button;