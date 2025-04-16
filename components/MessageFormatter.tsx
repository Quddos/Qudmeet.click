'use client'

import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageFormatterProps {
  content: string
  className?: string
}

export default function MessageFormatter({ content, className = '' }: MessageFormatterProps) {
  // Process the content to handle different formatting elements
  const processContent = () => {
    // Split the content by code blocks first
    const parts = content.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w+)?\s*([\s\S]*?)```/)
        if (match) {
          const language = match[1] || 'javascript'
          const code = match[2] || ''
          
          return (
            <div key={index} className="my-2 rounded-md overflow-hidden">
              <div className="bg-gray-800 text-gray-200 text-xs px-3 py-1 flex justify-between items-center">
                <span>{language}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter 
                language={language} 
                style={atomDark}
                customStyle={{ margin: 0, fontSize: '0.85rem' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )
        }
        
        // Fallback if regex fails
        return <pre key={index} className="bg-gray-800 text-gray-200 p-3 rounded-md my-2 text-sm overflow-x-auto">{part.slice(3, -3)}</pre>
      }
      
      // Process regular text with markdown-like formatting
      return (
        <div key={index} className="my-1">
          {processTextContent(part)}
        </div>
      )
    })
  }
  
  // Process text content (non-code blocks)
  const processTextContent = (text: string) => {
    // Split by newlines to handle lists and headings
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      // Check for headings (# Heading)
      if (line.match(/^#{1,6}\s/)) {
        const level = line.match(/^(#{1,6})\s/)?.[1].length || 1
        const content = line.replace(/^#{1,6}\s/, '')
        
        const headingClasses = [
          'text-xl font-bold', // h1
          'text-lg font-bold', // h2
          'text-base font-bold', // h3
          'text-sm font-bold', // h4
          'text-xs font-bold', // h5
          'text-xs font-semibold', // h6
        ]
        
        return (
          <div key={lineIndex} className={`${headingClasses[level-1] || headingClasses[0]} mt-3 mb-2`}>
            {content}
          </div>
        )
      }
      
      // Check for bullet lists
      if (line.match(/^\s*[\-\*]\s/)) {
        const content = line.replace(/^\s*[\-\*]\s/, '')
        return (
          <div key={lineIndex} className="flex items-start my-1">
            <span className="mr-2 mt-1">•</span>
            <span>{formatInlineElements(content)}</span>
          </div>
        )
      }
      
      // Check for numbered lists
      if (line.match(/^\s*\d+\.\s/)) {
        const number = line.match(/^\s*(\d+)\.\s/)?.[1] || '1'
        const content = line.replace(/^\s*\d+\.\s/, '')
        return (
          <div key={lineIndex} className="flex items-start my-1">
            <span className="mr-2 min-w-[1.5em] text-right">{number}.</span>
            <span>{formatInlineElements(content)}</span>
          </div>
        )
      }
      
      // Regular paragraph
      return line ? (
        <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
          {formatInlineElements(line)}
        </p>
      ) : (
        <br key={lineIndex} />
      )
    })
  }
  
  // Format inline elements like bold, italic, links
  const formatInlineElements = (text: string) => {
    // Replace **bold** with <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Replace *italic* with <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Replace [link text](url) with <a>
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
    
    // Replace `code` with <code>
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />
  }
  
  return (
    <div className={`message-formatter ${className}`}>
      {processContent()}
    </div>
  )
}
