// Sample data for demonstration purposes
export const sampleContacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc.",
    notes: "Met at the tech conference. Interested in our new product.",
    isFavorite: true,
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 987-6543",
    company: "Design Studio",
    notes: "Graphic designer, potential collaboration opportunity.",
    isFavorite: false,
    createdAt: "2024-01-16T14:20:00.000Z",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 456-7890",
    company: "Marketing Pro",
    notes: "Marketing consultant, very knowledgeable about social media.",
    isFavorite: true,
    createdAt: "2024-01-17T09:15:00.000Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 321-0987",
    company: "Startup Hub",
    notes: "Entrepreneur, looking for investment opportunities.",
    isFavorite: false,
    createdAt: "2024-01-18T16:45:00.000Z",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 654-3210",
    company: "Web Development Co.",
    notes: "Full-stack developer, expert in React and Node.js.",
    isFavorite: false,
    createdAt: "2024-01-19T11:30:00.000Z",
  },
]

// Function to add sample data for demo purposes
export const addSampleData = (userId) => {
  const existingContacts = localStorage.getItem(`contactManager_contacts_${userId}`)

  // Only add sample data if no contacts exist
  if (!existingContacts || JSON.parse(existingContacts).length === 0) {
    localStorage.setItem(`contactManager_contacts_${userId}`, JSON.stringify(sampleContacts))
    return true
  }

  return false
}
