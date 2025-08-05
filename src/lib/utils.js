import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function generateWebhookUrl(userId, strategyId) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${userId}/${strategyId}`
}

export function validateTradingViewSignal(signal) {
  const requiredFields = ['action', 'symbol', 'quantity']
  return requiredFields.every(field => signal.hasOwnProperty(field))
}

export function calculatePnL(entryPrice, currentPrice, quantity, action) {
  const priceDiff = action === 'BUY' ? currentPrice - entryPrice : entryPrice - currentPrice
  return priceDiff * quantity
}
