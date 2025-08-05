import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateTradingViewSignal } from '@/lib/utils'
import { BrokerFactory, VirtualBroker } from '@/lib/brokers/factory'

export async function POST(request, { params }) {
  try {
    const { userId, strategyId } = params
    const body = await request.json()

    console.log('Webhook received:', { userId, strategyId, body })

    // Validate the signal
    if (!validateTradingViewSignal(body)) {
      return NextResponse.json(
        { error: 'Invalid signal format' },
        { status: 400 }
      )
    }

    // Find the webhook
    const webhook = await prisma.webhook.findFirst({
      where: {
        userId,
        strategyId,
        isActive: true
      },
      include: {
        user: true,
        strategy: true
      }
    })

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook not found or inactive' },
        { status: 404 }
      )
    }

    // Check if user has active plan
    if (webhook.user.plan === 'FREE' && !webhook.strategy.isVirtual) {
      return NextResponse.json(
        { error: 'Free plan only supports virtual trading' },
        { status: 403 }
      )
    }

    // Update webhook stats
    await prisma.webhook.update({
      where: { id: webhook.id },
      data: {
        lastTriggered: new Date(),
        triggerCount: { increment: 1 }
      }
    })

    // Process the trading signal
    const orderData = {
      userId,
      strategyId,
      webhookId: webhook.id,
      symbol: body.symbol,
      action: body.action.toUpperCase(),
      orderType: body.orderType || 'MARKET',
      quantity: parseInt(body.quantity),
      price: body.price ? parseFloat(body.price) : null,
      stopLoss: body.stopLoss ? parseFloat(body.stopLoss) : null,
      takeProfit: body.takeProfit ? parseFloat(body.takeProfit) : null,
      isVirtual: webhook.strategy.isVirtual
    }

    // Get user's broker account
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: {
        userId,
        isActive: true,
        isVirtual: webhook.strategy.isVirtual
      }
    })

    if (!brokerAccount) {
      return NextResponse.json(
        { error: 'No active broker account found' },
        { status: 404 }
      )
    }

    orderData.brokerAccountId = brokerAccount.id

    // Create the order
    const order = await prisma.order.create({
      data: orderData
    })

    // Process the order through broker API or virtual trading
    let orderResult

    if (!webhook.strategy.isVirtual) {
      // Real trading through broker API
      orderResult = await BrokerFactory.executeOrder(brokerAccount, {
        symbol: body.symbol,
        action: body.action,
        quantity: body.quantity,
        orderType: body.orderType || 'MARKET',
        price: body.price,
        stopLoss: body.stopLoss,
        takeProfit: body.takeProfit
      })
    } else {
      // Virtual trading simulation
      const virtualBroker = new VirtualBroker(brokerAccount.balance)
      orderResult = await virtualBroker.placeOrder({
        symbol: body.symbol,
        transaction_type: body.action.toUpperCase(),
        quantity: parseInt(body.quantity),
        price: body.price,
        order_type: body.orderType || 'MARKET'
      })
    }

    // Update order status based on result
    if (orderResult.success) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'EXECUTED',
          brokerOrderId: orderResult.orderId,
          executedPrice: orderResult.data?.executedPrice || orderData.price || 100,
          executedAt: new Date()
        }
      })
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'REJECTED'
        }
      })

      return NextResponse.json({
        success: false,
        error: `Order execution failed: ${orderResult.error}`,
        orderId: order.id
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Trade Signal Received',
        message: `${body.action.toUpperCase()} ${body.quantity} ${body.symbol}`,
        type: 'TRADE_ALERT'
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Signal processed successfully'
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request, { params }) {
  try {
    const { userId, strategyId } = params

    const webhook = await prisma.webhook.findFirst({
      where: {
        userId,
        strategyId
      },
      include: {
        strategy: {
          select: {
            name: true,
            isActive: true
          }
        }
      }
    })

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: webhook.id,
      isActive: webhook.isActive,
      lastTriggered: webhook.lastTriggered,
      triggerCount: webhook.triggerCount,
      strategy: webhook.strategy
    })

  } catch (error) {
    console.error('Webhook GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
