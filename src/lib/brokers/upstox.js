import axios from 'axios'

export class UpstoxAPI {
  constructor(apiKey, apiSecret, accessToken) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.accessToken = accessToken
    this.baseURL = 'https://api.upstox.com/v2'
  }

  async getProfile() {
    try {
      const response = await axios.get(`${this.baseURL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getBalance() {
    try {
      const response = await axios.get(`${this.baseURL}/user/get-funds-and-margin`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      })
      
      const equity = response.data.data.equity
      return { 
        success: true, 
        balance: equity.available_margin,
        data: response.data 
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getPositions() {
    try {
      const response = await axios.get(`${this.baseURL}/portfolio/long-term-positions`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
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
        instrument_token,
        quantity,
        price,
        product,
        validity,
        order_type,
        transaction_type
      } = orderData

      const response = await axios.post(`${this.baseURL}/order/place`, {
        instrument_token,
        quantity,
        price,
        product: product || 'I', // Intraday
        validity: validity || 'DAY',
        order_type,
        transaction_type
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      return { success: true, orderId: response.data.data.order_id, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async getOrderStatus(orderId) {
    try {
      const response = await axios.get(`${this.baseURL}/order/retrieve-all`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      })

      const order = response.data.data.find(o => o.order_id === orderId)
      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await axios.delete(`${this.baseURL}/order/cancel`, {
        data: { order_id: orderId },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
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
      price
    } = signal

    // This is a simplified conversion - you'll need proper instrument token mapping
    const orderData = {
      instrument_token: symbol, // This needs to be converted to Upstox instrument token
      transaction_type: action.toUpperCase(),
      order_type: orderType === 'MARKET' ? 'MARKET' : 'LIMIT',
      quantity: parseInt(quantity),
      product: 'I' // Intraday
    }

    if (orderType === 'LIMIT' && price) {
      orderData.price = parseFloat(price)
    }

    return orderData
  }
}
