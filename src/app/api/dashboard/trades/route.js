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
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0
    const status = searchParams.get('status') // 'all', 'executed', 'pending', 'cancelled'
    
    // Build where clause
    const whereClause = {
      userId: decoded.userId
    }
    
    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase()
    }
    
    // Get user's recent trades
    const trades = await prisma.order.findMany({
      where: whereClause,
      include: {
        strategy: {
          select: {
            name: true
          }
        },
        brokerAccount: {
          select: {
            brokerName: true,
            isVirtual: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: whereClause
    })

    // Format trades for frontend
    const formattedTrades = trades.map(trade => ({
      id: trade.id,
      symbol: trade.symbol,
      action: trade.action,
      quantity: trade.quantity,
      orderType: trade.orderType,
      price: trade.price,
      executedPrice: trade.executedPrice,
      status: trade.status,
      brokerOrderId: trade.brokerOrderId,
      strategyName: trade.strategy?.name || 'Manual',
      brokerName: trade.brokerAccount?.brokerName || 'Unknown',
      isVirtual: trade.isVirtual || trade.brokerAccount?.isVirtual || false,
      createdAt: trade.createdAt,
      executedAt: trade.executedAt,
      pnl: calculateTradePnL(trade),
      time: formatTime(trade.executedAt || trade.createdAt)
    }))

    return NextResponse.json({
      success: true,
      trades: formattedTrades,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Get trades error:', error)
    
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

function calculateTradePnL(trade) {
  // This is a simplified P&L calculation
  // In a real system, you'd need to track positions and calculate based on entry/exit prices
  if (trade.status !== 'EXECUTED' || !trade.executedPrice) {
    return 0
  }
  
  // Mock P&L calculation - you'd implement proper position tracking
  const mockPnL = Math.random() * 1000 - 500 // Random P&L between -500 and +500
  return Math.round(mockPnL * 100) / 100
}

function formatTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const tradeDate = new Date(date)
  const diffMs = now - tradeDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return tradeDate.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
