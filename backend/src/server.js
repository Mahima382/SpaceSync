require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const sequelize  = require('./config/database')
const { notFound, errorHandler } = require('./middleware/errorHandler')

// Ensure associations are registered
require('./models/index')

// ─── Route Modules ────────────────────────────
const resourcesRouter = require('./routes/resources')
const bookingsRouter  = require('./routes/bookings')

const app  = express()
const PORT = process.env.PORT || 3000

// ─── Middleware ───────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ─────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SpaceSync API', timestamp: new Date() })
})

// ─── API Routes ───────────────────────────────
app.use('/api/resources', resourcesRouter)
app.use('/api/bookings',  bookingsRouter)

// ─── Error Handling ───────────────────────────
app.use(notFound)
app.use(errorHandler)

// ─── Start Server ─────────────────────────────
async function start() {
  try {
    await sequelize.authenticate()
    console.log('\x1b[32m✔\x1b[0m  Database connection established')

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true })
    console.log('\x1b[32m✔\x1b[0m  Database synced (tables ready)')

    app.listen(PORT, () => {
      console.log(`\n\x1b[36m┌────────────────────────────────────────┐\x1b[0m`)
      console.log(`\x1b[36m│\x1b[0m  SpaceSync API running                  \x1b[36m│\x1b[0m`)
      console.log(`\x1b[36m│\x1b[0m  \x1b[33mhttp://localhost:${PORT}\x1b[0m                \x1b[36m│\x1b[0m`)
      console.log(`\x1b[36m└────────────────────────────────────────┘\x1b[0m\n`)
      console.log('\x1b[90mEndpoints:\x1b[0m')
      console.log('  GET    /api/resources')
      console.log('  POST   /api/resources')
      console.log('  GET    /api/bookings')
      console.log('  POST   /api/bookings')
      console.log('  DELETE /api/bookings/:id\n')
    })
  } catch (err) {
    console.error('\x1b[31m✖\x1b[0m  Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
