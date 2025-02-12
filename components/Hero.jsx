'use client'

import { motion } from 'framer-motion'
import { QrCode, FileText, Bot, GraduationCap, Briefcase, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FileConverterModal from './FileConverterModal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MouseIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{
      y: [0, -3, 0],
      scale: [1, 0.95, 1]
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="inline-block mx-1"
  >
    <path
      d="M12 4C8.5 4 6 6.5 6 10V14C6 17.5 8.5 20 12 20C15.5 20 18 17.5 18 14V10C18 6.5 15.5 4 12 4Z"
      className="stroke-[url(#gradient)]"
      strokeWidth="1.5"
      fill="white"
    />
    <path
      d="M12 8V12"
      className="stroke-[url(#gradient)]"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,100;100,100"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </motion.svg>
)

const services = [
  {
    icon: QrCode,
    name: "QR Code",
    href: "/tools/qrcode",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    icon: Bot,
    name: "AI Interview",
    href: "/dashboard",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    icon: FileText,
    name: "File Convert",
    href: "/tools/converter",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    icon: Bot,
    name: "AI Humanizer",
    href: "/tools/ai-humanizer",
    bgColor: "bg-red-100",
    iconColor: "text-red-600"



  },
  
  {
    icon: GraduationCap,
    name: "Learning",
    href: "/learning",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    icon: Briefcase,
    name: "Op2unity Abroad",
    href: "/jobs",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    icon: Bot,
    name: "AI Chat",
    href: "/tools/chat",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600"
  },
  {
    icon: FileText,
    name: "Resume Builder",
    href: "/tools/resume",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    icon: GraduationCap,
    name: "Free Courses",
    href: "/courses",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600"
  },
  {
    icon: Lightbulb,
    name: "Business Ideas",
    href: "/tools/business-idea",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600"
  }
]

export default function Hero() {
  const [isConverterOpen, setIsConverterOpen] = useState(false)
  const router = useRouter()

  const handleServiceClick = (href, service) => {
    if (service === 'File Convert') {
      setIsConverterOpen(true)
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300 animate-gradient-xy" />

        <div className="relative container mx-auto px-4 pt-16 pb-8 flex flex-col min-h-[90vh]">
          <div className="grid lg:grid-cols-2 gap-8 items-center flex-grow">
            {/* Left column with Avatar */}
            <div className="relative">
              <div className="w-full max-w-md mx-auto">
                <img
                  src="/helloai.gif"
                  alt="AI Avatar"
                  className="rounded-3xl w-full h-auto"
                />
              </div>
            </div>

            {/* Right column with Text and CTA */}
            <div className="text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                Click<MouseIcon />Into
                <br />
                New World of <span className="text-blue-600">Opportunity</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                A breakthrough of AI Powered Platform design to help you Secure a new world of
                <span className="font-semibold"> Op2unity </span>
                You Aspired.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  className="px-8 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  Click into new Career
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Marquee Services - Positioned at bottom with less spacing */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute left-0 h-full w-px bg-gray-200" />
              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="flex gap-12 items-center"
                >
                  {services.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => handleServiceClick(service.href, service.name)}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl ${service.bgColor} transition-transform group-hover:scale-110 shadow-lg`}>
                        <service.icon className={`w-7 h-7 md:w-8 md:h-8 ${service.iconColor}`} />
                      </div>
                      <span className="mt-2 text-sm font-medium">{service.name}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FileConverterModal 
        isOpen={isConverterOpen} 
        onClose={() => setIsConverterOpen(false)} 
      />
    </>
  )
} 