
import './App.css';
import {Route, Routes} from "react-router-dom"
import Home from './pages/Home';
import Navbar from './components/Common/Navbar';
import Signup from "../src/pages/Signup"
import OpenRoute from './pages/OpenRoute';
import Login from "./pages/Login"
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/updatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './components/Dashboard/MyProfile';
import { Outlet } from 'react-router-dom';
import Dashboard from "../src/pages/Dashboard"
import PrivateRoute from './components/core/Auth/PrivateRoute';
import ErrorPage from './pages/Error';
import Settings from './components/Dashboard/Settings';
import EnrolledCourses from './components/Dashboard/EnrolledCourses';
import Cart from './components/Dashboard/Cart';
import { ACCOUNT_TYPE } from './utils/constants';
import { useSelector } from 'react-redux';
import AddCourse from './components/Dashboard/AddCourse';


function App() {

            const {user}=useSelector((state)=>state.profile);
            
  return (
    
    

   <div className="App w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">    
            
          <Navbar></Navbar>
         
          <Routes>
                 <Route path="/" element={<Home/>} > </Route>
                 <Route path="/about" element={<About />} />

                 <Route path="signup" 
                          element= { <OpenRoute>
                                               <Signup></Signup>
                                      </OpenRoute>
                                    }>

                 </Route>

                 <Route path='login' element={  <OpenRoute>
                                                       <Login></Login>
                                               </OpenRoute>}>
                       
                 </Route>

                 <Route path='forgot-password' element={  <OpenRoute>
                                                          <ForgotPassword></ForgotPassword>
                                               </OpenRoute>}>
                       
                   </Route>

                    {/* update password ke link ke end mei ek "id" mtlb "token/string" bhi hoga ek */}

                    <Route path='update-password/:id' 
                            element={  <OpenRoute>
                                               <UpdatePassword></UpdatePassword>
                                       </OpenRoute>
                                   }>
                    </Route>
                     
                     {/* Route for verify- email */}

                    <Route path='verify-email' 
                            element={  <OpenRoute>
                                               <VerifyEmail></VerifyEmail>
                                       </OpenRoute>
                                   }>
                    </Route>


                    {/* contact wala route <openRoute></openRoute>  ke andar nhi hai - hum <openRoute></openRoute>
                         ke andar bas wahi waale component rakh rahein hai jin par visit krne ke liye authentication 
                         ki jarurat hai  
                   */}
                   <Route path='contact' 
                            element={  <Contact></Contact>  }>
                    </Route>
                    
                    
                    {/* ye dashboard ke andar jo sidebar hai na uske liye hai
                        PrivateRoute - iska ye mtlb hai k9i sirf loggedIn users hio iss route ko access kr paaye */}
                    <Route element=
                            {
                                <PrivateRoute>
                                         <Dashboard></Dashboard>
                                </PrivateRoute>
                            }>
                              
                             {/* My Profile Route -  */}

                            <Route path='dashboard/my-profile' 
                                    element={ <MyProfile></MyProfile>}>
                            </Route>

                             {/*Settings Route -  */}
                              
                            <Route path='dashboard/settings' 
                                    element={ <Settings></Settings>}>
                            </Route>

                            {/*Enrolled Courses Route -  */}
                              
                            
                            
                            {  
                                
                                user?.accountType === ACCOUNT_TYPE.STUDENT && (
                                       <>   
                                               
                                                 <Route path='dashboard/enrolled-courses' 
                                                       element={<EnrolledCourses></EnrolledCourses>}>
                                                       
                                                 </Route>

                                                <Route path='dashboard/cart' 
                                                            element={<Cart></Cart>}>
                                                 </Route>    
                                      </>
                                 )
                            }


                            {  
                                
                                 user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                                       <>   
                                               
                                                 <Route path='dashboard/add-course' 
                                                       element={<AddCourse></AddCourse>}>
                                                       
                                                 </Route>

                                                  
                                      </>
                                 )
                            }

 
                </Route>  
                 


                    


                     

                     {/* jis bhi case mei abhi tak jitne routes mention kiye hai unke alawa koi 
                           bhi dusra route aaye to error page dikha dena */}
                    <Route path='*' 
                           element={<ErrorPage></ErrorPage>}>
                
                     </Route>

                         
                   

          </Routes> 


     
    </div>
  );
}

export default App;
