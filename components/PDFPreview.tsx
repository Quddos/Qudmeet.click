'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface PDFPreviewProps {
  pdfText: string
  pdfName: string
  onClose: () => void
}

export default function PDFPreview({ pdfText, pdfName, onClose }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDocument, setPdfDocument] = useState<any>(null)
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
        toast.error('Failed to load PDF viewer')
      }
    }
    loadPdfJs()
  }, [])

  // Create a temporary PDF from the text
  useEffect(() => {
    if (!pdfLib || !pdfText) return

    const generatePDF = async () => {
      try {
        setLoading(true)

        // Create a simple PDF with the text content
        const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        // Split text into chunks to fit on pages
        const textChunks = splitTextIntoChunks(pdfText, 3000) // Approximate characters per page

        for (const chunk of textChunks) {
          const page = pdfDoc.addPage()
          const { width, height } = page.getSize()

          page.drawText(chunk, {
            x: 50,
            y: height - 50,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
            lineHeight: 16,
            maxWidth: width - 100,
          })
        }

        const pdfBytes = await pdfDoc.save()

        // Convert to blob and create URL
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)

        // Load the PDF with PDF.js
        const loadingTask = pdfLib.getDocument(url)
        const pdf = await loadingTask.promise
        setPdfDocument(pdf)
        setTotalPages(pdf.numPages)

        // Render the first page
        renderPage(pdf, 1)
      } catch (error) {
        console.error('Error generating PDF preview:', error)
        toast.error('Failed to generate PDF preview')
      }
    }

    generatePDF()

    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfLib, pdfText])

  // Split text into chunks for pages
  const splitTextIntoChunks = (text: string, chunkSize: number) => {
    const chunks: string[] = []
    let i = 0
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize))
      i += chunkSize
    }
    return chunks
  }

  // Render a specific page
  const renderPage = async (pdf: any, pageNumber: number) => {
    try {
      setLoading(true)
      const page = await pdf.getPage(pageNumber)

      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      const viewport = page.getViewport({ scale: zoom, rotation })

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext).promise
      setLoading(false)
    } catch (error) {
      console.error('Error rendering page:', error)
      setLoading(false)
    }
  }

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      if (pdfDocument) {
        renderPage(pdfDocument, newPage)
      }
    }
  }

  // Navigate to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      if (pdfDocument) {
        renderPage(pdfDocument, newPage)
      }
    }
  }

  // Zoom in
  const zoomIn = () => {
    const newZoom = Math.min(zoom + 0.25, 3)
    setZoom(newZoom)
    if (pdfDocument) {
      renderPage(pdfDocument, currentPage)
    }
  }

  // Zoom out
  const zoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 0.5)
    setZoom(newZoom)
    if (pdfDocument) {
      renderPage(pdfDocument, currentPage)
    }
  }

  // Rotate
  const rotate = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    if (pdfDocument) {
      renderPage(pdfDocument, currentPage)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full h-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-3">
            <h2 className="font-semibold text-lg truncate">
              {pdfName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center justify-center p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-gray-500">Loading preview...</p>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-2 max-w-full max-h-full overflow-auto">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1 || loading}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages || loading}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.5 || loading}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 3 || loading}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={rotate}
              disabled={loading}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
