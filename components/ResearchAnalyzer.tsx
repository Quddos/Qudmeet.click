'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, FileText, Book, Beaker, Target, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import ChatPDFButton from './ChatPDFButton'

interface ResearchAnalysis {
  title: string;
  journal: string;
  year: string;
  contributions: Array<{ point: string; description: string }>;
  limitations: Array<{ point: string; description: string }>;
  areaOfFocus: string;
  methodology: {
    approach: string;
    tools: string[];
  };
  futureWork: string[];
}

export default function ResearchAnalyzer() {
  const [pdfText, setPdfText] = useState('')
  const [pdfName, setPdfName] = useState('')
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLib, setPdfLib] = useState<any>(null)

  // Initialize PDF.js dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        if (typeof window !== 'undefined') {
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
        }
        setPdfLib(pdfjsLib)
      } catch (error) {
        console.error('Error loading PDF.js:', error)
      }
    }
    loadPdfJs()
  }, [])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!pdfLib) {
      toast.error('PDF processor is not ready. Please try again.')
      return
    }

    const file = acceptedFiles[0]
    
    if (file.type === 'application/pdf') {
      try {
        setPdfName(file.name)
        const arrayBuffer = await file.arrayBuffer()
        
        const loadingTask = pdfLib.getDocument({
          data: arrayBuffer,
          useSystemFonts: true,
        })

        const pdf = await loadingTask.promise
        let fullText = ''
        
        toast.info(`Processing PDF (0/${pdf.numPages} pages)`)
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item: { str: string }) => item.str)
              .join(' ')
            fullText += pageText + '\n'
            
            toast.info(`Processing PDF (${i}/${pdf.numPages} pages)`)
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError)
            continue
          }
        }
        
        if (!fullText.trim()) {
          throw new Error('No text content found in PDF')
        }
        
        setPdfText(fullText)
        toast.success('Research paper uploaded successfully!')
      } catch (error) {
        console.error('PDF parsing error:', error)
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`)
        } else {
          toast.error('Error reading PDF file. Please try again.')
        }
      }
    } else {
      toast.error('Please upload a PDF file')
    }
  }, [pdfLib])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 5242880, // 5MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      if (error?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 5MB')
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload a PDF file')
      } else {
        toast.error('Error uploading file. Please try again.')
      }
    }
  })

  const handleAnalyze = async () => {
    if (!pdfText) {
      toast.error('Please upload a research paper')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/analyze-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfText: pdfText.slice(0, 30000) }), // Limit text length
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze research paper')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced File Upload Section */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        {...(getRootProps() as any)}
        className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
            : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
        }`}
        initial={false}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <FileText className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-blue-400'}`} />
          <div>
            <p className="text-lg font-medium text-gray-800">
              {isDragActive ? 'Drop your research paper here...' : 'Drag & drop your research paper'}
            </p>
            <p className="text-sm text-gray-600 mt-2">or click to select a file</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Supports PDF files (Max 5MB)</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleAnalyze}
          disabled={!pdfText || loading}
          className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 ${
            !pdfText
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : loading
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Research Paper'
          )}
        </button>
        
        {/* Desktop Chat Button */}
        <div className="hidden sm:block">
          <ChatPDFButton 
            pdfText={pdfText} 
            pdfName={pdfName} 
            className="px-6 py-3 rounded-xl font-medium"
          />
        </div>
      </div>

      {/* Floating Chat Button for Mobile */}
      <div className="sm:hidden">
        <ChatPDFButton 
          pdfText={pdfText} 
          pdfName={pdfName}
          variant="floating"
        />
      </div>

      {/* Enhanced Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Basic Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard 
                title="Title" 
                content={analysis.title}
                icon={<Book className="w-6 h-6" />}
                bgColor="bg-blue-600"
              />
              <InfoCard 
                title="Journal/Conference" 
                content={analysis.journal}
                icon={<FileText className="w-6 h-6" />}
                bgColor="bg-yellow-500"
              />
              <InfoCard 
                title="Year" 
                content={analysis.year}
                icon={<Target className="w-6 h-6" />}
                bgColor="bg-green-500"
              />
              <InfoCard 
                title="Area of Focus" 
                content={analysis.areaOfFocus}
                icon={<Beaker className="w-6 h-6" />}
                bgColor="bg-blue-100"
              />
            </div>

            {/* Contributions Section */}
            <motion.div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Key Contributions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.contributions.map((contribution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md
                      hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-blue-900">{contribution.point}</h4>
                    </div>
                    <p className="text-gray-700">{contribution.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Limitations Section */}
            <motion.div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Research Limitations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.limitations.map((limitation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 shadow-md
                      hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-rose-900">{limitation.point}</h4>
                    </div>
                    <p className="text-gray-700">{limitation.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Methodology Section */}
            <motion.div 
              className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8 shadow-lg
                hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Research Methodology</h3>
              <p className="text-gray-700 mb-6">{analysis.methodology.approach}</p>
              <div className="flex flex-wrap gap-3">
                {analysis.methodology.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-violet-100 text-violet-800 rounded-full text-sm font-medium
                      hover:bg-violet-200 transition-colors duration-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Future Work Section */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-lg
                hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Future Work</h3>
              <ul className="space-y-4">
                {analysis.futureWork.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <Lightbulb className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
// Enhanced Info Card Component
function InfoCard({ title, content, icon, bgColor }: { 
  title: string; 
  content: string; 
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${bgColor} p-6 rounded-xl shadow-lg
        hover:shadow-xl transition-all duration-300 hover:brightness-110`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-white">{icon}</div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-white/90 font-medium">{content}</p>
    </motion.div>
  );
} 
