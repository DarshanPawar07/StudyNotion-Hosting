import { useSelector } from "react-redux";

import RenderTotalAmount from "./RenderAmount";
import RenderCartCourses from "./RenderCartCourses";

const Cart=()=>{


    /* since humei cart ke andar ke total Items kitne hai vo bhi dikhana hai isiliye "total Items" bhi chahiye to 
       hum uske liye "cartSlice" ke andar 2 attributes hai "total" aur "totalItems" vo dono cheezein lagegi */
    const {total,totalItems}=useSelector((state)=>state.cart);


    return(
        <div>
              
              <h1 className="mb-14 text-3xl font-medium text-richblack-5">Your Cart</h1>

              {/* to show totalItems in cart */}
              <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">{totalItems} Courses In Cart</p>

              {/* agar totalItem ki value > 0 hai to har ek CourseItem ka card dikha do 
                  aur ek totalAmount waali div hogi usko display karna hai  */}
                
              {
                 totalItems > 0 ?
                  (<div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
                         <RenderCartCourses></RenderCartCourses>
                         <RenderTotalAmount></RenderTotalAmount>
                  </div>):

                  (<p className="mt-14 text-center text-3xl text-richblack-100">Your Cart Is Empty</p>)
              }



        </div>
    )
}

export default Cart;