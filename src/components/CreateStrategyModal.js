'use client'

import { useState } from 'react'
import { X, Copy, Check, Zap, Settings, Code } from 'lucide-react'

export default function CreateStrategyModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isVirtual: true,
    riskPerTrade: 1.0,
    maxPositions: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1) // 1: Create Strategy, 2: Show Webhook

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setWebhookUrl(data.strategy.webhooks[0]?.url || '')
        setStep(2)
        if (onSuccess) onSuccess(data.strategy)
      } else {
        setError(data.error || 'Failed to create strategy')
      }
    } catch (error) {
      console.error('Error creating strategy:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateWebhook = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/webhook/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: formData.name })
      })

      const data = await response.json()

      if (response.ok) {
        setWebhookUrl(data.webhook.url)
        setStep(2)
        if (onSuccess) onSuccess(data.strategy)
      } else {
        setError(data.error || 'Failed to generate webhook')
      }
    } catch (error) {
      console.error('Error generating webhook:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      name: '',
      description: '',
      isVirtual: true,
      riskPerTrade: 1.0,
      maxPositions: 1
    })
    setWebhookUrl('')
    setError('')
    setCopied(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {step === 1 ? 'Create Trading Strategy' : 'Webhook Generated!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Strategy Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Strategy Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Nifty Scalping Strategy"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your trading strategy..."
                rows={3}
              />
            </div>

            {/* Trading Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trading Mode
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.isVirtual}
                    onChange={() => setFormData({...formData, isVirtual: true})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-300">Virtual Trading (Paper)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!formData.isVirtual}
                    onChange={() => setFormData({...formData, isVirtual: false})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-300">Live Trading</span>
                </label>
              </div>
            </div>

            {/* Risk Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={formData.riskPerTrade}
                  onChange={(e) => setFormData({...formData, riskPerTrade: parseFloat(e.target.value)})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Positions
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxPositions}
                  onChange={(e) => setFormData({...formData, maxPositions: parseInt(e.target.value)})}
                  className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2 inline" />
                    Create Strategy
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleGenerateWebhook}
                disabled={isSubmitting || !formData.name}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2 inline" />
                    Quick Generate
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
              <Check className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Strategy Created Successfully!</p>
              <p className="text-sm text-green-300">Your webhook URL is ready to use</p>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                TradingView Webhook URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-3 py-3 bg-slate-700 border border-slate-600 rounded-l-lg text-white focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Copy this URL and paste it in your TradingView alert webhook field
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                <Code className="w-4 h-4 mr-2" />
                TradingView Setup Instructions
              </h3>
              <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                <li>Copy the webhook URL above</li>
                <li>Go to TradingView and create an alert</li>
                <li>In the alert settings, paste the webhook URL</li>
                <li>Use this JSON format in the message:</li>
              </ol>
              <div className="bg-slate-900/50 rounded p-3 mt-2">
                <code className="text-xs text-gray-300">
{`{
  "action": "BUY",
  "symbol": "NIFTY",
  "quantity": 50,
  "orderType": "MARKET"
}`}
                </code>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
