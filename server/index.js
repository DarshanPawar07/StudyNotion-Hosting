
const express=require("express");
const app=express();

const userRoutes =require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payment");
const courseRoutes=require("./routes/Course");

const database=require("./config/1.database");
const cookieParser=require("cookie-parser");

// mai chahta hun ki mera frontend 300 par run ho aur backend 400 par aur mai chahta hun mera forntend backend ki request ko entertain karein - isiliye mujhe "cors" ko lana padega
const cors=require("cors");
const {cloudinaryConnect} =require("./config/3.cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
const PORT =process.env.PORT || 4000;

//database connect 
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
       cors({
           origin:"*",
           credentials:true,
       })  // backend ko frontend ko entertain krne ke liye
)

app.use(
     fileUpload({
            useTempFiles:true,
            tempFileDir:"/tmp",
     })
)

//cloudinary connection

cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);      
//app.use("/api/v1/reach", contactUsRoute);
//default route
app.get("/",(req,res)=>{
      return res.json({
           success:true,
           message:"Your server is up and running..."
      });
})

//activating server
app.listen(PORT,()=>{
      console.log(`App is running at ${PORT}`)
})