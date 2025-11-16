"use client"

import { useState } from "react"
import { useContacts } from "../context/ContactContext"

const DuplicateDetector = () => {
  const { allContacts, deleteContact } = useContacts()
  const [duplicates, setDuplicates] = useState([])
  const [showResults, setShowResults] = useState(false)

  const findDuplicates = () => {
    const emailMap = new Map()
    const phoneMap = new Map()
    const nameMap = new Map()
    const foundDuplicates = []

    allContacts.forEach((contact) => {
      // Check by email
      if (contact.email) {
        const emailKey = contact.email.toLowerCase().trim()
        if (emailMap.has(emailKey)) {
          foundDuplicates.push({
            type: "email",
            value: contact.email,
            contacts: [emailMap.get(emailKey), contact],
          })
        } else {
          emailMap.set(emailKey, contact)
        }
      }

      // Check by phone
      if (contact.phone) {
        const phoneKey = contact.phone.replace(/\D/g, "") // Remove non-digits
        if (phoneMap.has(phoneKey) && phoneKey.length > 0) {
          foundDuplicates.push({
            type: "phone",
            value: contact.phone,
            contacts: [phoneMap.get(phoneKey), contact],
          })
        } else {
          phoneMap.set(phoneKey, contact)
        }
      }

      // Check by name (exact match)
      if (contact.name) {
        const nameKey = contact.name.toLowerCase().trim()
        if (nameMap.has(nameKey)) {
          const existing = nameMap.get(nameKey)
          // Only flag if other details are similar
          if (
            existing.email === contact.email ||
            existing.phone === contact.phone ||
            (existing.email && contact.email && existing.email.toLowerCase() === contact.email.toLowerCase())
          ) {
            foundDuplicates.push({
              type: "name",
              value: contact.name,
              contacts: [existing, contact],
            })
          }
        } else {
          nameMap.set(nameKey, contact)
        }
      }
    })

    setDuplicates(foundDuplicates)
    setShowResults(true)
  }

  const handleMerge = (duplicateGroup) => {
    // Keep the first contact, delete the rest
    const [, ...toDelete] = duplicateGroup.contacts
    toDelete.forEach((contact) => {
      deleteContact(contact.id)
    })
    setDuplicates((prev) => prev.filter((dup) => dup !== duplicateGroup))
  }

  if (allContacts.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={findDuplicates}
        className="inline-flex items-center px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all shadow-md border border-orange-200 text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Find Duplicates
      </button>

      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Duplicate Detection Results ({duplicates.length} found)
              </h2>
              <button
                onClick={() => {
                  setShowResults(false)
                  setDuplicates([])
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {duplicates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Duplicates Found!</h3>
                  <p className="text-gray-600">All your contacts are unique.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {duplicates.map((dup, index) => (
                    <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 bg-orange-200 text-orange-800 text-xs font-semibold rounded">
                            Duplicate {dup.type}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">Value: {dup.value}</p>
                        </div>
                        <button
                          onClick={() => handleMerge(dup)}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Merge & Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {dup.contacts.map((contact, idx) => (
                          <div key={contact.id} className="bg-white rounded p-3 border border-gray-200">
                            <p className="font-semibold text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DuplicateDetector

