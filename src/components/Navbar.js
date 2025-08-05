'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, TrendingUp, User, LogOut, BarChart3, Settings, Shield } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('userEmail')

    if (token) {
      setIsLoggedIn(true)
      setUserEmail(email || '')
    } else {
      setIsLoggedIn(false)
      setUserEmail('')
    }
  }, [pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setUserEmail('')
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">TradingBot Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}>
                    <BarChart3 className="w-4 h-4 inline mr-1" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/brokers" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard/brokers' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}>
                    <Shield className="w-4 h-4 inline mr-1" />
                    Brokers
                  </Link>
                  <Link href="/dashboard/strategies" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard/strategies' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}>
                    <Settings className="w-4 h-4 inline mr-1" />
                    Strategies
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Pricing
                  </Link>
                  <Link href="/#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Features
                  </Link>
                  <Link href="/#brokers" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Brokers
                  </Link>
                  <Link href="/docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Docs
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {isLoggedIn ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-32 truncate">{userEmail}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <hr className="border-slate-700 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/brokers"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard/brokers' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Brokers
                </Link>
                <Link
                  href="/dashboard/strategies"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard/strategies' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-300 hover:text-white'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Strategies
                </Link>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="px-3 py-2">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-300 truncate">{userEmail}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 rounded-md text-base font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
                <Link href="/#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Features
                </Link>
                <Link href="/#brokers" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Brokers
                </Link>
                <Link href="/docs" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Docs
                </Link>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex flex-col space-y-2 px-3">
                    <Link href="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium text-center" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
