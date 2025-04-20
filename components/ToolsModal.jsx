'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import {
  QrCode, FileText, Bot,
  Lightbulb, Book, FileSearch,
  Briefcase, GraduationCap, Users,
  MessageSquare
} from 'lucide-react'

const Dock = ({ children, className }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className={`flex items-center justify-center rounded-full bg-gradient-to-r from-gray-50 to-blue-50 backdrop-blur-sm border border-white/30 shadow-xl px-4 py-2 ${className}`}
      onMouseMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - bounds.left);
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {children.map((child, i) => (
        <DockIcon key={i} mouseX={mouseX}>
          {child}
        </DockIcon>
      ))}
    </motion.div>
  );
};

const DockIcon = ({ mouseX, children }) => {
  const ref = useRef(null);
  const distance = useMotionValue(Infinity);

  const size = useTransform(distance, [-150, 0, 150], [40, 65, 40]);
  const opacity = useTransform(distance, [-150, 0, 150], [0.8, 1, 0.8]);
  const scale = useTransform(distance, [-150, 0, 150], [0.8, 1.2, 0.8]);

  const springConfig = { stiffness: 400, damping: 25 };
  const sprungSize = useSpring(size, springConfig);
  const sprungScale = useSpring(scale, springConfig);

  useEffect(() => {
    if (!ref.current) return;

    const updateDistance = () => {
      const bounds = ref.current?.getBoundingClientRect() || { x: 0, width: 0 };
      const iconCenter = bounds.x + bounds.width / 2;
      const mouseXVal = mouseX.get();
      const dist = mouseXVal - iconCenter;
      distance.set(dist);
    };

    const unsubscribeX = mouseX.on("change", updateDistance);
    return () => unsubscribeX();
  }, [mouseX, distance]);

  return (
    <motion.div
      ref={ref}
      style={{ width: sprungSize, height: sprungSize, opacity }}
      className="flex items-center justify-center mx-2"
    >
      <motion.div
        whileHover={{ scale: 1.3 }}
        className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-600 transition-colors duration-300"
        style={{ scale: sprungScale }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const dockTools = [
  { name: 'Resume Analyzer', icon: FileSearch, href: '/tools/resume-analyzer' },
  { name: 'Research Analyzer', icon: Book, href: '/tools/research-analyzer' },
  { name: 'AI Mock Interview', icon: Bot, href: '/dashboard' },
  { name: 'AI Business Ideas', icon: Lightbulb, href: '/tools/business-idea' },
  { name: 'QR Code Generator', icon: QrCode, href: '/tools/qrcode' },
];

export default function ToolsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 z-10 flex justify-between items-center p-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                Discover Our Tools
              </h2>
              <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors rounded-full p-1 hover:bg-white hover:bg-opacity-10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Autoplaying Video */}
            <div className="p-4">
              <div className="relative w-full h-0 pt-[56.25%] rounded-xl overflow-hidden shadow-lg bg-gray-100">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/Qudmeet_demo_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Tools Section */}
            <div className="py-3 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Our Tools</h3>
              <div className="flex justify-center">
                <Dock>
                  {dockTools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="flex flex-col items-center text-blue-600 hover:text-yellow-400 transition-colors"
                      title={tool.name}
                      onClick={onClose}
                    >
                      <tool.icon className="w-8 h-8" />
                      <span className="text-xs mt-1 block text-center">{tool.name}</span>
                    </Link>
                  ))}
                </Dock>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
