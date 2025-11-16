"use client"

import { useState } from "react"
import { useContacts } from "../context/ContactContext"

const ExportImport = () => {
  const { allContacts, addContact } = useContacts()
  const [showMenu, setShowMenu] = useState(false)
  const [importMessage, setImportMessage] = useState({ type: "", text: "" })

  const exportToJSON = () => {
    const dataStr = JSON.stringify(allContacts, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `contacts_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Notes", "Favorite", "Created At"]
    const rows = allContacts.map((contact) => [
      contact.name || "",
      contact.email || "",
      contact.phone || "",
      contact.company || "",
      contact.notes || "",
      contact.isFavorite ? "Yes" : "No",
      contact.createdAt || "",
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `contacts_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result)
        if (!Array.isArray(importedData)) {
          setImportMessage({ type: "error", text: "Invalid file format. Expected an array of contacts." })
          return
        }

        let imported = 0
        let skipped = 0

        importedData.forEach((contact) => {
          // Check if contact already exists (by email)
          const exists = allContacts.some((c) => c.email === contact.email)
          if (!exists && contact.name && contact.email) {
            const { id, createdAt, ...contactData } = contact
            addContact(contactData)
            imported++
          } else {
            skipped++
          }
        })

        setImportMessage({
          type: "success",
          text: `Imported ${imported} contacts. ${skipped} skipped (duplicates or invalid).`,
        })
        setTimeout(() => setImportMessage({ type: "", text: "" }), 5000)
      } catch (error) {
        setImportMessage({ type: "error", text: "Failed to import. Please check the file format." })
        setTimeout(() => setImportMessage({ type: "", text: "" }), 5000)
      }
    }
    reader.readAsText(file)
    e.target.value = "" // Reset input
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-md border border-purple-200 text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Export/Import
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            <button
              onClick={exportToJSON}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export as JSON
            </button>
            <button
              onClick={exportToCSV}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as CSV
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <label className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center cursor-pointer">
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import from JSON
            </label>
          </div>
        </>
      )}

      {importMessage.text && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
            importMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {importMessage.type === "success" ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium">{importMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportImport

