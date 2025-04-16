'use client'

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import ChatPDF from './ChatPDF'

interface ChatPDFButtonProps {
  pdfText?: string
  pdfName?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'floating'
  onClick?: () => void
}

export default function ChatPDFButton({
  pdfText,
  pdfName,
  className = '',
  variant = 'primary',
  onClick
}: ChatPDFButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = () => {
    if (!pdfText) {
      // If no PDF text is available, don't open the chat
      return
    }

    if (onClick) {
      // If an onClick handler is provided, use that instead
      onClick()
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
            className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-blue-200 hover:scale-105 transition-all ${
              !pdfText || isLoading ? 'opacity-70 cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500 hover:scale-100' : ''
            } ${className}`}
            aria-label="Chat with PDF"
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <div className="flex flex-col items-center">
                <MessageSquare className="h-7 w-7" />
                <span className="text-[10px] mt-1">Chat</span>
              </div>
            )}
          </button>

          {!pdfText && (
            <div className="absolute bottom-20 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Upload a document to chat with it
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
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors shadow-sm ${
            !pdfText || isLoading ? 'opacity-70 cursor-not-allowed border-gray-400 text-gray-400' : ''
          } ${className}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
          <span className="hidden sm:inline font-medium">Chat with Document</span>
          <span className="sm:hidden font-medium">Chat</span>
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
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all ${
          !pdfText || isLoading ? 'opacity-70 cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500' : ''
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
        <span className="hidden sm:inline font-medium">Chat with Document</span>
        <span className="sm:hidden font-medium">Chat</span>
      </button>

      {!onClick && (
        <ChatPDF
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          pdfText={pdfText}
          pdfName={pdfName}
          className="ChatPDF-modal"
        />
      )}
    </>
  )
}