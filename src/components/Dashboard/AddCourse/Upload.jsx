import React, { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"
import { useDropzone } from "react-dropzone"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(viewData || editData || "")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/mp4": [] }
      : { "image/jpeg": [], "image/png": [], "image/jpg": [] },
    onDrop: (accepted) => {
      const file = accepted[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      setSelectedFile(file)
    },
  })

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [name, selectedFile, setValue])

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 min-h-[250px] cursor-pointer transition-all ${
          isDragActive
            ? "border-yellow-400 bg-richblack-600"
            : "border-richblack-500 bg-richblack-700"
        } flex items-center justify-center`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="w-full flex flex-col gap-4">
            {!video ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-auto rounded-md object-cover"
              />
            ) : (
              <Player playsInline src={preview} aspectRatio="16:9" />
            )}
            <button
              type="button"
              onClick={() => {
                setPreview("")
                setSelectedFile(null)
                setValue(name, null)
              }}
              className="text-xs text-richblack-300 underline self-end"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-richblack-200">
            <div className="mb-3 grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="text-sm">
              {isDragActive
                ? "Drop the file here..."
                : `Drag & drop a ${video ? "video" : "image"}, or click to browse`}
            </p>
            <ul className="mt-4 text-xs text-richblack-300 list-disc list-inside">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">{label} is required</span>
      )}
    </div>
  )
}
