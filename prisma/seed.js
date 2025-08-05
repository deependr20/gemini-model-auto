const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@tradingbotpro.com' },
    update: {},
    create: {
      email: 'demo@tradingbotpro.com',
      name: 'Demo User',
      password: hashedPassword,
      phone: '+91 98765 43210',
      plan: 'TRIAL',
      isVerified: true
    }
  })

  console.log('✅ Created demo user:', demoUser.email)

  // Create virtual broker account
  const virtualBroker = await prisma.brokerAccount.upsert({
    where: {
      userId_brokerName: {
        userId: demoUser.id,
        brokerName: 'VIRTUAL'
      }
    },
    update: {},
    create: {
      userId: demoUser.id,
      brokerName: 'VIRTUAL',
      apiKey: 'virtual_key',
      apiSecret: 'virtual_secret',
      isVirtual: true,
      balance: 100000,
      isActive: true
    }
  })

  // Create Zerodha demo account
  const zerodhaBroker = await prisma.brokerAccount.upsert({
    where: {
      userId_brokerName: {
        userId: demoUser.id,
        brokerName: 'ZERODHA'
      }
    },
    update: {},
    create: {
      userId: demoUser.id,
      brokerName: 'ZERODHA',
      apiKey: 'demo_zerodha_key',
      apiSecret: 'demo_zerodha_secret',
      accessToken: 'demo_access_token',
      isVirtual: false,
      balance: 50000,
      isActive: true
    }
  })

  console.log('✅ Created broker accounts')

  // Create sample strategies
  const strategies = [
    {
      name: 'Nifty Scalping Strategy',
      description: 'High-frequency scalping on Nifty futures with 1-minute timeframe',
      isActive: true,
      isVirtual: true,
      riskPerTrade: 1.0,
      maxPositions: 2
    },
    {
      name: 'Bank Nifty Options Strategy',
      description: 'Options trading strategy for Bank Nifty with technical indicators',
      isActive: true,
      isVirtual: false,
      riskPerTrade: 2.0,
      maxPositions: 1
    },
    {
      name: 'Swing Trading Strategy',
      description: 'Multi-day swing trading strategy for large-cap stocks',
      isActive: false,
      isVirtual: true,
      riskPerTrade: 1.5,
      maxPositions: 3
    },
    {
      name: 'Momentum Breakout Strategy',
      description: 'Breakout trading strategy based on volume and momentum indicators',
      isActive: true,
      isVirtual: true,
      riskPerTrade: 2.5,
      maxPositions: 1
    }
  ]

  const createdStrategies = []
  for (const strategyData of strategies) {
    const strategy = await prisma.strategy.create({
      data: {
        ...strategyData,
        userId: demoUser.id
      }
    })

    // Create webhook for each strategy
    const webhook = await prisma.webhook.create({
      data: {
        userId: demoUser.id,
        strategyId: strategy.id,
        url: `http://localhost:3001/api/webhook/${demoUser.id}/${strategy.id}`,
        isActive: true,
        triggerCount: Math.floor(Math.random() * 50),
        lastTriggered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
      }
    })

    createdStrategies.push({ strategy, webhook })
  }

  console.log('✅ Created strategies and webhooks')

  // Create sample orders
  const symbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN']
  const actions = ['BUY', 'SELL']
  const statuses = ['EXECUTED', 'PENDING', 'CANCELLED']

  for (let i = 0; i < 50; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const strategy = createdStrategies[Math.floor(Math.random() * createdStrategies.length)]
    const brokerAccount = Math.random() > 0.5 ? virtualBroker : zerodhaBroker
    
    const basePrice = {
      'NIFTY': 19850,
      'BANKNIFTY': 45200,
      'RELIANCE': 2450,
      'TCS': 3850,
      'INFY': 1650,
      'HDFCBANK': 1580,
      'ICICIBANK': 950,
      'SBIN': 580
    }[symbol]

    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.02 // ±2% variation
    const quantity = [25, 50, 75, 100][Math.floor(Math.random() * 4)]

    await prisma.order.create({
      data: {
        userId: demoUser.id,
        strategyId: strategy.strategy.id,
        webhookId: strategy.webhook.id,
        brokerAccountId: brokerAccount.id,
        symbol,
        action,
        orderType: 'MARKET',
        quantity,
        price: Math.round(price * 100) / 100,
        status,
        executedPrice: status === 'EXECUTED' ? Math.round(price * 100) / 100 : null,
        executedAt: status === 'EXECUTED' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        isVirtual: brokerAccount.isVirtual,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }
    })
  }

  console.log('✅ Created sample orders')

  // Create sample positions
  const positionSymbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS']
  for (const symbol of positionSymbols) {
    const basePrice = {
      'NIFTY': 19850,
      'BANKNIFTY': 45200,
      'RELIANCE': 2450,
      'TCS': 3850
    }[symbol]

    await prisma.position.create({
      data: {
        brokerAccountId: virtualBroker.id,
        symbol,
        quantity: [25, 50, 75][Math.floor(Math.random() * 3)],
        averagePrice: basePrice,
        currentPrice: basePrice + (Math.random() - 0.5) * basePrice * 0.01,
        pnl: (Math.random() - 0.5) * 1000,
        isOpen: Math.random() > 0.3
      }
    })
  }

  console.log('✅ Created sample positions')

  // Create sample notifications
  const notifications = [
    { title: 'Trade Executed', message: 'BUY 50 NIFTY @ ₹19,850', type: 'TRADE_ALERT' },
    { title: 'Strategy Activated', message: 'Nifty Scalping Strategy is now active', type: 'SUCCESS' },
    { title: 'Low Balance Warning', message: 'Your account balance is below ₹10,000', type: 'WARNING' },
    { title: 'New Webhook Trigger', message: 'Bank Nifty Options Strategy received signal', type: 'INFO' },
    { title: 'Order Cancelled', message: 'SELL 25 BANKNIFTY order was cancelled', type: 'ERROR' }
  ]

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        ...notif,
        userId: demoUser.id,
        isRead: Math.random() > 0.5,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      }
    })
  }

  console.log('✅ Created sample notifications')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Demo Account Details:')
  console.log('Email: demo@tradingbotpro.com')
  console.log('Password: demo123')
  console.log('\n🚀 You can now login and see dynamic data!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
