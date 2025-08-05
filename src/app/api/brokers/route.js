import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { encryptApiKey, decryptApiKey } from '@/lib/encryption'

// Get user's broker accounts
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
    
    // Get user's broker accounts
    const brokerAccounts = await prisma.brokerAccount.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        brokerName: true,
        isActive: true,
        isVirtual: true,
        balance: true,
        createdAt: true,
        // Don't return sensitive API keys
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      brokerAccounts
    })

  } catch (error) {
    console.error('Get broker accounts error:', error)
    
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

// Add new broker account
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
    const { brokerName, apiKey, apiSecret, accessToken, isVirtual } = await request.json()

    // Validate input
    if (!brokerName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Broker name, API key, and API secret are required' },
        { status: 400 }
      )
    }

    // Check if user already has this broker account
    const existingAccount = await prisma.brokerAccount.findUnique({
      where: {
        userId_brokerName: {
          userId: decoded.userId,
          brokerName: brokerName
        }
      }
    })

    if (existingAccount) {
      return NextResponse.json(
        { error: 'You already have an account with this broker' },
        { status: 400 }
      )
    }

    // Encrypt sensitive data
    const encryptedApiKey = encryptApiKey(apiKey)
    const encryptedApiSecret = encryptApiKey(apiSecret)
    const encryptedAccessToken = accessToken ? encryptApiKey(accessToken) : null

    // Test broker connection (you'll implement this per broker)
    const connectionTest = await testBrokerConnection(brokerName, apiKey, apiSecret, accessToken)
    
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: `Failed to connect to ${brokerName}: ${connectionTest.error}` },
        { status: 400 }
      )
    }

    // Create broker account
    const brokerAccount = await prisma.brokerAccount.create({
      data: {
        userId: decoded.userId,
        brokerName,
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        accessToken: encryptedAccessToken,
        isVirtual: isVirtual || false,
        balance: isVirtual ? 100000 : connectionTest.balance || 0
      }
    })

    return NextResponse.json({
      success: true,
      brokerAccount: {
        id: brokerAccount.id,
        brokerName: brokerAccount.brokerName,
        isActive: brokerAccount.isActive,
        isVirtual: brokerAccount.isVirtual,
        balance: brokerAccount.balance,
        createdAt: brokerAccount.createdAt
      },
      message: `${brokerName} account connected successfully`
    })

  } catch (error) {
    console.error('Add broker account error:', error)
    
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

// Update broker account
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
    const { id, apiKey, apiSecret, accessToken, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Broker account ID is required' },
        { status: 400 }
      )
    }

    const updateData = {}
    
    if (apiKey) updateData.apiKey = encryptApiKey(apiKey)
    if (apiSecret) updateData.apiSecret = encryptApiKey(apiSecret)
    if (accessToken) updateData.accessToken = encryptApiKey(accessToken)
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    // Update broker account
    const brokerAccount = await prisma.brokerAccount.update({
      where: { 
        id,
        userId: decoded.userId // Ensure user owns the account
      },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      brokerAccount: {
        id: brokerAccount.id,
        brokerName: brokerAccount.brokerName,
        isActive: brokerAccount.isActive,
        isVirtual: brokerAccount.isVirtual,
        balance: brokerAccount.balance,
        createdAt: brokerAccount.createdAt
      },
      message: 'Broker account updated successfully'
    })

  } catch (error) {
    console.error('Update broker account error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Broker account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete broker account
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
        { error: 'Broker account ID is required' },
        { status: 400 }
      )
    }

    // Delete broker account
    await prisma.brokerAccount.delete({
      where: { 
        id,
        userId: decoded.userId // Ensure user owns the account
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Broker account deleted successfully'
    })

  } catch (error) {
    console.error('Delete broker account error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Broker account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Test broker connection function
async function testBrokerConnection(brokerName, apiKey, apiSecret, accessToken) {
  try {
    switch (brokerName) {
      case 'ZERODHA':
        return await testZerodhaConnection(apiKey, apiSecret, accessToken)
      case 'UPSTOX':
        return await testUpstoxConnection(apiKey, apiSecret, accessToken)
      case 'FYERS':
        return await testFyersConnection(apiKey, apiSecret, accessToken)
      default:
        return { success: true, balance: 0 } // For now, assume success for other brokers
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Zerodha connection test
async function testZerodhaConnection(apiKey, apiSecret, accessToken) {
  // This is a placeholder - you'll need to implement actual Zerodha API calls
  // For now, just validate that the keys are provided
  if (!apiKey || !apiSecret) {
    return { success: false, error: 'API key and secret are required' }
  }
  
  // In real implementation, you would:
  // 1. Make API call to Zerodha to validate credentials
  // 2. Get user profile and balance
  // 3. Return success/failure with balance
  
  return { success: true, balance: 50000 } // Mock balance
}

// Upstox connection test
async function testUpstoxConnection(apiKey, apiSecret, accessToken) {
  // Similar implementation for Upstox
  return { success: true, balance: 75000 } // Mock balance
}

// Fyers connection test
async function testFyersConnection(apiKey, apiSecret, accessToken) {
  // Similar implementation for Fyers
  return { success: true, balance: 60000 } // Mock balance
}
