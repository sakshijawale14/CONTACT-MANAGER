"use client"

import { useState } from "react"
import { useContacts } from "../context/ContactContext"

const ContactGroups = () => {
  const { allContacts, selectedGroup, setSelectedGroup } = useContacts()

  const [showGroups, setShowGroups] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [showAddGroup, setShowAddGroup] = useState(false)

  // Get all unique groups
  const groups = ["all", "work", "personal", "family", "friends"]
  const customGroups = Array.from(
    new Set(allContacts.map((c) => c.group).filter((g) => g && !groups.includes(g))),
  )

  const allGroups = [...groups, ...customGroups]

  const getGroupCount = (groupName) => {
    if (groupName === "all") return allContacts.length
    return allContacts.filter((c) => c.group === groupName).length
  }

  const handleAddGroup = () => {
    if (newGroupName.trim() && !allGroups.includes(newGroupName.toLowerCase())) {
      // Group will be created when contacts are assigned to it
      setShowAddGroup(false)
      setNewGroupName("")
    }
  }


  return (
    <div className="relative">
      <button
        onClick={() => setShowGroups(!showGroups)}
        className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all shadow-md border border-indigo-200 text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Groups
      </button>

      {showGroups && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowGroups(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Contact Groups</h3>
            </div>
            {allGroups.map((group) => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group)
                  setShowGroups(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                  selectedGroup === group
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="capitalize">{group}</span>
                <span className="text-xs text-gray-500">({getGroupCount(group)})</span>
              </button>
            ))}
            {showAddGroup ? (
              <div className="px-4 py-2 border-t border-gray-100">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === "Enter" && handleAddGroup()}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddGroup}
                    className="flex-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddGroup(false)
                      setNewGroupName("")
                    }}
                    className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddGroup(true)}
                className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center border-t border-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Group
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ContactGroups

