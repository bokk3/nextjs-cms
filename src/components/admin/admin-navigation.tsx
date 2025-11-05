'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  Image
} from 'lucide-react'
import { useSession, signOut } from '../../lib/auth-client'

export function AdminNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/page-builder', label: 'Page Builder', icon: Layout },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Back to Site */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-black">Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user && (
              <>
                <span className="text-sm text-gray-700">
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
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-1">
              {/* Back to Site - Mobile */}
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-3" />
                <span className="font-medium">Back to Site</span>
              </Link>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Admin Links - Mobile */}
              {adminNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
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
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {session.user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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