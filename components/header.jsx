'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, FileText, Bot, Menu, X, Briefcase, GraduationCap, Users, Lightbulb, FileSearch, Book, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { getUnreadNotifications } from '@/lib/notifications'
import Cookies from 'js-cookie'


const CursorIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="animate-bounce"
  >
    <path 
      d="M5.08042 12.6101L19.1794 3.89797C19.9307 3.45257 20.8559 4.06576 20.7488 4.91697L18.8836 19.1695C18.7695 20.0724 17.6876 20.3459 17.1953 19.5816L13.9861 14.5552C13.7945 14.2623 13.4523 14.0878 13.0859 14.0878H9.54731C8.9201 14.0878 8.46924 13.4502 8.71259 12.8734L9.89781 10.1051C10.0461 9.75009 10.0461 9.35008 9.89781 8.99507L5.08042 12.6101ZM5.08042 12.6101L10.9607 8.99507" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

export default function Header() {
  const { isSignedIn, userId } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isOp2unityOpen, setIsOp2unityOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  const headerRef = useRef(null)
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsToolsOpen(false)
        setIsOp2unityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Notifications effect
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setUnreadNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [userId])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Don't render anything until mounted
  if (!isMounted) {
    return null // or a loading skeleton that matches server render
  }

  const tools = [
    {
      name: 'QRcode Gen',
      icon: QrCode,
      href: '/tools/qrcode',
      description: 'Generate QR codes easily'
    },
    {
      name: 'File Converter',
      icon: FileText,
      href: '/tools/converter',
      description: 'Convert files between formats'
    },
    {
      name: 'AI Mock Interview',
      icon: Bot,
      href: '/dashboard',
      description: 'Practice with AI interviewer'
    },
    {
      name: 'Business Idea Gen',
      icon: Lightbulb,
      href: '/tools/business-idea',
      description: 'Generate business ideas with AI'
    },
    {
      name: 'Research Analyzer',
      description: 'Analyze research papers and extract key insights',
      href: '/tools/research-analyzer',
      icon: Book, // assuming you're using Lucide icons
    },
    {
      name: 'Resume Analyzer',
      icon: FileSearch,
      href: '/tools/resume-analyzer',
      description: 'AI-powered resume analysis'
    }
  ]

  const opportunities = [
    {
      name: 'Job Board',
      icon: Briefcase,
      href: '/opportunities/job-board',
      description: 'Find your next role'
    },
    {
      name: 'Learning Path',
      icon: GraduationCap,
      href: '/opportunities/learning-path',
      description: 'Grow your skills'
    },
    {
      name: 'Community',
      icon: Users,
      href: '#',
      description: 'Connect with others'
    }
  ]

  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const activeButtonClass = "relative before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-400 before:via-purple-500 before:to-pink-500 before:transform before:origin-left before:scale-x-100 before:-z-10 before:animate-roll text-blue-600"
  const inactiveButtonClass = "hover:bg-gray-100 transition-colors"

  const isAdmin = Cookies.get('admin_username') === 'qudmeet_admin'

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      fetchNotifications() // Refresh notifications
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Update the notifications section in the header
  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
      {unreadNotifications.length > 0 ? (
        <>
          {unreadNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link}
              onClick={() => {
                markAsRead(notification.id)
                setShowNotifications(false)
              }}
              className="block p-4 hover:bg-gray-50 border-b last:border-b-0"
            >
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
          <div className="p-3 bg-gray-50 text-center border-t">
            <Link
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowNotifications(false)}
            >
              View all notifications
            </Link>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No new notifications
        </div>
      )}
    </div>
  )

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-gradient-to-r from-white/80 via-blue-50/80 to-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-gradient-to-r from-white via-blue-50/50 to-white'
      )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 relative">
            <Image
              src="/qudmeet.png"
              alt="Qudmeet Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Qudmeet</span>
            <span className="text-xs text-blue-500 font-bold">.click</span>
            
            <div className="absolute -right-4 top-0">
             
              <CursorIcon />
            </div>
            
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button
                onClick={() => {
                  setIsToolsOpen(!isToolsOpen)
                  setIsOp2unityOpen(false)
                }}
                onMouseEnter={() => {
                  setIsToolsOpen(true)
                  setIsOp2unityOpen(false)
                }}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                  isActive('/tools') ? activeButtonClass : inactiveButtonClass
                )}>
                Tools
              </button>
              <AnimatePresence>
                {isToolsOpen && (
                  <DropdownMenu 
                    items={tools} 
                    onClose={() => setIsToolsOpen(false)} 
                  />
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/about"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                isActive('/about') ? activeButtonClass : inactiveButtonClass
              )}>
              About
            </Link>
            
            <div className="relative group">
              <button
                onClick={() => {
                  setIsOp2unityOpen(!isOp2unityOpen)
                  setIsToolsOpen(false)
                }}
                onMouseEnter={() => {
                  setIsOp2unityOpen(true)
                  setIsToolsOpen(false)
                }}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                  isActive('/opportunities') ? activeButtonClass : inactiveButtonClass
                )}>
                Op2unity
              </button>
              <AnimatePresence>
                {isOp2unityOpen && (
                  <DropdownMenu 
                    items={opportunities} 
                    onClose={() => setIsOp2unityOpen(false)} 
                  />
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/sponsor"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                isActive('/sponsor') ? activeButtonClass : inactiveButtonClass
              )}>
              Sponsor Us
            </Link>
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                  isActive('/dashboard') ? activeButtonClass : inactiveButtonClass
                )}>
                  Dashboard
                </Link>

                {/* Notification Bell - Now part of main nav */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 rounded-full relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && <NotificationsDropdown />}
                </div>

                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Button variant="default" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isSignedIn && (
              <div className="relative mr-2" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Mobile Notifications Dropdown */}
                {showNotifications && <NotificationsDropdown />}
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="space-y-1">
                  <button
                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Tools
                  </button>
                  {isToolsOpen && (
                    <div className="pl-4 space-y-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
                          <tool.icon className="w-5 h-5 mr-2" />
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  About
                </Link>
                <Link
                  href="/sponsor"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  Sponsor Us
                </Link>
                <div className="space-y-1">
                  <button
                    onClick={() => setIsOp2unityOpen(!isOp2unityOpen)}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Op2unity
                  </button>
                  {isOp2unityOpen && (
                    <div className="pl-4 space-y-1">
                      {opportunities.map((opportunity) => (
                        <Link
                          key={opportunity.name}
                          href={opportunity.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
                          <opportunity.icon className="w-5 h-5 mr-2" />
                          {opportunity.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {isSignedIn ? (
                  <>
                    <div className="pt-2">
                      <Button variant="default" className="w-full" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </div>
                    <div className="pt-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifications(!showNotifications)}
                          className="p-2 hover:bg-gray-100 rounded-full relative">
                          <Bell className="w-5 h-5" />
                          {unreadNotifications.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadNotifications.length}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                ) : (
                  <div className="pt-2">
                    <Button variant="default" className="w-full" asChild>
                      <Link href="/sign-in">Login</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add admin dashboard link if user is admin */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Admin Dashboard
          </Link>
        )}
      </div>
    </header>
  );
}

function DropdownMenu({
  items,
  onClose
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onMouseLeave={onClose}
      className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
      style={{ width: '500px', marginLeft: '-200px' }}>
      <div
        className="bg-white rounded-[40px] shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="relative bg-blue-50/50 rounded-[40px]">
          <div className="grid grid-cols-3 gap-4 p-8">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-blue-100/50 transition-colors">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

