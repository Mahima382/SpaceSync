const express  = require('express')
const router   = express.Router()
const { Resource } = require('../models')

// ─── GET /api/resources ───────────────────────
// Returns all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll({
      order: [['createdAt', 'ASC']],
    })
    return res.json(resources)
  } catch (err) {
    console.error('[GET /resources]', err)
    return res.status(500).json({ error: 'Failed to fetch resources' })
  }
})

// ─── POST /api/resources ─────────────────────
// Create a new resource
// Body: { name, type, capacity }
router.post('/', async (req, res) => {
  const { name, type, capacity } = req.body

  // Basic validation
  if (!name || !type || capacity === undefined) {
    return res.status(400).json({
      error: 'name, type, and capacity are required fields',
    })
  }

  try {
    const resource = await Resource.create({ name, type, capacity })
    return res.status(201).json(resource)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message)
      return res.status(400).json({ error: messages.join('; ') })
    }
    console.error('[POST /resources]', err)
    return res.status(500).json({ error: 'Failed to create resource' })
  }
})

module.exports = router
