// ✅ Only keep public key here
const PAYSTACK_PUBLIC_KEY = "pk_test_d64192e86cdbcbe81646360ab2e09ceb8e061060"; 

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
    Nigeria: "NGN",
    Ghana: "GHS",
    Kenya: "KES",
    "South Africa": "ZAR",
    "United States": "USD",
    "United Kingdom": "GBP",
    Canada: "CAD",
    // Add more countries if needed
  };
  return currencyMap[country] || "USD";
};

// Convert USD prices to local currency (simplified conversion)
export const convertPrice = (usdPrice: number, currency: string): number => {
  const conversionRates: { [key: string]: number } = {
    NGN: 800, // 1 USD = 800 NGN (update with real rates)
    GHS: 12,  // 1 USD = 12 GHS
    KES: 150, // 1 USD = 150 KES
    ZAR: 18,  // 1 USD = 18 ZAR
    USD: 1,
    GBP: 0.8,
    CAD: 1.35,
  };
  return Math.round(usdPrice * (conversionRates[currency] || 1));
};

// Initialize Paystack
export const initializePaystack = (config: PaystackConfig) => {
  if (!(window as any).PaystackPop) {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => {
      openPaystackModal(config);
    };
    document.head.appendChild(script);
  } else {
    openPaystackModal(config);
  }
};

// Open Paystack payment modal
const openPaystackModal = (config: PaystackConfig) => {
  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    callback: (response: any) => {
      console.log("Payment successful:", response);
      config.callback(response);
    },
    onClose: () => {
      console.log("Payment modal closed");
      config.onClose();
    },
  });
  handler.openIframe();
};

// Create subscription plan (mock for now — backend needed)
export const createSubscriptionPlan = async (planData: {
  name: string;
  amount: number;
  interval: "monthly" | "annually";
  currency: string;
}) => {
  /**
   * ⚠️ IMPORTANT: This should be implemented on your backend
   * with PAYSTACK_SECRET_KEY for security.
   */
  console.log("Create plan on your backend:", planData);
  return { plan_code: `PLN_${Date.now()}` }; // Mock response
};
