const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem("contactManager_token")
}

// Helper function to set auth token
const setToken = (token) => {
  if (token) {
    localStorage.setItem("contactManager_token", token)
  } else {
    localStorage.removeItem("contactManager_token")
  }
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Handle network errors or cases where response is not ok
    if (!response.ok) {
      let errorMessage = "An error occurred"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    // Try to parse JSON response
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (e) {
      throw new Error("Invalid response from server")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    
    // Handle network errors (backend not running, CORS, etc.)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please check your internet connection.")
    }
    
    // Re-throw the error with its message
    throw error
  }
}

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
    if (data.token) {
      setToken(data.token)
    }
    return data
  },

  login: async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    if (data.token) {
      setToken(data.token)
    }
    return data
  },

  getCurrentUser: async () => {
    return apiRequest("/auth/me")
  },

  logout: () => {
    setToken(null)
  },
}

// Contacts API
export const contactsAPI = {
  getAll: async (search = "", sort = "name", group = "all") => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (sort) params.append("sort", sort)
    if (group && group !== "all") params.append("group", group)
    
    const query = params.toString()
    return apiRequest(`/contacts${query ? `?${query}` : ""}`)
  },

  create: async (contactData) => {
    return apiRequest("/contacts", {
      method: "POST",
      body: JSON.stringify(contactData),
    })
  },

  update: async (contactId, contactData) => {
    return apiRequest(`/contacts/${contactId}`, {
      method: "PUT",
      body: JSON.stringify(contactData),
    })
  },

  delete: async (contactId) => {
    return apiRequest(`/contacts/${contactId}`, {
      method: "DELETE",
    })
  },

  toggleFavorite: async (contactId) => {
    return apiRequest(`/contacts/${contactId}/toggle-favorite`, {
      method: "POST",
    })
  },

  incrementAccess: async (contactId) => {
    return apiRequest(`/contacts/${contactId}/increment-access`, {
      method: "POST",
    })
  },
}

// Messages API
export const messagesAPI = {
  send: async (recipientEmail, text) => {
    return apiRequest("/messages", {
      method: "POST",
      body: JSON.stringify({ recipientEmail, text }),
    })
  },

  getConversation: async (recipientEmail) => {
    const params = new URLSearchParams({ recipientEmail })
    return apiRequest(`/messages/conversation?${params}`)
  },

  getConversations: async () => {
    return apiRequest("/messages/conversations")
  },

  getUnreadCount: async () => {
    return apiRequest("/messages/unread-count")
  },

  markAsRead: async (messageId) => {
    return apiRequest(`/messages/${messageId}/read`, {
      method: "POST",
    })
  },

  delete: async (messageId) => {
    return apiRequest(`/messages/${messageId}`, {
      method: "DELETE",
    })
  },
}

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Upload failed")
    }

    return response.json()
  },
}

// User search API
export const usersAPI = {
  search: async (email) => {
    const params = new URLSearchParams({ email })
    return apiRequest(`/users/search?${params}`)
  },
}

export { getToken, setToken }


