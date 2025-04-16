'use client'

import { useState, useEffect } from 'react'
import { Clock, MessageSquare, Search, Trash2, ChevronRight, ChevronDown, Lock, Unlock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ChatSession {
  id: string
  title: string
  date: Date
  preview: string
  locked?: boolean
}

interface ChatHistorySidebarProps {
  onSelectSession?: (sessionId: string) => void
  type: 'research' | 'resume'
}

export default function ChatHistorySidebar({ onSelectSession, type }: ChatHistorySidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [expandedSection, setExpandedSection] = useState<'recent' | 'saved' | null>('recent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load chat history from localStorage
    try {
      const savedSessions = localStorage.getItem(`${type}ChatSessions`)
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions)
        // Convert string dates back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }))
        setSessions(sessionsWithDates)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast.error('Failed to load chat history')
    } finally {
      setLoading(false)
    }
  }, [type])

  const saveSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, locked: !session.locked }
          : session
      )
    )

    // Update localStorage
    try {
      localStorage.setItem(`${type}ChatSessions`, JSON.stringify(sessions))
      toast.success(
        sessions.find(s => s.id === sessionId)?.locked
          ? 'Session unlocked'
          : 'Session saved'
      )
    } catch (error) {
      console.error('Error saving session:', error)
      toast.error('Failed to save session')
    }
  }

  const deleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session?.locked) {
      toast.error('Cannot delete a saved session')
      return
    }

    setSessions(prev => prev.filter(session => session.id !== sessionId))

    // Update localStorage
    try {
      localStorage.setItem(
        `${type}ChatSessions`,
        JSON.stringify(sessions.filter(session => session.id !== sessionId))
      )
      toast.success('Session deleted')
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to delete session')
    }
  }

  const recentSessions = sessions.filter(session => !session.locked)
  const savedSessions = sessions.filter(session => session.locked)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-blue-700 border-r border-gray-200 h-full overflow-y-auto p-4 w-full text-white">
      <h3 className="text-lg font-semibold mb-4">
        {type === 'research' ? 'Research History' : 'Resume Analysis History'}
      </h3>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-blue-200">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No chat history yet</p>
          <p className="text-sm mt-1">Your conversations will appear here</p>
        </div>
      ) : (
        <>
          {/* Recent Sessions */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full p-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'recent' ? null : 'recent')}
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Recent ({recentSessions.length})</span>
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
                  {recentSessions.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No recent sessions</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {recentSessions.map(session => (
                        <div
                          key={session.id}
                          className="bg-white p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <button
                              className="text-left flex-1"
                              onClick={() => onSelectSession?.(session.id)}
                            >
                              <h4 className="font-medium text-sm truncate">{session.title}</h4>
                              <p className="text-xs text-blue-300 mt-1">
                                {session.date.toLocaleDateString()} · {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{session.preview}</p>
                            </button>

                            <div className="flex space-x-1 ml-2">
                              <button
                                className="p-1 text-gray-400 hover:text-blue-500"
                                onClick={() => saveSession(session.id)}
                                title="Save session"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-400 hover:text-red-500"
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
              className="flex items-center justify-between w-full p-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'saved' ? null : 'saved')}
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                <span className="font-medium">Saved ({savedSessions.length})</span>
              </div>
              {expandedSection === 'saved' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
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
                    <p className="text-sm text-gray-500 p-2">No saved sessions</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {savedSessions.map(session => (
                        <div
                          key={session.id}
                          className="bg-white p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <button
                              className="text-left flex-1"
                              onClick={() => onSelectSession?.(session.id)}
                            >
                              <h4 className="font-medium text-sm truncate">{session.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {session.date.toLocaleDateString()} · {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{session.preview}</p>
                            </button>

                            <div className="flex space-x-1 ml-2">
                              <button
                                className="p-1 text-blue-500 hover:text-gray-500"
                                onClick={() => saveSession(session.id)}
                                title="Unsave session"
                              >
                                <Unlock className="w-4 h-4" />
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
  )
}
