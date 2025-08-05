# TradingBot Pro - Automated Trading Platform

A comprehensive trading automation platform similar to NextLevelBot, built with Next.js, featuring TradingView webhook integration, multi-broker support, and beautiful UI.

## 🚀 Features

- **TradingView Integration**: Receive webhook signals from TradingView Pine Script strategies
- **Multi-Broker Support**: Connect to 25+ brokers including Zerodha, Upstox, Fyers, Binance, and more
- **Paper Trading**: Free virtual trading with ₹1,00,000 virtual money
- **Real-time Dashboard**: Monitor trades, P&L, and strategy performance
- **Strategy Management**: Create, manage, and automate trading strategies
- **Webhook System**: Unique webhook URLs for each strategy
- **Risk Management**: Position sizing, stop-loss, take-profit controls
- **Notifications**: Telegram alerts and in-app notifications
- **Beautiful UI**: Modern, responsive design with dark theme

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, NextAuth.js
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd gemini-model-auto
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Update the `.env` file with your configuration:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tradingbot?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TradingBot Pro"

# JWT
JWT_SECRET="your-jwt-secret-here"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (when you have a database)
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📡 TradingView Webhook Setup

### 1. Create a Strategy

1. Register/Login to the platform
2. Go to Dashboard → Create New Strategy
3. Copy the generated webhook URL

### 2. Configure TradingView Alert

Use this JSON format in TradingView alerts:

```json
{
  "action": "BUY",
  "symbol": "NIFTY",
  "quantity": 50,
  "orderType": "MARKET",
  "price": null,
  "stopLoss": 19800,
  "takeProfit": 19900
}
```

## 🎨 Current Features Implemented

✅ Beautiful landing page similar to NextLevelBot
✅ User authentication (register/login)
✅ TradingView webhook API endpoints
✅ Database schema for users, strategies, orders
✅ Dashboard with trading statistics
✅ Strategy management system
✅ Multi-broker integration framework
✅ Paper trading support
✅ Responsive design with dark theme

## 🚧 Next Steps

- Set up PostgreSQL database
- Implement broker API integrations
- Add real-time trading functionality
- Create strategy builder interface
- Add notification system
- Implement backtesting features

## ⚠️ Disclaimer

This software is for educational purposes only. Trading involves risk and you should never trade with money you cannot afford to lose.
