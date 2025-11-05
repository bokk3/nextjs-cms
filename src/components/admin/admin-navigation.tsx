'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  LogOut,
  ArrowLeft,
  Layout,
  Image,
  ChevronDown,
  Edit3
} from 'lucide-react'
import { useSession, signOut } from '../../lib/auth-client'

export function AdminNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleContentDropdown = () => setIsContentDropdownOpen(!isContentDropdownOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContentDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Primary navigation items (always visible)
  const primaryNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  ]

  // Content management dropdown items
  const contentNavLinks = [
    { href: '/admin/page-builder', label: 'Page Builder', icon: Layout },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/content', label: 'Content', icon: FileText },
  ]

  // Secondary navigation items
  const secondaryNavLinks = [
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const isContentSectionActive = () => {
    return contentNavLinks.some(link => isActive(link.href))
  }

  return (
    <nav className="admin-nav bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Back to Site */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-black dark:text-white">Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Primary Navigation */}
            {primaryNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center p-2 rounded-md transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={link.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {link.label}
                  </span>
                </Link>
              )
            })}

            {/* Content Management Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleContentDropdown}
                className={`group relative flex items-center p-2 rounded-md transition-colors ${
                  isContentSectionActive()
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Content Management"
              >
                <Edit3 className="h-5 w-5" />
                <ChevronDown className="h-3 w-3 ml-1" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Content
                </span>
              </button>
              
              {isContentDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                  <div className="py-1">
                    {contentNavLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive(link.href)
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setIsContentDropdownOpen(false)}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Navigation */}
            {secondaryNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center p-2 rounded-md transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={link.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {session?.user && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300 max-w-32 truncate">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="py-4 space-y-1">
              {/* Back to Site - Mobile */}
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-3" />
                <span className="font-medium">Back to Site</span>
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              {/* Primary Navigation - Mobile */}
              {primaryNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {link.label}
                  </Link>
                )
              })}

              {/* Content Management Section - Mobile */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Content Management
                </div>
                <div className="space-y-1">
                  {contentNavLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center px-2 py-2 text-sm font-medium transition-colors rounded ${
                          isActive(link.href)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Secondary Navigation - Mobile */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              {secondaryNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {link.label}
                  </Link>
                )
              })}
              
              {/* User Menu - Mobile */}
              {session?.user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}