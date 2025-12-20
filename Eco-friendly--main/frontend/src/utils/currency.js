// Format currency in Indian numbering system (e.g., 1,00,000 instead of 100,000)
export const formatCurrency = (amount, currencySymbol = '₹') => {
  if (amount === undefined || amount === null) return `${currencySymbol}0`;
  
  // Convert to number if it's a string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format according to Indian numbering system
  return `${currencySymbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Parse currency string back to number (removes commas and currency symbol)
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbol and commas
  const cleaned = currencyString.replace(/[₹$,]/g, '').trim();
  return parseFloat(cleaned) || 0;
};