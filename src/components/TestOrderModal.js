'use client'

import { useState, useEffect } from 'react'
import { X, Play, CheckCircle, XCircle } from 'lucide-react'

export default function TestOrderModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    brokerAccountId: '',
    symbol: 'RELIANCE',
    action: 'BUY',
    quantity: 1,
    orderType: 'MARKET',
    price: '',
    product: 'MIS',
    exchange: 'NSE'
  })
  const [brokerAccounts, setBrokerAccounts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchBrokerAccounts()
    }
  }, [isOpen])

  const fetchBrokerAccounts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/brokers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBrokerAccounts(data.brokerAccounts.filter(account => account.isActive))
      }
    } catch (error) {
      console.error('Error fetching broker accounts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Test order failed')
      }
    } catch (error) {
      console.error('Error placing test order:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      brokerAccountId: '',
      symbol: 'RELIANCE',
      action: 'BUY',
      quantity: 1,
      orderType: 'MARKET',
      price: '',
      product: 'MIS',
      exchange: 'NSE'
    })
    setResult(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Test Order Execution</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Broker Account */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Broker Account *
              </label>
              <select
                value={formData.brokerAccountId}
                onChange={(e) => setFormData({...formData, brokerAccountId: e.target.value})}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select broker account</option>
                {brokerAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.brokerName} - {account.isVirtual ? 'Virtual' : 'Live'} (₹{account.balance?.toLocaleString() || '0'})
                  </option>
                ))}
              </select>
            </div>

            {/* Symbol */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Symbol *
              </label>
              <select
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="RELIANCE">RELIANCE</option>
                <option value="TCS">TCS</option>
                <option value="INFY">INFY</option>
                <option value="HDFCBANK">HDFCBANK</option>
                <option value="ICICIBANK">ICICIBANK</option>
                <option value="SBIN">SBIN</option>
                <option value="NIFTY 50">NIFTY 50</option>
                <option value="NIFTY BANK">NIFTY BANK</option>
              </select>
            </div>

            {/* Action and Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action *
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Order Type and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order Type
                </label>
                <select
                  value={formData.orderType}
                  onChange={(e) => setFormData({...formData, orderType: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="MARKET">MARKET</option>
                  <option value="LIMIT">LIMIT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price {formData.orderType === 'LIMIT' ? '*' : '(Optional)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={formData.orderType === 'LIMIT'}
                />
              </div>
            </div>

            {/* Product and Exchange */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="MIS">MIS (Intraday)</option>
                  <option value="CNC">CNC (Delivery)</option>
                  <option value="NRML">NRML (Normal)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exchange
                </label>
                <select
                  value={formData.exchange}
                  onChange={(e) => setFormData({...formData, exchange: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                  <option value="NFO">NFO</option>
                  <option value="MCX">MCX</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.brokerAccountId}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Placing Test Order...
                </div>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 inline" />
                  Place Test Order
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Result */}
            <div className={`border rounded-lg p-6 ${
              result.success ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
            }`}>
              <div className="flex items-center mb-4">
                {result.success ? (
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 mr-3" />
                )}
                <h3 className={`text-xl font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? 'Order Executed Successfully!' : 'Order Failed'}
                </h3>
              </div>
              
              {result.success ? (
                <div className="space-y-2 text-green-300">
                  <p><strong>Order ID:</strong> {result.order.brokerOrderId}</p>
                  <p><strong>Symbol:</strong> {result.order.symbol}</p>
                  <p><strong>Action:</strong> {result.order.action}</p>
                  <p><strong>Quantity:</strong> {result.order.quantity}</p>
                  <p><strong>Executed Price:</strong> ₹{result.order.executedPrice}</p>
                  <p><strong>Status:</strong> {result.order.status}</p>
                </div>
              ) : (
                <p className="text-red-300">{result.error}</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
