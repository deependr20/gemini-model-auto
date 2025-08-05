import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request) {
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
    
    // Get user's strategies with performance data
    const strategies = await prisma.strategy.findMany({
      where: { userId: decoded.userId },
      include: {
        webhooks: {
          select: {
            id: true,
            url: true,
            isActive: true,
            triggerCount: true,
            lastTriggered: true
          }
        },
        orders: {
          select: {
            id: true,
            action: true,
            quantity: true,
            executedPrice: true,
            status: true,
            createdAt: true,
            executedAt: true
          },
          where: {
            status: 'EXECUTED'
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate performance metrics for each strategy
    const strategiesWithMetrics = strategies.map(strategy => {
      const performance = calculateStrategyPerformance(strategy.orders)
      
      return {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        isActive: strategy.isActive,
        isVirtual: strategy.isVirtual,
        riskPerTrade: strategy.riskPerTrade,
        maxPositions: strategy.maxPositions,
        createdAt: strategy.createdAt,
        updatedAt: strategy.updatedAt,
        
        // Webhook info
        webhook: strategy.webhooks[0] || null,
        
        // Performance metrics
        totalTrades: strategy._count.orders,
        executedTrades: strategy.orders.length,
        pnl: performance.pnl,
        winRate: performance.winRate,
        avgTradeValue: performance.avgTradeValue,
        lastTradeAt: strategy.orders[0]?.executedAt || null,
        
        // Status indicators
        status: getStrategyStatus(strategy),
        performance: getPerformanceRating(performance.pnl, performance.winRate)
      }
    })

    return NextResponse.json({
      success: true,
      strategies: strategiesWithMetrics
    })

  } catch (error) {
    console.error('Get strategies error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateStrategyPerformance(orders) {
  if (!orders || orders.length === 0) {
    return {
      pnl: 0,
      winRate: 0,
      avgTradeValue: 0,
      totalVolume: 0
    }
  }

  // Group orders by symbol to calculate P&L
  const positions = new Map()
  let totalPnL = 0
  let totalVolume = 0
  let profitableTrades = 0
  let totalCompletedTrades = 0

  orders.forEach(order => {
    if (order.executedPrice) {
      const symbol = order.symbol
      const value = order.quantity * order.executedPrice
      totalVolume += value

      if (!positions.has(symbol)) {
        positions.set(symbol, {
          totalBought: 0,
          totalSold: 0,
          quantity: 0,
          trades: []
        })
      }

      const position = positions.get(symbol)
      position.trades.push(order)

      if (order.action === 'BUY') {
        position.totalBought += value
        position.quantity += order.quantity
      } else {
        position.totalSold += value
        position.quantity -= order.quantity

        // Calculate realized P&L for sells
        if (position.totalBought > 0) {
          const avgBuyPrice = position.totalBought / (position.quantity + order.quantity)
          const realizedPnL = (order.executedPrice - avgBuyPrice) * order.quantity
          position.pnl = (position.pnl || 0) + realizedPnL
          totalPnL += realizedPnL
          
          totalCompletedTrades++
          if (realizedPnL > 0) profitableTrades++
        }
      }

      positions.set(symbol, position)
    }
  })

  const winRate = totalCompletedTrades > 0 ? (profitableTrades / totalCompletedTrades) * 100 : 0
  const avgTradeValue = orders.length > 0 ? totalVolume / orders.length : 0

  return {
    pnl: Math.round(totalPnL * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    avgTradeValue: Math.round(avgTradeValue * 100) / 100,
    totalVolume: Math.round(totalVolume * 100) / 100
  }
}

function getStrategyStatus(strategy) {
  if (!strategy.isActive) return 'Paused'
  
  const webhook = strategy.webhooks[0]
  if (!webhook || !webhook.isActive) return 'No Webhook'
  
  const lastTriggered = webhook.lastTriggered
  if (!lastTriggered) return 'Never Triggered'
  
  const hoursSinceLastTrigger = (Date.now() - new Date(lastTriggered).getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceLastTrigger < 1) return 'Active'
  if (hoursSinceLastTrigger < 24) return 'Recent Activity'
  if (hoursSinceLastTrigger < 168) return 'Weekly Activity' // 7 days
  
  return 'Inactive'
}

function getPerformanceRating(pnl, winRate) {
  if (pnl > 1000 && winRate > 70) return 'Excellent'
  if (pnl > 500 && winRate > 60) return 'Good'
  if (pnl > 0 && winRate > 50) return 'Average'
  if (pnl > -500) return 'Poor'
  return 'Very Poor'
}
