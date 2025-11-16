"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "url('/pattern.svg')", backgroundRepeat: "repeat" }}
      ></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 text-balance">
            Contact Manager
          </h1>
          <p className="text-xl text-blue-100 text-balance max-w-lg mx-auto leading-relaxed">
            Organize, manage, and stay connected with all your important contacts in one beautiful, intuitive platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login to Your Account
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
          >
            Create New Account
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Organize Contacts</h3>
            <p className="text-sm text-white/70">Keep all your contacts organized and easily accessible</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quick Search</h3>
            <p className="text-sm text-white/70">Find any contact instantly with powerful search</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Favorites</h3>
            <p className="text-sm text-white/70">Mark important contacts as favorites for quick access</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
