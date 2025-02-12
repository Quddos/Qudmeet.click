'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import { MapPin, Briefcase, DollarSign } from 'lucide-react'

export default function JobDetail() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      const data = await response.json()
      // Clean the HTML content
      data.description = data.description?.replace(/<\/?[^>]+(>|$)/g, '\n')
      data.requirements = data.requirements?.replace(/<\/?[^>]+(>|$)/g, '\n')
      setJob(data)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !job) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-20">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-600 mb-4">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {job.jobType}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <div className="prose max-w-none whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Requirements</h2>
          <div className="prose max-w-none whitespace-pre-line">
            {job.requirements}
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700">Debug Why choose us:</p>
          <p className="text-sm text-blue-600">
            (when you apply through us we handle your process and you can only be concerned about receiving your offer letter, we only charge 15% fee from your first Salary)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/jobs/${params.id}/apply`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Through Us
          </button>
          <a
            href={job.directApplyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-center"
          >
            Apply Directly
          </a>
        </div>
      </div>
    </div>
  )
} 