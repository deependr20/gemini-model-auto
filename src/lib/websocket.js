'use client'

import { useState, useEffect } from 'react'

class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 5000
    this.listeners = new Map()
  }

  connect(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}`)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit(data.type, data.payload)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.emit('disconnected')
        this.attemptReconnect(userId)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      this.attemptReconnect(userId)
    }
  }

  attemptReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.connect(userId)
      }, this.reconnectInterval)
    } else {
      console.log('Max reconnection attempts reached')
      this.emit('maxReconnectAttemptsReached')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in WebSocket event callback:', error)
        }
      })
    }
  }

  // Subscribe to real-time updates
  subscribeToTrades(userId) {
    this.send('subscribe', { type: 'trades', userId })
  }

  subscribeToStrategies(userId) {
    this.send('subscribe', { type: 'strategies', userId })
  }

  subscribeToStats(userId) {
    this.send('subscribe', { type: 'stats', userId })
  }

  // Unsubscribe from updates
  unsubscribeFromTrades(userId) {
    this.send('unsubscribe', { type: 'trades', userId })
  }

  unsubscribeFromStrategies(userId) {
    this.send('unsubscribe', { type: 'strategies', userId })
  }

  unsubscribeFromStats(userId) {
    this.send('unsubscribe', { type: 'stats', userId })
  }
}

// Create a singleton instance
const wsService = new WebSocketService()

export default wsService

// React hook for using WebSocket in components
export function useWebSocket(userId) {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const handleConnected = () => setConnected(true)
    const handleDisconnected = () => setConnected(false)
    const handleError = (error) => setError(error)

    wsService.on('connected', handleConnected)
    wsService.on('disconnected', handleDisconnected)
    wsService.on('error', handleError)

    wsService.connect(userId)

    return () => {
      wsService.off('connected', handleConnected)
      wsService.off('disconnected', handleDisconnected)
      wsService.off('error', handleError)
    }
  }, [userId])

  return {
    connected,
    error,
    subscribe: (type, callback) => wsService.on(type, callback),
    unsubscribe: (type, callback) => wsService.off(type, callback),
    send: (type, payload) => wsService.send(type, payload)
  }
}

// Hook for real-time dashboard data
export function useRealtimeDashboard(userId) {
  const [stats, setStats] = useState(null)
  const [trades, setTrades] = useState([])
  const [strategies, setStrategies] = useState([])
  const { connected } = useWebSocket(userId)

  useEffect(() => {
    if (!connected || !userId) return

    const handleStatsUpdate = (data) => setStats(data)
    const handleTradesUpdate = (data) => setTrades(data)
    const handleStrategiesUpdate = (data) => setStrategies(data)

    wsService.on('stats_update', handleStatsUpdate)
    wsService.on('trades_update', handleTradesUpdate)
    wsService.on('strategies_update', handleStrategiesUpdate)

    // Subscribe to updates
    wsService.subscribeToStats(userId)
    wsService.subscribeToTrades(userId)
    wsService.subscribeToStrategies(userId)

    return () => {
      wsService.off('stats_update', handleStatsUpdate)
      wsService.off('trades_update', handleTradesUpdate)
      wsService.off('strategies_update', handleStrategiesUpdate)

      wsService.unsubscribeFromStats(userId)
      wsService.unsubscribeFromTrades(userId)
      wsService.unsubscribeFromStrategies(userId)
    }
  }, [connected, userId])

  return {
    connected,
    stats,
    trades,
    strategies
  }
}
