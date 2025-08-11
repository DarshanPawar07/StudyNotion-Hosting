import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux"
import {createSection, updateSection} from "../../../../services/operations/courseDetailsAPI"
import {setCourse,setEditCourse,setStep,} from "../../../../slices/courseSlice"
import IconBtn from "../../../Common/IconBtn";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    formState : {errors},
  } = useForm();

  const {course} = useSelector((state)=>state.course)
  const {token} = useSelector((state)=>state.auth)

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null);

  const dispatch = useDispatch();

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "")
  }


  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one section")
      return
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in eact secion")
      return
    }
    dispatch(setStep(3));
  }
  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  const handleChangeEditSectionName = (sectionId, sectionName) =>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  }

  const onSubmit = async (data) => {
    setLoading(true)
    let result;
    if(editSectionName){
      result = await updateSection({
        sectionName : data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      },
      token
      )
    }
    else{
      result = await createSection(
        {
          sectionName : data.sectionName,
          courseId: course._id,
        },
        token
      )
    }
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  return (
    <div className='text-white bg-richblack-800 p-6 rounded-xl'>
      {/* Step 2 me aapka swagat h  */}
      <div>
        <h3 className='text-2xl font-semibold mb-4'>
          Course Builder
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}

        >
          <div className='flex flex-col gap-2'>
            <label htmlFor=" ">Section Name <sup>*</sup></label>
            <input 
              className='bg-richblack-700'
              id="sectionName"
              type="text" 
              placeholder='Add a section to build your
               course' 
              {...register("sectionName", {required: true})}
              />
              {errors.sectionName && (
                <span>
                  Section name is required
                </span>
              )}
          </div>
          <div className='flex items-center gap-4 my-4'>
            <IconBtn
              type="submit"
              disabled={loading}
              text={editSectionName ? "Edit Section Name" : "Create Section"}
              outline={true}
            >
              <IoAddCircleOutline size={20} className="text-yellow-50" />
            </IconBtn>
            {editSectionName && (
              <button 
                type="button"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>

        </form>
        {course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}
        <div className='flex items-center gap-5 justify-end mt-4'>
          <button 
            onClick={goBack}
          >
            Back
          </button>
          <button className='yellowButton flex items-center gap-2' disabled={loading} text="Next" onClick={goToNext}>
            Next
            <MdNavigateNext size={20}/>
          </button>
        </div>

      </div>
    </div>
  )
}

export default CourseBuilderForm
