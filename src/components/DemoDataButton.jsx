"use client"
import { useAuth } from "../context/AuthContext"
import { useContacts } from "../context/ContactContext"
import { sampleContacts } from "../utils/sampleData"

const DemoDataButton = () => {
  const { user } = useAuth()
  const { allContacts, addContact } = useContacts()

  const addDemoData = () => {
    if (allContacts.length === 0) {
      sampleContacts.forEach((contact) => {
        // Remove id and createdAt to let the system generate new ones
        const { id, createdAt, ...contactData } = contact
        addContact(contactData)
      })
    }
  }

  // Only show if user has no contacts
  if (!user || allContacts.length > 0) {
    return null
  }

  return (
    <div className="text-center mt-4">
      <button
        onClick={addDemoData}
        className="inline-flex items-center px-4 py-2 text-sm text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors shadow-md"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Sample Contacts
      </button>
    </div>
  )
}

export default DemoDataButton
