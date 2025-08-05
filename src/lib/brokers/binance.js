import axios from 'axios'
import crypto from 'crypto'

export class BinanceAPI {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.baseURL = 'https://api.binance.com/api/v3'
  }

  createSignature(queryString) {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex')
  }

  async makeRequest(endpoint, params = {}, method = 'GET') {
    const timestamp = Date.now()
    const queryString = new URLSearchParams({
      ...params,
      timestamp
    }).toString()

    const signature = this.createSignature(queryString)
    const url = `${this.baseURL}${endpoint}?${queryString}&signature=${signature}`

    try {
      const response = await axios({
        method,
        url,
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.msg || error.message }
    }
  }

  async getProfile() {
    return await this.makeRequest('/account')
  }

  async getBalance() {
    try {
      const result = await this.makeRequest('/account')
      if (result.success) {
        const usdtBalance = result.data.balances.find(b => b.asset === 'USDT')
        return {
          success: true,
          balance: parseFloat(usdtBalance?.free || 0),
          data: result.data
        }
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getPositions() {
    // For spot trading, positions are just balances
    const result = await this.makeRequest('/account')
    if (result.success) {
      const positions = result.data.balances
        .filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
        .map(b => ({
          symbol: b.asset,
          free: parseFloat(b.free),
          locked: parseFloat(b.locked),
          total: parseFloat(b.free) + parseFloat(b.locked)
        }))
      return { success: true, data: positions }
    }
    return result
  }

  async placeOrder(orderData) {
    const {
      symbol,
      side,
      type,
      quantity,
      price,
      timeInForce
    } = orderData

    const params = {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(),
      type: type.toUpperCase(),
      quantity
    }

    if (type.toUpperCase() === 'LIMIT') {
      params.price = price
      params.timeInForce = timeInForce || 'GTC'
    }

    const result = await this.makeRequest('/order', params, 'POST')
    
    if (result.success) {
      return {
        success: true,
        orderId: result.data.orderId,
        data: result.data
      }
    }
    
    return result
  }

  async getOrderStatus(orderId, symbol) {
    return await this.makeRequest('/order', {
      symbol: symbol.toUpperCase(),
      orderId
    })
  }

  async cancelOrder(orderId, symbol) {
    return await this.makeRequest('/order', {
      symbol: symbol.toUpperCase(),
      orderId
    }, 'DELETE')
  }

  static convertTradingViewSignal(signal) {
    const {
      action,
      symbol,
      quantity,
      orderType,
      price
    } = signal

    // Convert to Binance format
    const binanceSymbol = symbol.includes('USDT') ? symbol : `${symbol}USDT`

    const orderData = {
      symbol: binanceSymbol,
      side: action.toUpperCase(), // BUY or SELL
      type: orderType === 'MARKET' ? 'MARKET' : 'LIMIT',
      quantity: parseFloat(quantity)
    }

    if (orderType === 'LIMIT' && price) {
      orderData.price = parseFloat(price)
      orderData.timeInForce = 'GTC'
    }

    return orderData
  }
}
