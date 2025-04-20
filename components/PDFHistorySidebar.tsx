'use client'

import { useState, useEffect } from 'react'
import { File, Trash2, Clock, Search, ChevronRight, ChevronDown, FileText, MessageSquare, Eye, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import PDFPreview from './PDFPreview'
import PDFChatInterface from './PDFChatInterface'

interface PDFDocument {
  id: string
  name: string
  date: Date
  text: string
  preview: string
  type: 'research' | 'resume'
}

interface PDFHistorySidebarProps {
  onSelectPDF: (pdf: PDFDocument) => void
  onChatWithPDF?: (pdf: PDFDocument) => void
  type: 'research' | 'resume'
}

export default function PDFHistorySidebar({ onSelectPDF, onChatWithPDF, type }: PDFHistorySidebarProps) {
  const [documents, setDocuments] = useState<PDFDocument[]>([])
  const [expandedSection, setExpandedSection] = useState<'recent' | 'all' | null>('recent')
  const [loading, setLoading] = useState(true)
  const [previewDoc, setPreviewDoc] = useState<PDFDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatDoc, setChatDoc] = useState<PDFDocument | null>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Load PDF history from localStorage
    try {
      const savedDocuments = localStorage.getItem(`${type}PDFDocuments`)
      if (savedDocuments) {
        const parsedDocuments = JSON.parse(savedDocuments)
        // Convert string dates back to Date objects
        const documentsWithDates = parsedDocuments.map((doc: any) => ({
          ...doc,
          date: new Date(doc.date)
        }))
        setDocuments(documentsWithDates)
      }
    } catch (error) {
      console.error('Error loading PDF history:', error)
      toast.error('Failed to load PDF history')
    } finally {
      setLoading(false)
    }
  }, [type])

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))

    // Update localStorage
    try {
      localStorage.setItem(
        `${type}PDFDocuments`,
        JSON.stringify(documents.filter(doc => doc.id !== documentId))
      )
      toast.success('Document deleted')
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
    }
  }

  const handleChatWithPDF = (doc: PDFDocument) => {
    setChatDoc(doc)
    setShowChat(true)

    // If there's an external handler, call it too
    if (onChatWithPDF) {
      onChatWithPDF(doc)
    }
  }

  // Filter documents by search query
  const filterDocuments = (docs: PDFDocument[]) => {
    if (!searchQuery.trim()) return docs

    const query = searchQuery.toLowerCase().trim()
    return docs.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.text.toLowerCase().includes(query) ||
      doc.preview.toLowerCase().includes(query)
    )
  }

  // Sort documents by date (newest first)
  const sortedDocuments = [...documents].sort((a, b) =>
    b.date.getTime() - a.date.getTime()
  )

  // Filter documents
  const filteredDocuments = filterDocuments(sortedDocuments)

  // Get recent documents (last 5)
  const recentDocuments = filteredDocuments.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-blue-700 border-r border-gray-200 h-full w-full text-white flex flex-col" style={{ minWidth: '300px', width: '25%' }}>
      {showChat && chatDoc ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-3 border-b border-blue-600">
            <h3 className="text-sm font-medium">Chat with PDF</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-blue-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PDFChatInterface
              pdfName={chatDoc.name}
              pdfText={chatDoc.text}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto p-4 w-full h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {type === 'research' ? 'Research Papers' : 'Resume Documents'}
            </h3>
            <button
              className="sm:hidden p-2 text-blue-300 hover:text-white rounded-full"
              onClick={() => document.dispatchEvent(new CustomEvent('closeSidebar'))}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => handleChatWithPDF({
              id: 'new-chat',
              name: 'New Chat',
              text: '',
              preview: 'Start a new conversation',
              date: new Date(),
              type: type
            })}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2.5 mb-4 flex items-center justify-center transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            <span>New chat</span>
          </button>

          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm bg-blue-600 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* PDF Preview Modal */}
          <AnimatePresence>
            {previewDoc && (
              <PDFPreview
                pdfText={previewDoc.text}
                pdfName={previewDoc.name}
                onClose={() => setPreviewDoc(null)}
              />
            )}
          </AnimatePresence>

          {documents.length === 0 || (searchQuery && filteredDocuments.length === 0) ? (
            <div className="text-center py-8 text-blue-200">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-70" />
              {searchQuery ? (
                <>
                  <p>No matching documents</p>
                  <p className="text-sm mt-1 text-blue-300">Try a different search term</p>
                </>
              ) : (
                <>
                  <p>No documents yet</p>
                  <p className="text-sm mt-1 text-blue-300">Your uploaded documents will appear here</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Recent Documents */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full p-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === 'recent' ? null : 'recent')}
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Recent ({recentDocuments.length})</span>
                  </div>
                  {expandedSection === 'recent' ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === 'recent' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {recentDocuments.length === 0 ? (
                        <p className="text-sm text-blue-300 p-2">No recent documents</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {recentDocuments.map(doc => (
                            <div
                              key={doc.id}
                              className="bg-blue-800 p-3 rounded-md border border-blue-700 hover:border-blue-500 hover:bg-blue-700 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <button
                                  className="text-left flex-1"
                                  onClick={() => onSelectPDF(doc)}
                                >
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-blue-300" />
                                    <h4 className="font-medium text-sm truncate text-white">{doc.name}</h4>
                                  </div>
                                  <p className="text-xs text-blue-300 mt-1">
                                    {doc.date.toLocaleDateString()} · {doc.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                  <div className="flex items-center mt-2">
                                    <MessageSquare className="w-3 h-3 mr-1 text-blue-300" />
                                    <p className="text-xs text-blue-200 line-clamp-1">{doc.preview}</p>
                                  </div>
                                </button>

                                <div className="flex space-x-1 ml-2">
                                  <button
                                    className="p-1 text-blue-300 hover:text-green-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatWithPDF(doc);
                                    }}
                                    title="Chat with this document"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1 text-blue-300 hover:text-blue-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewDoc(doc);
                                    }}
                                    title="Preview document"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1 text-blue-300 hover:text-red-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDocument(doc.id);
                                    }}
                                    title="Delete document"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* All Documents */}
              <div>
                <button
                  className="flex items-center justify-between w-full p-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === 'all' ? null : 'all')}
                >
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    <span className="font-medium">All Documents ({documents.length})</span>
                  </div>
                  {expandedSection === 'all' ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === 'all' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mt-2">
                        {filteredDocuments.map(doc => (
                          <div
                            key={doc.id}
                            className="bg-blue-800 p-3 rounded-md border border-blue-700 hover:border-blue-500 hover:bg-blue-700 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <button
                                className="text-left flex-1"
                                onClick={() => onSelectPDF(doc)}
                              >
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 mr-2 text-blue-300" />
                                  <h4 className="font-medium text-sm truncate text-white">{doc.name}</h4>
                                </div>
                                <p className="text-xs text-blue-300 mt-1">
                                  {doc.date.toLocaleDateString()} · {doc.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex items-center mt-2">
                                  <MessageSquare className="w-3 h-3 mr-1 text-blue-300" />
                                  <p className="text-xs text-blue-200 line-clamp-1">{doc.preview}</p>
                                </div>
                              </button>

                              <div className="flex space-x-1 ml-2">
                                <button
                                  className="p-1 text-blue-300 hover:text-green-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChatWithPDF(doc);
                                  }}
                                  title="Chat with this document"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1 text-blue-300 hover:text-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewDoc(doc);
                                  }}
                                  title="Preview document"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1 text-blue-300 hover:text-red-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteDocument(doc.id);
                                  }}
                                  title="Delete document"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
