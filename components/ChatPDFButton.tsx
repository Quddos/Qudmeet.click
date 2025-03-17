'use client'

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import ChatPDF from './ChatPDF'

interface ChatPDFButtonProps {
  pdfText?: string
  pdfName?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'floating'
}

export default function ChatPDFButton({ 
  pdfText, 
  pdfName, 
  className = '',
  variant = 'primary'
}: ChatPDFButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = () => {
    if (!pdfText) {
      // If no PDF text is available, don't open the chat
      return
    }
    
    setIsLoading(true)
    // Simulate a brief loading state to indicate to the user that the chat is being prepared
    setTimeout(() => {
      setIsLoading(false)
      setIsOpen(true)
    }, 500)
  }

  // Floating button for mobile view
  if (variant === 'floating') {
    return (
      <>
        <div className="relative group">
          <button
            onClick={handleOpen}
            disabled={!pdfText || isLoading}
            className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors ${
              !pdfText || isLoading ? 'opacity-70 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''
            } ${className}`}
            aria-label="Chat with PDF"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <MessageSquare className="h-6 w-6" />
            )}
          </button>
          
          {!pdfText && (
            <div className="absolute bottom-20 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Upload a resume to chat with it
            </div>
          )}
        </div>

        <ChatPDF 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          pdfText={pdfText}
          pdfName={pdfName}
          className="ChatPDF-modal"
        />
      </>
    )
  }

  // Secondary variant (outline)
  if (variant === 'secondary') {
    return (
      <>
        <button
          onClick={handleOpen}
          disabled={!pdfText || isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors ${
            !pdfText || isLoading ? 'opacity-70 cursor-not-allowed' : ''
          } ${className}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Chat with PDF</span>
          <span className="sm:hidden">Chat</span>
        </button>

        <ChatPDF 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          pdfText={pdfText}
          pdfName={pdfName}
          className="ChatPDF-modal"
        />
      </>
    )
  }

  // Default primary variant
  return (
    <>
      <button
        onClick={handleOpen}
        disabled={!pdfText || isLoading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
          !pdfText || isLoading ? 'opacity-70 cursor-not-allowed' : ''
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
        <span className="hidden sm:inline">Chat with PDF</span>
        <span className="sm:hidden">Chat</span>
      </button>

      <ChatPDF 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        pdfText={pdfText}
        pdfName={pdfName}
        className="ChatPDF-modal"
      />
    </>
  )
} 