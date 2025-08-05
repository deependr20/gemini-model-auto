import axios from 'axios'

export class FyersAPI {
  constructor(apiKey, apiSecret, accessToken) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.accessToken = accessToken
    this.baseURL = 'https://api.fyers.in/api/v2'
  }

  async getProfile() {
    try {
      const response = await axios.get(`${this.baseURL}/profile`, {
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getBalance() {
    try {
      const response = await axios.get(`${this.baseURL}/funds`, {
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`
        }
      })
      
      const fund = response.data.fund_limit[0]
      return { 
        success: true, 
        balance: fund.availableBalance,
        data: response.data 
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getPositions() {
    try {
      const response = await axios.get(`${this.baseURL}/positions`, {
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async placeOrder(orderData) {
    try {
      const {
        symbol,
        qty,
        type,
        side,
        productType,
        limitPrice,
        stopPrice,
        validity,
        disclosedQty,
        offlineOrder
      } = orderData

      const response = await axios.post(`${this.baseURL}/orders`, {
        symbol,
        qty,
        type,
        side,
        productType: productType || 'INTRADAY',
        limitPrice,
        stopPrice,
        validity: validity || 'DAY',
        disclosedQty: disclosedQty || 0,
        offlineOrder: offlineOrder || false
      }, {
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      return { success: true, orderId: response.data.id, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getOrderStatus(orderId) {
    try {
      const response = await axios.get(`${this.baseURL}/orders`, {
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`
        }
      })

      const order = response.data.orderBook.find(o => o.id === orderId)
      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await axios.delete(`${this.baseURL}/orders`, {
        data: { id: orderId },
        headers: {
          'Authorization': `${this.apiKey}:${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  static convertTradingViewSignal(signal) {
    const {
      action,
      symbol,
      quantity,
      orderType,
      price,
      stopLoss
    } = signal

    // Convert symbol to Fyers format (e.g., NSE:RELIANCE-EQ)
    const fyersSymbol = `NSE:${symbol}-EQ`

    const orderData = {
      symbol: fyersSymbol,
      qty: parseInt(quantity),
      type: orderType === 'MARKET' ? 1 : 2, // 1 = Market, 2 = Limit
      side: action.toUpperCase() === 'BUY' ? 1 : -1, // 1 = Buy, -1 = Sell
      productType: 'INTRADAY'
    }

    if (orderType === 'LIMIT' && price) {
      orderData.limitPrice = parseFloat(price)
    }

    if (stopLoss) {
      orderData.stopPrice = parseFloat(stopLoss)
      orderData.type = 3 // Stop Loss
    }

    return orderData
  }
}
