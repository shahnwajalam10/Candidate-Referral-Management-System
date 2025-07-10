"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { candidatesAPI } from "../services/api"
import CandidateCard from "../components/CandidateCard"
import SearchAndFilter from "../components/SearchAndFilter"
import StatsCards from "../components/StatsCards"
import Pagination from "../components/Pagination"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import { FiRefreshCw, FiInfo, FiAlertCircle } from "react-icons/fi"

const Dashboard = () => {
  // State management
  const [candidates, setCandidates] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)

  // Constants
  const QUOTES = useMemo(() => [
    "Talent wins games, but teamwork and intelligence win championships.",
    "Hire character. Train skill.",
    "The secret of success is to hire the best people in the world.",
    "Great vision without great people is irrelevant.",
    "When you hire people smarter than you, you prove you're smarter than them.",
  ], [])

  const [dailyQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // Memoized filtered candidate count
  const filteredCandidateCount = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchTerm 
        ? candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      const matchesStatus = statusFilter !== "all" 
        ? candidate.status === statusFilter 
        : true
      return matchesSearch && matchesStatus
    }).length
  }, [candidates, searchTerm, statusFilter])

  // Fetch data functions
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: pagination.current,
        limit: 10,
        search: searchTerm,
        ...(statusFilter !== "all" && { status: statusFilter })
      }

      const response = await candidatesAPI.getAll(params)
      setCandidates(response.data.candidates)
      setPagination(response.data.pagination)
    } catch (err) {
      console.error("Fetch candidates error:", err)
      setError("Failed to fetch candidates. Please try again.")
      toast.error("Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }, [pagination.current, searchTerm, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await candidatesAPI.getStats()
      setStats(response.data.stats)
    } catch (err) {
      console.error("Fetch stats error:", err)
      toast.error("Failed to fetch statistics")
    }
  }, [])

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCandidates(), fetchStats()])
    }
    
    fetchData()
  }, [fetchCandidates, fetchStats])

  // Event handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [])

  const handleFilter = useCallback((filter) => {
    setStatusFilter(filter)
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [])

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, current: page }))
  }, [])

  const handleCandidateUpdate = useCallback((updatedCandidate) => {
    setCandidates(prev =>
      prev.map(candidate => 
        candidate._id === updatedCandidate._id ? updatedCandidate : candidate
      )
    )
    fetchStats()
    toast.success("Candidate updated successfully")
  }, [fetchStats])

  const handleCandidateDelete = useCallback((candidateId) => {
    setCandidates(prev => prev.filter(candidate => candidate._id !== candidateId))
    fetchStats()
    toast.success("Candidate deleted successfully")
  }, [fetchStats])

  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true)
      await Promise.all([fetchCandidates(), fetchStats()])
      toast.success("Data refreshed successfully")
    } catch (err) {
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchCandidates, fetchStats])

  // Render helpers
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <FiAlertCircle size={48} className="mx-auto" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {searchTerm || statusFilter !== "all" 
          ? "Try adjusting your search or filter criteria." 
          : "No candidates in the system yet."}
      </p>
      {!searchTerm && statusFilter === "all" && (
        <div className="mt-6">
          <button
            onClick={refreshData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  )

  const renderLoadingState = () => (
    <div className="flex justify-center py-12">
      <LoadingSpinner size="large" />
    </div>
  )

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-500 mb-4">
        <FiAlertCircle size={48} className="mx-auto" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading data</h3>
      <p className="mt-1 text-sm text-gray-500">{error}</p>
      <div className="mt-6">
        <button
          onClick={refreshData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Retry
        </button>
      </div>
    </div>
  )

  const renderCandidateGrid = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            onUpdate={handleCandidateUpdate}
            onDelete={handleCandidateDelete}
            colorTheme="black"
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{(pagination.current - 1) * 10 + 1}</span> to{' '}
          <span className="font-medium">{Math.min(pagination.current * 10, pagination.total)}</span> of{' '}
          <span className="font-medium">{pagination.total}</span> candidates
        </p>
        <Pagination
          currentPage={pagination.current}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          colorTheme="black"
        />
      </div>
    </>
  )

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your recruitment pipeline efficiently</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? (
            <>
              <FiRefreshCw className="animate-spin mr-2 h-4 w-4" />
              Refreshing...
            </>
          ) : (
            <>
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Quote Section */}
      {/* <div className=" border-black bg-gray-100 p-4 rounded-lg">
        <p className="mono text-gray-800">"{dailyQuote}"</p>
      </div> */}

      <div className="border-radius-4 border-black bg-white p-5 rounded-r-lg shadow-sm">
  <div className="flex items-start">
    <svg 
      className="flex-shrink-0 h-5 w-5 text-black mt-0.5 mr-3" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
    <p className="font-mono text-gray-800 text-lg leading-relaxed">"{dailyQuote}"</p>
  </div>
</div>

      
      

      {/* Stats Section */}
      <StatsCards stats={stats} loading={loading} colorTheme="black" />

      {/* Main Content Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Candidate Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredCandidateCount} candidates (Page {pagination.current} of {pagination.pages})
            </p>
          </div>
          <div className="w-full md:w-auto">
            <SearchAndFilter 
              onSearch={handleSearch} 
              onFilter={handleFilter} 
              currentFilter={statusFilter} 
              disabled={loading}
              colorTheme="black"
            />
          </div>
        </div>

        {error ? renderErrorState() : 
         loading ? renderLoadingState() : 
         candidates.length === 0 ? renderEmptyState() : 
         renderCandidateGrid()}
      </div>

      {/* Quick Tips Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center mb-4">
          <FiInfo className="h-5 w-5 text-black mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Recruitment Best Practices</h3>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="text-gray-700">Review candidates within 48 hours of application to improve candidate experience</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="text-gray-700">Use structured interviews with standardized questions for objective evaluation</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="text-gray-700">Monitor pipeline metrics weekly to identify and address bottlenecks</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="text-gray-700">Provide timely feedback to all candidates, even those not selected</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard