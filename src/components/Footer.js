'use client'

import Link from 'next/link'
import { 
  TrendingUp, 
  Youtube, 
  MessageCircle, 
  Users, 
  Send, 
  Instagram, 
  Facebook,
  Mail,
  Phone
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">TradingBot Pro</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              TradingBot Pro is a user-friendly web-based application that operates through a unique 
              Webhook system, enabling users to call and trigger various Public API methods. 
              Automate your trading strategies with ease.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Send className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/youtube" className="text-gray-400 hover:text-white transition-colors">
                  YouTube Channel
                </Link>
              </li>
              <li>
                <Link href="/indicators" className="text-gray-400 hover:text-white transition-colors">
                  Indicator Request
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-gray-400 hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                  Disclaimer Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Community Links */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Join Our Community</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="#" 
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200"
            >
              <Youtube className="w-5 h-5" />
              <span className="text-sm">YouTube</span>
            </a>
            <a 
              href="#" 
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </a>
            <a 
              href="#" 
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">Community</span>
            </a>
            <a 
              href="#" 
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              <span className="text-sm">Telegram</span>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@tradingbotpro.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 98739 47912</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get a call from our friendly support team in Hindi!
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Request Callback
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-2">Important Disclaimer</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors or traders. 
              At TradingBot Pro, we solely provide automation trading tools and a strategy marketplace; we do not offer trading buy or sell signals, 
              recommendations, or any form of investment advisory services. The use of our trading strategies is at your own risk, and TradingBot Pro 
              cannot be held responsible for any losses incurred during their implementation. We advise users to exercise caution and perform their 
              due diligence before engaging in any trading activities.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TradingBot Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
