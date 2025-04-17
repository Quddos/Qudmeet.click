'use client'

import React from 'react'

// Define the structure of a PDF document
interface PDFDocument {
  id: string
  name: string
  date: Date
  text: string
  preview: string
  type: 'research' | 'resume'
}

// Props for the sidebar component
interface PDFHistorySidebarProps {
  onSelectPDF: (pdf: PDFDocument) => void
  onChatWithPDF?: (pdf: PDFDocument) => void
  type: 'research' | 'resume'
}

export default function PDFHistorySidebar({ onSelectPDF, onChatWithPDF, type }: PDFHistorySidebarProps) {
  // This component is temporarily disabled to fix build errors
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">PDF History</h2>
        <p className="text-sm text-gray-500">Temporarily disabled</p>
      </div>
    </div>
  );
}
