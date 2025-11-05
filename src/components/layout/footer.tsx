'use client'

import Link from 'next/link'
import { useCookieConsent } from '@/contexts/cookie-consent-context'

export function Footer() {
  let setShowBanner: ((show: boolean) => void) | null = null
  try {
    const cookieConsent = useCookieConsent()
    setShowBanner = cookieConsent.setShowBanner
  } catch {
    // Footer used outside CookieConsentProvider - cookie preferences won't be available
  }
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Portfolio</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Custom artisan work crafted with quality materials and attention to detail.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              {setShowBanner && (
                <li>
                  <button
                    onClick={() => setShowBanner(true)}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-left"
                  >
                    Cookie Preferences
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {currentYear} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}