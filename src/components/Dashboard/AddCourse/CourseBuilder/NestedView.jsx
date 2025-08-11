import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"

import {
  deleteSection,
  deleteSubSection,
} from '../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../slices/courseSlice';
import ConfirmationModal from '../../../Common/ConfirmationModal'
import SubSectionModal from './SubSectionModal'

const NestedView = ({handleChangeEditSectionName}) => {

  const dispatch = useDispatch();
  const {course} = useSelector((state)=>state.course);
  const {token} = useSelector((state)=>state.auth);

  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);

  // To keep the track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);


  const handleDeleteSubSection = async(subSectionId,sectionId) => {
    const result = await deleteSubSection({subSectionId, sectionId, token})
    if(result) {
      const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section)

      const updatedCourse = {...course, courseContent: updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null);
  }

  const handleDeleteSection = async(sectionId) => {
    const result = await deleteSection({sectionId, courseId: course._id, token})
    if(result){
      dispatch(setCourse(result))
    }
    setConfirmationModal(null);
  }

  return (
    <>
        <div className='bg-richblack-700 p-6 rounded-xl mt-8'>
           {course?.courseContent?.map((section)=>(
              <details key={section._id} open className=''>
                  <summary className='flex justify-between items-center text-lg text-richblack-50 border-b-2 border-richblack-500 pb-2 my-2'>
                      <div className='flex gap-2 items-center'>
                          <RxDropdownMenu/>
                          <p>
                              {section.sectionName}
                          </p>
                      </div>
                      <div className='flex items-center gap-3'>
                          <button
                              onClick={()=>handleChangeEditSectionName(section._id, section.sectionName)}
                          >
                              <MdEdit/>
                          </button>
                          <button
                              onClick={()=> setConfirmationModal({
                                Text1: "Delete this section",
                                Text2: "All the lectures in this section will be deleted",
                                btnText1: "Delete",
                                btnText2: "Cancel",
                                btnHandler1: () => handleDeleteSection(section._id),
                                btnHandler2: () => setConfirmationModal(null),
                              })}
                          >
                              <RiDeleteBin6Line/>
                          </button>
                          <span>|</span>
                          <AiFillCaretDown/>
                      </div>
                  </summary>

                  {/* Subsection Div */}
                  <div className='p-2 px-4 flex flex-col gap-2 text-richblack-50'>
                      {section?.subSection.map((data)=>(
                          <div key={data._id}
                              onClick={() => setViewSubSection(data)}
                              className='flex justify-between text-xl items-center border-b-2 border-richblack-500 p-2'
                          >
                              <div className='flex items-center gap-2'>
                                  <RxDropdownMenu/>
                                  <p>
                                      {data.title}
                                  </p>
                              </div>

                              <div
                                  onClick={(e) => e.stopPropagation()}
                                  className='flex gap-3 items-center'
                              >
                                  <button
                                      onClick={()=>setEditSubSection({...data, sectionId: section._id})}
                                  >
                                      <MdEdit/>
                                  </button>
                                  
                                  <button
                                      onClick={()=>
                                          setConfirmationModal({
                                            Text1: "Delete this Sub-Section",
                                            Text2: "This lecture will be deleted",
                                            btnText1:"Delete",
                                            btnText2:"Cancel",
                                            btnHandler1: ()=> handleDeleteSubSection(data._id, section._id),
                                            btnHandler2: ()=> setConfirmationModal(null),
                                          })
                                      }
                                  >
                                      <RiDeleteBin6Line/>
                                  </button>
                              </div>
                          </div>
                      ))}
                      {/* Add New Lecture to Section */}
                      <button
                          className='flex items-center gap-2 text-yellow-50'
                          onClick={()=> setAddSubSection(section._id)}
                      >
                          <FaPlus/>
                          <p>Add Lecture</p>
                      </button>
                  </div>
              </details>
           ))}
        </div>

        {/* Modal Display */}
        {addSubSection ? (
          <SubSectionModal
              modalData={addSubSection}
              setModalData={setAddSubSection}
              add={true}
          />
        )
        :
        viewSubSection ? (
          <SubSectionModal
              modalData={viewSubSection}
              setModalData={setViewSubSection}
              view={true}
          />
        )
        :
        editSubSection ? (
          <SubSectionModal
              modalData={editSubSection}
              setModalData={setEditSubSection}
              edit={true}
          />
        )
        :
        (
          <></>
        )
      }

      {/* Confirmation Modal */}
        {confirmationModal ? (
          <ConfirmationModal modalData={confirmationModal}/>
          )
          :
          (<></>)
        }
    </>
  )
}

export default NestedView