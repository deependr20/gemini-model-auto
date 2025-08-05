import { ZerodhaAPI } from './zerodha'
import { UpstoxAPI } from './upstox'
import { FyersAPI } from './fyers'
import { BinanceAPI } from './binance'
import { decryptApiKey } from '../encryption'

export class BrokerFactory {
  static createBrokerInstance(brokerAccount) {
    const { brokerName, apiKey, apiSecret, accessToken } = brokerAccount
    
    // Decrypt the API credentials
    const decryptedApiKey = decryptApiKey(apiKey)
    const decryptedApiSecret = decryptApiKey(apiSecret)
    const decryptedAccessToken = accessToken ? decryptApiKey(accessToken) : null

    switch (brokerName) {
      case 'ZERODHA':
        return new ZerodhaAPI(decryptedApiKey, decryptedApiSecret, decryptedAccessToken)
      
      case 'UPSTOX':
        return new UpstoxAPI(decryptedApiKey, decryptedApiSecret, decryptedAccessToken)
      
      case 'FYERS':
        return new FyersAPI(decryptedApiKey, decryptedApiSecret, decryptedAccessToken)
      
      case 'BINANCE':
        return new BinanceAPI(decryptedApiKey, decryptedApiSecret)
      
      default:
        throw new Error(`Unsupported broker: ${brokerName}`)
    }
  }

  static async executeOrder(brokerAccount, orderData) {
    try {
      const brokerAPI = this.createBrokerInstance(brokerAccount)
      
      // Convert TradingView signal to broker-specific format
      const brokerOrderData = this.convertSignalToBrokerFormat(brokerAccount.brokerName, orderData)
      
      // Execute the order
      const result = await brokerAPI.placeOrder(brokerOrderData)
      
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static convertSignalToBrokerFormat(brokerName, signal) {
    switch (brokerName) {
      case 'ZERODHA':
        return ZerodhaAPI.convertTradingViewSignal(signal)
      
      case 'UPSTOX':
        return UpstoxAPI.convertTradingViewSignal(signal)
      
      case 'FYERS':
        return FyersAPI.convertTradingViewSignal(signal)
      
      case 'BINANCE':
        return BinanceAPI.convertTradingViewSignal(signal)
      
      default:
        throw new Error(`Unsupported broker: ${brokerName}`)
    }
  }

  static async getAccountBalance(brokerAccount) {
    try {
      const brokerAPI = this.createBrokerInstance(brokerAccount)
      return await brokerAPI.getBalance()
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getPositions(brokerAccount) {
    try {
      const brokerAPI = this.createBrokerInstance(brokerAccount)
      return await brokerAPI.getPositions()
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getOrderStatus(brokerAccount, orderId) {
    try {
      const brokerAPI = this.createBrokerInstance(brokerAccount)
      return await brokerAPI.getOrderStatus(orderId)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async cancelOrder(brokerAccount, orderId) {
    try {
      const brokerAPI = this.createBrokerInstance(brokerAccount)
      return await brokerAPI.cancelOrder(orderId)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static getSupportedBrokers() {
    return [
      {
        name: 'ZERODHA',
        displayName: 'Zerodha Kite',
        description: 'India\'s largest discount broker',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        setupUrl: 'https://kite.trade/apps/',
        authType: 'oauth', // Requires OAuth flow
        requiredFields: ['apiKey', 'apiSecret', 'accessToken']
      },
      {
        name: 'UPSTOX',
        displayName: 'Upstox Pro',
        description: 'Modern trading platform',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        setupUrl: 'https://upstox.com/developer/',
        authType: 'oauth',
        requiredFields: ['apiKey', 'apiSecret', 'accessToken']
      },
      {
        name: 'FYERS',
        displayName: 'Fyers API',
        description: 'Advanced trading APIs',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        setupUrl: 'https://myapi.fyers.in/',
        authType: 'oauth',
        requiredFields: ['apiKey', 'apiSecret', 'accessToken']
      },
      {
        name: 'BINANCE',
        displayName: 'Binance',
        description: 'Global crypto exchange',
        features: ['Spot', 'Futures', 'Options'],
        setupUrl: 'https://binance.com/api/',
        authType: 'apikey',
        requiredFields: ['apiKey', 'apiSecret']
      },
      {
        name: 'ALICEBLUE',
        displayName: 'Alice Blue',
        description: 'Comprehensive trading solutions',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        setupUrl: 'https://aliceblue.com/',
        authType: 'oauth',
        requiredFields: ['apiKey', 'apiSecret', 'accessToken']
      }
    ]
  }

  static getBrokerInfo(brokerName) {
    const brokers = this.getSupportedBrokers()
    return brokers.find(broker => broker.name === brokerName)
  }

  static validateBrokerCredentials(brokerName, credentials) {
    const brokerInfo = this.getBrokerInfo(brokerName)
    
    if (!brokerInfo) {
      return { valid: false, error: 'Unsupported broker' }
    }

    const missingFields = brokerInfo.requiredFields.filter(field => !credentials[field])
    
    if (missingFields.length > 0) {
      return { 
        valid: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }
    }

    return { valid: true }
  }
}

// Virtual trading simulator
export class VirtualBroker {
  constructor(initialBalance = 100000) {
    this.balance = initialBalance
    this.positions = new Map()
    this.orders = []
    this.orderIdCounter = 1
  }

  async placeOrder(orderData) {
    const orderId = `VIRTUAL_${this.orderIdCounter++}`
    const order = {
      orderId,
      ...orderData,
      status: 'EXECUTED',
      executedAt: new Date(),
      executedPrice: orderData.price || this.getMockPrice(orderData.symbol)
    }

    this.orders.push(order)

    // Update positions and balance
    this.updatePositions(order)

    return { success: true, orderId, data: order }
  }

  async getBalance() {
    return { success: true, balance: this.balance }
  }

  async getPositions() {
    return { success: true, data: Array.from(this.positions.values()) }
  }

  async getOrderStatus(orderId) {
    const order = this.orders.find(o => o.orderId === orderId)
    return { success: true, data: order }
  }

  updatePositions(order) {
    const { symbol, transaction_type, quantity, executedPrice } = order
    const key = symbol

    if (!this.positions.has(key)) {
      this.positions.set(key, {
        symbol,
        quantity: 0,
        averagePrice: 0,
        pnl: 0
      })
    }

    const position = this.positions.get(key)
    const orderValue = quantity * executedPrice

    if (transaction_type === 'BUY') {
      position.quantity += quantity
      this.balance -= orderValue
    } else {
      position.quantity -= quantity
      this.balance += orderValue
    }

    // Update average price
    if (position.quantity > 0) {
      position.averagePrice = (position.averagePrice * (position.quantity - quantity) + orderValue) / position.quantity
    }

    this.positions.set(key, position)
  }

  getMockPrice(symbol) {
    // Return mock prices for different symbols
    const mockPrices = {
      'NIFTY': 19850,
      'BANKNIFTY': 45200,
      'RELIANCE': 2450,
      'TCS': 3850,
      'INFY': 1650,
      'HDFCBANK': 1580
    }

    return mockPrices[symbol] || 100 + Math.random() * 1000
  }
}
