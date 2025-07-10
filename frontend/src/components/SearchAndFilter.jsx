"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"

const SearchAndFilter = ({ onSearch, onFilter, currentFilter }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  const handleFilterChange = (e) => onFilter(e.target.value)
  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search Input - Perfectly Sized */}
      <div className="relative flex-1">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${isFocused ? 'text-black' : 'text-gray-400'}`}>
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdown - Compact and Clean */}
      <div className="relative w-[180px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Filter className="h-4 w-4" />
        </div>
        <select
          value={currentFilter}
          onChange={handleFilterChange}
          className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilter