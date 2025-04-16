'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface PDFChatInterfaceProps {
  pdfName: string
  pdfText: string
  onClose?: () => void
}

export default function PDFChatInterface({ pdfName, pdfText, onClose }: PDFChatInterfaceProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your research assistant. I've analyzed "${pdfName || 'your document'}". How can I help you understand it better?`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = { role: 'user' as const, content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate AI response (in a real app, this would call your API)
      setTimeout(() => {
        // Generate a response based on the PDF content and user question
        let response = "I'm analyzing your document to answer that question..."

        if (input.toLowerCase().includes('summary') || input.toLowerCase().includes('summarize')) {
          response = `Based on my analysis of "${pdfName}", the main points are:\n\n1. The document discusses research findings related to the topic.\n2. It presents methodology and results.\n3. The conclusions suggest further research opportunities.`
        } else if (input.toLowerCase().includes('key') && input.toLowerCase().includes('finding')) {
          response = "The key findings from this research paper include the methodology used, the results obtained, and the implications for future research."
        } else if (input.toLowerCase().includes('conclusion')) {
          response = "The conclusion of this paper suggests that more research is needed, but the current findings provide valuable insights into the topic."
        } else {
          response = "I can help you understand this document better. You can ask me to summarize it, explain specific sections, or highlight key findings."
        }

        setMessages(prev => [...prev, { role: 'assistant', content: response }])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error getting response:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b border-blue-600 bg-blue-800 text-white">
        <h3 className="font-medium text-sm truncate">Chat with: {pdfName || 'Document'}</h3>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-800 border border-blue-200 shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm font-medium">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-blue-600 border border-blue-200 shadow-md rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-blue-600 bg-blue-800">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document..."
            className="flex-1 px-4 py-2 bg-white border border-blue-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-r-lg ${
              !input.trim() || isLoading
                ? 'bg-blue-600 text-blue-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
