const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fs = require('fs')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// database function
const connectDB = require('./config/db')
const connectBroker = require('./config/connectBroker')

dotenv.config()
// connect to database
connectDB()

// connnect to broker
connectBroker()

// initialize app
const app = express()

// import routes
const marketDataRoutes = require('./routes/marketData')

Sentry.init({
  dsn: 'https://24bd9cd6d0ee47f6a9179d612145b262@o1298853.ingest.sentry.io/6530189',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// All controllers should live here
app.use('/api/marketData', marketDataRoutes)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(express.json())
app.use(cors())

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
