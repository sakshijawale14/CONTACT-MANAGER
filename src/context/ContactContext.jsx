"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { contactsAPI } from "../utils/api"

const ContactContext = createContext()

export const useContacts = () => {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error("useContacts must be used within a ContactProvider")
  }
  return context
}

export const ContactProvider = ({ children }) => {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name") // 'name', 'favorites', 'frequent'
  const [selectedGroup, setSelectedGroup] = useState("all")

  // Load contacts from API when user changes
  useEffect(() => {
    if (user) {
      loadContacts()
    } else {
      setContacts([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // loadContacts is stable, no need to include it

  const loadContacts = async () => {
    if (!user) return
    setLoading(true)
    try {
      const sort = sortBy === "frequent" ? "frequent" : sortBy === "favorites" ? "favorites" : "name"
      const data = await contactsAPI.getAll(searchTerm, sort, selectedGroup)
      setContacts(data.contacts || [])
    } catch (error) {
      console.error("Failed to load contacts:", error)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  // Reload contacts when search, sort, or group changes
  useEffect(() => {
    if (user) {
      loadContacts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, selectedGroup, user]) // loadContacts is stable, no need to include it

  const addContact = async (contactData) => {
    try {
      const data = await contactsAPI.create(contactData)
      await loadContacts() // Reload to get updated list
      return data
    } catch (error) {
      console.error("Failed to add contact:", error)
      throw error
    }
  }

  const updateContact = async (id, contactData) => {
    try {
      const data = await contactsAPI.update(id, contactData)
      await loadContacts() // Reload to get updated list
      return data
    } catch (error) {
      console.error("Failed to update contact:", error)
      throw error
    }
  }

  const deleteContact = async (id) => {
    try {
      await contactsAPI.delete(id)
      await loadContacts() // Reload to get updated list
    } catch (error) {
      console.error("Failed to delete contact:", error)
      throw error
    }
  }

  const toggleFavorite = async (id) => {
    try {
      await contactsAPI.toggleFavorite(id)
      await loadContacts() // Reload to get updated list
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      throw error
    }
  }

  const incrementAccessCount = async (id) => {
    try {
      await contactsAPI.incrementAccess(id)
      await loadContacts() // Reload to get updated list
    } catch (error) {
      console.error("Failed to increment access count:", error)
    }
  }

  // Filter and sort contacts (client-side filtering for search)
  const filteredAndSortedContacts = React.useMemo(() => {
    let filtered = contacts

    // Client-side search filtering (backend also does this, but we do it here for instant feedback)
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.phone && contact.phone.includes(searchTerm)),
      )
    }

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter((contact) => contact.group === selectedGroup)
    }

    // Sort contacts
    filtered.sort((a, b) => {
      if (sortBy === "favorites") {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return a.name.localeCompare(b.name)
      } else if (sortBy === "frequent") {
        const aCount = a.accessCount || 0
        const bCount = b.accessCount || 0
        if (aCount !== bCount) return bCount - aCount
        return a.name.localeCompare(b.name)
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [contacts, searchTerm, sortBy, selectedGroup])

  // Get frequently accessed contacts (accessed 4+ times)
  const frequentContacts = React.useMemo(() => {
    return [...contacts]
      .filter((contact) => (contact.accessCount || 0) >= 4)
      .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
      .slice(0, 5)
  }, [contacts])

  // Get recently created contacts (last 7 days)
  const recentContacts = React.useMemo(() => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return [...contacts]
      .filter((contact) => {
        if (!contact.createdAt) return false
        const createdDate = new Date(contact.createdAt)
        return createdDate >= sevenDaysAgo
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      .slice(0, 5)
  }, [contacts])

  const value = {
    contacts: filteredAndSortedContacts,
    allContacts: contacts,
    frequentContacts,
    recentContacts,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedGroup,
    setSelectedGroup,
    addContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    incrementAccessCount,
    refreshContacts: loadContacts,
  }

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}
