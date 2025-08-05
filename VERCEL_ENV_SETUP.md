# 🔐 Vercel Environment Variables Setup

## Required Environment Variables for Production

### 📋 **Step-by-Step Setup:**

1. **Go to your Vercel project dashboard**
2. **Click on "Settings" tab**
3. **Click on "Environment Variables" in the sidebar**
4. **Add each variable below**

---

## 🚨 **CRITICAL - Required Variables**

### **Database Configuration**
```bash
# For Production Database (Choose one)
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
# OR for MySQL
# DATABASE_URL="mysql://username:password@host:port/database"
```

### **Authentication Secrets**
```bash
# NextAuth Secret (Generate a strong 32+ character secret)
NEXTAUTH_SECRET="your-super-secret-nextauth-key-for-production-min-32-chars-here"

# JWT Secret (Generate a strong 32+ character secret)
JWT_SECRET="your-super-secret-jwt-key-for-production-min-32-chars-here"

# Encryption Key (Exactly 32 characters for API key encryption)
ENCRYPTION_KEY="YourSecretEncryptionKey1234567890AB"
```

### **App URLs**
```bash
# Your Vercel app URL (replace with your actual domain)
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# App Name
NEXT_PUBLIC_APP_NAME="TradingBot Pro"
```

---

## 🔑 **Broker API Keys (Add as needed)**

### **Zerodha Integration**
```bash
ZERODHA_API_KEY="your_zerodha_api_key"
ZERODHA_API_SECRET="your_zerodha_api_secret"
ZERODHA_REDIRECT_URL="https://your-app-name.vercel.app/auth/zerodha/callback"
```

### **Upstox Integration**
```bash
UPSTOX_API_KEY="your_upstox_api_key"
UPSTOX_API_SECRET="your_upstox_api_secret"
UPSTOX_REDIRECT_URL="https://your-app-name.vercel.app/auth/upstox/callback"
```

### **Fyers Integration**
```bash
FYERS_API_KEY="your_fyers_api_key"
FYERS_API_SECRET="your_fyers_api_secret"
FYERS_REDIRECT_URL="https://your-app-name.vercel.app/auth/fyers/callback"
```

### **Binance Integration**
```bash
BINANCE_API_KEY="your_binance_api_key"
BINANCE_API_SECRET="your_binance_api_secret"
```

---

## 📊 **Market Data APIs (Optional)**

```bash
# Alpha Vantage (Free tier available)
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_api_key"

# Finnhub (Free tier available)
FINNHUB_API_KEY="your_finnhub_api_key"

# Polygon.io (Paid service)
POLYGON_API_KEY="your_polygon_api_key"
```

---

## 🤖 **AI & Notifications (Optional)**

### **Gemini AI**
```bash
GEMINI_API_KEY="your_gemini_api_key"
```

### **Telegram Notifications**
```bash
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_chat_id"
```

### **Email Notifications**
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

---

## ⚡ **Performance & Caching (Optional)**

### **Redis (for caching)**
```bash
REDIS_URL="redis://username:password@host:port"
```

### **WebSocket & Real-time**
```bash
NEXT_PUBLIC_WS_URL="wss://your-app-name.vercel.app"
ENABLE_REAL_TIME="true"
```

---

## 🛡️ **Security & Rate Limiting**

```bash
# Rate Limiting (15 minutes window, 100 requests max)
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX="100"

# Logging
LOG_LEVEL="info"
ENABLE_REQUEST_LOGGING="false"
```

---

## 🎯 **How to Generate Secure Secrets**

### **For NEXTAUTH_SECRET and JWT_SECRET:**
```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

### **For ENCRYPTION_KEY (exactly 32 characters):**
```bash
# Generate exactly 32 characters
node -e "console.log(require('crypto').randomBytes(16).toString('hex').toUpperCase())"
```

---

## 📋 **Deployment Checklist**

### **Before Deploying:**
- [ ] Database created and accessible
- [ ] All required environment variables added to Vercel
- [ ] Broker API keys obtained (if using live trading)
- [ ] Domain configured (optional)
- [ ] SSL certificate will be automatic with Vercel

### **After Deploying:**
- [ ] Test login/registration
- [ ] Test broker connections
- [ ] Test webhook generation
- [ ] Test order execution (virtual mode first)
- [ ] Update broker redirect URLs with production domain

---

## 🚀 **Quick Setup Commands**

### **1. Clone and Setup Locally:**
```bash
git clone your-repo-url
cd your-project
npm install
```

### **2. Create Production Environment File:**
```bash
cp .env.production.example .env.production
# Edit .env.production with your values
```

### **3. Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

---

## ⚠️ **Important Notes**

1. **Never commit secrets to Git**
2. **Use different secrets for development and production**
3. **Rotate secrets regularly**
4. **Test in development before production deployment**
5. **Keep backup of your environment variables**

---

## 🆘 **Need Help?**

### **Database Options:**
- **Vercel Postgres**: Built-in, easy setup
- **Supabase**: Free PostgreSQL with great features
- **PlanetScale**: Free MySQL with branching
- **Railway**: Simple PostgreSQL/MySQL hosting

### **Common Issues:**
- **Build fails**: Check all required variables are set
- **Database connection**: Verify DATABASE_URL format
- **Broker auth fails**: Check redirect URLs match exactly
- **API errors**: Verify all secrets are correct

Your trading platform will be production-ready once these variables are configured! 🎉
