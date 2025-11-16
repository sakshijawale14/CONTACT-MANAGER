"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useContacts } from "../context/ContactContext"
import Navbar from "../components/Navbar"
import ContactCard from "../components/ContactCard"
import ContactModal from "../components/ContactModal"
import Messaging from "../components/Messaging"
import SearchAndSort from "../components/SearchAndSort"
import DemoDataButton from "../components/DemoDataButton"
import ExportImport from "../components/ExportImport"
import DuplicateDetector from "../components/DuplicateDetector"
import ContactGroups from "../components/ContactGroups"

const Dashboard = () => {
  const { user } = useAuth()
  const { contacts, allContacts, frequentContacts, recentContacts } = useContacts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [messagingContact, setMessagingContact] = useState(null)

  const handleAddContact = () => {
    setEditingContact(null)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
  }

  const handleMessage = (contact) => {
    setMessagingContact(contact)
  }

  const handleCloseMessaging = () => {
    setMessagingContact(null)
  }

  const favoriteCount = allContacts.filter((c) => c.isFavorite).length
  const totalCount = allContacts.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Stats */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Manage your contacts and stay organized</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Contacts</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Favorites</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{favoriteCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Frequent</p>
                <p className="text-3xl font-bold text-pink-600 mt-1">{frequentContacts.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Recent</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {recentContacts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Accessed Contacts */}
        {frequentContacts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                Frequently Accessed
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              {frequentContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onEdit={handleEditContact} onMessage={handleMessage} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ExportImport />
            <DuplicateDetector />
            <ContactGroups />
          </div>
          <SearchAndSort onAddContact={handleAddContact} />
        </div>

        {/* Contacts Grid */}
        <div className="space-y-6">
          {contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by adding your first contact. Keep all your important connections organized in one place.
              </p>
              <button
                onClick={handleAddContact}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Contact
              </button>
              <DemoDataButton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onEdit={handleEditContact} onMessage={handleMessage} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Contact Modal */}
      {isModalOpen && <ContactModal contact={editingContact} onClose={handleCloseModal} />}

      {/* Messaging Modal */}
      {messagingContact && <Messaging contact={messagingContact} onClose={handleCloseMessaging} />}
    </div>
  )
}

export default Dashboard
