import axios from 'axios'
import crypto from 'crypto'

export class ZerodhaAPI {
  constructor(apiKey, apiSecret, accessToken) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.accessToken = accessToken
    this.baseURL = 'https://api.kite.trade'
    this.timeout = 7000 // 7 seconds timeout
  }

  // Create request headers
  getHeaders() {
    return {
      'Authorization': `token ${this.apiKey}:${this.accessToken}`,
      'X-Kite-Version': '3',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // Make API request with error handling
  async makeRequest(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: this.getHeaders(),
        timeout: this.timeout
      }

      if (data) {
        if (method === 'GET') {
          config.params = data
        } else {
          // Convert data to URL-encoded format for POST requests
          config.data = new URLSearchParams(data).toString()
        }
      }

      const response = await axios(config)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Zerodha API Error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        errorType: error.response?.data?.error_type || 'NetworkError'
      }
    }
  }

  // Get user profile
  async getProfile() {
    return await this.makeRequest('GET', '/user/profile')
  }

  // Get account balance
  async getBalance() {
    const result = await this.makeRequest('GET', '/user/margins')
    if (result.success) {
      const equity = result.data.data.equity
      return {
        success: true,
        balance: equity.available.cash,
        data: result.data
      }
    }
    return result
  }

  // Get positions
  async getPositions() {
    return await this.makeRequest('GET', '/portfolio/positions')
  }

  // Place order
  async placeOrder(orderData) {
    const {
      tradingsymbol,
      exchange,
      transaction_type, // BUY or SELL
      order_type, // MARKET, LIMIT, SL, SL-M
      quantity,
      price,
      trigger_price,
      product, // CNC, MIS, NRML
      validity, // DAY, IOC
      disclosed_quantity,
      tag
    } = orderData

    // Validate required fields
    if (!tradingsymbol || !exchange || !transaction_type || !quantity) {
      return {
        success: false,
        error: 'Missing required fields: tradingsymbol, exchange, transaction_type, quantity'
      }
    }

    // Prepare order payload
    const payload = {
      tradingsymbol,
      exchange,
      transaction_type,
      order_type: order_type || 'MARKET',
      quantity: parseInt(quantity),
      product: product || 'MIS',
      validity: validity || 'DAY'
    }

    // Add optional fields
    if (price && (order_type === 'LIMIT' || order_type === 'SL')) {
      payload.price = parseFloat(price)
    }

    if (trigger_price && (order_type === 'SL' || order_type === 'SL-M')) {
      payload.trigger_price = parseFloat(trigger_price)
    }

    if (disclosed_quantity) {
      payload.disclosed_quantity = parseInt(disclosed_quantity)
    }

    if (tag) {
      payload.tag = tag
    }

    console.log('Placing Zerodha order:', payload)

    const result = await this.makeRequest('POST', '/orders/regular', payload)

    if (result.success) {
      return {
        success: true,
        orderId: result.data.data.order_id,
        data: result.data
      }
    }

    return result
  }

  // Get order status
  async getOrderStatus(orderId) {
    const result = await this.makeRequest('GET', '/orders')
    if (result.success) {
      const order = result.data.data.find(o => o.order_id === orderId)
      return { success: true, data: order }
    }
    return result
  }

  // Get all orders
  async getAllOrders() {
    return await this.makeRequest('GET', '/orders')
  }

  // Cancel order
  async cancelOrder(orderId, variety = 'regular') {
    return await this.makeRequest('DELETE', `/orders/${variety}/${orderId}`)
  }

  // Modify order
  async modifyOrder(orderId, orderData, variety = 'regular') {
    const {
      quantity,
      price,
      trigger_price,
      order_type,
      validity
    } = orderData

    const payload = {}
    if (quantity) payload.quantity = parseInt(quantity)
    if (price) payload.price = parseFloat(price)
    if (trigger_price) payload.trigger_price = parseFloat(trigger_price)
    if (order_type) payload.order_type = order_type
    if (validity) payload.validity = validity

    return await this.makeRequest('PUT', `/orders/${variety}/${orderId}`, payload)
  }

  // Get instruments (for symbol mapping)
  async getInstruments(exchange = 'NSE') {
    try {
      const response = await axios.get(`${this.baseURL}/instruments/${exchange}`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`,
          'X-Kite-Version': '3'
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  // Convert TradingView signal to Zerodha order format
  static convertTradingViewSignal(signal) {
    const {
      action,
      symbol,
      quantity,
      orderType,
      price,
      stopLoss,
      takeProfit,
      product,
      exchange
    } = signal

    // Symbol mapping for common instruments
    const symbolMap = {
      'NIFTY': 'NIFTY 50',
      'BANKNIFTY': 'NIFTY BANK',
      'FINNIFTY': 'NIFTY FIN SERVICE',
      'MIDCPNIFTY': 'NIFTY MID SELECT'
    }

    const tradingsymbol = symbolMap[symbol] || symbol
    const exchangeCode = exchange || (symbol.includes('NIFTY') ? 'NFO' : 'NSE')

    const orderData = {
      tradingsymbol,
      exchange: exchangeCode,
      transaction_type: action.toUpperCase(), // BUY or SELL
      order_type: orderType === 'MARKET' ? 'MARKET' : 'LIMIT',
      quantity: parseInt(quantity),
      product: product || 'MIS', // MIS for intraday, CNC for delivery
      validity: 'DAY',
      tag: 'TradingView'
    }

    // Handle different order types
    if (orderType === 'LIMIT' && price) {
      orderData.price = parseFloat(price)
    }

    if (stopLoss && orderType === 'SL') {
      orderData.trigger_price = parseFloat(stopLoss)
      orderData.order_type = 'SL'
      if (price) {
        orderData.price = parseFloat(price)
      }
    }

    if (stopLoss && orderType === 'SL-M') {
      orderData.trigger_price = parseFloat(stopLoss)
      orderData.order_type = 'SL-M'
    }

    return orderData
  }

  // Get instrument token for a symbol
  async getInstrumentToken(symbol, exchange = 'NSE') {
    const result = await this.makeRequest('GET', `/instruments/${exchange}`)
    if (result.success) {
      const instrument = result.data.find(inst =>
        inst.tradingsymbol === symbol || inst.name === symbol
      )
      return instrument ? instrument.instrument_token : null
    }
    return null
  }

  // Get LTP (Last Traded Price) for symbols
  async getLTP(symbols) {
    if (Array.isArray(symbols)) {
      symbols = symbols.join(',')
    }
    return await this.makeRequest('GET', '/quote/ltp', { i: symbols })
  }

  // Get full quote for symbols
  async getQuote(symbols) {
    if (Array.isArray(symbols)) {
      symbols = symbols.join(',')
    }
    return await this.makeRequest('GET', '/quote', { i: symbols })
  }
}

// Helper functions for Zerodha authentication
export function getZerodhaLoginURL(apiKey, redirectURL) {
  const baseURL = 'https://kite.zerodha.com/connect/login'
  const params = new URLSearchParams({
    api_key: apiKey,
    v: '3'
  })

  if (redirectURL) {
    params.append('redirect_params', `redirect_url=${encodeURIComponent(redirectURL)}`)
  }

  return `${baseURL}?${params.toString()}`
}

export async function generateZerodhaAccessToken(apiKey, apiSecret, requestToken) {
  try {
    const checksum = crypto.createHash('sha256')
      .update(apiKey + requestToken + apiSecret)
      .digest('hex')

    const response = await axios.post('https://api.kite.trade/session/token', {
      api_key: apiKey,
      request_token: requestToken,
      checksum: checksum
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.data && response.data.data && response.data.data.access_token) {
      return {
        success: true,
        accessToken: response.data.data.access_token,
        data: response.data.data
      }
    } else {
      return {
        success: false,
        error: 'Invalid response from Zerodha'
      }
    }
  } catch (error) {
    console.error('Zerodha token generation error:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}


