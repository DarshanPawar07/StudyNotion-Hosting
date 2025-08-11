import IconBtn from "../../Common/IconBtn";
import { useNavigate } from "react-router-dom";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useState,useEffect,useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { updateDisplayPicture } from "../../../services/operations/SettingsApi";

const ChangeProfilePicture=()=>{

    const navigate=useNavigate();
    const {user} =useSelector((state)=>state.profile)

    // hum imageFile naam ka variable bana rhe hai jismei jo uploaded image hogi vo is variable ke andar store hogi
    const[imageFile, setImageFile] =useState(null);
    
   /* "previewSource" ke andar hum  ek previewed version image ka vo store kr rhe hai jo user ne upload kari hai 
      iska purpose is something that can be shown immediately in the browser before uploading it anywhere  */
    const [previewSource,setPreviewSource]=useState(null);
    
    /* ye isi liye use kiya hai ki ek image upload krne ke baad dusri image select kari to file 
      change ho gayi iske liye ye use kiya hai */
    const handleFileChange = (e) => 
         {
               const file = e.target.files[0]   // get the first file selected 
               
             if (file)
                 {
                    setImageFile(file)
                    previewFile(file)
                 }
         }

    const previewFile = (file) => 
        {
               const reader = new FileReader();
               reader.readAsDataURL(file);  // convert file to base64 string (URL format)
               reader.onloadend = () => 
                    {
                         setPreviewSource(reader.result);  // save the preview URL
                   };
        }

    {/* This runs automatically when imageFile changes. */}
    useEffect(() => 
        {
             if (imageFile)
                   {
                       previewFile(imageFile);  // generate a preview whenever imageFile changes
                   }
        }, [imageFile]);

      /* this creates a reference variable "fileInput" */
      const fileInputRef = useRef(null)
    
      const handleClick = () =>
        {
           fileInputRef.current.click()
           // fileInputRef.current will point to the actual DOM element of the <input type="file" />.
        }

     const [loading, setLoading] = useState(false);

     {/* function to handle fileUpload */}

       const handleFileUpload = () => {

         try {

           console.log("uploading...")

           setLoading(true)

           // FormData is a built-in JavaScript object used to send form data, especially files, to a server.
           const formData = new FormData()

           //formData mei se "imageFile" jo bhi hogi usko lelo aur "displayPicture" naam se store karo
           formData.append("displayPicture", imageFile)

           // console.log("formdata", formData)

           /* Sends the file to the server using a Redux action (updateDisplayPicture) by passing token for authentication
               and the "formData" as an actual image file */
           
            /* "updateDisplayPicture" ye function SettingsApi mei likha hai kyunki vahi Api se connect karegi aur DB mei changes karegi */

           dispatch(updateDisplayPicture(token, formData)).then(() => {
             setLoading(false)
           })

         }

        catch (error) {
           console.log("ERROR MESSAGE - ", error.message)
         }
       }
   
        const dispatch=useDispatch();
        const { token } = useSelector((state) => state.auth)
    return(
         
        <>

             <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
                     
                    <div className="flex items-center gap-x-4">
                                 
                            <img src={ previewSource|| user?.image} alt={`profile-${user?.firstName}`}
                                 className="aspect-square w-[78px] rounded-full object-cover">
                                        
                            </img>

                            <div className="space-y-2">

                                  <p> Change Profile Picture</p>

                                  <div className="flex flex-row gap-3">

                                            <input type="file" 
                                                   ref={fileInputRef}  // jo input mei file aayi hai vo "fileInputRef" iss variable mei store kr do
                                                   onChange={handleFileChange}
                                                   className="hidden"
                                                   accept="image/png, image/gif, image/jpeg">

                                            </input>

                                            <button onClick={handleClick}
                                                    disabled={loading}
                                                    className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                                            >
                                               Select 
                                             </button>

                                             <IconBtn text={loading ? "Uploading..." : "Upload"}
                                                      onclick={handleFileUpload}
                                                      >
                                                                        {!loading && (
                                                                          <FiUpload className="text-lg text-richblack-900" />
                                                                        )} 
                                                      </IconBtn>
                                  </div>

                            </div>
                     </div>

                </div>
        </>

    )
}

export default ChangeProfilePicture;