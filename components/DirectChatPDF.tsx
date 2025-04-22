'use client'

import { useEffect, useState } from 'react'
import ChatPDF from './ChatPDF'

export default function DirectChatPDF() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [pdfText, setPdfText] = useState('')
  const [pdfName, setPdfName] = useState('')
  const [docType, setDocType] = useState<'research' | 'resume' | 'default'>('default')

  useEffect(() => {
    // Listen for the custom event to open the chat
    const handleOpenDirectChat = (event: CustomEvent) => {
      setIsChatOpen(true)
      const { pdfName, pdfText, type = 'default' } = event.detail
      setPdfName(pdfName)
      setPdfText(pdfText)
      setDocType(type)
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
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      pdfText={pdfText}
      pdfName={pdfName}
      type={docType}
      className="ChatPDF-modal"
    />
  )
}
