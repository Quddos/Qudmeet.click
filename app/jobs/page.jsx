'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Briefcase, Calendar, Building, Search } from 'lucide-react'
import Marquee from 'react-fast-marquee'

export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  const jobCategories = [
    'All',
    'Software Development',
    'Design',
    'Marketing',
    'Sales',
    'Customer Support',
    'Engineering'
  ]

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobsByCategory(activeCategory)
  }, [activeCategory, jobs])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      const data = await response.json()
      setJobs(data)
      setFilteredJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterJobsByCategory = (category) => {
    if (category === 'All') {
      setFilteredJobs(jobs)
    } else {
      const filtered = jobs.filter(job => 
        job.category?.toLowerCase() === category.toLowerCase()
      )
      setFilteredJobs(filtered)
    }
  }

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-6">
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
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Apply Now
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      {/* Categories Filter */}
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

      {/* Job Categories Sections */}
      {jobCategories.slice(1).map((category) => {
        const categoryJobs = jobs.filter(job => 
          job.category?.toLowerCase() === category.toLowerCase()
        )

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
            <p className="text-gray-600">No jobs found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}