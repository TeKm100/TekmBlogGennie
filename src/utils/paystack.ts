
// 💳 PAYSTACK CONFIGURATION - TEST KEYS ACTIVE
// To switch to production: Replace these test keys with your live Paystack keys from https://dashboard.paystack.com/#/settings/developer

// 🔑 TEST KEYS - Replace with LIVE keys for production
const PAYSTACK_PUBLIC_KEY = "pk_test_d64192e86cdbcbe81646360ab2e09ceb8e061060"; // Your TEST public key
const PAYSTACK_SECRET_KEY = "sk_test_080a0cc9a1963f361d9462c65d188f87cc5c2385"; // Your TEST secret key (keep secure!)

// 🚀 FOR PRODUCTION: Replace above with:
// const PAYSTACK_PUBLIC_KEY = "pk_live_YOUR_LIVE_PUBLIC_KEY_HERE";
// const PAYSTACK_SECRET_KEY = "sk_live_YOUR_LIVE_SECRET_KEY_HERE";

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo for NGN, cents for USD, etc.
  currency: string;
  plan?: string;
  callback: (response: any) => void;
  onClose: () => void;
}

// Currency conversion based on country
export const getCurrencyByCountry = (country: string): string => {
  const currencyMap: { [key: string]: string } = {
    'Nigeria': 'NGN',
    'Ghana': 'GHS',
    'Kenya': 'KES',
    'South Africa': 'ZAR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR',
    'Spain': 'EUR',
    // Add more countries as needed
  };
  return currencyMap[country] || 'USD';
};

// Convert USD prices to local currency (simplified conversion - update with real rates)
export const convertPrice = (usdPrice: number, currency: string): number => {
  const conversionRates: { [key: string]: number } = {
    'NGN': 800, // 1 USD = 800 NGN (update with real rates from API)
    'GHS': 12,  // 1 USD = 12 GHS
    'KES': 150, // 1 USD = 150 KES
    'ZAR': 18,  // 1 USD = 18 ZAR
    'USD': 1,
    'GBP': 0.8,
    'CAD': 1.35,
    'AUD': 1.5,
    'EUR': 0.85,
  };
  return Math.round(usdPrice * (conversionRates[currency] || 1));
};

export const initializePaystack = (config: PaystackConfig) => {
  // Load Paystack inline script if not already loaded
  if (!(window as any).PaystackPop) {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      openPaystackModal(config);
    };
    document.head.appendChild(script);
  } else {
    openPaystackModal(config);
  }
};

const openPaystackModal = (config: PaystackConfig) => {
  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY, // Using your TEST public key
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    callback: config.callback,
    onClose: config.onClose,
  });
  handler.openIframe();
};

// Server-side functions (implement these on your backend for security)
export const createSubscriptionPlan = async (planData: {
  name: string;
  amount: number;
  interval: 'monthly' | 'annually';
  currency: string;
}) => {
  // 🚨 IMPORTANT: This should be implemented on your backend using PAYSTACK_SECRET_KEY
  // Never expose secret keys in frontend code
  // Example backend endpoint: POST /api/paystack/create-plan
  
  try {
    // For now, return a mock response
    // Replace this with actual backend call when ready
    console.log('Create plan on your backend:', planData);
    
    // Mock response structure
    return { 
      plan_code: `PLN_${Date.now()}`,
      status: 'success'
    };
    
    // 🔄 BACKEND IMPLEMENTATION EXAMPLE:
    // const response = await fetch('/api/paystack/create-plan', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(planData)
    // });
    // return await response.json();
    
  } catch (error) {
    console.error('Plan creation error:', error);
    throw error;
  }
};

export const verifyTransaction = async (reference: string) => {
  // 🚨 IMPORTANT: This should be implemented on your backend using PAYSTACK_SECRET_KEY
  // Example backend endpoint: GET /api/paystack/verify/{reference}
  
  try {
    console.log('Verify transaction on your backend:', reference);
    
    // Mock response for development
    return {
      status: 'success',
      data: {
        status: 'success',
        reference: reference,
        amount: 5000,
        currency: 'NGN'
      }
    };
    
    // 🔄 BACKEND IMPLEMENTATION EXAMPLE:
    // const response = await fetch(`/api/paystack/verify/${reference}`);
    // return await response.json();
    
  } catch (error) {
    console.error('Transaction verification error:', error);
    throw error;
  }
};

// Export keys for backend use (only use in secure server environment)
export const getPaystackKeys = () => ({
  publicKey: PAYSTACK_PUBLIC_KEY,
  // Never export secret key to frontend - this is for reference only
  // secretKey: PAYSTACK_SECRET_KEY // Use only in backend/server
});
