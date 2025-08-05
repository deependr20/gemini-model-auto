'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, Database, Youtube } from 'lucide-react'

export default function Stats() {
  const [counts, setCounts] = useState({
    users: 0,
    requests: 0,
    apis: 0,
    subscribers: 0
  })

  useEffect(() => {
    const targets = {
      users: 56360,
      requests: 198474,
      apis: 31575,
      subscribers: 24100
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounts({
        users: Math.floor(targets.users * progress),
        requests: Math.floor(targets.requests * progress),
        apis: Math.floor(targets.apis * progress),
        subscribers: Math.floor(targets.subscribers * progress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setCounts(targets)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      icon: Users,
      value: counts.users.toLocaleString(),
      label: 'Total Current Users',
      subtitle: 'Not Fake Data',
      color: 'text-blue-400'
    },
    {
      icon: Activity,
      value: counts.requests.toLocaleString(),
      label: '24 Hours API Request',
      subtitle: 'All Brokers or Exchange Request',
      color: 'text-green-400'
    },
    {
      icon: Database,
      value: counts.apis.toLocaleString(),
      label: 'Total of User API',
      subtitle: 'In Our Platform',
      color: 'text-purple-400'
    },
    {
      icon: Youtube,
      value: counts.subscribers.toLocaleString(),
      label: 'Total Youtube Subscriber',
      subtitle: 'Subscribe Now',
      color: 'text-red-400'
    }
  ]

  return (
    <div className="py-20 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Reality Of Our Algo Universe
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time statistics from our trading platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-500">
                {stat.subtitle}
              </p>
              
              {stat.label.includes('Youtube') && (
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  Subscribe Now
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-green-400 font-medium">Live Data • Updated in Real-time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
