'use client'

import { useEffect, useState } from 'react'
import ChatPDF from './ChatPDF'

export default function DirectChatPDF() {
  const [isOpen, setIsOpen] = useState(false)
  const [pdfText, setPdfText] = useState('')
  const [pdfName, setPdfName] = useState('')

  useEffect(() => {
    // Listen for the custom event to open the chat
    const handleOpenDirectChat = (event: CustomEvent) => {
      const { pdfName, pdfText } = event.detail
      setPdfName(pdfName)
      setPdfText(pdfText)
      setIsOpen(true)
    }

    // Add event listener
    document.addEventListener('openDirectChat', handleOpenDirectChat as EventListener)

    // Clean up
    return () => {
      document.removeEventListener('openDirectChat', handleOpenDirectChat as EventListener)
    }
  }, [])

  return (
    <ChatPDF
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      pdfText={pdfText}
      pdfName={pdfName}
      className="ChatPDF-modal"
    />
  )
}
