const MetaApi = require('metaapi.cloud-sdk').default

const connectBroker = async () => {
  const metaToken = process.env.META_API_TOKEN
  const metaAccountId = process.env.META_ACCOUNT_ID
  const metaApi = new MetaApi(metaToken)
  try {
    const account = await metaApi.metatraderAccountApi.getAccount(metaAccountId)
    const initialState = account.state

    console.log('this is the', initialState)

    await account.deploy()
    const deployedStates = ['DEPLOYING', 'DEPLOYED']

    if (!deployedStates.includes(initialState)) {
      // wait until account is deployed and connected to broker
      console.log('Deploying account')
      await account.deploy()
    }

    console.log('Waiting for API server to connect to broker (may take couple of minutes)')

    // connect to MetaApi API
    const connection = account.getRPCConnection()
    await connection.connect()

    // wait until terminal state synchronized to the local state
    console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)')
    await connection.waitSynchronized()

    console.log('connected to broker terminal')
  } catch (err) {
    console.log('this is error', err)
    process.exit(1)
  }
}

module.exports = connectBroker
