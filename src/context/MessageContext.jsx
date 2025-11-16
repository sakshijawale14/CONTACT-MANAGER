"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { messagesAPI } from "../utils/api"

const MessageContext = createContext()

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}

export const MessageProvider = ({ children }) => {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  // Load unread count when user changes
  useEffect(() => {
    if (user) {
      loadUnreadCount()
      // Refresh unread count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    } else {
      setUnreadCount(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // loadUnreadCount is stable, no need to include it

  const loadUnreadCount = async () => {
    if (!user) return
    try {
      const data = await messagesAPI.getUnreadCount()
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error("Failed to load unread count:", error)
    }
  }

  // Send a message (uses recipientEmail for cross-account messaging)
  const sendMessage = async (recipientEmail, text) => {
    if (!user || !text.trim()) {
      throw new Error("User must be logged in and message text is required")
    }

    try {
      const data = await messagesAPI.send(recipientEmail, text)
      // Refresh unread count after sending
      await loadUnreadCount()
      return data
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  // Get messages between current user and a contact (by email)
  const getConversation = async (recipientEmail) => {
    if (!user) return []

    try {
      const data = await messagesAPI.getConversation(recipientEmail)
      return data.messages || []
    } catch (error) {
      console.error("Failed to get conversation:", error)
      return []
    }
  }

  // Get all conversations
  const getConversations = async () => {
    if (!user) return []

    try {
      const data = await messagesAPI.getConversations()
      return data.conversations || []
    } catch (error) {
      console.error("Failed to get conversations:", error)
      return []
    }
  }

  // Mark messages as read (handled automatically when fetching conversation)
  const markAsRead = async (recipientEmail) => {
    // This is handled automatically when fetching conversation
    // But we can refresh unread count
    await loadUnreadCount()
  }

  const value = {
    sendMessage,
    getConversation,
    getConversations,
    markAsRead,
    getUnreadCount: () => unreadCount,
    unreadCount,
    refreshUnreadCount: loadUnreadCount,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}
