"use client"

import { useState } from "react"
import { useContacts } from "../context/ContactContext"

const ContactCard = ({ contact, onEdit, onMessage }) => {
  const { toggleFavorite, deleteContact, incrementAccessCount } = useContacts()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const handleCardClick = () => {
    incrementAccessCount(contact.id)
    onEdit(contact)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(contact.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deleteContact(contact.id)
    setShowDeleteConfirm(false)
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleCall = (e) => {
    e.stopPropagation()
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`
    }
  }

  const handleEmail = (e) => {
    e.stopPropagation()
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`
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

  const isFrequent = (contact.accessCount || 0) > 3

  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 p-6 hover:shadow-xl transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 ${
        isFrequent ? "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50" : "border-gray-200"
      } ${contact.isFavorite ? "ring-2 ring-yellow-400" : ""}`}
      onClick={handleCardClick}
    >
      {/* Favorite Badge */}
      {contact.isFavorite && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
            <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* Frequent Badge */}
      {isFrequent && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Frequent
          </div>
        </div>
      )}

      {/* Avatar/Photo */}
      <div className="flex items-center mb-4 group">
        {contact.photo ? (
          <img
            src={contact.photo}
            alt={contact.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-purple-200 shadow-md mr-4"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mr-4 shadow-lg">
            {getInitials(contact.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{contact.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate flex-1">{contact.email}</p>
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEmail(e)
                }}
                className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                title="Send email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(contact.email, "email")
                }}
                className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                title={copiedField === "email" ? "Copied!" : "Copy email"}
              >
                {copiedField === "email" ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {isFrequent && (
            <p className="text-xs text-purple-600 font-medium mt-1">
              Accessed {contact.accessCount || 0} times
            </p>
          )}
          {contact.group && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              {contact.group}
            </span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {contact.phone && (
          <div className="flex items-center justify-between text-sm text-gray-600 group">
            <div className="flex items-center flex-1">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="truncate">{contact.phone}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCall(e)
                }}
                className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                title="Call"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(contact.phone, "phone")
                }}
                className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                title={copiedField === "phone" ? "Copied!" : "Copy phone"}
              >
                {copiedField === "phone" ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="truncate">{contact.company}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              contact.isFavorite
                ? "text-yellow-500 hover:bg-yellow-50"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
            title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className="w-5 h-5"
              fill={contact.isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contact)
            }}
            className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
            title="Edit contact"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          {onMessage && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMessage(contact)
              }}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete contact"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contact</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {contact.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactCard
