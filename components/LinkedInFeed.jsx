'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, ExternalLink, ThumbsUp, MessageSquare, Share2, Clock } from 'lucide-react'
import Link from 'next/link'

export default function LinkedInFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Sample LinkedIn posts (since direct API access requires authentication)
  // In a production environment, you would fetch these from a backend API
  // that handles the LinkedIn API authentication
  useEffect(() => {
    // Simulating API fetch with sample data
    const samplePosts = [
      {
        id: 'post1',
        author: 'Qudmeet',
        authorImage: '/logo.png',
        date: '2 days ago',
        content: 'Excited to announce our latest AI tool for resume analysis! Try it out today and get personalized feedback on your resume.',
        likes: 45,
        comments: 12,
        shares: 8
      },
      {
        id: 'post2',
        author: 'Qudmeet',
        authorImage: '/logo.png',
        date: '1 week ago',
        content: 'Our AI interview practice tool has helped over 500 users prepare for their dream jobs. What features would you like to see next?',
        likes: 78,
        comments: 23,
        shares: 15
      },
      {
        id: 'post3',
        author: 'Qudmeet',
        authorImage: '/logo.png',
        date: '2 weeks ago',
        content: 'Tips for optimizing your resume for ATS systems: 1) Use keywords from the job description, 2) Keep formatting simple, 3) Quantify achievements, 4) Tailor for each application.',
        likes: 120,
        comments: 35,
        shares: 42
      }
    ]

    setTimeout(() => {
      setPosts(samplePosts)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Updates</h2>
          <Link 
            href="https://www.linkedin.com/company/105658013" 
            target="_blank"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            <span>Follow us on LinkedIn</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                      <img 
                        src={post.authorImage} 
                        alt={post.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-gray-500 text-sm border-t pt-3">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>{post.shares}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link 
            href="https://www.linkedin.com/company/105658013"
            target="_blank"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Updates on LinkedIn
          </Link>
        </div>
      </div>
    </section>
  )
}
