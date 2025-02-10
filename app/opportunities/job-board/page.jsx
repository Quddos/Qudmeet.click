'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Briefcase, Calendar, Building, Search, DollarSign, Filter, X } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import Header from '@/components/header'
import debounce from 'lodash/debounce'

export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [sponsoredJobs, setSponsoredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salary: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const jobCategories = [
    'All',
    'Software Development',
    'Design',
    'Marketing',
    'Sales',
    'Customer Support',
    'Engineering'
  ]

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote']
  const salaryRanges = ['0-50k', '50k-100k', '100k-150k', '150k+']

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [activeCategory, searchTerm, filters, jobs])

  // Memoize filtered jobs for better performance
  const { filteredJobs: memoFilteredJobs, sponsoredJobs: memoSponsoredJobs } = useMemo(() => {
    const sponsored = jobs.filter(job => 
      job.title.toLowerCase().includes('visa') || 
      job.description?.toLowerCase().includes('visa sponsorship')
    )

    const filtered = searchTerm.trim() 
      ? jobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : jobs

    return { filteredJobs: filtered, sponsoredJobs: sponsored }
  }, [jobs, searchTerm])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/jobs')
      const data = await response.json()
      
      setJobs(data)
      setFilteredJobs(data)
      setSponsoredJobs(memoSponsoredJobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    // Category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(job => 
        job.category.toLowerCase().includes(activeCategory.toLowerCase())
      )
    }

    // Search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job =>
        job.jobType.toLowerCase() === filters.jobType.toLowerCase()
      )
    }

    setFilteredJobs(filtered)
  }

  const resetFilters = () => {
    setActiveCategory('All')
    setSearchTerm('')
    setFilters({
      location: '',
      jobType: '',
      salary: ''
    })
  }

  // Real-time search with debounce
  const handleSearch = debounce((term) => {
    if (!term.trim()) {
      setFilteredJobs(jobs)
      return
    }

    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(term.toLowerCase()) ||
      job.company.toLowerCase().includes(term.toLowerCase()) ||
      job.location.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredJobs(filtered)
  }, 300)

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-6">
        {/* Company Logo and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/company-fallback.png'
                }}
              />
            ) : (
              <Building className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {job.title}
            </h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            <span>{job.postedDate}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-gray-500 text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <Link
          href={`/opportunities/job-board/${job.id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Apply Now
        </Link>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
        <Header />
        <div className="container mx-auto pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <Header />
      <div className="container mx-auto pt-20">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {Object.values(filters).some(Boolean) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Job Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Filter by location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={filters.salary}
                onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                className="p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Salary Ranges</option>
                {salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Visa Sponsorship Jobs */}
        {sponsoredJobs.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-bold mb-4">Featured: Visa Sponsorship Jobs</h2>
            <div className="grid gap-4">
              {sponsoredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Job Categories with Marquee */}
        {jobCategories.slice(1).map((category) => {
          const categoryJobs = jobs.filter(job => job.category === category)
          
          if (categoryJobs.length === 0) return null

          return (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {category}
              </h2>
              <Marquee
                gradient={true}
                speed={40}
                gradientColor={[245, 247, 250]}
                pauseOnHover={true}
              >
                <div className="flex gap-6 py-4">
                  {categoryJobs.map((job) => (
                    <div key={job.id} className="w-[350px] flex-shrink-0">
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          )
        })}

        {/* All Jobs Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Available Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">No jobs found matching your criteria</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 