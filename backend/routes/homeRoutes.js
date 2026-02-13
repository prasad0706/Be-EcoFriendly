const express = require('express');
const router = express.Router();
const { getHomeData, getCategories } = require('../controllers/homeController');

router.get('/', getHomeData);
router.get('/categories', getCategories);

module.exports = router;
