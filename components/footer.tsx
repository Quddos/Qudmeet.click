'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Marquee from 'react-fast-marquee'

const Footer = () => {
    const tools = [
        { name: 'QR Code', icon: '📱' },
        { name: 'AI Interview', icon: '🎯' },
        { name: 'File Convert', icon: '📄' },
        { name: 'Learning', icon: '📚' },
        { name: 'Digitally Abroad', icon: '🌍' },
        { name: 'AI Chat', icon: '💬' },
        { name: 'Resume Builder', icon: '📝' },
        { name: 'Free Courses', icon: '🎓' },
        { name: 'Business Ideas', icon: '💡' },
    ]

    const links = [
        { name: 'About us', href: '/about' },
        { name: 'Contact us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
    ]

    return (
        <footer className="relative bg-blue-400">
            {/* Tools Marquee */}
            <div className="w-full overflow-hidden py-4 bg-blue-500 border-y border-gray-200">
                <Marquee gradient={false} speed={40}>
                    <div className="flex gap-8 px-4">
                        {tools.map((tool, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-400 px-4 py-2 rounded-full shadow-sm">
                                <span className="text-xl">{tool.icon}</span>
                                <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl bg-blue-400 from-indigo-400 to-blue-400 mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Navigation Links */}
                    <div className="flex flex-wrap gap-4">
                        {links.map((link, index) => (
                            <Link 
                                key={index}
                                href={link.href}
                                className="bg-[#FFEB3B] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#FFD700] transition-colors shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col items-start md:items-end gap-2 bg-white/80 p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800">Contact US</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">📧</span>
                            <a href="mailto:us@qudmeet.click" className="text-sm text-blue-600 hover:text-blue-800">
                                us@qudmeet.click
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">📧</span>
                            <a href="mailto:Qudmeet@gmail.com" className="text-sm text-blue-600 hover:text-blue-800">
                                Qudmeet@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Website URL */}
                <div className="mt-8 text-center">
                    <Link 
                        href="https://www.qudmeet.click" 
                        className="text-sm text-gray-600 hover:text-gray-900 bg-white/80 px-4 py-2 rounded-full shadow-sm"
                    >
                        www.qudmeet.click
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer 