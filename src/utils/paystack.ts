
interface PaystackConfig {
  publicKey: string
  currency: string
  amount: number
  email: string
  reference: string
  callback: (response: any) => void
  onClose: () => void
}

// Currency mapping based on country/region
const getCurrencyByLocation = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const locale = navigator.language || 'en-US'
  
  // Nigeria
  if (timezone.includes('Lagos') || locale.includes('ng')) return 'NGN'
  // Ghana
  if (timezone.includes('Accra') || locale.includes('gh')) return 'GHS'
  // Kenya
  if (timezone.includes('Nairobi') || locale.includes('ke')) return 'KES'
  // South Africa
  if (timezone.includes('Johannesburg') || locale.includes('za')) return 'ZAR'
  
  // Default to USD for other regions
  return 'USD'
}

// Convert USD prices to local currency (approximate rates)
const convertCurrency = (usdAmount: number, targetCurrency: string): number => {
  const rates: Record<string, number> = {
    'USD': 1,
    'NGN': 1650, // 1 USD = ~1650 NGN
    'GHS': 16,   // 1 USD = ~16 GHS
    'KES': 130,  // 1 USD = ~130 KES
    'ZAR': 18    // 1 USD = ~18 ZAR
  }
  
  return Math.round(usdAmount * (rates[targetCurrency] || 1))
}

export const initializePaystack = (config: Omit<PaystackConfig, 'publicKey'>) => {
  // In a real app, store this in environment variables
  const publicKey = 'pk_test_your_paystack_public_key_here'
  
  const currency = getCurrencyByLocation()
  const convertedAmount = convertCurrency(config.amount, currency)
  
  // Load Paystack script if not already loaded
  if (!window.PaystackPop) {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => {
      openPaystackPopup({
        ...config,
        publicKey,
        currency,
        amount: convertedAmount * 100 // Paystack expects amount in kobo/cents
      })
    }
    document.head.appendChild(script)
  } else {
    openPaystackPopup({
      ...config,
      publicKey,
      currency,
      amount: convertedAmount * 100
    })
  }
}

const openPaystackPopup = (config: PaystackConfig) => {
  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    ref: config.reference,
    callback: config.callback,
    onClose: config.onClose
  })
  
  handler.openIframe()
}

export const generatePaymentReference = (): string => {
  return `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Format currency for display
export const formatCurrency = (amount: number, currency?: string): string => {
  const detectedCurrency = currency || getCurrencyByLocation()
  const convertedAmount = convertCurrency(amount, detectedCurrency)
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: detectedCurrency,
    minimumFractionDigits: detectedCurrency === 'NGN' ? 0 : 2
  })
  
  return formatter.format(convertedAmount)
}

// Declare global PaystackPop for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void
      }
    }
  }
}
