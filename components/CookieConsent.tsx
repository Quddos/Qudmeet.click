'use client'
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent')
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleConsent = () => {
    // Store consent in localStorage
    localStorage.setItem('cookieConsent', 'true')
    // Hide the consent banner
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 w-full bg-gray-100 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-700 text-center sm:text-left">
          This website uses cookies and Google AdSense to improve your experience.
          By continuing to use this site, you accept our use of cookies.
        </p>
        <button 
          onClick={handleConsent}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  )
} 