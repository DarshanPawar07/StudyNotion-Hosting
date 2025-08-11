import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useDispatch } from "react-redux";

import { removeFromCart } from "../../../slices/cartSlice";



const RenderCartCourses=()=>{
     
    {/* jo humei courses "add to cart" karein the vo data humne ek attribute mei store kiya tha jiska naam "cart" tha jo ki cartSlice mei present hai */}
    const{cart} =useSelector((state)=>state.cart);

    /* dispatch lagega kyunki humei remove from cart wala function call krna hai cartSlice mei se */

     const dispatch =useDispatch();

    return(
        <div className="flex flex-1 flex-col">
           
           {/* Hemi idhar Cart ke andar jo jo courses padein hai unko reder karna chahta 
               hun to vo cart ka data mei kaha se lekar aau ? "CartSlice" ke andar se "cart" 
               naam ka ek attribute hai vaha se uss attribute par .map() function laga denge*/}

               {
                    cart.map((course,index)=>{
                         
                         <div key={course._id}
                              className={`flex w-full flex-wrap items-start justify-between gap-6 
                              ${index !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"} ${index !== 0 && "mt-6"} `}>

                                 <div className="flex flex-1 flex-col gap-4 xl:flex-row">

                                      <img  src={course?.thumbnail}
                                            alt={course?.courseName}
                                            className="h-[148px] w-[220px] rounded-lg object-cover">
                                        
                                     </img>

                                      <div className="flex flex-col space-y-1">

                                           <p className="text-lg font-medium text-richblack-5">
                                                         {course?.courseName}
                                           </p>

                                           <p className="text-sm text-richblack-300">
                                                      {course?.category?.name}
                                           </p>

                                           <div className="flex items-center gap-2">
                                                        { /* average rating ki jo api thi na usko call krke yaha par averaghe rating dikhani hai iss course ki */}
                                                    
                                                       <span className="text-yellow-5">4.5</span>
                                                     
                                                     <ReactStars count={5} size={20}
                                                                 value={course?.ratingAndReviews?.length}
                                                                 edit={false} 
                                                                 activeColor="#ffd700"
                                                                 emptyIcon={<FaStar />} 
                                                                 fullIcon={<FaStar />} 

                                                       />

                                                     {/* number of rating and reviews */}
                                                     <span className="text-richblack-400">
                                                                {course?.ratingAndReviews?.length}
                                                     </span>
                                           </div>

                                      </div>
                                 </div>

                                 <div className="flex flex-col items-end space-y-2">   

                                        {/* remove course from cart wala button jispar onclick krne se "removeFromCart" funtion 
                                            jo ki cartSlice mei present hai vo call ho jayega */}

                                        <button onClick={dispatch(removeFromCart(course._id))}
                                                 className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200">
                                                 
                                                 <RiDeleteBin6Line />
                                                 <span>Remove</span>
                                        </button>

                                        {/* price */}

                                        <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {course?.price}</p>
                                         
                                 </div>
                                 
                         </div>
                    })
               } 

        </div>
    )
}

export default RenderCartCourses ;