const PaymentOffer = require('../models/PaymentOffer');

// GET /api/payment-offers
exports.getPaymentOffers = async (req, res) => {
  try {
    let paymentOffers = await PaymentOffer.find({ active: true });

    // If no dynamic offers, return some default ones as requested (Static + Dynamic combined)
    if (paymentOffers.length === 0) {
      paymentOffers = [
        {
          title: 'ZestMoney Pay Later',
          description: 'Shop now and pay in easy EMIs. No credit card required.',
          type: 'paylater',
          icon: 'Wallet'
        },
        {
          title: 'HDFC Bank Offer',
          description: 'Flat 10% instant discount on HDFC Credit Cards.',
          type: 'bank',
          icon: 'CreditCard'
        },
        {
          title: 'UPI Cashback',
          description: 'Win up to ₹500 cashback on payments via Google Pay or PhonePe.',
          type: 'upi',
          icon: 'Zap'
        },
        {
          title: 'Eco Points',
          description: 'Earn 5 Eco Points for every ₹100 spent. Redeem on next purchase.',
          type: 'rewards',
          icon: 'Leaf'
        }
      ];
    }

    res.status(200).json({
      success: true,
      data: paymentOffers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
