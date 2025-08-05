'use client'

import { Check, Star, Zap } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Lifetime',
      description: 'Perfect for learning and testing strategies',
      features: [
        'PaperTrade: TradingView Enabled',
        'Chartink PaperTrade Access',
        'Virtual Options Trading',
        'Futures: Trade Virtually',
        'Monthly: Three Key Indicators'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
      popular: false
    },
    {
      name: '3 Days Trial',
      price: '₹199',
      period: '3 Days',
      description: 'Test all features with real money',
      features: [
        'Trade on NSE, NFO, MCX, CDS',
        'Unlimited with TradingView',
        'Unlimited with Chartink',
        'Options Algo: Unlimited Trading',
        'All Major Indian Brokers',
        'Binance, CoinDCX & More'
      ],
      buttonText: 'Start Trial',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      popular: true
    },
    {
      name: '30 Days Plan',
      price: '₹999',
      period: '30 Days',
      description: 'Most popular for active traders',
      features: [
        'Trade on NSE, NFO, MCX, CDS',
        'Unlimited with TradingView',
        'Unlimited with Chartink',
        'Options Algo: Unlimited Trading',
        'All Major Indian Brokers',
        'Binance, CoinDCX & More'
      ],
      buttonText: 'Choose Plan',
      buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
      popular: false
    },
    {
      name: '90 Days Plan',
      price: '₹2,697',
      period: '90 Days',
      description: 'Best value for serious traders',
      features: [
        'Trade on NSE, NFO, MCX, CDS',
        'Unlimited with TradingView',
        'Unlimited with Chartink',
        'Options Algo: Unlimited Trading',
        'All Major Indian Brokers',
        'Binance, CoinDCX & More'
      ],
      buttonText: 'Choose Plan',
      buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
      popular: false,
      savings: '10% OFF'
    },
    {
      name: '365 Days Plan',
      price: '₹8,392',
      period: '365 Days',
      description: 'Maximum savings for professionals',
      features: [
        'Trade on NSE, NFO, MCX, CDS',
        'Unlimited with TradingView',
        'Unlimited with Chartink',
        'Options Algo: Unlimited Trading',
        'All Major Indian Brokers',
        'Binance, CoinDCX & More'
      ],
      buttonText: 'Choose Plan',
      buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
      popular: false,
      savings: '30% OFF'
    }
  ]

  return (
    <div id="pricing" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Start free and upgrade when you&apos;re ready. No hidden fees, no long-term contracts.
            Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${plan.popular
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-slate-700 hover:border-purple-500/50'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {plan.savings}
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Instant Activation</h3>
                <p className="text-gray-400 text-sm">Start trading immediately after payment. No waiting period.</p>
              </div>

              <div className="text-center">
                <Check className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Money Back Guarantee</h3>
                <p className="text-gray-400 text-sm">Not satisfied? Get a full refund within 7 days.</p>
              </div>

              <div className="text-center">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400 text-sm">Get help anytime via chat, email, or phone support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Is there a setup fee?</h4>
              <p className="text-gray-400 text-sm">No setup fees. You only pay for your chosen plan. No hidden charges.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400 text-sm">We accept all major credit cards, debit cards, UPI, and net banking.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer custom plans?</h4>
              <p className="text-gray-400 text-sm">Yes, we offer custom enterprise plans for large trading firms. Contact us for details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
