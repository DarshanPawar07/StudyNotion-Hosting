
import ChangeProfilePicture from "./ChangeProfilePicture";
import EditProfile from "./EditProfile";
import ChangePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";

const Settings=()=>{

    return(
    
        
        <div>
           
            {/* 1) Change Profile picture */}
              <ChangeProfilePicture></ChangeProfilePicture>

            {/* 2) Change Profile information */}
                <EditProfile></EditProfile>


            {/* 3) Change password */}
               <ChangePassword></ChangePassword>


            {/* 4) delete account*/}
            <DeleteAccount></DeleteAccount>

        </div>
    )
}

export default Settings;