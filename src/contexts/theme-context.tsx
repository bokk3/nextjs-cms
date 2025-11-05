'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      
      const initialTheme = savedTheme || systemTheme
      setTheme(initialTheme)
      
      // Apply theme immediately
      const root = document.documentElement
      if (initialTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } catch (error) {
      // Fallback if localStorage is not available
      setTheme('light')
    }
  }, [])

  // Apply theme to document when theme changes
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      
      try {
        localStorage.setItem('theme', theme)
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      console.log('Theme toggled from', prev, 'to', newTheme)
      return newTheme
    })
  }

  const contextValue = {
    theme,
    toggleTheme,
    setTheme
  }

  // Always render the provider, but prevent hydration mismatch
  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : <div className="opacity-0">{children}</div>}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}