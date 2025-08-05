'use client'

import { 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Settings, 
  Bell, 
  Code, 
  BarChart3,
  Smartphone,
  Clock,
  Users,
  Target
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Paper Trading',
      description: 'Practice your strategies with virtual money before risking real capital. Full TradingView integration with live market data.',
      color: 'text-yellow-400'
    },
    {
      icon: Globe,
      title: 'Multi-Broker Support',
      description: 'Connect to 25+ brokers including Zerodha, Upstox, Fyers, Binance, and more. Trade across multiple accounts simultaneously.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'No VPS Required',
      description: 'Cloud-based infrastructure ensures your strategies run 24/7 without needing your own server or VPS.',
      color: 'text-green-400'
    },
    {
      icon: TrendingUp,
      title: 'Auto-Strike Price Options',
      description: 'Automatically select ATM or OTM options for Nifty and Bank Nifty with intelligent strike price selection.',
      color: 'text-purple-400'
    },
    {
      icon: Settings,
      title: 'Multi-Account Management',
      description: 'Manage multiple trading accounts and APIs from a single dashboard. Perfect for professional traders.',
      color: 'text-orange-400'
    },
    {
      icon: Bell,
      title: 'Telegram Alerts',
      description: 'Get instant notifications on Telegram for all your trades, signals, and important updates.',
      color: 'text-cyan-400'
    },
    {
      icon: Code,
      title: 'Pine Script Integration',
      description: 'Use your existing TradingView Pine Script strategies or create new ones with our advanced editor.',
      color: 'text-pink-400'
    },
    {
      icon: BarChart3,
      title: 'Chartink Scanner',
      description: 'Integrate with Chartink screener for powerful stock scanning and automated trading based on technical criteria.',
      color: 'text-indigo-400'
    },
    {
      icon: Smartphone,
      title: 'Mobile Trading',
      description: 'Trade anywhere on any device - smartphone, tablet, or laptop. Responsive design for all screen sizes.',
      color: 'text-emerald-400'
    },
    {
      icon: Clock,
      title: 'Low Latency Execution',
      description: 'Ultra-fast order execution with minimal latency. Critical for scalping and high-frequency strategies.',
      color: 'text-red-400'
    },
    {
      icon: Users,
      title: 'Community & Support',
      description: 'Join our active community of 43,000+ traders. Get support, share strategies, and learn from experts.',
      color: 'text-violet-400'
    },
    {
      icon: Target,
      title: 'Risk Management',
      description: 'Advanced risk management tools including position sizing, stop-loss, take-profit, and drawdown limits.',
      color: 'text-amber-400'
    }
  ]

  return (
    <div id="features" className="py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powerful Features for Professional Trading
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Everything you need to automate your trading strategies and scale your operations. 
            From beginners to professional traders, we have the tools you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/70"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-slate-700/50 group-hover:bg-slate-700 transition-colors`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Automated Trading?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of traders who are already using our platform to automate their strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold rounded-lg transition-all duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
