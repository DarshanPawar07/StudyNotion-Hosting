

{/* This will be used in Conformation modal */}

const IconBtn=({
     text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) =>{

    return(

        <button disabled={disabled} onClick={onclick}  className={`flex items-center ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
      type={type}>
                {
                     /* AGAR "childern" variable mei kuch hai to */

                     children ?
                     // agar children mei kuch hai to..
                      ( 
                          <>
                             <span  className={`${outline && "text-yellow-50"}`}>
                                   {text}
                             </span>
                             {children}
                          </>

                      ):
                      // agar children hai nhi to text ko render kr do
                      (text)
                }
        </button>
    )
}

export default IconBtn;