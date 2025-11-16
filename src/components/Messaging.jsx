"use client"

import { useState, useEffect, useRef } from "react"
import { useMessages } from "../context/MessageContext"
import { useAuth } from "../context/AuthContext"

const Messaging = ({ contact, onClose }) => {
  const { user } = useAuth()
  const { sendMessage, getConversation, markAsRead } = useMessages()
  const [messageText, setMessageText] = useState("")
  const [conversation, setConversation] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date()) // For real-time timestamp updates
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const conversationRef = useRef([]) // Keep ref of conversation for polling

  // Silent refresh for polling (doesn't show loading state)
  const refreshConversation = async () => {
    if (!contact || !contact.email) return
    try {
      const conv = await getConversation(contact.email)
      
      // Only update if there are actual changes (use ref to avoid stale closure)
      const currentConv = conversationRef.current
      const currentLastId = currentConv.length > 0 ? currentConv[currentConv.length - 1]?.id : null
      const newLastId = conv.length > 0 ? conv[conv.length - 1]?.id : null
      
      if (currentLastId !== newLastId || conv.length !== currentConv.length) {
        // New messages detected
        const unreadForContact = conv.filter(msg => msg.senderId !== user.id && !msg.read).length
        setUnreadCount(unreadForContact)
        setConversation(conv)
        conversationRef.current = conv // Update ref
        await markAsRead(contact.email)
        setUnreadCount(0)
        
        // Check if user is near bottom (within 100px) - if so, auto-scroll
        const messagesContainer = messagesEndRef.current?.parentElement
        if (messagesContainer) {
          const isNearBottom = 
            messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100
          
          if (isNearBottom) {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
          }
        }
      }
    } catch (error) {
      // Silently fail during polling to avoid spam
      console.error("Failed to refresh conversation:", error)
    }
  }

  useEffect(() => {
    if (contact && contact.email) {
      loadConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]) // loadConversation is stable, no need to include it

  // Real-time polling: Check for new messages every 2 seconds
  useEffect(() => {
    if (!contact || !contact.email) return

    const pollInterval = setInterval(() => {
      // Silently refresh conversation to get new messages
      refreshConversation()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.email, user?.id]) // Only depend on contact email and user id

  const loadConversation = async (isInitialLoad = true) => {
    if (!contact || !contact.email) return
    try {
      const conv = await getConversation(contact.email)
      // Calculate unread count BEFORE marking as read
      const unreadForContact = conv.filter(msg => msg.senderId !== user.id && !msg.read).length
      setUnreadCount(unreadForContact)
      
      // Check if there are new messages (compare by length or last message ID)
      const hasNewMessages = conv.length !== conversation.length || 
        (conv.length > 0 && conversation.length > 0 && 
         conv[conv.length - 1].id !== conversation[conversation.length - 1].id)
      
      setConversation(conv)
      conversationRef.current = conv // Update ref
      await markAsRead(contact.email)
      // After marking as read, unread count should be 0
      setUnreadCount(0)
      
      // Only auto-scroll if it's initial load, user sent a message, or new message received
      if (isInitialLoad || hasNewMessages) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    } catch (error) {
      console.error("Failed to load conversation:", error)
    }
  }

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  // Update timestamps in real-time (every 5 seconds for more responsive updates)
  useEffect(() => {
    // Update immediately
    setCurrentTime(new Date())
    
    // Then update every 5 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 5000) // Update every 5 seconds for more responsive timestamps

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !contact || !contact.email) return

    try {
      await sendMessage(contact.email, messageText)
      setMessageText("")
      // Reload conversation to show new message immediately
      await loadConversation(false) // false = not initial load, so no loading spinner
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } catch (error) {
      console.error("Failed to send message:", error)
      alert(error.message || "Failed to send message. Please try again.")
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time"
    
    // Parse the timestamp (handles ISO format from backend)
    // The backend sends UTC time in ISO format like "2024-01-15T10:30:00.000000"
    // If it doesn't have 'Z' or timezone, assume it's UTC
    let date
    if (timestamp.includes('Z') || timestamp.includes('+') || timestamp.includes('-', 10)) {
      // Has timezone info, parse normally
      date = new Date(timestamp)
    } else {
      // No timezone info, assume UTC and append 'Z'
      date = new Date(timestamp + 'Z')
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid timestamp:", timestamp, "Parsed as:", date)
      return "Invalid time"
    }
    
    const now = currentTime // Use currentTime state for real-time updates
    const diffMs = now.getTime() - date.getTime()
    
    // Debug: Log timestamp details to help diagnose issues
    if (Math.abs(diffMs) > 3600000) { // If difference is more than 1 hour, log it
      console.log("Timestamp debug:", {
        original: timestamp,
        parsed: date.toISOString(),
        local: date.toLocaleString(),
        now: now.toISOString(),
        nowLocal: now.toLocaleString(),
        diffMs: diffMs,
        diffMins: Math.floor(diffMs / 60000),
        diffHours: Math.floor(diffMs / 3600000)
      })
    }
    
    // Handle negative differences (future dates - shouldn't happen but handle gracefully)
    if (diffMs < 0) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    }
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    // Check if message is from today (compare dates in local timezone)
    const dateStr = date.toDateString()
    const nowStr = now.toDateString()
    const isToday = dateStr === nowStr
    
    // Always show relative time for recent messages
    if (diffMins < 1) {
      return "Just now"
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
    } else if (diffHours < 24) {
      // Show hours ago for messages within 24 hours
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else if (diffDays < 7) {
      // Show days ago for messages within a week
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    } else if (diffDays < 30) {
      // Show weeks ago for messages within a month
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
    } else if (diffDays < 365) {
      // Show months ago for messages within a year
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? "month" : "months"} ago`
    } else {
      // For very old messages, show the date
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
      })
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return
    
    try {
      const { messagesAPI } = await import("../utils/api")
      await messagesAPI.delete(messageId)
      await loadConversation()
    } catch (error) {
      console.error("Failed to delete message:", error)
      alert("Failed to delete message. Please try again.")
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!contact) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            {contact.photo ? (
              <img
                src={contact.photo}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(contact.name)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {contact.name}
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">{contact.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation with {contact.name}</p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isSent = msg.senderId === user.id
              const isUnread = !isSent && !msg.read
              return (
                <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"} ${isUnread ? "bg-blue-50 rounded-lg p-2 -mx-2" : ""}`}>
                  <div className={`flex items-start gap-2 max-w-[75%] ${isSent ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    {!isSent && (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {getInitials(msg.senderName)}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className="flex flex-col group">
                      <div
                        className={`rounded-2xl px-4 py-2 relative ${
                          isSent
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : isUnread
                            ? "bg-blue-100 text-gray-900 border-2 border-blue-300"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                        {isSent && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-opacity hover:bg-red-600"
                            title="Delete message"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 px-2 ${isSent ? "justify-end" : "justify-start"}`}>
                        <span className="text-xs text-gray-500" key={`timestamp-${msg.id}-${currentTime.getTime()}`}>
                          {formatTimestamp(msg.timestamp)}
                        </span>
                        {isSent && msg.read && (
                          <span className="text-xs text-blue-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Seen
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Messaging

