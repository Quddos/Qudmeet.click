'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, FileText, Loader2, MessageSquare, Plus, ChevronRight, ChevronDown, Clock, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'
import MessageFormatter from './MessageFormatter'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  date: Date
  saved: boolean
}

interface ChatSessionProps {
  type: 'research' | 'resume'
  pdfText?: string
  pdfName?: string
  className?: string
}

export default function ChatSession({ type, pdfText, pdfName, className = '' }: ChatSessionProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState<'recent' | 'saved' | null>('recent')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat sessions from localStorage
  useEffect(() => {
    const loadSessions = () => {
      try {
        const savedSessions = localStorage.getItem(`${type}ChatSessions`)
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions)
          // Convert string dates back to Date objects
          const sessionsWithDates = parsedSessions.map((session: any) => ({
            ...session,
            date: new Date(session.date),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
            }))
          }))
          setSessions(sessionsWithDates)
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error)
        toast.error('Failed to load chat history')
      }
    }

    loadSessions()
  }, [type])

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure DOM updates complete before scrolling
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeSession?.messages, loading]);

  // Save sessions to localStorage
  const saveSessions = (updatedSessions: ChatSession[]) => {
    try {
      localStorage.setItem(`${type}ChatSessions`, JSON.stringify(updatedSessions))
    } catch (error) {
      console.error('Error saving sessions:', error)
      toast.error('Failed to save chat sessions')
    }
  }

  // Create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: newChatTitle || `New Chat ${sessions.length + 1}`,
      messages: [
        {
          role: 'assistant',
          content: pdfText
            ? `Hello! I'm your PDF assistant for "${pdfName || 'your document'}". How can I help you understand it better?`
            : `Hello! I'm your AI assistant. How can I help you today?`,
          timestamp: new Date()
        }
      ],
      date: new Date(),
      saved: false
    }

    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    setActiveSession(newSession)
    saveSessions(updatedSessions)
    setNewChatTitle('')
    setIsMobileMenuOpen(false)
  }

  // Delete a chat session
  const deleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session?.saved) {
      toast.error('Cannot delete a saved session')
      return
    }

    const updatedSessions = sessions.filter(session => session.id !== sessionId)
    setSessions(updatedSessions)

    if (activeSession?.id === sessionId) {
      setActiveSession(updatedSessions.length > 0 ? updatedSessions[0] : null)
    }

    saveSessions(updatedSessions)
    toast.success('Session deleted')
  }

  // Toggle save status of a session
  const toggleSaveSession = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId
        ? { ...session, saved: !session.saved }
        : session
    )

    setSessions(updatedSessions)

    if (activeSession?.id === sessionId) {
      const updatedSession = updatedSessions.find(s => s.id === sessionId)
      if (updatedSession) {
        setActiveSession(updatedSession)
      }
    }

    saveSessions(updatedSessions)

    const session = sessions.find(s => s.id === sessionId)
    toast.success(session?.saved ? 'Session unsaved' : 'Session saved')
  }

  // Send a message
  const sendMessage = async () => {
    if (!input.trim() || loading || !activeSession) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    // Update active session with user message
    const updatedActiveSession = {
      ...activeSession,
      messages: [...activeSession.messages, userMessage]
    }

    // Update the title for new chats if this is the first user message
    let shouldUpdateTitle = false
    if (activeSession.messages.length === 1 && activeSession.messages[0].role === 'assistant') {
      updatedActiveSession.title = input.slice(0, 30) + (input.length > 30 ? '...' : '')
      shouldUpdateTitle = true
    }

    setActiveSession(updatedActiveSession)

    // Update in sessions list
    const updatedSessions = sessions.map(session =>
      session.id === activeSession.id ? updatedActiveSession : session
    )
    setSessions(updatedSessions)
    saveSessions(updatedSessions)

    setInput('')
    setLoading(true)

    try {
      // Determine the appropriate endpoint based on type and if we have PDF text
      let endpoint = '/api/chat';

      if (pdfText) {
        endpoint = type === 'research' ? '/api/chat-research' : '/api/chat-pdf';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedActiveSession.messages,
          pdfText: pdfText?.slice(0, 30000), // Limit PDF text length if provided
          enhancedMode: true, // Enable enhanced mode to think beyond the PDF content
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date()
      }

      // Update active session with assistant's response
      const finalSession = {
        ...updatedActiveSession,
        messages: [...updatedActiveSession.messages, assistantMessage]
      }

      setActiveSession(finalSession)

      // Update in sessions list
      const finalSessions = sessions.map(session =>
        session.id === activeSession.id ? finalSession : session
      )
      setSessions(finalSessions)
      saveSessions(finalSessions)

    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get a response. Please try again.')

      // Add more helpful error message
      let errorContent = "I'm having trouble processing your request right now. This could be due to high demand or a temporary issue with the AI service.";
      errorContent += "\n\nPlease try again in a moment, or try rephrasing your question.";

      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      }

      const sessionWithError = {
        ...updatedActiveSession,
        messages: [...updatedActiveSession.messages, errorMessage]
      }

      setActiveSession(sessionWithError)

      // Update in sessions list
      const sessionsWithError = sessions.map(session =>
        session.id === activeSession.id ? sessionWithError : session
      )
      setSessions(sessionsWithError)
      saveSessions(sessionsWithError)
    } finally {
      setLoading(false)
    }
  }

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const recentSessions = sessions.filter(session => !session.saved)
  const savedSessions = sessions.filter(session => session.saved)

  return (
    <div className={`flex h-[calc(100vh-200px)] min-h-[500px] border border-gray-200 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-30"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat History Sidebar */}
      <div
        className={`w-72 bg-white border-r border-gray-200 flex flex-col ${
          isMobileMenuOpen ? 'fixed inset-0 z-20 w-full md:w-72 md:relative' : 'hidden md:flex'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={createNewSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5 flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No chat history yet</p>
              <p className="text-sm mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <>
              {/* Recent Sessions */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === 'recent' ? null : 'recent')}
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-700">Recent ({recentSessions.length})</span>
                  </div>
                  {expandedSection === 'recent' ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
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
                      {recentSessions.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No recent chats</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {recentSessions.map(session => (
                            <div
                              key={session.id}
                              className={`p-3 rounded-md border transition-colors ${
                                activeSession?.id === session.id
                                  ? 'bg-blue-50 border-blue-300'
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <button
                                  className="text-left flex-1"
                                  onClick={() => {
                                    setActiveSession(session)
                                    setIsMobileMenuOpen(false)
                                  }}
                                >
                                  <h4 className="font-medium text-sm truncate text-gray-800">{session.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {session.date.toLocaleDateString()} · {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </button>

                                <div className="flex space-x-1 ml-2">
                                  <button
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                    onClick={() => toggleSaveSession(session.id)}
                                    title="Save session"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    onClick={() => deleteSession(session.id)}
                                    title="Delete session"
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

              {/* Saved Sessions */}
              <div>
                <button
                  className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === 'saved' ? null : 'saved')}
                >
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-700">Saved ({savedSessions.length})</span>
                  </div>
                  {expandedSection === 'saved' ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === 'saved' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {savedSessions.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No saved chats</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {savedSessions.map(session => (
                            <div
                              key={session.id}
                              className={`p-3 rounded-md border transition-colors ${
                                activeSession?.id === session.id
                                  ? 'bg-blue-50 border-blue-300'
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <button
                                  className="text-left flex-1"
                                  onClick={() => {
                                    setActiveSession(session)
                                    setIsMobileMenuOpen(false)
                                  }}
                                >
                                  <h4 className="font-medium text-sm truncate text-gray-800">{session.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {session.date.toLocaleDateString()} · {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </button>

                                <div className="flex space-x-1 ml-2">
                                  <button
                                    className={`p-1 ${session.saved ? 'text-blue-500' : 'text-gray-400'} hover:text-gray-600`}
                                    onClick={() => toggleSaveSession(session.id)}
                                    title={session.saved ? 'Unsave session' : 'Save session'}
                                  >
                                    <Save className="w-4 h-4" />
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
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 p-4 bg-blue-100 rounded-full">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Start a new conversation</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {pdfText
                ? `Chat about "${pdfName || 'your document'}" or ask general questions.`
                : 'Chat with AI to get help, information, or creative content.'}
            </p>
            <button
              onClick={createNewSession}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>New chat</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                <h3 className="font-medium text-gray-800">{activeSession.title}</h3>
              </div>
              {activeSession.saved && (
                <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  Saved
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-container">
              {activeSession.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none text-gray-800'
                    }`}
                  >
                    <MessageFormatter 
                      content={message.content}
                      className={message.role === 'user' ? 'text-white' : 'text-gray-800'}
                    />

                    {/* Timestamp */}
                    <div className={`text-[10px] ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'} mt-1`}>
                      {message.timestamp ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${pdfText ? 'about your document' : ''}...`}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                    !input.trim() || loading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}