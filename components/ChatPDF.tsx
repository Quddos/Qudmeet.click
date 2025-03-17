'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, FileText, Loader2, Info, AlertTriangle, RefreshCw, BarChart, PieChart, LineChart, Download, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Title
)

interface Message {
  role: 'user' | 'assistant'
  content: string
  chartData?: {
    type: 'pie' | 'bar' | 'line'
    data: any
    options?: any
  }
  timestamp?: Date
}

interface ChatPDFProps {
  isOpen: boolean
  onClose: () => void
  pdfText?: string
  pdfName?: string
  className?: string
}

export default function ChatPDF({ isOpen, onClose, pdfText, pdfName, className = '' }: ChatPDFProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your PDF assistant. Ask me anything about the uploaded document. I can help you with:' +
        '\n\n• Summarizing key points' +
        '\n• Explaining complex concepts' + 
        '\n• Finding specific information' +
        '\n• Answering questions about the content' +
        '\n• Creating visualizations of data' +
        '\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryMessage, setRetryMessage] = useState<Message | null>(null)
  const [fontSize, setFontSize] = useState<'text-xs' | 'text-sm' | 'text-base'>('text-sm')
  const [showConversationSummary, setShowConversationSummary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Calculate document length and truncation status
  const documentLength = pdfText?.length || 0
  const isTruncated = documentLength > 30000
  const truncatedLength = isTruncated ? 30000 : documentLength
  const truncationPercentage = isTruncated ? Math.round((30000 / documentLength) * 100) : 100
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Process response for charts
  const processResponseForCharts = (response: string): { content: string, chartData?: any } => {
    // Check if response contains chart data markers
    if (response.includes('```chart')) {
      try {
        // Extract chart data
        const chartMatch = response.match(/```chart\s+(pie|bar|line)\s+([^`]+)```/)
        
        if (chartMatch) {
          const chartType = chartMatch[1] as 'pie' | 'bar' | 'line'
          const chartDataStr = chartMatch[2].trim()
          
          // Parse chart data
          const chartData = JSON.parse(chartDataStr)
          
          // Remove chart code block from response
          const cleanContent = response.replace(/```chart\s+(pie|bar|line)\s+([^`]+)```/g, '')
            .replace(/\n\n\n+/g, '\n\n') // Clean up excessive newlines
            .trim()
          
          return {
            content: cleanContent,
            chartData: {
              type: chartType,
              data: chartData,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 11
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: chartData.title || 'Data Visualization',
                    font: {
                      size: 14
                    }
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Error parsing chart data:', e)
      }
    }
    
    return { content: response }
  }

  // Generate conversation summary charts
  const generateConversationSummary = () => {
    if (messages.length <= 1) {
      toast.error('Not enough conversation data to generate summary')
      return
    }

    setShowConversationSummary(true)
  }

  // Get conversation summary charts
  const getConversationSummaryCharts = () => {
    // Skip if not enough messages
    if (messages.length <= 1) {
      return null
    }

    // Message count by role
    const messageCountData = {
      labels: ['User', 'Assistant'],
      datasets: [{
        label: 'Message Count',
        data: [
          messages.filter(m => m.role === 'user').length,
          messages.filter(m => m.role === 'assistant').length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    }

    // Message length by role
    const userMessageLengths = messages
      .filter(m => m.role === 'user')
      .map(m => m.content.length)
    
    const assistantMessageLengths = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content.length)

    const avgUserLength = userMessageLengths.length > 0 
      ? Math.round(userMessageLengths.reduce((a, b) => a + b, 0) / userMessageLengths.length) 
      : 0
    
    const avgAssistantLength = assistantMessageLengths.length > 0 
      ? Math.round(assistantMessageLengths.reduce((a, b) => a + b, 0) / assistantMessageLengths.length) 
      : 0

    const messageLengthData = {
      labels: ['User', 'Assistant'],
      datasets: [{
        label: 'Avg. Message Length (chars)',
        data: [avgUserLength, avgAssistantLength],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    }

    // Message timeline (if timestamps available)
    const timelineData = {
      labels: messages
        .filter((_, i) => i > 0) // Skip first welcome message
        .map((_, i) => `Message ${i + 1}`),
      datasets: [{
        label: 'Message Length',
        data: messages
          .filter((_, i) => i > 0) // Skip first welcome message
          .map(m => m.content.length),
        backgroundColor: messages
          .filter((_, i) => i > 0) // Skip first welcome message
          .map(m => m.role === 'user' 
            ? 'rgba(54, 162, 235, 0.6)' 
            : 'rgba(75, 192, 192, 0.6)'
          ),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }

    // Topic frequency (basic implementation - counts keywords)
    const keywords = [
      'summary', 'explain', 'chart', 'data', 'compare', 
      'visualization', 'model', 'accuracy', 'results', 'conclusion'
    ]

    const keywordCounts = keywords.map(keyword => {
      return {
        keyword,
        count: messages.reduce((count, message) => {
          return count + (message.content.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0)
        }, 0)
      }
    }).filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 keywords

    const topicData = {
      labels: keywordCounts.map(item => item.keyword),
      datasets: [{
        label: 'Topic Frequency',
        data: keywordCounts.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    }

    return (
      <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800 flex items-center text-sm">
            <BarChart2 className="h-4 w-4 mr-1.5 text-blue-500" />
            Conversation Summary
          </h3>
          <button 
            onClick={() => setShowConversationSummary(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Message Distribution</h4>
            <div className="h-[120px]">
              <Pie data={messageCountData} />
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Average Message Length</h4>
            <div className="h-[120px]">
              <Bar 
                data={messageLengthData}
                options={{
                  indexAxis: 'y' as const,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 md:col-span-2">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Message Length Timeline</h4>
            <div className="h-[120px]">
              <Bar data={timelineData} />
            </div>
          </div>

          {keywordCounts.length > 0 && (
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 md:col-span-2">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Top Topics</h4>
              <div className="h-[120px]">
                <Bar data={topicData} />
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-gray-500 italic text-center">
          Based on {messages.length} messages exchanged in this conversation
        </div>
      </div>
    )
  }

  // Handle sending a message
  const handleSendMessage = async (retryingMessage?: Message) => {
    const messageToSend = retryingMessage || { 
      role: 'user' as const, 
      content: input,
      timestamp: new Date()
    }
    
    if ((!messageToSend.content.trim() && !retryingMessage) || loading) return
    
    if (!pdfText) {
      toast.error('No PDF content available to analyze')
      return
    }

    // Only add the message to the chat if it's not a retry
    if (!retryingMessage) {
      setMessages(prev => [...prev, messageToSend])
      setInput('')
    }
    
    setLoading(true)
    setError(null)
    setRetryMessage(null)

    try {
      // Check if the message is asking for visualization
      const isVisualizationRequest = messageToSend.content.toLowerCase().includes('chart') || 
                                    messageToSend.content.toLowerCase().includes('graph') || 
                                    messageToSend.content.toLowerCase().includes('visual') ||
                                    messageToSend.content.toLowerCase().includes('plot') ||
                                    messageToSend.content.toLowerCase().includes('diagram')

      // Enhance prompt for visualization if needed
      let enhancedPrompt = messageToSend.content
      if (isVisualizationRequest) {
        enhancedPrompt += "\n\nIf you're creating a visualization, please format the chart data as a JSON object inside a code block with the format ```chart [type] [data]```, where type is 'pie', 'bar', or 'line', and data is a valid Chart.js data object with labels and datasets."
      }

      const response = await fetch('/api/chat-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { ...messageToSend, content: enhancedPrompt }],
          pdfText: pdfText.slice(0, 30000), // Limit text length
          enhancedMode: true, // Enable enhanced mode to think beyond the PDF
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      
      // Process response for charts
      const { content, chartData } = processResponseForCharts(data.response)
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content,
        chartData,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to process your question'
      setError(errorMessage)
      setRetryMessage(messageToSend)
      toast.error('Failed to process your question. Please try again.')
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your question. Please try again with a different question or click the retry button.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  // Handle retrying a failed message
  const handleRetry = () => {
    if (retryMessage) {
      handleSendMessage(retryMessage)
    }
  }

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Suggest example questions
  const exampleQuestions = [
    "Can you summarize this document?",
    "What are the main points?",
    "Explain the key concepts in simple terms",
    "What conclusions does this document reach?",
    "Create a chart of the key data points"
  ]

  const handleExampleClick = (question: string) => {
    setInput(question)
  }

  // Handle font size change
  const handleFontSizeChange = (size: 'text-xs' | 'text-sm' | 'text-base') => {
    setFontSize(size)
  }

  // Render chart based on type
  const renderChart = (chartData: any) => {
    const { type, data, options } = chartData
    
    // Smaller chart heights
    const chartHeight = type === 'bar' ? 180 : 150
    
    switch (type) {
      case 'pie':
        return (
          <div className="h-[150px] w-full">
            <Pie data={data} options={options} />
          </div>
        )
      case 'bar':
        return (
          <div className="h-[180px] w-full">
            <Bar data={data} options={options} />
          </div>
        )
      case 'line':
        return (
          <div className="h-[150px] w-full">
            <Line data={data} options={options} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Mobile view: Full screen modal */}
          <motion.div
            className="bg-white w-full h-full max-w-3xl max-h-[90vh] md:h-[80vh] md:rounded-xl shadow-xl flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <h2 className="font-semibold text-lg truncate">
                  {pdfName ? `Chat with: ${pdfName}` : 'Chat with PDF'}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {/* Font size controls */}
                <div className="flex items-center space-x-1 bg-blue-600/50 rounded-lg p-1">
                  <button 
                    onClick={() => handleFontSizeChange('text-xs')}
                    className={`p-1 rounded ${fontSize === 'text-xs' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    title="Small text"
                  >
                    <span className="text-xs">A</span>
                  </button>
                  <button 
                    onClick={() => handleFontSizeChange('text-sm')}
                    className={`p-1 rounded ${fontSize === 'text-sm' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    title="Medium text"
                  >
                    <span className="text-sm">A</span>
                  </button>
                  <button 
                    onClick={() => handleFontSizeChange('text-base')}
                    className={`p-1 rounded ${fontSize === 'text-base' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    title="Large text"
                  >
                    <span className="text-base">A</span>
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-blue-700/50 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Document Length Indicator (if truncated) */}
            {isTruncated && (
              <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  This document is large. Only the first {Math.round(truncatedLength/1000)}K characters ({truncationPercentage}%) are being analyzed.
                </p>
              </div>
            )}
            
            {/* Conversation Summary Button */}
            {messages.length > 1 && !showConversationSummary && (
              <button
                onClick={generateConversationSummary}
                className="mx-auto my-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100 flex items-center hover:bg-blue-100 transition-colors"
              >
                <BarChart className="h-3.5 w-3.5 mr-1.5" />
                <span>Show Conversation Summary</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
              </button>
            )}
            
            {/* Conversation Summary Charts */}
            {showConversationSummary && getConversationSummaryCharts()}
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${
                    message.role === 'user' 
                      ? 'ml-auto max-w-[85%] sm:max-w-[80%]' 
                      : 'mr-auto max-w-[85%] sm:max-w-[80%]'
                  }`}
                >
                  <div 
                    className={`p-2.5 rounded-lg ${fontSize} ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    ))}
                    
                    {/* Render chart if available */}
                    {message.chartData && (
                      <div className="mt-2 p-1.5 bg-white/80 rounded-lg border border-gray-200">
                        {renderChart(message.chartData)}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-[10px] ${message.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-400'} mt-1`}>
                    {message.timestamp ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mr-auto max-w-[85%] sm:max-w-[80%] mb-3">
                  <div className="p-2.5 rounded-lg bg-white border border-gray-200 shadow-sm rounded-bl-none flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-gray-500 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="mx-auto max-w-[90%] mb-3 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 text-sm font-medium">Error</p>
                      <p className="text-red-600 text-xs">{error}</p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={handleRetry}
                          className="flex items-center space-x-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Retry</span>
                        </button>
                        <p className="text-red-600 text-xs ml-2">or try a different question</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Example Questions */}
            {messages.length < 3 && (
              <div className="px-3 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-700 mb-1.5">Try asking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-2.5 border-t bg-white">
              <div className="flex space-x-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your PDF..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={2}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-lg ${
                    !input.trim() || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-1.5 px-1">
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-xs text-gray-500 hover:text-blue-500 flex items-center space-x-1"
                    title="Create chart"
                    onClick={() => setInput(prev => prev + " Create a chart of the key data points.")}
                  >
                    <BarChart className="h-3.5 w-3.5" />
                    <span>Chart</span>
                  </button>
                  
                  <button 
                    className="text-xs text-gray-500 hover:text-blue-500 flex items-center space-x-1"
                    title="Show conversation summary"
                    onClick={generateConversationSummary}
                    disabled={messages.length <= 1}
                  >
                    <BarChart2 className="h-3.5 w-3.5" />
                    <span>Summary</span>
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {input.length > 0 ? `${input.length} characters` : 'Type a message...'}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 