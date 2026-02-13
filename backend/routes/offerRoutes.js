const express = require('express');
const router = express.Router();
const { getOffers } = require('../controllers/offerController');

router.get('/', getOffers);

module.exports = router;
