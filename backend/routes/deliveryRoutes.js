const express = require('express');
const router = express.Router();
const { checkDelivery } = require('../controllers/deliveryController');

router.get('/check', checkDelivery);

module.exports = router;
