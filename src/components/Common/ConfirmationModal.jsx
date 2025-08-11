
import IconBtn from "./IconBtn";

{/* Code for creating a modal  - Ex - it is used after clicking on logout button in sidebar in my profile*/}

const ConfirmationModal=({modalData})=>{

            {/* Modal ke andar kya kya aa rha hai - 
                a) modal ke bahar wala poora screen blur ho rahi hai
                b) ek squarish modal(box) hai jismei "Are You sure" aisa text aa rha hai
                    aur 2 buttons hai ek "logout" ka dusra "cancel" ka
           */}

     return(

        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
                  
                  <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
                          {/* Modal ki heading */}
                          <p className="text-2xl font-semibold text-richblack-5">{modalData.text1}</p>

                          {/* Modal ka paragraph wala text */}
                          <p className="mt-3 mb-5 leading-6 text-richblack-200">{modalData.text2}</p>
                         
                           {/* buttons */}
                          <div className="flex items-center gap-x-4">
                                 {/* Logout wala btn */}
                                 <IconBtn onclick={modalData?.btn1Handler} text={modalData?.btn1Text} ></IconBtn>
                                 
                                  {/* Cancel wala button */}
                                  <button  className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
                                          onClick={modalData?.btn2Handler}>
                                          {modalData?.btn2Text}
                                   </button>
                          </div>
                  </div>
                
        </div>
     )
}

export default ConfirmationModal;