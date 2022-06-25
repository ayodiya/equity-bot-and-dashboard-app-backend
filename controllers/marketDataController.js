const MetaApi = require('metaapi.cloud-sdk').default

const MarketData = require('../models/MarketData')

const metaToken = process.env.META_API_TOKEN
const metaAccountId = process.env.META_ACCOUNT_ID
const metaApi = new MetaApi(metaToken)

exports.getMarketData = async (req, res) => {
  try {
    const account = await metaApi.metatraderAccountApi.getAccount(metaAccountId)

    // connect to MetaApi API
    const connection = account.getRPCConnection()
    await connection.connect()

    // invoke RPC API (replace ticket numbers with actual ticket numbers which exist in your MT account)

    const {
      platform,
      broker,
      currency,
      server,
      balance,
      equity,
      name
    } = await connection.getAccountInformation()
    const { time, brokerTime } = await connection.getServerTime()

    const newMarketData = await MarketData.create({
      platform,
      broker,
      currency,
      server,
      balance,
      equity,
      accountName: name,
      serverTime: { time, brokerTime }
    })

    res.status(200).json({
      msg: 'Data fetched succesfully',
      newMarketData
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Server error, please try again'
    })
  }
}
