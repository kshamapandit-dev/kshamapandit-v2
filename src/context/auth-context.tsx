"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { graphqlClient, LoginResponse, REFRESH_TOKEN_MUTATION } from '@/lib/graphql'

interface User {
  id: string
  databaseId: number
  name: string
  email: string
  firstName: string
  lastName: string
  username: string
}

interface Customer {
  id: string
  databaseId: number
  email: string
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  customer: Customer | null
  isAuthenticated: boolean
  login: (authToken: string, refreshToken: string, user: User, customer: Customer) => void
  logout: () => void
  refreshAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'kp-auth-token'
const REFRESH_TOKEN_STORAGE_KEY = 'kp-refresh-token'
const USER_STORAGE_KEY = 'kp-user'
const CUSTOMER_STORAGE_KEY = 'kp-customer'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY)

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const parsedCustomer = storedCustomer ? JSON.parse(storedCustomer) : null
      setUser(parsedUser)
      setCustomer(parsedCustomer)
      setIsAuthenticated(true)
      graphqlClient.setHeader('Authorization', `Bearer ${storedToken}`)
    }
  }, [])

  const login = (authToken: string, refreshToken: string, userData: User, customerData: Customer) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken)
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    if (customerData) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData))
    }
    graphqlClient.setHeader('Authorization', `Bearer ${authToken}`)
    setUser(userData)
    setCustomer(customerData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    graphqlClient.setHeader('Authorization', '')
    setUser(null)
    setCustomer(null)
    setIsAuthenticated(false)
  }

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    if (!refreshToken) {
      logout()
      return false
    }

    try {
      const response = await graphqlClient.request<{ refreshToken: { authToken: string; success: boolean } }>(
        REFRESH_TOKEN_MUTATION,
        { token: refreshToken }
      )

      if (response.refreshToken.success) {
        const newToken = response.refreshToken.authToken
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
        graphqlClient.setHeader('Authorization', `Bearer ${newToken}`)
        return true
      }

      logout()
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, customer, isAuthenticated, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 