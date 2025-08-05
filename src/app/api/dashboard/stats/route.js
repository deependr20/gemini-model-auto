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
    
    // Get user's trading statistics
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        brokerAccounts: {
          select: {
            id: true,
            brokerName: true,
            balance: true,
            isActive: true,
            isVirtual: true
          }
        },
        strategies: {
          select: {
            id: true,
            name: true,
            isActive: true,
            isVirtual: true
          }
        },
        orders: {
          select: {
            id: true,
            symbol: true,
            action: true,
            quantity: true,
            executedPrice: true,
            status: true,
            createdAt: true,
            executedAt: true,
            isVirtual: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 50 // Last 50 orders for calculations
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const stats = calculateTradingStats(user)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get dashboard stats error:', error)
    
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

function calculateTradingStats(user) {
  const { orders, strategies, brokerAccounts } = user
  
  // Calculate total P&L
  let totalPnL = 0
  let todayPnL = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Group orders by symbol to calculate P&L
  const positions = new Map()
  
  orders.forEach(order => {
    if (order.status === 'EXECUTED' && order.executedPrice) {
      const symbol = order.symbol
      const value = order.quantity * order.executedPrice
      
      if (!positions.has(symbol)) {
        positions.set(symbol, {
          symbol,
          totalBought: 0,
          totalSold: 0,
          quantity: 0,
          pnl: 0
        })
      }
      
      const position = positions.get(symbol)
      
      if (order.action === 'BUY') {
        position.totalBought += value
        position.quantity += order.quantity
      } else {
        position.totalSold += value
        position.quantity -= order.quantity
        
        // Calculate realized P&L for sells
        const avgBuyPrice = position.totalBought / (position.quantity + order.quantity)
        const realizedPnL = (order.executedPrice - avgBuyPrice) * order.quantity
        position.pnl += realizedPnL
        totalPnL += realizedPnL
        
        // Check if it's today's trade
        if (order.executedAt && new Date(order.executedAt) >= today) {
          todayPnL += realizedPnL
        }
      }
      
      positions.set(symbol, position)
    }
  })

  // Count active strategies
  const activeStrategies = strategies.filter(s => s.isActive).length
  
  // Count total executed orders
  const totalTrades = orders.filter(o => o.status === 'EXECUTED').length
  
  // Count today's trades
  const todayTrades = orders.filter(o => 
    o.status === 'EXECUTED' && 
    o.executedAt && 
    new Date(o.executedAt) >= today
  ).length

  // Calculate total balance across all accounts
  const totalBalance = brokerAccounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  
  // Calculate win rate
  const profitableTrades = Array.from(positions.values()).filter(p => p.pnl > 0).length
  const totalCompletedTrades = Array.from(positions.values()).filter(p => p.pnl !== 0).length
  const winRate = totalCompletedTrades > 0 ? (profitableTrades / totalCompletedTrades) * 100 : 0

  return {
    totalPnL: Math.round(totalPnL * 100) / 100,
    todayPnL: Math.round(todayPnL * 100) / 100,
    activeStrategies,
    totalTrades,
    todayTrades,
    totalBalance: Math.round(totalBalance * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    totalBrokerAccounts: brokerAccounts.length,
    activeBrokerAccounts: brokerAccounts.filter(a => a.isActive).length,
    virtualAccounts: brokerAccounts.filter(a => a.isVirtual).length,
    liveAccounts: brokerAccounts.filter(a => !a.isVirtual).length
  }
}
