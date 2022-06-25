// account information: {
//     platform: 'mt4',
//     broker: 'Raw Trading Ltd',
//     currency: 'USD',
//     server: 'ICMarketsSC-Demo06',
//     balance: 5050.73,
//     equity: 5053.5599999999995,
//     margin: 6.92,
//     freeMargin: 5046.639999999999,
//     leverage: 100,
//     marginLevel: 73028.32369942196,
//     name: 'Account Zuma',
//     login: 66337396,
//     credit: 0,
//     tradeAllowed: true,
//     investorMode: false,
//     marginMode: 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING',
//     type: 'ACCOUNT_TRADE_MODE_CONTEST'
//   }
//   server time {
//     time: 2022-06-25T23:18:14.218Z,
//     brokerTime: '2022-06-26 02:18:14.218'
//   }

const mongoose = require('mongoose')

const marketDataSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  broker: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  server: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  },
  equity: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  serverTime: {
    time: { type: Number, required: true },
    brokerTime: { type: String, required: true }
  }
},
{ timestamps: true }
)

const MarketData = mongoose.model('MarketData', marketDataSchema)

module.exports = MarketData
