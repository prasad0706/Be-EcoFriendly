const express = require('express');
const router = express.Router();
const { getPaymentOffers } = require('../controllers/paymentOfferController');

router.get('/', getPaymentOffers);

module.exports = router;
