"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import api from "./api"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  googleLogin: (code: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken()
      if (token) {
        try {
          const profile = await api.getProfile()
          // Try to restore saved avatar (e.g. Google profile picture)
          const savedUser = localStorage.getItem("user")
          const savedAvatar = savedUser ? JSON.parse(savedUser)?.avatar : null
          const userData: User = {
            id: profile.id.toString(),
            email: profile.email,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            avatar: savedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
          }
          setUser(userData)
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          api.removeToken()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await api.login(email, password)

      try {
        const profile = await api.getProfile()
        const userData: User = {
          id: profile.id.toString(),
          email: profile.email,
          firstName: profile.first_name || email.split("@")[0],
          lastName: profile.last_name || "",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } catch (profileError) {
        console.error("Failed to fetch profile after login:", profileError)
        const userData: User = {
          id: data.user_id?.toString() || "0",
          email: data.email || email,
          firstName: email.split("@")[0],
          lastName: "",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true)
    try {
      const username = email.split("@")[0]
      await api.register(username, email, password, firstName, lastName)
      await login(email, password)
    } catch (error: any) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const googleLogin = async (code: string) => {
    setIsLoading(true)
    try {
      const googleData = await api.googleLogin(code)

      const profile = await api.getProfile()
      const userData: User = {
        id: profile.id.toString(),
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        avatar: googleData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error: any) {
      console.error('Google login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, googleLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
