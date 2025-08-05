'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

function ZerodhaCallbackContent() {
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing Zerodha authentication...')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const requestToken = searchParams.get('request_token')
        const action = searchParams.get('action')
        const status = searchParams.get('status')

        if (action === 'login' && status === 'success' && requestToken) {
          // Get stored API credentials from localStorage
          const storedData = localStorage.getItem('zerodha_auth_data')
          if (!storedData) {
            throw new Error('No API credentials found. Please try connecting again.')
          }

          const { apiKey, apiSecret } = JSON.parse(storedData)
          const token = localStorage.getItem('token')

          if (!token) {
            throw new Error('Please login to your account first.')
          }

          setMessage('Generating access token...')

          // Generate access token
          const response = await fetch('/api/auth/zerodha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              apiKey,
              apiSecret,
              requestToken
            })
          })

          const data = await response.json()

          if (response.ok) {
            setStatus('success')
            setMessage('Zerodha account connected successfully!')

            // Clean up stored data
            localStorage.removeItem('zerodha_auth_data')

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard/brokers')
            }, 2000)
          } else {
            throw new Error(data.error || 'Failed to connect Zerodha account')
          }
        } else if (action === 'login' && status === 'error') {
          throw new Error('Authentication was cancelled or failed')
        } else {
          throw new Error('Invalid callback parameters')
        }
      } catch (error) {
        console.error('Zerodha callback error:', error)
        setStatus('error')
        setError(error.message)
        setMessage('Failed to connect Zerodha account')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-4">Connecting Zerodha</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
                Redirecting to dashboard...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Connection Failed</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm mb-6">
                  {error}
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/dashboard/brokers')}
                  className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Back to Brokers
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        {status === 'processing' && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Please wait while we securely connect your Zerodha account...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ZerodhaCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
            <p className="text-gray-400">Preparing authentication...</p>
          </div>
        </div>
      </div>
    }>
      <ZerodhaCallbackContent />
    </Suspense>
  )
}
