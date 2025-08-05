import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { generateWebhookUrl } from '@/lib/utils'

// Get user's strategies
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

    // Get user's strategies
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
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      strategies
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

// Create new strategy
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
    const { name, description, pineScript, isVirtual, riskPerTrade, maxPositions } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Strategy name is required' },
        { status: 400 }
      )
    }

    // Create strategy
    const strategy = await prisma.strategy.create({
      data: {
        userId: decoded.userId,
        name,
        description,
        pineScript,
        isVirtual: isVirtual !== false, // Default to true
        riskPerTrade: riskPerTrade || 1.0,
        maxPositions: maxPositions || 1
      }
    })

    // Create webhook for the strategy
    const webhookUrl = generateWebhookUrl(decoded.userId, strategy.id)
    const webhook = await prisma.webhook.create({
      data: {
        userId: decoded.userId,
        strategyId: strategy.id,
        url: webhookUrl
      }
    })

    return NextResponse.json({
      success: true,
      strategy: {
        ...strategy,
        webhooks: [webhook]
      },
      message: 'Strategy created successfully'
    })

  } catch (error) {
    console.error('Create strategy error:', error)

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

// Update strategy
export async function PUT(request) {
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
    const { id, name, description, pineScript, isActive, isVirtual, riskPerTrade, maxPositions } = await request.json()

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Strategy ID is required' },
        { status: 400 }
      )
    }

    // Update strategy
    const strategy = await prisma.strategy.update({
      where: {
        id,
        userId: decoded.userId // Ensure user owns the strategy
      },
      data: {
        name,
        description,
        pineScript,
        isActive,
        isVirtual,
        riskPerTrade,
        maxPositions
      },
      include: {
        webhooks: {
          select: {
            id: true,
            url: true,
            isActive: true,
            triggerCount: true,
            lastTriggered: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      strategy,
      message: 'Strategy updated successfully'
    })

  } catch (error) {
    console.error('Update strategy error:', error)

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Strategy not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete strategy
export async function DELETE(request) {
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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Strategy ID is required' },
        { status: 400 }
      )
    }

    // Delete strategy (webhooks and orders will be deleted due to cascade)
    await prisma.strategy.delete({
      where: {
        id,
        userId: decoded.userId // Ensure user owns the strategy
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Strategy deleted successfully'
    })

  } catch (error) {
    console.error('Delete strategy error:', error)

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Strategy not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
