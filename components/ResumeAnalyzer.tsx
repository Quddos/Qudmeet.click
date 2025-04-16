"use client"
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Sun, Moon, Book, Briefcase, GraduationCap, Code, Target, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useInView } from 'react-intersection-observer';
import ChatSession from './ChatSession'

ChartJS.register(ArcElement, Tooltip, Legend);

// Add interface for PDF.js text content
interface PDFTextItem {
  str: string;
  dir?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

interface PDFTextContent {
  items: PDFTextItem[];
  styles?: Record<string, any>;
}

// Add interface for the analysis response
interface AnalysisResponse {
  overallScore: number;
  skills: {
    matched: string[];
    missing: string[];
  };
  experience: {
    score: number;
    feedback: string;
  };
  education: {
    score: number;
    feedback: string;
  };
  recommendations: string[];
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pdfLib, setPdfLib] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Add scroll animation refs
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [experienceRef, experienceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Resource categories
  const resources = [
    {
      title: "Resume Templates",
      description: "Professional templates for different industries",
      icon: <FileText className="w-6 h-6" />,
      link: "#",
      categories: ["Tech", "Business", "Creative", "Academic"]
    },
    {
      title: "Skill Development",
      description: "Online courses and certifications",
      icon: <Code className="w-6 h-6" />,
      link: "#",
      platforms: ["Coursera", "Udemy", "LinkedIn Learning"]
    },
    {
      title: "Interview Preparation",
      description: "AI Mock Interview to get you ready",
      icon: <Briefcase className="w-6 h-6" />,
      link: "#",
      platforms: ["LinkedIn Learning", "Coursera", "Udemy"]
    }
  ];

  // Initialize PDF.js dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        if (typeof window !== 'undefined') {
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
        }
        setPdfLib(pdfjsLib);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
      }
    };
    loadPdfJs();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!pdfLib) {
      toast.error('PDF processor is not ready. Please try again.');
      return;
    }

    const file = acceptedFiles[0];
    
    if (file.type === 'application/pdf') {
      try {
        setResumeName(file.name);
        const arrayBuffer = await file.arrayBuffer();
        
        const loadingTask = pdfLib.getDocument({
          data: arrayBuffer,
          useSystemFonts: true,
        });

        const pdf = await loadingTask.promise;
        let fullText = '';
        
        toast.info(`Processing PDF (0/${pdf.numPages} pages)`);
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent() as PDFTextContent;
            const pageText = textContent.items
              .map((item: PDFTextItem) => item.str)
              .join(' ');
            fullText += pageText + '\n';
            
            toast.info(`Processing PDF (${i}/${pdf.numPages} pages)`);
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
            continue;
          }
        }
        
        if (!fullText.trim()) {
          throw new Error('No text content found in PDF');
        }
        
        setResumeText(fullText);
        toast.success('Resume uploaded successfully!');
      } catch (error) {
        console.error('PDF parsing error:', error);
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error('Error reading PDF file. Please try again.');
        }
      }
    } else if (file.type === 'text/plain') {
      try {
        const text = await file.text();
        if (!text.trim()) {
          throw new Error('The text file is empty');
        }
        setResumeText(text);
        toast.success('Resume uploaded successfully!');
      } catch (error) {
        console.error('Text file reading error:', error);
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error('Error reading text file. Please try again.');
        }
      }
    } else {
      toast.error('Please upload a PDF or TXT file');
    }
  }, [pdfLib]);

  // Add file validation
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false,
    maxSize: 5242880, // 5MB
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 5MB');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload a PDF or TXT file');
      } else {
        toast.error('Error uploading file. Please try again.');
      }
    }
  });

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      toast.error('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeText: resumeText.slice(0, 30000), // Limit text length to avoid token limits
          jobDescription: jobDescription.slice(0, 10000)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
      }
      
      const data = await response.json();
      
      // Validate the response structure
      if (!data.overallScore || !data.skills || !data.recommendations) {
        throw new Error('Invalid analysis response format');
      }
      
      setAnalysis(data);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      if (error instanceof Error) {
        toast.error(`Analysis failed: ${error.message}`);
      } else {
        toast.error('Failed to analyze resume. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle resource clicks
  const handleResourceClick = (resourceType: string) => {
    setModalMessage('Qudmeet Techiee Team on leave now, Feature coming soon... 😋');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen">
      <div className="mb-10">
        <ChatSession 
          type="resume"
          pdfText={resumeText}
          pdfName={resumeName}
          className="shadow-lg"
        />
      </div>

      {/* Main content section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Form Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-10">
          {/* Resume Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:pr-6"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold text-gray-900 mb-4"
              >
                Upload Your Resume
              </motion.h2>
              
              <motion.div 
                variants={itemVariants}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50/50'
                }`}
              >
                <input {...getInputProps()} />
                <FileText className={`w-10 h-10 mx-auto mb-4 ${isDragActive ? 'text-purple-500' : 'text-purple-400'}`} />
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop your resume here'
                    : 'Drag & drop your resume, or click to select file'}
                </p>
                <p className="text-xs text-purple-500 mt-2">PDF, DOCX, or TXT (Max 5MB)</p>
                
                {resumeText && (
                  <div className="mt-2">
                    <textarea
                      className="w-full min-h-[100px] p-4 rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-all resize-none bg-white/80 backdrop-blur-sm"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Resume content..."
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Job Description Section */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:pl-6 lg:border-l border-gray-200"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold text-gray-900 mb-4"
              >
                Enter Job Description
              </motion.h2>
              
              <motion.div
                variants={itemVariants}
                className="border-2 border-blue-100 rounded-xl p-4 hover:border-blue-300 transition-all"
              >
                <textarea
                  className="w-full min-h-[200px] p-4 rounded-lg bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here... Include responsibilities, requirements, skills, and any other details from the job posting."
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handleAnalyze}
              disabled={!resumeText || !jobDescription || loading}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
                !resumeText || !jobDescription
                  ? 'bg-gray-400 cursor-not-allowed'
                  : loading
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white"
                >
                  <h3 className="text-lg font-semibold mb-4">Overall Match /10</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <Doughnut
                        data={{
                          labels: ['Match', 'Gap'],
                          datasets: [{
                            data: [analysis.overallScore, 100 - analysis.overallScore],
                            backgroundColor: ['#ffffff', 'rgba(255,255,255,0.2)'],
                            borderWidth: 0
                          }]
                        }}
                        options={{
                          cutout: '70%',
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{analysis.overallScore}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Experience Score - Updated gradient */}
                <motion.div
                  ref={experienceRef}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: experienceInView ? 1 : 0.9,
                    opacity: experienceInView ? 1 : 0
                  }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-6 rounded-2xl shadow-lg text-blue-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">Experience /10</h3>
                  <div className="text-3xl font-bold mb-2">{analysis.experience.score}%</div>
                  <p className="text-sm text-blue/90">{analysis.experience.feedback}</p>
                </motion.div>

                {/* Education Score - Updated gradient */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-6 rounded-2xl shadow-lg text-green-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">Education /10</h3>
                  <div className="text-3xl font-bold mb-2">{analysis.education.score}%</div>
                  <p className="text-sm text-green/90">{analysis.education.feedback}</p>
                </motion.div>
              </div>

              {/* Skills Analysis - Using CSS Grid */}
              <motion.div
                ref={skillsRef}
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: skillsInView ? 0 : 20,
                  opacity: skillsInView ? 1 : 0
                }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Matched Skills - Grid Layout */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Matched Skills</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {analysis.skills.matched.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 260,
                          damping: 20 
                        }}
                        className="flex items-center justify-center"
                      >
                        <span className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium text-center hover:bg-green-200 transition-colors duration-200 truncate hover:text-clip">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills - Grid Layout */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Skills to Acquire</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {analysis.skills.missing.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 260,
                          damping: 20 
                        }}
                        className="flex items-center justify-center"
                      >
                        <span className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium text-center hover:bg-red-200 transition-colors duration-200 truncate hover:text-clip">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recommendations - Updated visibility */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 mt-2 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Recommendations</h3>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg"
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-amber-900">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources - Simplified */}
              <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-6">
                <ResourceCard
                  title="Resume Templates"
                  description="Access professional resume templates"
                  onClick={() => handleResourceClick('templates')}
                />
                <ResourceCard
                  title="Skill Development"
                  description="Learn the missing skills"
                  onClick={() => handleResourceClick('skills')}
                />
                 <ResourceCard
                  title="Interview Preparation"
                  description="AI Mock Interview to get you ready"
                  onClick={() => handleResourceClick('interview')}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md mx-4"
          >
            <p className="text-lg text-center mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Simple Resource Card Component
function ResourceCard({ title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg cursor-pointer"
    >
      <h4 className="font-semibold text-blue-800 mb-2">{title}</h4>
      <p className="text-sm text-blue-600">{description}</p>
    </motion.div>
  );
} 