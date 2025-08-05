'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CreateStrategyModal from '@/components/CreateStrategyModal'
import TestOrderModal from '@/components/TestOrderModal'
import {
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Plus,
  Settings,
  Bell,
  BarChart3,
  Zap,
  Shield,
  RefreshCw,
  Clock,
  TrendingDown,
  Play
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPnL: 0,
    todayPnL: 0,
    activeStrategies: 0,
    totalTrades: 0,
    totalBalance: 0,
    winRate: 0,
    todayTrades: 0,
    totalBrokerAccounts: 0
  })

  const [recentTrades, setRecentTrades] = useState([])
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTestOrderModal, setShowTestOrderModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to view dashboard')
        setLoading(false)
        return
      }

      // Fetch all dashboard data in parallel
      const [statsResponse, tradesResponse, strategiesResponse] = await Promise.all([
        fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/dashboard/trades?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/dashboard/strategies', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      if (tradesResponse.ok) {
        const tradesData = await tradesResponse.json()
        setRecentTrades(tradesData.trades)
      }

      if (strategiesResponse.ok) {
        const strategiesData = await strategiesResponse.json()
        setStrategies(strategiesData.strategies)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    fetchDashboardData()
  }

  const handleStrategyCreated = (newStrategy) => {
    setStrategies([newStrategy, ...strategies])
    setStats(prev => ({
      ...prev,
      activeStrategies: prev.activeStrategies + (newStrategy.isActive ? 1 : 0)
    }))
    setShowCreateModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Trading Dashboard</h1>
                <p className="text-sm text-gray-400">Real-time trading overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stats.totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {stats.totalPnL >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total P&L</p>
                <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{Math.abs(stats.totalPnL).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Win Rate: {stats.winRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stats.todayPnL >= 0 ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Today&apos;s P&L</p>
                <p className={`text-2xl font-bold ${stats.todayPnL >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  ₹{Math.abs(stats.todayPnL).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{stats.todayTrades} trades today</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Strategies</p>
                <p className="text-2xl font-bold text-purple-400">{stats.activeStrategies}</p>
                <p className="text-xs text-gray-500">{strategies.length} total strategies</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-500/20">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-orange-400">₹{stats.totalBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stats.totalBrokerAccounts} broker accounts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trades */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Trades</h2>
              <button className="text-purple-400 hover:text-purple-300 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {recentTrades.length > 0 ? (
                recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${trade.action === 'BUY' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">{trade.symbol}</p>
                          {trade.isVirtual && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Virtual</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {trade.action} {trade.quantity} @ ₹{trade.executedPrice || trade.price || 'Market'}
                        </p>
                        <p className="text-gray-500 text-xs">{trade.brokerName} • {trade.strategyName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{trade.time}</p>
                      <p className={`text-sm font-medium ${trade.status === 'EXECUTED' ? 'text-green-400' :
                        trade.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{trade.status}</p>
                      {trade.pnl !== 0 && (
                        <p className={`text-xs ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}₹{trade.pnl}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-400">No trades yet</p>
                  <p className="text-gray-500 text-sm">Your recent trades will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Strategies */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Active Strategies</h2>
              <button className="flex items-center text-purple-400 hover:text-purple-300 text-sm">
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </button>
            </div>
            <div className="space-y-4">
              {strategies.length > 0 ? (
                strategies.map((strategy) => (
                  <div key={strategy.id} className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-medium">{strategy.name}</h3>
                        <p className="text-gray-500 text-xs">{strategy.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {strategy.isVirtual && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Virtual</span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${strategy.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                          strategy.status === 'Paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                          {strategy.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">P&L: </span>
                        <span className={strategy.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ₹{Math.abs(strategy.pnl || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trades: </span>
                        <span className="text-white">{strategy.executedTrades || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Win Rate: </span>
                        <span className="text-white">{strategy.winRate || 0}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Performance: </span>
                        <span className={`text-xs px-2 py-1 rounded ${strategy.performance === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                          strategy.performance === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                            strategy.performance === 'Average' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                          }`}>
                          {strategy.performance || 'N/A'}
                        </span>
                      </div>
                    </div>
                    {strategy.webhook && (
                      <div className="mt-2 pt-2 border-t border-slate-600">
                        <p className="text-xs text-gray-500">
                          Webhook: {strategy.webhook.triggerCount || 0} triggers
                          {strategy.webhook.lastTriggered && (
                            <span> • Last: {new Date(strategy.webhook.lastTriggered).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-gray-400">No strategies yet</p>
                  <p className="text-gray-500 text-sm">Create your first trading strategy</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Strategy
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center p-6 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-xl text-white font-semibold transition-all duration-200"
            >
              <Zap className="w-5 h-5 mr-2" />
              Generate Webhook
            </button>
            <button
              onClick={() => setShowTestOrderModal(true)}
              className="flex items-center justify-center p-6 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-xl text-white font-semibold transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Test Order
            </button>
            <Link href="/dashboard/brokers" className="flex items-center justify-center p-6 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-xl text-white font-semibold transition-all duration-200">
              <Shield className="w-5 h-5 mr-2" />
              Manage Brokers
            </Link>
          </div>
        </div>
      </div>

      {/* Create Strategy Modal */}
      <CreateStrategyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleStrategyCreated}
      />

      {/* Test Order Modal */}
      <TestOrderModal
        isOpen={showTestOrderModal}
        onClose={() => setShowTestOrderModal(false)}
      />
    </div>
  )
}
