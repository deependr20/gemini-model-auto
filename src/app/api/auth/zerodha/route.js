import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { generateZerodhaAccessToken, getZerodhaLoginURL } from '@/lib/brokers/zerodha'
import { encryptApiKey } from '@/lib/encryption'

// Get Zerodha login URL
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('apiKey')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    const redirectURL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/zerodha/callback`
    const loginURL = getZerodhaLoginURL(apiKey, redirectURL)

    return NextResponse.json({
      success: true,
      loginURL
    })

  } catch (error) {
    console.error('Zerodha auth URL error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle access token generation
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
    const { apiKey, apiSecret, requestToken } = await request.json()

    // Validate input
    if (!apiKey || !apiSecret || !requestToken) {
      return NextResponse.json(
        { error: 'API key, secret, and request token are required' },
        { status: 400 }
      )
    }

    // Generate access token
    const tokenResult = await generateZerodhaAccessToken(apiKey, apiSecret, requestToken)
    
    if (!tokenResult.success) {
      return NextResponse.json(
        { error: `Failed to generate access token: ${tokenResult.error}` },
        { status: 400 }
      )
    }

    const accessToken = tokenResult.accessToken

    // Test the connection
    const { ZerodhaAPI } = await import('@/lib/brokers/zerodha')
    const zerodhaAPI = new ZerodhaAPI(apiKey, apiSecret, accessToken)
    const profileResult = await zerodhaAPI.getProfile()

    if (!profileResult.success) {
      return NextResponse.json(
        { error: `Connection test failed: ${profileResult.error}` },
        { status: 400 }
      )
    }

    // Get balance
    const balanceResult = await zerodhaAPI.getBalance()
    const balance = balanceResult.success ? balanceResult.balance : 0

    // Encrypt sensitive data
    const encryptedApiKey = encryptApiKey(apiKey)
    const encryptedApiSecret = encryptApiKey(apiSecret)
    const encryptedAccessToken = encryptApiKey(accessToken)

    // Save or update broker account
    const brokerAccount = await prisma.brokerAccount.upsert({
      where: {
        userId_brokerName: {
          userId: decoded.userId,
          brokerName: 'ZERODHA'
        }
      },
      update: {
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        accessToken: encryptedAccessToken,
        balance,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: decoded.userId,
        brokerName: 'ZERODHA',
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        accessToken: encryptedAccessToken,
        balance,
        isVirtual: false,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      brokerAccount: {
        id: brokerAccount.id,
        brokerName: brokerAccount.brokerName,
        balance: brokerAccount.balance,
        isActive: brokerAccount.isActive,
        isVirtual: brokerAccount.isVirtual
      },
      profile: profileResult.data,
      message: 'Zerodha account connected successfully'
    })

  } catch (error) {
    console.error('Zerodha auth error:', error)
    
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
