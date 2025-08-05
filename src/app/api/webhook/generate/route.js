import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { generateWebhookUrl } from '@/lib/utils'

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
    const { strategyId, name } = await request.json()

    let strategy

    if (strategyId) {
      // Get existing strategy
      strategy = await prisma.strategy.findFirst({
        where: {
          id: strategyId,
          userId: decoded.userId
        }
      })

      if (!strategy) {
        return NextResponse.json(
          { error: 'Strategy not found' },
          { status: 404 }
        )
      }
    } else if (name) {
      // Create new strategy
      strategy = await prisma.strategy.create({
        data: {
          userId: decoded.userId,
          name,
          description: 'Auto-generated strategy for webhook',
          isVirtual: true,
          riskPerTrade: 1.0,
          maxPositions: 1
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Either strategyId or name is required' },
        { status: 400 }
      )
    }

    // Check if webhook already exists
    let webhook = await prisma.webhook.findFirst({
      where: {
        userId: decoded.userId,
        strategyId: strategy.id
      }
    })

    if (!webhook) {
      // Create new webhook
      const webhookUrl = generateWebhookUrl(decoded.userId, strategy.id)
      webhook = await prisma.webhook.create({
        data: {
          userId: decoded.userId,
          strategyId: strategy.id,
          url: webhookUrl,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        isActive: webhook.isActive,
        triggerCount: webhook.triggerCount,
        lastTriggered: webhook.lastTriggered
      },
      strategy: {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        isActive: strategy.isActive,
        isVirtual: strategy.isVirtual
      },
      message: 'Webhook generated successfully'
    })

  } catch (error) {
    console.error('Generate webhook error:', error)
    
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
