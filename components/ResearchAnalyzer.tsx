'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, FileText, SidebarClose, MessageSquare, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
// import PDFHistorySidebar from './PDFHistorySidebar'
import ChatSession from './ChatSession'

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
  potentialApplications?: Array<{ platform: string; description: string }>;
}

export default function ResearchAnalyzer() {
  const [pdfText, setPdfText] = useState('')
  const [pdfName, setPdfName] = useState('')
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLib, setPdfLib] = useState<any>(null)
  const [sidebarType, setSidebarType] = useState<'chat' | 'pdf' | null>(null)

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

    // Add event listener for closing sidebar on mobile
    const handleCloseSidebar = () => setSidebarType(null)
    document.addEventListener('closeSidebar', handleCloseSidebar)

    return () => {
      document.removeEventListener('closeSidebar', handleCloseSidebar)
    }
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!pdfLib) {
      toast.error('PDF processor is not ready. Please try again.')
      return
    }

    const file = acceptedFiles[0]

    if (!file) return

    try {
      setPdfName(file.name)
      setLoading(true)

      // Read the file
      const text = await readFileAsText(file, pdfLib)
      setPdfText(text)

      // Save to history
      saveToHistory({
        id: Date.now().toString(),
        name: file.name,
        date: new Date(),
        text: text,
        preview: text.slice(0, 200) + '...',
        type: 'research'
      })

      toast.success('PDF uploaded successfully')
    } catch (error) {
      console.error('Error processing PDF:', error)
      toast.error('Failed to process PDF')
    } finally {
      setLoading(false)
    }
  }, [pdfLib])

  // Read PDF file as text
  const readFileAsText = async (file: File, pdfjsLib: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let fullText = ''

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(' ')
          fullText += pageText + '\n\n'
        }

        resolve(fullText)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Save PDF to history
  const saveToHistory = (pdf: any) => {
    try {
      const savedDocuments = localStorage.getItem('researchPDFDocuments') || '[]'
      const documents = JSON.parse(savedDocuments)

      // Add new document to the beginning
      documents.unshift(pdf)

      // Limit to 20 documents
      const limitedDocuments = documents.slice(0, 20)

      localStorage.setItem('researchPDFDocuments', JSON.stringify(limitedDocuments))
    } catch (error) {
      console.error('Error saving to history:', error)
    }
  }

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
      // Save the analysis to history
      saveToHistory(data)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze research paper')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-10">
        <ChatSession
          type="research"
          pdfText={pdfText}
          pdfName={pdfName}
          className="shadow-lg"
        />
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar - Removed */}
        {/* <AnimatePresence>
          {sidebarType && (
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: window.innerWidth < 640 ? '100%' : '300px',
                height: window.innerWidth < 640 ? 'auto' : '100%',
                opacity: 1
              }}
              exit={{ width: 0, height: window.innerWidth < 640 ? 0 : 'auto', opacity: 0 }}
              className="sm:h-full border-r border-gray-200 overflow-hidden fixed sm:relative top-0 left-0 w-full sm:w-auto z-30 bg-white shadow-lg"
            >
              {sidebarType === 'pdf' && (
                <PDFHistorySidebar
                  type="research"
                  onSelectPDF={(pdf) => {
                    // Load the selected PDF
                    setPdfName(pdf.name)
                    setPdfText(pdf.text)
                    toast.success(`Loaded PDF: ${pdf.name}`)
                    setSidebarType(null) // Close sidebar after selection
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
       
        {/* Main Content */}
        <div className="flex-1 space-y-8 relative">
      

          {/* Enhanced File Upload Section with Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-1">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-800">Drag & drop your research paper</h2>
            </div>
            <p className="text-xs text-gray-500">or click to select a file</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            {...(getRootProps() as any)}
            className={`border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
              }`}
            initial={false}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <FileText className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-blue-400'}`} />
              {isDragActive ? (
                <p className="text-lg font-medium text-blue-600">Drop your research paper here...</p>
              ) : (
                <p className="text-sm text-gray-600">Supports PDF files (Max 5MB)</p>
              )}
            </div>
          </motion.div>

          {/* Action Button - Blue Bar */}
          <div className="mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!pdfText || loading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${!pdfText
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : loading
                    ? 'bg-blue-600 animate-pulse text-white'
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
          </div>

          {/* Enhanced Analysis Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 bg-white rounded-xl p-6 shadow-lg"
              >
                {/* Header Section with Blue Background */}
                {/* <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                  <h2 className="text-xl font-bold text-center">Analyze Research Paper</h2>
                </div> */}

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Title Card */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <div>
                      <h3 className="text-xs font-medium mb-1">Title</h3>
                      <p className="text-sm font-semibold">{analysis.title}</p>
                    </div>
                  </div>

                  {/* Journal/Conference Card */}
                  <div className="bg-yellow-500 text-white p-4 rounded-lg">
                    <div>
                      <h3 className="text-xs font-medium mb-1">Journal/Conference</h3>
                      <p className="text-sm font-semibold">{analysis.journal}</p>
                    </div>
                  </div>

                  {/* Year Card */}
                  <div className="bg-green-500 text-white p-4 rounded-lg">
                    <div>
                      <h3 className="text-xs font-medium mb-1">Year</h3>
                      <p className="text-sm font-semibold">{analysis.year}</p>
                    </div>
                  </div>
                </div>


                {/* Enhanced Area of Focus - Full Width */}
                <div className="mt-6 bg-blue-100 border border-blue-300 text-blue-900 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">Area of Focus</h3>
                  <p className="text-lg">{analysis.areaOfFocus}</p>
                </div>

                {/* Key Contributions Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Key Contributions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.contributions.map((contribution, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-blue-900 text-sm">{contribution.point}</h4>
                        </div>
                        <p className="text-gray-700 text-xs pl-8">{contribution.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Limitations Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Research Limitations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.limitations.map((limitation, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">{limitation.point}</h4>
                        <p className="text-gray-700 text-xs">{limitation.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Methodology Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Research Methodology</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-700">
                      <span className="font-semibold text-gray-800 text-sm mb-3 block">{analysis.methodology.approach}</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        {analysis.methodology.tools.map((tool, index) => (
                          <div key={index} className="bg-violet-100 text-violet-800 rounded-full px-4 py-2 text-sm font-medium text-center">
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Future Work Section */}
                <motion.div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Future Work</h3>
                  <ul className="space-y-3">
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

                {/* Potential Applications with Other Technologies */}
                {analysis.potentialApplications && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">Applications with Other Technologies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {analysis.potentialApplications.map((application, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 shadow-md
                            hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-purple-900">{application.platform}</h4>
                          </div>
                          <p className="text-gray-700">{application.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Chat with this PDF button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-8"
                >
                  <button
                    onClick={() => {
                      // Dispatch a custom event to open the chat
                      document.dispatchEvent(new CustomEvent('openDirectChat', {
                        detail: {
                          pdfName: pdfName,
                          pdfText: pdfText,
                          type: 'research'
                        }
                      }))

                      // Scroll to top to show the chat
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat with this Research Paper</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}


