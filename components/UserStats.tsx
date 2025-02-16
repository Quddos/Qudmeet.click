'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Stats {
  totalJobs: number
  totalInterviews: number
}

const messages = [
  { text: "We are parts of your journey you chose", color: "text-blue-600" },
  { text: "A free AI to get your task done", color: "text-green-600" },
  { text: "Qudmeet.click get you clicked with whats best for you", color: "text-purple-600" }
]

export default function UserStats() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalInterviews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchStats() {
      try {
        const [jobsRes, interviewsRes] = await Promise.all([
          fetch('/api/jobs', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch('/api/mock-interviews/count', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        ])

        if (!jobsRes.ok || !interviewsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [jobsData, interviewsData] = await Promise.all([
          jobsRes.json(),
          interviewsRes.json(),
        ])

        setStats({
          totalJobs: jobsData.length || 0,
          totalInterviews: interviewsData?.count || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchStats()
    }
  }, [mounted])

  // Rotate through messages every 3 seconds when there's an error
  useEffect(() => {
    if (error) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [error])

  if (!mounted) return null

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`text-2xl font-bold text-center ${messages[messageIndex].color}`}
          >
            {messages[messageIndex].text}
          </motion.p>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Available Jobs</h3>
        <p className="text-4xl font-bold text-blue-600">
          {stats.totalJobs.toLocaleString()}+
        </p>
        <p className="text-gray-600 mt-2">Open Positions</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Mock Interviews</h3>
        <p className="text-4xl font-bold text-green-600">
          {stats.totalInterviews.toLocaleString()}
        </p>
        <p className="text-gray-600 mt-2">Completed Sessions</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Job Applications</h3>
        <p className="text-4xl font-bold text-purple-600">
          300+
        </p>
        <p className="text-gray-600 mt-2">Submitted Applications</p>
      </div>
    </div>
  )
} 