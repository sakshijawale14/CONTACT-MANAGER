"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, getToken, setToken } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = getToken()
      if (token) {
        try {
          const data = await authAPI.getCurrentUser()
          setUser(data.user)
        } catch (error) {
          console.error("Failed to load user:", error)
          setToken(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      setUser(data.user)
      return { success: true, message: "Successfully logged in!" }
    } catch (error) {
      return { success: false, message: error.message || "Incorrect email or password. Please try again." }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password)
      setUser(data.user)
      return { success: true, message: "Account created successfully! Welcome to Contact Manager." }
    } catch (error) {
      return { success: false, message: error.message || "Failed to create account. Please try again." }
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
