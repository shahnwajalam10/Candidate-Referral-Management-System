"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { candidatesAPI } from "../services/api"
import toast from "react-hot-toast"
import { Eye, Trash2, Mail, Phone, CalendarDays, UserCircle2 } from "lucide-react"
import StatusBadge from "./StatusBadge"
import StatusDropdown from "./StatusDropdown"

const CandidateCard = ({ candidate, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    try {
      const response = await candidatesAPI.updateStatus(candidate._id, newStatus)
      onUpdate(response.data.candidate)
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
      await candidatesAPI.delete(candidate._id)
      onDelete(candidate._id)
      toast.success("Candidate deleted successfully")
    } catch (error) {
      toast.error("Failed to delete candidate")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={`relative border border-gray-200 rounded-lg p-6 transition-all duration-200 ${
        isHovered ? "shadow-lg border-gray-300" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with name and status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-full">
            <UserCircle2 className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.jobTitle}</p>
          </div>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      {/* Candidate details */}
      <div className="space-y-3 mb-5 pl-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          <span>{candidate.phone || "Not provided"}</span>
        </div>
        {candidate.referredBy?.name && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-1">Referred by:</span>
            <span>{candidate.referredBy.name}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
          <span>Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Link
            to={`/candidates/${candidate._id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Details
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <StatusDropdown
            currentStatus={candidate.status}
            onStatusChange={handleStatusUpdate}
            disabled={isUpdating}
            className="min-w-[120px]"
          />

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-1.5 rounded-md transition-colors ${
              isDeleting ? "text-gray-400" : "text-gray-500 hover:text-red-600 hover:bg-red-50"
            }`}
            aria-label="Delete candidate"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading indicator for status update */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  )
}

export default CandidateCard
