"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { candidatesAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"
import StatusBadge from "../components/StatusBadge"
import StatusDropdown from "../components/StatusDropdown"
import { ArrowLeft, Mail, Phone, Calendar, User, Download, Trash2 } from "lucide-react"

const CandidateDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchCandidate()
  }, [id])

  const fetchCandidate = async () => {
    try {
      const response = await candidatesAPI.getById(id)
      setCandidate(response.data.candidate)
    } catch (error) {
      toast.error("Failed to fetch candidate details")
      navigate("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    try {
      const response = await candidatesAPI.updateStatus(id, newStatus)
      setCandidate(response.data.candidate)
      toast.success("Status updated successfully")
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return
    }

    setIsDeleting(true)
    try {
      await candidatesAPI.delete(id)
      toast.success("Candidate deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Failed to delete candidate")
    } finally {
      setIsDeleting(false)
    }
  }

  // Get the base API URL for file downloads
  const getResumeUrl = () => {
    if (!candidate?.resumeUrl) return null

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    // Remove '/api' from the end to get the server base URL
    const serverBaseUrl = baseUrl.replace("/api", "")
    return `${serverBaseUrl}${candidate.resumeUrl}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Candidate not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center group text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3">
            <StatusDropdown
              currentStatus={candidate.status}
              onStatusChange={handleStatusUpdate}
              disabled={isUpdating}
            />

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Candidate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Candidate header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{candidate.jobTitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={candidate.status} />
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left column */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-black text-white p-2 rounded-full mr-3">
                    <Mail className="h-4 w-4" />
                  </span>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Email</p>
                      <a
                        href={`mailto:${candidate.email}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {candidate.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Phone</p>
                      <a
                        href={`tel:${candidate.phone}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {candidate.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-black text-white p-2 rounded-full mr-3">
                    <User className="h-4 w-4" />
                  </span>
                  Referral Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Referred By</p>
                      <p className="text-gray-900">{candidate.referredBy?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Date Added</p>
                      <p className="text-gray-900">
                        {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Resume */}
              {candidate.resumeUrl && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-black text-white p-2 rounded-full mr-3">
                      <Download className="h-4 w-4" />
                    </span>
                    Resume
                  </h3>
                  <a
                    href={getResumeUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </a>
                </div>
              )}

              {/* Notes */}
              {candidate.notes && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-black text-white p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </span>
                    Additional Notes
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{candidate.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
              <span>
                <span className="font-medium">Created:</span> {new Date(candidate.createdAt).toLocaleString()}
              </span>
              <span className="mt-1 md:mt-0">
                <span className="font-medium">Last Updated:</span> {new Date(candidate.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDetails
