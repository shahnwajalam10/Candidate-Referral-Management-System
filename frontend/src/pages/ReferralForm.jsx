"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { candidatesAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"
import { Upload, X } from "lucide-react"

const ReferralForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    document.getElementById("resume").value = ""
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("jobTitle", data.jobTitle)
      if (data.notes) formData.append("notes", data.notes)
      if (selectedFile) formData.append("resume", selectedFile)

      await candidatesAPI.create(formData)
      toast.success("Candidate referred successfully!")
      reset()
      setSelectedFile(null)
      navigate("/dashboard")
    } catch (error) {
      const message = error.response?.data?.message || "Failed to refer candidate"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Refer a Candidate</h1>
            <p className="mt-2 text-gray-600">Help us find the best talent by referring qualified candidates.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Candidate Name *
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black focus:outline-none transition"
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black focus:outline-none transition"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[1-9][\d]{0,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black focus:outline-none transition"
                  placeholder="+1234567890"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Job Title *
                </label>
                <input
                  {...register("jobTitle", {
                    required: "Job title is required",
                    minLength: {
                      value: 2,
                      message: "Job title must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black focus:outline-none transition"
                  placeholder="Software Engineer"
                />
                {errors.jobTitle && <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                Resume (PDF only)
              </label>
              <div className="mt-1">
                {!selectedFile ? (
                  <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition">
                    <div className="space-y-3 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="flex justify-center text-sm text-gray-600">
                        <label
                          htmlFor="resume"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
                        >
                          <span>Choose a file</span>
                          <input id="resume" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, max 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-black text-white p-2 rounded">
                        <Upload className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-black transition"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 uppercase tracking-wider">
                Additional Notes
              </label>
              <textarea
                {...register("notes", {
                  maxLength: {
                    value: 500,
                    message: "Notes cannot exceed 500 characters",
                  },
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-black focus:border-black focus:outline-none transition"
                placeholder="Skills, experience, or why you're recommending this candidate..."
              />
              {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Submit Referral"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReferralForm