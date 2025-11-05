'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const { currentLanguage, languages, setLanguage, isLoading } = useLanguage()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black">Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Dropdown */}
            {!isLoading && languages.length > 1 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguageMenu}
                  className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase font-medium">
                    {currentLanguage}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setLanguage(language.code)
                            setIsLanguageMenuOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            currentLanguage === language.code
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{language.name}</span>
                            <span className="text-xs uppercase text-gray-500">
                              {language.code}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              {!isLoading && languages.length > 1 && (
                <div className="px-4 py-2 border-t border-gray-100 mt-2">
                  <div className="text-sm font-medium text-gray-500 mb-2">Language</div>
                  <div className="space-y-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setLanguage(language.code)
                          setIsMenuOpen(false)
                        }}
                        className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                          currentLanguage === language.code
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{language.name}</span>
                          <span className="text-xs uppercase text-gray-500">
                            {language.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}