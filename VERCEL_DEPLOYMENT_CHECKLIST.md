# ✅ Vercel Deployment Checklist

## 🚨 **REQUIRED Environment Variables**

Copy these to your Vercel project settings:

### **Core Application**
```bash
DATABASE_URL="your_database_connection_string"
NEXTAUTH_SECRET="your-32-char-secret-here"
JWT_SECRET="your-32-char-jwt-secret-here"
ENCRYPTION_KEY="Your32CharEncryptionKeyHere123"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_NAME="TradingBot Pro"
```

### **Zerodha Integration** (if using)
```bash
ZERODHA_API_KEY="your_zerodha_api_key"
ZERODHA_API_SECRET="your_zerodha_api_secret"
ZERODHA_REDIRECT_URL="https://your-app.vercel.app/auth/zerodha/callback"
```

### **AI Integration** (if using)
```bash
GEMINI_API_KEY="your_gemini_api_key"
```

---

## 📋 **Quick Setup Steps**

### **1. Database Setup**
- [ ] Create PostgreSQL database (Vercel Postgres, Supabase, or PlanetScale)
- [ ] Copy DATABASE_URL connection string
- [ ] Test connection locally

### **2. Generate Secrets**
```bash
# Generate NEXTAUTH_SECRET (32+ chars)
openssl rand -base64 32

# Generate JWT_SECRET (32+ chars)  
openssl rand -base64 32

# Generate ENCRYPTION_KEY (exactly 32 chars)
node -e "console.log(require('crypto').randomBytes(16).toString('hex').toUpperCase())"
```

### **3. Vercel Project Setup**
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add all environment variables in Settings > Environment Variables
- [ ] Deploy

### **4. Post-Deployment**
- [ ] Test login/registration
- [ ] Update broker redirect URLs with production domain
- [ ] Test webhook generation
- [ ] Test virtual trading

---

## 🔧 **Helper Scripts**

### **Interactive Setup**
```bash
node scripts/setup-vercel-env.js
```

### **Manual Vercel CLI Setup**
```bash
# Install Vercel CLI
npm i -g vercel

# Add environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add JWT_SECRET production
# ... add all required variables

# Deploy
vercel --prod
```

---

## 🆘 **Common Issues & Solutions**

### **Build Fails**
- ✅ Check all required environment variables are set
- ✅ Verify DATABASE_URL format is correct
- ✅ Ensure secrets are properly generated

### **Database Connection Issues**
- ✅ Test DATABASE_URL locally first
- ✅ Check database allows connections from Vercel IPs
- ✅ Verify SSL settings if required

### **Broker Authentication Fails**
- ✅ Update broker app redirect URLs to production domain
- ✅ Verify API keys are correct
- ✅ Check redirect URLs match exactly (no trailing slashes)

---

## 🎯 **Production URLs to Update**

After deployment, update these in your broker apps:

### **Zerodha Kite Connect**
- Redirect URL: `https://your-app.vercel.app/auth/zerodha/callback`

### **Upstox**
- Redirect URL: `https://your-app.vercel.app/auth/upstox/callback`

### **Fyers**
- Redirect URL: `https://your-app.vercel.app/auth/fyers/callback`

---

## 🚀 **Ready to Deploy!**

Once all environment variables are set:

1. **Push to GitHub**
2. **Import to Vercel** 
3. **Add environment variables**
4. **Deploy**
5. **Test functionality**
6. **Update broker redirect URLs**

Your trading platform will be live! 🎉
