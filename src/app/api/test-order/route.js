import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { BrokerFactory } from '@/lib/brokers/factory'

export async function POST(request) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const { 
      brokerAccountId, 
      symbol, 
      action, 
      quantity, 
      orderType, 
      price,
      product,
      exchange
    } = await request.json()

    // Validate input
    if (!brokerAccountId || !symbol || !action || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: brokerAccountId, symbol, action, quantity' },
        { status: 400 }
      )
    }

    // Get broker account
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: {
        id: brokerAccountId,
        userId: decoded.userId,
        isActive: true
      }
    })

    if (!brokerAccount) {
      return NextResponse.json(
        { error: 'Broker account not found or inactive' },
        { status: 404 }
      )
    }

    // Prepare order data
    const orderData = {
      symbol,
      action: action.toUpperCase(),
      quantity: parseInt(quantity),
      orderType: orderType || 'MARKET',
      price: price ? parseFloat(price) : null,
      product: product || 'MIS',
      exchange: exchange || 'NSE'
    }

    console.log('Test order data:', orderData)
    console.log('Broker account:', brokerAccount.brokerName)

    // Execute order through broker factory
    const result = await BrokerFactory.executeOrder(brokerAccount, orderData)

    if (result.success) {
      // Save order to database
      const order = await prisma.order.create({
        data: {
          userId: decoded.userId,
          brokerAccountId: brokerAccount.id,
          symbol: orderData.symbol,
          action: orderData.action,
          orderType: orderData.orderType,
          quantity: orderData.quantity,
          price: orderData.price,
          status: 'EXECUTED',
          brokerOrderId: result.orderId,
          executedPrice: result.data?.executedPrice || orderData.price,
          executedAt: new Date(),
          isVirtual: brokerAccount.isVirtual
        }
      })

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          symbol: order.symbol,
          action: order.action,
          quantity: order.quantity,
          status: order.status,
          brokerOrderId: order.brokerOrderId,
          executedPrice: order.executedPrice
        },
        brokerResponse: result.data,
        message: 'Test order executed successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Test order failed'
      })
    }

  } catch (error) {
    console.error('Test order error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
