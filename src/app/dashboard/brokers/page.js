'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

export default function BrokersPage() {
  const [brokerAccounts, setBrokerAccounts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    brokerName: '',
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    isVirtual: false
  })
  const [showSecrets, setShowSecrets] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supportedBrokers = [
    {
      name: 'ZERODHA',
      displayName: 'Zerodha Kite',
      logo: '🟢',
      setupUrl: 'https://kite.trade/apps/',
      description: 'India\'s largest discount broker'
    },
    {
      name: 'UPSTOX',
      displayName: 'Upstox Pro',
      logo: '🟠',
      setupUrl: 'https://upstox.com/developer/',
      description: 'Modern trading platform'
    },
    {
      name: 'FYERS',
      displayName: 'Fyers API',
      logo: '🔵',
      setupUrl: 'https://myapi.fyers.in/',
      description: 'Advanced trading APIs'
    },
    {
      name: 'ALICEBLUE',
      displayName: 'Alice Blue',
      logo: '🔷',
      setupUrl: 'https://aliceblue.com/',
      description: 'Comprehensive trading solutions'
    },
    {
      name: 'BINANCE',
      displayName: 'Binance',
      logo: '🟡',
      setupUrl: 'https://binance.com/api/',
      description: 'Global crypto exchange'
    }
  ]

  useEffect(() => {
    fetchBrokerAccounts()
  }, [])

  const fetchBrokerAccounts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/brokers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBrokerAccounts(data.brokerAccounts)
      }
    } catch (error) {
      console.error('Error fetching broker accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Special handling for Zerodha OAuth flow
      if (formData.brokerName === 'ZERODHA' && formData.apiKey && formData.apiSecret && !formData.accessToken) {
        await handleZerodhaOAuth()
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch('/api/brokers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setBrokerAccounts([...brokerAccounts, data.brokerAccount])
        setShowAddForm(false)
        setFormData({
          brokerName: '',
          apiKey: '',
          apiSecret: '',
          accessToken: '',
          isVirtual: false
        })
        alert('Broker account added successfully!')
      } else {
        alert(data.error || 'Failed to add broker account')
      }
    } catch (error) {
      console.error('Error adding broker account:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleZerodhaOAuth = async () => {
    try {
      // Store API credentials temporarily
      localStorage.setItem('zerodha_auth_data', JSON.stringify({
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret
      }))

      // Get login URL
      const response = await fetch(`/api/auth/zerodha?apiKey=${formData.apiKey}`)
      const data = await response.json()

      if (response.ok) {
        // Redirect to Zerodha login
        window.location.href = data.loginURL
      } else {
        throw new Error(data.error || 'Failed to get Zerodha login URL')
      }
    } catch (error) {
      console.error('Zerodha OAuth error:', error)
      alert(error.message)
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (accountId) => {
    if (!confirm('Are you sure you want to delete this broker account?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/brokers?id=${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setBrokerAccounts(brokerAccounts.filter(account => account.id !== accountId))
        alert('Broker account deleted successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete broker account')
      }
    } catch (error) {
      console.error('Error deleting broker account:', error)
      alert('Network error. Please try again.')
    }
  }

  const toggleShowSecret = (accountId) => {
    setShowSecrets(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Broker Accounts</h1>
            <p className="text-gray-400 mt-2">Manage your trading accounts and API connections</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Broker Account
          </button>
        </div>

        {/* Broker Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {brokerAccounts.map((account) => (
            <div key={account.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {supportedBrokers.find(b => b.name === account.brokerName)?.logo || '📊'}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{account.brokerName}</h3>
                    <p className="text-sm text-gray-400">
                      {account.isVirtual ? 'Virtual Account' : 'Live Account'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white font-medium">₹{account.balance?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${account.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Added:</span>
                  <span className="text-gray-300">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Broker Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add Broker Account</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Broker Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Broker
                  </label>
                  <select
                    value={formData.brokerName}
                    onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Choose a broker</option>
                    {supportedBrokers.map((broker) => (
                      <option key={broker.name} value={broker.name}>
                        {broker.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your API key"
                    required
                  />
                </div>

                {/* API Secret */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Secret
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your API secret"
                    required
                  />
                </div>

                {/* Access Token (Optional for non-Zerodha) */}
                {formData.brokerName !== 'ZERODHA' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Access Token (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.accessToken}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter access token if available"
                    />
                  </div>
                )}

                {/* Zerodha OAuth Notice */}
                {formData.brokerName === 'ZERODHA' && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-blue-300 text-sm font-medium mb-1">
                          Zerodha OAuth Authentication
                        </p>
                        <p className="text-blue-200 text-sm">
                          After entering your API key and secret, you'll be redirected to Zerodha to authorize the connection.
                          No need to enter access token manually.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Virtual Account Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    checked={formData.isVirtual}
                    onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-300">
                    This is a virtual/demo account
                  </label>
                </div>

                {/* Setup Instructions */}
                {formData.brokerName && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-blue-300 text-sm">
                          Need help setting up API keys for {formData.brokerName}?
                        </p>
                        <a
                          href={supportedBrokers.find(b => b.name === formData.brokerName)?.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center mt-1"
                        >
                          View Setup Guide
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    'Add Broker Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {brokerAccounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Broker Accounts</h3>
            <p className="text-gray-400 mb-6">
              Add your first broker account to start automated trading
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Add Your First Broker
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
