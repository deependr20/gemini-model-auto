'use client'

import Link from 'next/link'
import { ArrowRight, Play, Star, Zap, Shield, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative pt-16 pb-20 sm:pb-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 mt-6 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
            <Star className="w-4 h-4 mr-2" />
            ⭐ Access Free TradingView Strategies Exclusively for You!
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block">Algo Trading With</span>
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TradingView & Chartink
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-8">
            Automate your trading strategies with our powerful webhook system. 
            Connect TradingView alerts directly to your broker accounts and trade 24/7.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Zap className="w-5 h-5" />
              <span>⭐ Real-time Free Paper Trading</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span>⭐ Trade Across Multiple Brokers</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span>⭐ No VPS Required</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/register" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/demo" 
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Trusted by 43,452+ Active Traders</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-white">43,452+</div>
              <div className="text-gray-400">|</div>
              <div className="text-2xl font-bold text-white">198,474</div>
              <div className="text-gray-400">|</div>
              <div className="text-2xl font-bold text-white">31,575</div>
            </div>
            <div className="flex justify-center items-center space-x-8 text-xs text-gray-500 mt-2">
              <div>Active Users</div>
              <div>24h API Requests</div>
              <div>Total APIs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-bounce hidden lg:block"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-pink-500/20 rounded-full animate-bounce delay-1000 hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full animate-bounce delay-500 hidden lg:block"></div>
    </div>
  )
}
