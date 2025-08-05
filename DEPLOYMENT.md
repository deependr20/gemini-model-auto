# 🚀 Deployment Guide for TradingBot Pro

## Vercel Deployment

### Prerequisites
1. **GitHub Repository** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - Set up PostgreSQL or MySQL database

### Step 1: Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

#### Option B: External Database
- **Supabase**: Free PostgreSQL database
- **PlanetScale**: Free MySQL database
- **Railway**: PostgreSQL/MySQL hosting

### Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Required Variables
DATABASE_URL="your_database_connection_string"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-min-32-chars"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
ENCRYPTION_KEY="YourSecretEncryptionKey1234567890AB"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional: Broker API Keys
ZERODHA_API_KEY="your_zerodha_api_key"
ZERODHA_API_SECRET="your_zerodha_api_secret"
ZERODHA_REDIRECT_URL="https://your-app.vercel.app/auth/zerodha/callback"

# Add other broker keys as needed...
```

### Step 3: Deploy to Vercel

#### Method 1: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables
6. Click "Deploy"

#### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 4: Database Migration

After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

Or set up a one-time function in Vercel to run migrations.

### Step 5: Update Broker Redirect URLs

Update your broker app settings with production URLs:

- **Zerodha**: `https://your-app.vercel.app/auth/zerodha/callback`
- **Upstox**: `https://your-app.vercel.app/auth/upstox/callback`
- **Fyers**: `https://your-app.vercel.app/auth/fyers/callback`

## Troubleshooting

### Common Issues

#### 1. Prisma Client Error
```
Error: Prisma has detected that this project was built on Vercel
```
**Solution**: The build scripts are already configured to handle this.

#### 2. Database Connection Issues
- Ensure `DATABASE_URL` is correctly set
- Check database is accessible from Vercel's IP ranges
- Verify connection string format

#### 3. Environment Variables Not Loading
- Double-check variable names (case-sensitive)
- Ensure no trailing spaces
- Redeploy after adding variables

#### 4. Build Timeouts
- Optimize build process
- Consider using Vercel Pro for longer build times

### Performance Optimization

1. **Database Connection Pooling**
   - Use connection pooling for production
   - Consider PgBouncer for PostgreSQL

2. **Caching**
   - Enable Redis for session storage
   - Use Vercel Edge Caching

3. **Monitoring**
   - Set up Vercel Analytics
   - Monitor API response times

## Production Checklist

- [ ] Database set up and accessible
- [ ] All environment variables configured
- [ ] Broker redirect URLs updated
- [ ] Database migrations run
- [ ] SSL certificate active
- [ ] Domain configured (optional)
- [ ] Monitoring set up
- [ ] Backup strategy in place

## Security Considerations

1. **Environment Variables**
   - Use strong, unique secrets
   - Never commit secrets to Git
   - Rotate keys regularly

2. **Database Security**
   - Use SSL connections
   - Restrict IP access
   - Regular backups

3. **API Security**
   - Rate limiting enabled
   - Input validation
   - CORS properly configured

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Check broker API configurations

The platform is now ready for production use! 🎉
