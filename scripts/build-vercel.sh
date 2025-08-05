#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Install dependencies if not already installed
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Prisma Client generation failed"
    exit 1
fi

# Build Next.js application
echo "🏗️ Building Next.js application..."
npx next build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Next.js build completed successfully"
else
    echo "❌ Next.js build failed"
    exit 1
fi

echo "🎉 Vercel build process completed successfully!"
