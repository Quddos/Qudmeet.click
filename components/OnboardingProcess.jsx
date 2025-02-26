"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Bot, Monitor, BookOpen } from 'lucide-react';
import Modal from './Modal';

const OnboardingProcess = () => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: 'STEP ONE',
      subtitle: 'Upload CV',
      description: 'Submit your CV through our secure cloud upload system. We accept PDF and DOC formats.',
      icon: Upload,
      color: 'rgb(198, 246, 213)',
      textColor: 'text-gray-700',
      bgImage: '/recruitment/upload-cv.jpg'
    },
    {
      id: 2,
      title: 'STEP TWO',
      subtitle: 'AI Mock Interview',
      description: 'Participate in an AI-powered mock interview to assess your skills and prepare for the role.',
      icon: Bot,
      color: 'rgb(226, 232, 240)',
      textColor: 'text-gray-700',
      bgImage: '/recruitment/ai-interview.jpg'
    },
    {
      id: 3,
      title: 'STEP THREE',
      subtitle: 'Role Train/Test',
      description: 'Complete role-specific training and assessment tests to demonstrate your expertise.',
      icon: Monitor,
      color: 'rgb(254, 215, 215)',
      textColor: 'text-gray-700',
      bgImage: '/recruitment/training.jpg'
    },
    {
      id: 4,
      title: 'STEP FOUR',
      subtitle: 'Onboarding',
      description: 'Complete the onboarding process including documentation and platform access setup.',
      icon: BookOpen,
      color: 'rgb(255, 179, 167)',
      textColor: 'text-gray-700',
      bgImage: '/recruitment/onboarding.jpg'
    }
  ];

  return (
    <div className="relative min-h-screen py-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300 animate-gradient-xy transition-opacity duration-500" 
           style={{ opacity: hoveredStep ? 0.3 : 1 }} 
      />
      
      {/* Background images for each step */}
      <AnimatePresence>
        {hoveredStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${hoveredStep.bgImage})`,
              filter: 'blur(8px)'
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-gray-800"
        >
          OUR RECRUITMENT PROCESS
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 hidden md:block" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center w-full md:w-1/4 mb-8 md:mb-0"
                onMouseEnter={() => setHoveredStep(step)}
                onMouseLeave={() => setHoveredStep(null)}
                onClick={() => setSelectedStep(step)}
              >
                <div 
                  className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 cursor-pointer transition-all duration-300 ${
                    hoveredStep?.id === step.id ? 'scale-110 shadow-lg' : ''
                  }`}
                  style={{ backgroundColor: step.color }}
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <step.icon className={`w-12 h-12 ${hoveredStep?.id === step.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                </div>

                <div className="w-3 h-3 bg-gray-300 rounded-full mb-4" />

                <div className="text-center">
                  <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                    hoveredStep?.id === step.id ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
            START YOUR JOURNEY →
          </button>
        </motion.div>
      </div>

      {selectedStep && (
        <Modal
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          title={selectedStep.title}
          content={selectedStep.description}
        />
      )}
    </div>
  );
};

export default OnboardingProcess; 