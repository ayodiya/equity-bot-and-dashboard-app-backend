const express = require('express')

const marketDataController = require('../controllers/marketDataController')

const router = express.Router()

router.get('/', marketDataController.getMarketData)

module.exports = router
