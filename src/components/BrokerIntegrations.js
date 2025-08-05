'use client'

import { ExternalLink, CheckCircle } from 'lucide-react'

export default function BrokerIntegrations() {
  const brokers = [
    { name: 'Zerodha', logo: '🟢', status: 'active', category: 'Indian' },
    { name: 'Upstox', logo: '🟠', status: 'active', category: 'Indian' },
    { name: 'Fyers', logo: '🔵', status: 'active', category: 'Indian' },
    { name: 'Alice Blue', logo: '🔷', status: 'active', category: 'Indian' },
    { name: 'Binance', logo: '🟡', status: 'active', category: 'Crypto' },
    { name: 'Samco', logo: '🟣', status: 'active', category: 'Indian' },
    { name: 'FXCM', logo: '🔴', status: 'active', category: 'Forex' },
    { name: '5Paisa', logo: '🟢', status: 'active', category: 'Indian' },
    { name: 'TradingView', logo: '📈', status: 'active', category: 'Platform' },
    { name: 'Alpaca', logo: '🦙', status: 'active', category: 'US' },
    { name: 'IIFL', logo: '🔵', status: 'active', category: 'Indian' },
    { name: 'BitBns', logo: '₿', status: 'active', category: 'Crypto' },
    { name: 'BitMEX', logo: '⚡', status: 'active', category: 'Crypto' },
    { name: 'MetaTrader', logo: '📊', status: 'active', category: 'Forex' },
    { name: 'WazirX', logo: '💎', status: 'active', category: 'Crypto' },
    { name: 'CoinDCX', logo: '🪙', status: 'active', category: 'Crypto' },
    { name: 'Delta Exchange', logo: '🔺', status: 'active', category: 'Crypto' },
    { name: 'TradeSmart', logo: '🧠', status: 'active', category: 'Indian' },
    { name: 'Bybit', logo: '🚀', status: 'active', category: 'Crypto' },
    { name: 'MasterTrust', logo: '🏛️', status: 'active', category: 'Indian' },
    { name: 'Finvasia', logo: '💼', status: 'active', category: 'Indian' },
    { name: 'Dhan HQ', logo: '💰', status: 'active', category: 'Indian' },
    { name: 'Pi42', logo: '🥧', status: 'active', category: 'Crypto' },
    { name: 'Sharekhan', logo: '📈', status: 'active', category: 'Indian' }
  ]

  const categories = {
    'Indian': { color: 'bg-green-500/20 text-green-400 border-green-500/30', count: 0 },
    'Crypto': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', count: 0 },
    'Forex': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', count: 0 },
    'US': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', count: 0 },
    'Platform': { color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', count: 0 }
  }

  // Count brokers by category
  brokers.forEach(broker => {
    if (categories[broker.category]) {
      categories[broker.category].count++
    }
  })

  return (
    <div id="brokers" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Supported Brokers & Exchanges
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Connect to 25+ brokers and exchanges worldwide. Trade stocks, options, futures, forex, and crypto
            all from one unified platform.
          </p>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {Object.entries(categories).map(([category, config]) => (
            <div key={category} className={`border rounded-lg p-4 text-center ${config.color}`}>
              <div className="text-2xl font-bold">{config.count}</div>
              <div className="text-sm">{category} Brokers</div>
            </div>
          ))}
        </div>

        {/* Broker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {brokers.map((broker, index) => (
            <div
              key={index}
              className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-3xl mb-2">{broker.logo}</div>
              <h3 className="text-white font-medium text-sm mb-1">{broker.name}</h3>
              <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${categories[broker.category]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                <CheckCircle className="w-3 h-3 mr-1" />
                {broker.category}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Setup</h3>
            <p className="text-gray-400">Connect your broker account in minutes with our simple API key integration.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Connection</h3>
            <p className="text-gray-400">Bank-level security with encrypted API connections and secure data handling.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Sync</h3>
            <p className="text-gray-400">Live portfolio sync and real-time order status updates across all platforms.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Don&apos;t See Your Broker?
            </h3>
            <p className="text-gray-300 mb-6">
              We&apos;re constantly adding new broker integrations. Contact us to request support for your preferred broker.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              Request Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
