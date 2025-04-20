'use client'
import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import Link from 'next/link'
import { 
  QrCode, FileText, Bot, 
  Lightbulb, Book, FileSearch,
  Briefcase, GraduationCap, Users
} from 'lucide-react'

const categories = {
  'AI Tools': [
    { name: 'AI Mock Interview', icon: Bot, href: '/dashboard', description: 'Practice with AI interviewer' },
    { name: 'AI Text Humanizer', icon: FileText, href: '/tools/ai-humanizer', description: 'AI-powered humanizer' },
    { name: 'Business Idea Gen', icon: Lightbulb, href: '/tools/business-idea', description: 'Generate business ideas with AI' },
  ],
  'Career Tools': [
    { name: 'Resume Analyzer', icon: FileSearch, href: '/tools/resume-analyzer', description: 'AI-powered resume analysis' },
    { name: 'Research Analyzer', icon: Book, href: '/tools/research-analyzer', description: 'Analyze research papers' },
  ],
  'Utilities': [
    { name: 'QRcode Gen', icon: QrCode, href: '/tools/qrcode', description: 'Generate QR codes easily' },
    { name: 'File Converter', icon: FileText, href: '/tools/converter', description: 'Convert files between formats' },
  ],
  'Opportunities': [
    { name: 'Job Board', icon: Briefcase, href: '/opportunities/job-board', description: 'Find your next role' },
    { name: 'Learning Path', icon: GraduationCap, href: '#', description: 'Grow your skills' },
    { name: 'Community', icon: Users, href: '#', description: 'Connect with others' },
  ]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolsTabs() {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tabBackgrounds = [
    'bg-blue-50',   // AI Tools
    'bg-green-50',  // Career Tools
    'bg-purple-50', // Utilities
    'bg-orange-50'  // Opportunities
  ]

  if (!mounted) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Tools Suite</h2>
        
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 max-w-2xl mx-auto">
            {Object.keys(categories).map((category, idx) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
                    selected
                      ? `${tabBackgrounds[idx]} shadow text-gray-900`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/[0.12]'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-8">
            {Object.entries(categories).map(([category, tools], idx) => (
              <Tab.Panel
                key={category}
                className={classNames(
                  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                  tabBackgrounds[idx]
                )}
              >
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <tool.icon className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  )
} 