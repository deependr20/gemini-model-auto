#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up TradingBot Pro...\n')

// Check if Node.js version is compatible
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion)
  process.exit(1)
}

console.log('✅ Node.js version check passed:', nodeVersion)

// Function to run commands
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed`)
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    process.exit(1)
  }
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('\n📝 Creating .env file...')
  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="super-secret-nextauth-key-change-in-production-2024"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="TradingBot Pro"

# JWT
JWT_SECRET="super-secret-jwt-key-change-in-production-2024"

# Encryption for API keys (32 characters)
ENCRYPTION_KEY="MySecretEncryptionKey1234567890AB"

# Real-time Data & WebSocket
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
ENABLE_REAL_TIME="true"

# Market Data APIs (Optional - add your keys)
ALPHA_VANTAGE_API_KEY=""
FINNHUB_API_KEY=""
POLYGON_API_KEY=""

# Broker API Keys (Add your actual keys)
ZERODHA_API_KEY=""
ZERODHA_API_SECRET=""
ZERODHA_REDIRECT_URL="http://localhost:3001/auth/zerodha/callback"

UPSTOX_API_KEY=""
UPSTOX_API_SECRET=""
UPSTOX_REDIRECT_URL="http://localhost:3001/auth/upstox/callback"

FYERS_API_KEY=""
FYERS_API_SECRET=""
FYERS_REDIRECT_URL="http://localhost:3001/auth/fyers/callback"

BINANCE_API_KEY=""
BINANCE_API_SECRET=""

# Telegram Bot (for notifications)
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# Redis (for caching and real-time data)
REDIS_URL="redis://localhost:6379"

# Rate Limiting
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX="100"

# Logging
LOG_LEVEL="info"
ENABLE_REQUEST_LOGGING="true"

GEMINI_API_KEY=AIzaSyDwkA4tepGIpoly2oKv6_2SILNn7MVLzB8
`
  
  fs.writeFileSync('.env', envContent)
  console.log('✅ .env file created with default values')
} else {
  console.log('✅ .env file already exists')
}

// Install dependencies
runCommand('npm install', 'Installing dependencies')

// Generate Prisma client
runCommand('npx prisma generate', 'Generating Prisma client')

// Run database migrations
runCommand('npx prisma migrate dev --name init', 'Setting up database')

// Seed the database
runCommand('npm run db:seed', 'Seeding database with sample data')

console.log('\n🎉 Setup completed successfully!')
console.log('\n📋 What\'s been set up:')
console.log('✅ Dependencies installed')
console.log('✅ Database created and migrated')
console.log('✅ Sample data seeded')
console.log('✅ Environment variables configured')

console.log('\n🚀 Next steps:')
console.log('1. Run: npm run dev')
console.log('2. Open: http://localhost:3001')
console.log('3. Login with demo account:')
console.log('   Email: demo@tradingbotpro.com')
console.log('   Password: demo123')

console.log('\n🔧 Optional configurations:')
console.log('• Add your broker API keys to .env file')
console.log('• Configure Telegram bot for notifications')
console.log('• Set up email SMTP for notifications')
console.log('• Add market data API keys for real-time prices')

console.log('\n📚 Useful commands:')
console.log('• npm run dev          - Start development server')
console.log('• npm run db:studio    - Open Prisma Studio (database GUI)')
console.log('• npm run db:seed      - Re-seed database with sample data')
console.log('• npm run db:reset     - Reset database and re-seed')

console.log('\n🌟 Your trading automation platform is ready!')
