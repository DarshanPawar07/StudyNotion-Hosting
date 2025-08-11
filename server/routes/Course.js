
// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// 1) COURSE CONTROLLERS IMPORT

const {
     createCourse,
    getAllCourses,
    getCourseDetails,
    getInstructorCourses,
   editCourse,
    deleteCourse,
    getFullCourseDetails,
 
} = require("../controllers/4.Course")


// 2) TAGS CONTROLLERS IMPORT 

// 3) CATEGORIES CONTROLLERS IMPORT

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,

} = require("../controllers/3.Category")

// 4) SECTIONS CONTROLLERS IMPORT

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/5.Section");

// 5) SUB- SECTIONS CONTROLLERS IMPORT

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/6.subSection")

// 6) RATINGS CONTROLLERS IMPORT

const {
  createRating,
  getAverageRating,
  getAllRatings,
} = require("../controllers/9.ratingAndReview")



const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress")


// 7) IMPORTING MIDDLEWARES

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// To get Course Progress
router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatings)

module.exports = router
